const mysql = require("mysql");
const config = require("../config/database.json");  
const express = require('express');
const router = express.Router();
const database = require("../database/database");

const ClashDomeGameEngineRunner = require("../validators/clashdome-game-engine-runner");
const {ExplorerApi} = require("atomicassets");
const fetch = require('node-fetch');
const blockchain = require("./blockchain");
const matchingUtils = require("./matching-utils");
const weekly_ladeboard= require("./weekly-leaderboard");
const payments = require("./payments");
const duels= require("./duels-utils.js");
const mutex = require("async-mutex");
const stakecpu = require("./stake-cpu");
const mazeserver = require("./maze-server");
const PRNG = process.env.SERVER_TYPE === "testnet" ? require("./prng-test-net") : require("./prng-main-net");

const mtx = new mutex.Mutex();

const GAME_NAMES = {
    "0": "endless-siege",
    "1": "candy-fiesta",
    "2": "templok",
    "3": "ringy-dingy",
    "4": "endless-siege-2",
    "5": "rug-pool",
    "6": "maze"
};

const LANDS_NUMBER = {
    "endless-siege": 0,
    "candy-fiesta": 0,
    "templok": 0,
    "ringy-dingy": 0,
    "endless-siege-2": 40,
    "rug-pool": 10,
    "maze": 0
};

let connection;

if (!process.env.DEV_MODE) {
    connection = createConnection();
    handleDisconnect();
}

function createConnection() {

    return mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database
    });
}

function handleDisconnect() {

    connection = createConnection();

    connection.connect(function(err) {   
                  
        if(err) {                                   
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); 
        }                                       
    });                                     
                                               
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            handleDisconnect();                        
        } else {                                      
            throw err;                                  
        }
    });
}

router.get('/get-replay-log/:duelid/:player', async (req, res) => {

    try {

        let queryStr = "SELECT player1logs, player2logs FROM free_duels WHERE id = " + connection.escape(req.params.duelid) + ";";
        
        let result = await query(queryStr);

        if (!result[0]) {
          
            res.send({error: "No actions found for duel:" + req.params.duelid + " and player #" + req.params.player});

        } else if (result[0].player1logs && result[0].player2logs) {

            let actions;
            let lastAdversaryAction;
            let adversaryAccount;

            if (req.params.player === "1") {

                actions = JSON.parse(result[0].player2logs);
                lastAdversaryAction = actions[actions.length - 1];
                adversaryAccount = lastAdversaryAction.data.userName;

                res.send({actions: result[0].player1logs, adversaryAccount: adversaryAccount});

            } else {

                actions = JSON.parse(result[0].player1logs);
                lastAdversaryAction = actions[actions.length - 1];
                adversaryAccount = lastAdversaryAction.data.userName;
               
                res.send({actions: result[0].player2logs, adversaryAccount: adversaryAccount});
            }

        } else {

            res.send({error: "Duel:" + req.params.duelid + " is still undecided"});
        }

    } catch (e) {  

        res.send({error: "" + e});
    }
});

router.get('/get-token-mining-game-config/:username', async (req, res) => {

    try {

        const gamesFees = await blockchain.getGamesReward(connection);

        const playerMultiplier = await weekly_ladeboard.browseMultiplier(req.params.username);
        res.send({gamesFees: gamesFees, playerMultiplier: playerMultiplier.multiplier || 1});

    } catch (e) {

        console.log(e);

        res.send({error: "get-token-mining-game-config." + JSON.stringify(e)});
    }
});

router.get('/get-game-cofig/:username/:gameid/:land_id/:private/:duel_id/:adversary', async (req, res) => {
    
    try {

        // TODO: QUITAR ESTO PASADO EL BETA TESTING
        if (GAME_NAMES[req.params.gameid] === "maze") {
            await blockchain.checkVIPPass(req.params.username);
        }

        const gameFees = await blockchain.getGamesReward(connection);

        let queryStr = "SELECT actions, duel_id, fee, date, validating, is_private, adversary FROM ongoing_games WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
        let result = await query(queryStr);

        const high_scores = await matchingUtils.getHighScores(req.params.username, GAME_NAMES[req.params.gameid]);

        if (!result[0]) {

            let pendingDuels = false;

            if (req.params.private === "true") {
                // MIRAMOS SI HAY DUELOS PENDIENTES DE CONFIRMAR ENTRE LOS 2 JUGADORES
                queryStr = "SELECT * FROM duels WHERE is_private = 1 and (state = 0 or state = 1) and game = " + connection.escape(GAME_NAMES[req.params.gameid]) + " and (( player1Account = " + connection.escape(req.params.username) + " and find_in_set(" + connection.escape(req.params.adversary) + ", REPLACE(REPLACE(REPLACE(REPLACE(whitelist,']','') ,  '[',''),'\"',''),' ',''))) or (find_in_set(" + connection.escape(req.params.username) + ", REPLACE(REPLACE(REPLACE(REPLACE(whitelist,']',''),'[',''),'\"',''),' ','')) and player1Account = " + connection.escape(req.params.adversary) + "));";
                const pendingDuelsresult = await query(queryStr);

                pendingDuels = pendingDuelsresult.length ? true : false;
            }

            if (req.params.private === "true") {

                if (parseInt(req.params.duel_id)) {

                    queryStr = "SELECT * FROM free_duels WHERE id = " + connection.escape(req.params.duel_id) + ";";
                    const resultFreeDuels = await query(queryStr);

                    queryStr = "SELECT * FROM duels WHERE id = " + connection.escape(req.params.duel_id) + ";";
                    const resultDuels = await query(queryStr);

                    if (!resultFreeDuels.length || !resultDuels.length) {
                        res.send({error: "Invalid duel ID " + req.params.duel_id});
                        return;
                    }

                    if (resultDuels[0].state >= 3 || resultDuels[0].state < 0) {

                        const playerMultiplier = await weekly_ladeboard.browseMultiplier(req.params.username);

                        res.send({
                            resumedGame: false, 
                            duelID: null, 
                            gameFees: gameFees, 
                            date: null, 
                            expired: false, 
                            validating: false, 
                            playerMultiplier: playerMultiplier.multiplier || 1, 
                            high_scores: high_scores,
                            adversaryAccount: req.params.username === resultDuels[0].player2Account ? resultDuels[0].player1Account : resultDuels[0].player2Account, 
                            private: true,
                            pendingDuels: pendingDuels,
                            isSecondPlayer: req.params.username === resultDuels[0].player2Account ? true : false
                        });

                        return;
                    }

                    if (req.params.username === resultDuels[0].player1Account) {
                        // el primer jugador vuelve con el link y el primero ya ha aceptado
                        let resumedGame = false;

                        if (resultDuels[0].state >= 1) {

                            resumedGame = true;

                            const action = [{type: "start game", data: {seed: parseInt(resultFreeDuels[0].seedsId)}}];

                            const rn =  Math.random();
                            const credential = Math.floor(rn * 1e5);

                            queryStr = "INSERT INTO ongoing_games (player_name, game_id, duel_id, land_id, fee, seed, actions, MMR, credential, is_private, adversary) VALUES (" + connection.escape(req.params.username) + ", " + connection.escape(req.params.gameid) +  ", " + parseInt(req.params.duel_id) + ", " + resultDuels[0].land_id + ", " + JSON.stringify(resultDuels[0].fee) + ", " + parseInt(resultFreeDuels[0].seedsId) + ", '" + JSON.stringify(action) + "', 0, " + credential + ", 1, '" + resultDuels[0].player2Account + "');";

                            await query(queryStr);
                        }

                        const date = new Date().toJSON().slice(0, 19).replace('T', ' ')

                        // TODO: pasar el nombre del adversario adversaryAccount

                        res.send({
                            resumedGame: resumedGame, 
                            duelID: parseInt(req.params.duel_id), 
                            date: date, 
                            gameFees: gameFees, 
                            expired: false, 
                            validating: false,
                            high_scores: high_scores, 
                            roomId: resultFreeDuels[0].roomId, 
                            seed: resultFreeDuels[0].seedsId, 
                            adversaryAccount: resultDuels[0].player2Account, 
                            fee: resultDuels[0].fee, 
                            state: resultDuels[0].state, 
                            isSecondPlayer: false,
                            private: true
                        });
                        
                    } else if (resultDuels[0].whitelist.includes(req.params.username)) {

                        // el segundo jugador accede a traves del link
                        if (resultDuels[0].state === 0) {
                            res.send({
                                resumedGame: false, 
                                duelID: parseInt(req.params.duel_id), 
                                gameFees: gameFees, 
                                date: null, 
                                expired: false, 
                                validating: false, 
                                high_scores: high_scores, 
                                roomId: resultFreeDuels[0].roomId, 
                                seed: resultFreeDuels[0].seedsId, 
                                adversaryAccount: resultDuels[0].player1Account, 
                                fee: resultDuels[0].fee, 
                                state: resultDuels[0].state, 
                                isSecondPlayer: true
                            });
                        } else {
                            res.send({error: "Duel already accepted by " + resultDuels[0].player2Account});
                        }
                        
                    } else {
                        res.send({error: "Invalid player for duel " + req.params.duel_id});
                    }

                } else {

                    res.send({
                        resumedGame: false, 
                        duelID: null,
                        gameFees: gameFees, 
                        date: null, 
                        expired: false, 
                        validating: false, 
                        playerMultiplier: 1, 
                        high_scores: high_scores,
                        private: true,
                        adversaryAccount: null,
                        pendingDuels: pendingDuels,
                        isSecondPlayer: false
                    });
                }
            
            } else {
                // MIRAR SI TIENE ALGUN PAGO DE WAX PENDIENTE
                const paidFee = await blockchain.getPaidDuelFee(req.params.username, GAME_NAMES[req.params.gameid]);

                if (paidFee) {

                    await matchingUtils.updatePlayer(req.params.username, GAME_NAMES[req.params.gameid], null, null);
                    
                    const playerMMRData = await matchingUtils.getMMR(req.params.username, GAME_NAMES[req.params.gameid], paidFee);

                    // LE ABRIMOS UN NUEVO DUELO CON ID = -1 Y CON LA TIERRA QUE NOS MANDA EL SDK
                    const duelID = -1;
                    const landID = req.params.land_id || 1;

                    let rn = Math.random();
                    const seed = Math.floor(rn * 1e8);

                    rn =  Math.random();
                    const credential = Math.floor(rn * 1e5);

                    const action = [{type: "start game", data: {seed: seed}}];

                    queryStr = "INSERT INTO ongoing_games (player_name, game_id, duel_id, land_id, fee, seed, actions, MMR, credential) VALUES (" + connection.escape(req.params.username) + ", " + connection.escape(req.params.gameid) +  ", " + duelID + ", " + connection.escape(landID) + ", " + JSON.stringify(paidFee) + ", " + seed + ", '" + JSON.stringify(action) + "', " + playerMMRData.MMR + ", " + credential + ");";

                    await query(queryStr);

                    const date = new Date().toJSON().slice(0, 19).replace('T', ' ');

                    res.send({
                        resumedGame: true, 
                        duelID: duelID, 
                        gameFees: gameFees, 
                        date: date, 
                        expired: false, 
                        validating: false, 
                        playerMultiplier: null, 
                        high_scores : high_scores
                    });

                } else {

                    const playerMultiplier = await weekly_ladeboard.browseMultiplier(req.params.username);

                    res.send({
                        resumedGame: false, 
                        duelID: null,
                        gameFees: gameFees, 
                        date: null, 
                        expired: false, 
                        validating: false, 
                        playerMultiplier: playerMultiplier.multiplier || 1, 
                        high_scores: high_scores,
                        private: false,
                        adversaryAccount: null,
                        pendingDuels: pendingDuels
                    });
                }
            }

        } else {

            const startTimestamp = new Date(Date.parse(result[0].date)).getTime();
            
            const now = new Date();
            const now_utc = (now.getTime() + now.getTimezoneOffset() * 60 * 1000);

            const tPlayer = now_utc - startTimestamp;
            
            // LA SESION CADUCA A LAS 2 HORAS
            const maxGameDuration = 2 * 3600 * 1000;

            if (tPlayer > maxGameDuration && !result[0].is_private) {

                queryStr = "DELETE FROM ongoing_games WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
                
                await query(queryStr);

                res.send({resumedGame: true, duelID: result[0].duel_id, gameFees: gameFees, date: result[0].date, expired: true, validating: false, playerMultiplier: null});

                // SI ES UN DUELO DE WAX BORRAMOS PAGOS REALIZADOS PARA EVITAR EL EXPLOIT DE LAS 2 HORAS
                if (result[0].fee.indexOf("WAX") !== -1) {
                    await blockchain.takeAction("clashdomedll", "clashdomedll", "clearpymt", {account: req.params.username, game_name: GAME_NAMES[req.params.gameid]}, 0);
                }

            } else {

                let isSecondPlayer = false;

                if (result[0].is_private === 1) {
                    // MIRAR SI SE TRATA DEL PRIMERO O EL SEGUNDO JUGADOR
                    queryStr = "SELECT * FROM duels WHERE id = " + result[0].duel_id + ";";
                    const resultDuels = await query(queryStr);

                    isSecondPlayer = req.params.username === resultDuels[0].player2Account ? true : false
                }

                res.send({
                    resumedGame: true, 
                    duelID: result[0].duel_id, 
                    gameFees: gameFees, 
                    date: result[0].date, 
                    expired: false, 
                    validating: false, 
                    playerMultiplier: null, 
                    high_scores : high_scores,
                    private: result[0].is_private === 1,
                    numActions: JSON.parse(result[0].actions).length,
                    adversaryAccount: result[0].adversary, 
                    isSecondPlayer: isSecondPlayer
                });
            }
        }
        
    } catch (e) {  

        try {

            e.message = e.message.replace(/'/g, "");

            var errorQuery=`INSERT INTO errors
            (fn,username,game ,error)
            VALUES ("get-game-cofig",` + connection.escape(req.params.username)+","+ connection.escape(GAME_NAMES[req.params.gameid])+","+matchingUtils.returnSQLString(e.message)+")";
            await query(errorQuery);
            
        } catch(ee){
            console.log(ee);
        }

        res.send({error: "get-game-config." + e.message});
    }
});

router.get('/get-duel-id-and-seed/:username/:gameid/:fee/:land_id/:country_code', async (req, res) => {

    try {

        // COMPROBAR Q EL JUGADOR HA MANDADO EL TIMESTAMP DE INICIO DE SESION AL SMART CONTRACT
        await blockchain.checkSessionTimestamp(req.params.username, GAME_NAMES[req.params.gameid], 0);

        let fee = req.params.fee;

        if (fee === "0.0000 LUDIO") {
            fee = "0.0000 CREDITS";
        }
        
        let landID = parseInt(req.params.land_id);

        const max_lands = LANDS_NUMBER[GAME_NAMES[req.params.gameid]];

        if (0 > landID || landID > max_lands || isNaN(landID)) {
            res.send({error: "Land ID not found."});
            return;
        } 

        // comprobamos si el jugador tiene un ciudadano stakeado
        await blockchain.checkCitizen(req.params.usernam, fee);

        try {

            // TODO: QUITAR ESTO PASADO EL BETA TESTING
            if (GAME_NAMES[req.params.gameid] === "maze") { 
                await blockchain.checkVIPPass(req.params.username);
            }

            let duelID = -1;
            let seed;
            let queryStr;
            let adversaryScore = null;
            let adversaryAccount = null;
            let roomId = null;
            let playerMMRData = null;

            if (parseInt(req.params.duel_id)) {
                duelID = parseInt(req.params.duel_id);
            }

            // if player it's not on the mmr db add it
            await matchingUtils.updatePlayer(req.params.username,GAME_NAMES[req.params.gameid], null, null);
            
            playerMMRData = await matchingUtils.getMMR(req.params.username,GAME_NAMES[req.params.gameid], fee);

            const maxOpenDuelsData = matchingUtils.getMaxOpenDuels(playerMMRData.MMR);

            const playerOpenDuels = await duels.getPlayerDuels(req.params.username,GAME_NAMES[req.params.gameid], fee);

            if (playerOpenDuels.length >= maxOpenDuelsData.maxDuels) {
                res.send({error: "Your MMR is above " + maxOpenDuelsData.MMRLevel + " (" + playerMMRData.MMR + "). You can't have more than " + maxOpenDuelsData.maxDuels + " open duels for each game and entry fee."});
                return;
            }

            const release = await mtx.acquire();

            try {

                availableDuels = await duels.getAvailableFreeDuels(req.params.username, GAME_NAMES[req.params.gameid]);

                if (availableDuels.length > 0) {

                    const result = duels.getDuelSQL(playerMMRData.MMR, availableDuels, fee, landID, GAME_NAMES[req.params.gameid]);
                    duelID = result.duelID;
                    landID = result.landID;
                }

                if (duelID !== -1) {

                    queryStr = "SELECT seedsId, player1logs FROM free_duels WHERE id = " + duelID + ";";

                    let result = await query(queryStr);

                    if (!result[0]) {

                        res.send({error: "Can't find duel with ID:" + duelID});
                        return;
            
                    } else {

                        // SE GUARDABA COMO STRING Y HAY QUE CONVERTIRLO A NUMERO	
                        if (result[0].seedsId) {
                            seed = parseInt(result[0].seedsId);
                        } else {
                            const rn = Math.random();
                            seed = Math.floor(rn * 1e8);
                        }

                        const actions = JSON.parse(result[0].player1logs);
                        const lastAction = actions[actions.length - 1];
                        adversaryScore = lastAction.data.score;
                        adversaryAccount = lastAction.data.userName;
                        landID = lastAction.data.landID || 1; // en los logs hay partidas que no pueden tener este campo 
                    }

                    result = await duels.compromiseDuel(duelID, req.params.username);

                    if (result.error) {
                        // si hay algun error pq el duelo ya esta comprometido se crea uno nuevo
                        duelID = -1;

                        const rn = Math.random();
                        seed = Math.floor(rn * 1e8);

                        adversaryScore = null;
                    } 

                } else {

                    const rn = Math.random();
                    seed = Math.floor(rn * 1e8);

                    if (landID === 0) {
                        
                        if (GAME_NAMES[req.params.gameid] === "maze") {
                            landID = await mazeserver.getLevelId();
                        } else {
                            // asignamos un terreno aleatorio
                            landID = 1 + Math.floor(Math.random() * max_lands);
                        }
                    }
                }

            } finally {

                release();
            }
 
            // creamos una credencial valida para esta sesión y se la mandamos al cliente
            const credential = Math.floor(Math.random() * 1e5);

            const action = [{type: "start game", data: {seed: seed}}];

            let MMR = playerMMRData ? playerMMRData.MMR : 0;

            queryStr = "INSERT INTO ongoing_games (player_name, game_id, duel_id, land_id, fee, seed, actions, MMR, credential, adversary) VALUES (" + connection.escape(req.params.username) + ", " + connection.escape(req.params.gameid) +  ", " + duelID +  ", " + connection.escape(landID) + ", " + connection.escape(fee) +  ", " + seed + ", '" + JSON.stringify(action) + "', " + MMR + ", " + credential + "," + connection.escape(req.params.adversary) + ");";
            await query(queryStr);

            let levelData = null;

            if (GAME_NAMES[req.params.gameid] === "maze") {
                levelData = await mazeserver.getLevelData(landID);
            }

            const playerMultiplier = await weekly_ladeboard.browseMultiplier(req.params.username);

            await weekly_ladeboard.updateMultiplier(playerMultiplier.multiplier, GAME_NAMES[req.params.gameid], req.params.username);

            if (fee.includes("WAX")) {
                payments.addPayment(connection, query, req.params.username, req.params.fee, req.params.country_code);
            }

            res.send({
                duelID: duelID, 
                landID: landID, 
                levelData: levelData,
                seed: seed, 
                adversaryScore: adversaryScore, 
                adversaryAccount: adversaryAccount, 
                credential: credential, 
                roomId: roomId
            });
            
        } catch (e) {
                
            if (typeof e !== "string") {
                e = JSON.stringify(e.message);
            }

            // UN JUGADOR REPORTO QUE NO SE BORRARON LOS DATOS DE ongoing_games
            if (e.indexOf("ER_DUP_ENTRY") !== -1) {
            
                const queryStr = "DELETE FROM ongoing_games WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
                await query(queryStr);
            }

            res.status(400).json({ error: "" + e});
        }

    } catch (e) {
        
        try {

            e.message = e.message.replace(/'/g, "");
            
            const errorQuery=`INSERT INTO errors
            (fn,username,game,error)
            VALUES ("get-duel-id-and-seed",` + connection.escape(req.params.username) + "," + connection.escape(GAME_NAMES[req.params.gameid]) + "," + matchingUtils.returnSQLString(e.message) + ")";

            await query(errorQuery);

        } catch(ee) {

            console.log(ee);
        }

        res.status(400).json({ error: "" + e});
    }
});

router.get('/check-join-private-duel/:duel_id', async (req, res) => {

    try {

        let queryStr = "SELECT * FROM duels WHERE id = " + connection.escape(req.params.duel_id) + ";";
        const duelsResult = await query(queryStr);

        if (duelsResult.length && duelsResult[0].state === 0) {
            res.send({value: true})
        } else {
            res.send({value: false})
        }
    } catch(e) {
        res.send({error: e.message})
    }
});

router.get('/check-pending-group-private-duels/:username/:game/:fee', async (req, res) => {

    try {

        let queryStr = "select * from duels where is_private = 1 and fee = " + connection.escape(req.params.fee) + " and game = " + connection.escape(req.params.game) + " and ((player1Account = " + connection.escape(req.params.username) + " and player1Score is null and state >= 0 and state < 3) or (player2Account = " + connection.escape(req.params.username) + " and player2Score is null and state >= 0 and state < 3) or (player2Account is null and state = 0 and find_in_set(" + connection.escape(req.params.username) + ",REPLACE(REPLACE(REPLACE(REPLACE(whitelist,']','') ,  '[',''),'\"',''),' ',''))));";
        const duelsResult = await query(queryStr);

        if (duelsResult.length) {
            res.send({value: true})
        } else {
            res.send({value: false})
        }
    } catch(e) {
        res.send({error: "" + e.message})
    }
});

router.get('/join-private-duel/:username/:gameid/:fee/:land_id/:country_code/:adversary/:duel_id', async (req, res) => {

    try {

        // COMPROBAR Q EL JUGADOR HA MANDADO EL TIMESTAMP DE INICIO DE SESION AL SMART CONTRACT
        await blockchain.checkSessionTimestamp(req.params.username, GAME_NAMES[req.params.gameid], 0);

        if (req.params.adversary !== "null" && req.params.adversary[0] !== "[") {
            req.params.adversary = "[\"" + req.params.adversary + "\"]";
        }

        // comprobamos si los jugadores son amigos
        let adversaries = await blockchain.checkDuelFriendship(
            req.params.username, 
            req.params.adversary !== "null" ? JSON.parse(req.params.adversary) : [], 
            parseInt(req.params.duel_id) ? parseInt(req.params.duel_id) : -1,
            res);

        if (!adversaries) {
            return;
        }

        let fee = req.params.fee;
        let landID = parseInt(req.params.land_id);

        const max_lands = LANDS_NUMBER[GAME_NAMES[req.params.gameid]];

        if (0 > landID || landID > max_lands || isNaN(landID)) {

            res.send({error: "Land ID not found."});
            return;
        } 

        let duelID = parseInt(req.params.duel_id) ? parseInt(req.params.duel_id) : -1;
        let seed;
        let queryStr;
        let roomId = null;
        let isSecondPlayer = false;

        // creamos una credencial valida para esta sesión y se la mandamos al cliente
        const credential = Math.floor(Math.random() * 1e5);

        if (duelID === -1) {

            roomId = duels.generateRoomId(10);
            isSecondPlayer = false;

            const rn = Math.random();
            seed = Math.floor(rn * 1e8);

            if (landID === 0) {
                // asignamos un terreno aleatorio
                landID = 1 + Math.floor(Math.random() * max_lands);
            }

            queryStr = "INSERT INTO free_duels (roomId, seedsId, is_private) VALUES (" + connection.escape(roomId) + ", '" + seed.toString() + "',1);";
            result = await query(queryStr);
            
            duelID = result.insertId;

            await duels.createPrivateDuel(duelID, 0, 0, GAME_NAMES[req.params.gameid], fee, req.params.username, adversaries, landID);

        } else {

            queryStr = "SELECT * FROM free_duels WHERE id = " + duelID + ";";
            let freeDuelsResult = await query(queryStr);
            seed = parseInt(freeDuelsResult[0].seedsId);

            queryStr = "SELECT * FROM duels WHERE id = " + duelID + ";";
            const duelsResult = await query(queryStr);

            if (duelsResult[0].player2Account) {
                req.send({error: "Duel already accepted by " + duelsResult[0].player2Account})
                return;
            } else if (!duelsResult[0].whitelist.includes(req.params.username)) {
                req.send({error: "You are not in this duel whitelist."})
                return;
            } else if (fee !== duelsResult[0].fee) {
                req.send({error: "Invalid fee."})
                return;
            } else if (duelsResult[0].state !== 0) {
                req.send({error: "This duel is closed."})
                return;
            }
            
            landID = duelsResult[0].land_id;
            seed = freeDuelsResult[0].seedsId;
            roomId = freeDuelsResult[0].roomId;
            isSecondPlayer = true;

            queryStr = "UPDATE duels SET state = 1, player2Account = " + connection.escape(req.params.username) + " WHERE id = " + duelID + ";";
            await query(queryStr);

            const actions = [{type: "start game", data: {seed: seed}}];

            queryStr = "INSERT INTO ongoing_games (player_name, game_id, duel_id, land_id, fee, seed, actions, credential, is_private, adversary) VALUES (" + connection.escape(req.params.username) + ", " + connection.escape(req.params.gameid) +  ", " + duelID +  ", " + connection.escape(landID) + ", " + connection.escape(fee) +  ", " + seed + ", '" + JSON.stringify(actions) + "', " + credential + ", true, " + connection.escape(req.params.adversary) + ");";

            await query(queryStr);
        }

        res.send({
            duelID: duelID, 
            landID: landID, 
            seed: seed, 
            adversaryScore: null, 
            adversaryAccount: req.params.adversary, 
            credential: credential, 
            roomId: roomId,
            isSecondPlayer: isSecondPlayer
        });

        if (fee.includes("WAX")) {
            payments.addPayment(connection, query, req.params.username, req.params.fee, req.params.country_code);
        }

    } catch (e) {

        console.log(e);

        try {

            e.message = e.message.replace(/'/g, "");
            
            const errorQuery=`INSERT INTO errors
            (fn,username,game,error)
            VALUES ("open-private-duel",` + connection.escape(req.params.username) + "," + connection.escape(GAME_NAMES[req.params.gameid]) + "," + matchingUtils.returnSQLString(e.message) + ")";

            await query(errorQuery);

        } catch(ee) {

            console.log(ee);
        }

        res.send({error: "" + e.message});
    }
});

router.get('/create-private-ongoing/:duel_id/:username/:gameid', async (req, res) => {

    try {

        let queryStr = "SELECT * FROM free_duels WHERE id = " + connection.escape(req.params.duel_id) + ";";
        const freeDuelsResult = await query(queryStr);

        queryStr = "SELECT * FROM duels WHERE id = " + connection.escape(req.params.duel_id) + ";";
        const duelsResult = await query(queryStr);

        if (freeDuelsResult.error) {

            res.send({error: "" + freeDuelsResult.error});
            return;

        } else {

            if (!freeDuelsResult.length) {
                res.send({error: "Invalid duel ID " + duel_id});
                return;
            } else if (!freeDuelsResult[0].is_private) {
                res.send({error: "Duel " + duel_id + "isn't private"});
                return;
            } else {

                if (req.params.username !== duelsResult[0].player1Account) {
                    req.send({error: "Invalid first player."});
                    return;
                }

                let landID = duelsResult[0].land_id;
                let seed = freeDuelsResult[0].seedsId;
                let fee = duelsResult[0].fee;
                const action = [{type: "start game", data: {seed: seed}}];
                const rn =  Math.random();
                const credential = Math.floor(rn * 1e5);

                queryStr = "INSERT INTO ongoing_games (player_name, game_id, duel_id, land_id, fee, seed, actions, MMR, credential, is_private, adversary) VALUES (" + connection.escape(req.params.username) + ", " + connection.escape(req.params.gameid) +  ", " + connection.escape(req.params.duel_id) +  ", " + connection.escape(landID) + ", " + connection.escape(fee) +  ", " + seed + ", '" + JSON.stringify(action) + "', 0, " + credential + ", 1, '" + duelsResult[0].player2Account + "');";
                await query(queryStr);

                res.send({credential: credential});
            }
        }
    } catch (e) {

        res.send({error: "" + e});
    }
});

router.get('/retry-get-duel-id-and-seed/:username/:gameid/:fee/:is_private/:adversary', async (req, res) => {

    try {

        // MIRAR SI HABIA ALGO EN LA BDD
        let queryStr = "SELECT duel_id, seed, credential FROM ongoing_games WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
        let result = await query(queryStr);

        if (!result[0]) {

            let fee = req.params.fee;

            if (fee === "0.0000 LUDIO") {
                fee = "0.0000 CREDITS";
            }
            let candNewDuelBeAssigned = false;
    
            // comprobamos si el jugador tiene un ciudadano stakeado
            if (fee.indexOf("0.0000") !== -1) {
    
                const citizenData = await blockchain.getTableRows("clashdomewld", "citiz", 1, 1, "i64", req.params.username, req.params.username, false, 0);

                if (citizenData.rows.length === 0) {

                    const trialData = await blockchain.getTableRows("clashdomewld", "trials", 1, 1, "i64", req.params.username, req.params.username, false, 0);

                    if (trialData.rows.length > 0 && !trialData.rows[0].full && trialData.rows[0].staked) {
                        candNewDuelBeAssigned = true;
                    }
                } else {
                    candNewDuelBeAssigned = true;
                }
    
            } else {
    
                // mirar si el jugador realizó un pago
                const data = await blockchain.getTableRows("clashdomedll", "payments2", 1, 1, "i64", req.params.username, req.params.username, false, 0);
                const games = data.rows[0].games;
    
                const gameName = GAME_NAMES[req.params.gameid];
    
                let paidFee = null;
    
                for (let i = 0; i < games.length; i ++) {
                    if (games[i].id === gameName) {
                        paidFee = games[i].entries[games[i].entries.length - 1];
                        break;
                    }
                }
    
                if (paidFee) {
                    candNewDuelBeAssigned = true;
                } 
            }
    
            if (candNewDuelBeAssigned) {
    
                const playerMMRData = await matchingUtils.getMMR(req.params.username,GAME_NAMES[req.params.gameid],fee);
    
                // LE ASIGNAMOS UN DUELO CON ID = -1 DEL FEE DEL CUAL NOS HA INFORMADO EL CLIENTE
                const duelID = -1;
    
                let rn = Math.random();
                const seed = Math.floor(rn * 1e8);
    
                rn =  Math.random();
                const credential = Math.floor(rn * 1e5);
    
                const action = [{type: "start game", data: {seed: seed}}];
                
                queryStr = "INSERT INTO ongoing_games (player_name, game_id, duel_id, land_id, fee, seed, actions, MMR, credential) VALUES (" + connection.escape(req.params.username) + ", " + connection.escape(req.params.gameid) +  ", " + duelID +  ", " + connection.escape(landID) + ", " + connection.escape(fee) +  ", " + seed + ", '" + JSON.stringify(action) + "', " + playerMMRData.MMR + ", " + credential + ");";
          
                await query(queryStr);

                res.send({duelID: duelID, seed: seed, adversaryScore: null, adversaryAccount: null, credential: credential});
    
            } else {
            
                res.send({error: "A new duel can't be assigned."});
            }

        } else {

            res.send({duelID: result[0].duel_id, seed: result[0].seed, adversaryScore: null, adversaryAccount: null, credential: result[0].credential});
        }

    } catch (e) {

        try{

            e.message = e.message.replace(/'/g, "");

            var errorQuery=`INSERT INTO errors
            (fn,username,game ,error)
            VALUES ("retry-get-duel-id-and-seed",` + connection.escape(req.params.username) + "," + connection.escape(GAME_NAMES[req.params.gameid]) + ","+matchingUtils.returnSQLString(e.message)+")";

            await query(errorQuery);

        } catch(ee){

            console.log(ee);
        }

        res.send({error: "" + e});
    }
});

router.get('/fetch-seed/:username/:gameid/:actions/:seedscounter/:credential', async (req, res) => {

    try {

        const gameID = parseInt(req.params.gameid);

        let queryStr = "SELECT duel_id, actions, seeds_counter, seed, fee, credential, date, is_private FROM ongoing_games WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(gameID) + ";";
        const result = await query(queryStr);

        if (!result[0]) {

            res.send({error: "Game session is not available. Please refresh."});

            const errorQuery=`INSERT INTO errors
            (fn, username, game, error)
            VALUES ("fetch-seed",` + connection.escape(req.params.username) + "," + connection.escape(GAME_NAMES[req.params.gameid]) + ", 'Game session is not accessible.')";

            await query(errorQuery);

            return;

        } else {

            const startTimestamp = new Date(Date.parse(result[0].date)).getTime();
          
            const now = new Date();
            const now_utc = (now.getTime() + now.getTimezoneOffset() * 60 * 1000);
            
            const tPlayer = now_utc - startTimestamp;

            // LA SESION CADUCA A LAS 2 HORAS
            const maxGameDuration = 2 * 3600 * 1000;

            if (tPlayer > maxGameDuration && !result[0].is_private) {

                queryStr = "DELETE FROM ongoing_games WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
                
                await query(queryStr);

                res.send({duelID: result[0].duel_id, seed: result[0].seed, seedsCounter: result[0].seeds_counter, date: result[0].date, expired: true});

                // SI ES UN DUELO DE WAX BORRAMOS PAGOS REALIZADOS PARA EVITAR EL EXPLOIT DE LAS 2 HORAS
                if (result[0].fee.indexOf("WAX") !== -1) {
                    await blockchain.takeAction("clashdomedll", "clashdomedll", "clearpymt", {account: req.params.username, game_name: GAME_NAMES[req.params.gameid]}, 0);
                }

            } else {

                let seed = result[0].seed;

                let seeds_counter = result[0].seeds_counter;

                if (seeds_counter === parseInt(req.params.seedscounter)) {

                    if (result[0].credential === parseInt(req.params.credential)) {

                        const prng = new PRNG(seed);	
                	
                        seeds_counter ++;	
                    	
                        for (let i = 0; i < seeds_counter; i ++) {	
                            const rn = prng.getRandom();	
                            seed = Math.floor(rn * 1e8);	
                        }

                        let actions = JSON.parse(result[0].actions);
                        actions = actions.concat(JSON.parse(req.params.actions));
                        actions.push({type: "set seed", data: {seed: seed, i: seeds_counter}});
                
                        queryStr = "UPDATE ongoing_games SET actions = " + connection.escape(JSON.stringify(actions), true) + " , seeds_counter = " + seeds_counter + " WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
                        await query(queryStr);
                
                        res.send({seed: seed, seedsCounter: seeds_counter});

                    } else {
                        
                        res.send({error: "Wrong credential:" + req.params.credential});
                    }

                } else {
        
                    res.send({error: "Duplicated game session."});
                }
            }
        }

    } catch (e) {

        try{

            e.message = e.message.replace(/'/g, "");

            var errorQuery=`INSERT INTO errors
            (fn, username, game, error)
            VALUES ("fetch-seed",` +connection.escape(req.params.username)+","+ connection.escape(GAME_NAMES[req.params.gameid])+","+matchingUtils.returnSQLString(e.message)+")";

            await query(errorQuery);

        }
        catch(ee){

            console.log(ee);
        }
        res.send({error: "" + e});
    }
});

router.get('/update-score/:username/:gameid/:actions/:score/:credential', async (req, res) => {

    try {

        let queryStr = "SELECT actions, duel_id, land_id, fee, seed, date, credential, MMR, is_private FROM ongoing_games WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";

        let result = await query(queryStr);

        if (!result[0]) {

            // POSIBLEMENTE LOS DATOS DE LA PARTIDAS HAN SIDO YA BORRADOS DE LA TABLA ongoing_games
            // Y SE HAYAN GRABADO BIEN EN EL BLOCKCHIN
            res.send({error: "Score already submitted"});
            return;

        } else {
            
            if (result[0].credential === parseInt(req.params.credential)) {

                let hasPlayerVotedLevel = false;

                if (GAME_NAMES[req.params.gameid] === "maze") {
                    
                    await mazeserver.storeCredential(req.params.username, parseInt(req.params.credential));
                    hasPlayerVotedLevel = await mazeserver.hasPlayerVoteLevel(req.params.username, result[0].land_id);
                }

                const MMR = result[0].MMR;
                const fee = result[0].fee;
                const landID = result[0].land_id;

                let actions = JSON.parse(result[0].actions);
                actions = actions.concat(JSON.parse(req.params.actions));

                const startTimestamp = new Date(Date.parse(result[0].date)).getTime();
                const now = new Date().getTime();
        
                const tPlayer = now - startTimestamp;

                // TODO: remove || 999999 after 1 day
                const seed = result[0].seed || 999999;
        
                const playerScore = parseInt(req.params.score);

                const clashDomeGameEngineRunner = new ClashDomeGameEngineRunner(req.params.gameid, actions, landID, result[0].duel_id);
        
                const validatorResult = await clashDomeGameEngineRunner.run();

                // TODO: VOLVER A VALIDAR
                if (playerScore !== validatorResult.score) {

                    // res.send({error: "Score validation missmatch.\nClient:" + playerScore.toLocaleString() + " Server:" + validatorResult.score.toLocaleString()});

                    const error = "validation error, playerScore:" + playerScore + ", validatorResult.score:" + validatorResult.score;

                    var errorQuery=`INSERT INTO errors
                    (fn, username, game, error)
                    VALUES ("update-score",` + connection.escape(req.params.username) + "," + connection.escape(GAME_NAMES[req.params.gameid]) + ", '" + error + "' )";
        
                    await query(errorQuery);
                }

                const boosterFee = matchingUtils.getLudioFee(actions);

                // PONEMOS UN BOOLEANO DE QUE ESTAMOS VALIDANDO A TRUE 
                // ESTO ES PARA TRATAR EL CASO DE QUE LAS APIs DE WAX TENGAN UNA ALTA LATENCIA 
                // TAL COMO ESTABA SE ASIGNABAN 2 IDs PARA EL MISMO DUELO SI EL JUGADOR REFRESCABA
                // https://github.com/ClashDome/clashdome-sdk/issues/57

                queryStr = "UPDATE ongoing_games SET validating = 1 WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";

                await query(queryStr);

                const action = {type: "end game", data: {userName: req.params.username, landID: landID, score: playerScore, duration: tPlayer}};
                actions.push(action);    

                let duel_id = result[0].duel_id;

                if (result[0].is_private) {

                    const duelInfo = await duels.getDuelsByID(duel_id);

                    if (duelInfo.error) {

                        queryStr = "UPDATE ongoing_games SET validating = 0 WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
                        await query(queryStr);

                        res.send({"state": "ERROR!", "value": duelInfo.error});
                        return;

                    } else {

                        if (!duelInfo.length) {
                            res.send({error: "Invalid duel ID " + duel_id});
                            return;
                        }

                        if (duelInfo[0].state === 2) {

                            let finalinfo = await query("Select * from duels where id = " + duel_id);

                            finalinfo = finalinfo[0];

                            let adversaryAccount = finalinfo.player1Account === req.params.username ? finalinfo.player2Account : finalinfo.player1Account;
                            let adversaryScore = finalinfo.player1Account === req.params.username ? finalinfo.player2Score : finalinfo.player1Score;
                            let adversaryDuration = finalinfo.player1Account === req.params.username ? finalinfo.player2Duration : finalinfo.player1Duration

                            let matchResult= matchingUtils.calculateWinner(adversaryAccount,adversaryScore,adversaryDuration,req.params.username,playerScore,tPlayer,0,0,0,0);

                            const data = {
                                id: duel_id,
                                gamenumb: req.params.gameid,
                                fee: fee,
                                winner_account: matchResult.winner_account,
                                loser_account: matchResult.loser_account
                            }

                            const value = await blockchain.takeAction("clashdomedll", "clashdomedll", "fprivgame", data, 0);

                            if (value.error || typeof value === "undefined" || typeof value.value === "undefined") {

                                queryStr = "UPDATE ongoing_games SET validating = 0 WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
                                await query(queryStr);
                            
                                if (value.error ) {

                                    res.send({error: value.error.message});

                                    let v2 = value.error.message.replace(/'/g, "");
                                    var errorQuery=`INSERT INTO errors
                                    (fn,username,game ,error, duelID)
                                    VALUES ("update-score-close_game",` +connection.escape(req.params.username) + ","+ connection.escape(GAME_NAMES[req.params.gameid]) + ","+matchingUtils.returnSQLString(v2) + "," + duel_id + ")";
                                
                                    await query(errorQuery);
                                }

                                return;
                            }
                        }

                        queryStr = "DELETE FROM ongoing_games WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
                        await query(queryStr);

                        if (duelInfo[0].player1Account === req.params.username) {

                            queryStr = "UPDATE free_duels SET player1logs = " + connection.escape(JSON.stringify(actions), true) + " WHERE id = " + duel_id + ";";
                            await query(queryStr);

                            duels.updatePrivateDuel(true, req.params.username,tPlayer,req.params.score,duel_id,duelInfo[0].state);

                            res.send({duelID: duel_id, playerScore: req.params.score, tPlayer: tPlayer, adversaryAccount: duelInfo[0].player2Account, adversaryScore: duelInfo[0].player2Score, tAdversary: duelInfo[0].player2Duration, playerMultiplier: 1});

                        } else if (duelInfo[0].player2Account === req.params.username) {

                            queryStr = "UPDATE free_duels SET player2logs = " + connection.escape(JSON.stringify(actions), true) + " WHERE id = " + duel_id + ";";
                            await query(queryStr);

                            duels.updatePrivateDuel(false, req.params.username,tPlayer,req.params.score,duel_id,duelInfo[0].state);

                            res.send({
                                duelID: duel_id, 
                                playerScore: req.params.score,
                                tPlayer: tPlayer, 
                                adversaryAccount: duelInfo[0].player1Account, 
                                adversaryScore: duelInfo[0].player1Score, 
                                tAdversary: duelInfo[0].player1Duration, 
                                playerMultiplier: 1,
                                hasPlayerVotedLevel: hasPlayerVotedLevel
                            });

                        } else {
                            res.send({error: "Invalid username " + req.params.username});
                            return;
                        }
                    }

                } else {
                    
                    if (duel_id === -1) {
        
                        // SE GUARDA EL SEED COMO STRING POR COMPATIBILIDAD CON LO QUE HABIA ANTES
                        queryStr = "INSERT INTO free_duels (player1logs, seedsId) VALUES (" + connection.escape(JSON.stringify(actions), true) + ", '" + seed.toString() + "');";
                        result = await query(queryStr);
                        
                        duel_id = result.insertId;

                        const data = {id: duel_id, type: 0, game: parseInt(req.params.gameid), fee: fee, account: req.params.username, duration: tPlayer, booster_fee: boosterFee, memo: duel_id};

                        const value = await blockchain.takeAction("clashdomedll", "clashdomedll", "create", data, 0);
                        
                        if (value.error || value == undefined || value.value ==undefined) {

                            queryStr = "UPDATE ongoing_games SET validating = 0 WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
                            
                            await query(queryStr);

                            if (value.error ) {
                            
                                res.send({error: value.error.message});

                                let v2 = value.error.message.replace(/'/g, "");
                                var errorQuery=`INSERT INTO errors
                                (fn,username,game ,error, duelID)
                                VALUES ("update-score-open_game",` +connection.escape(req.params.username) + ","+ connection.escape(GAME_NAMES[req.params.gameid]) + ","+matchingUtils.returnSQLString(v2) + "," + duel_id + ")";
                            
                                await query(errorQuery);

                            } else {
                                res.send({error: "Blockchain error, please refresh and try again !"});
                                var errorQuery=`INSERT INTO errors
                                (fn,username,game ,error, duelID)
                                VALUES ("update-score-open_game",` + connection.escape(req.params.username) + ","+ connection.escape(GAME_NAMES[req.params.gameid]) + ","+ "create undefined error case !  " + "," + duel_id + ")";
                            
                                await query(errorQuery);
                            }

                            return;

                        } else {

                            let tempMultiplier = await weekly_ladeboard.getStoredMultipier(req.params.username,GAME_NAMES[req.params.gameid]);
                            await duels.createDuel(duel_id,0,0,GAME_NAMES[req.params.gameid],fee,req.params.username,tPlayer,playerScore,MMR,tempMultiplier,landID);
                            duels.reopenDuels();
                            
                            // UNA VEZ SE HAN GRABADO LOS RESULTADOS EN EL BLOCKCHAIN SE BORRAN DE ongoing_games
                            queryStr = "DELETE FROM ongoing_games WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
                            await query(queryStr);

                            if (process.env.SERVER_TYPE !== "testnet") {
                                // BORRAMOS LA FILA MAS ANTIGUA DE free_duels PARA QUE NO CREZCA DESCONTROLADAMENTE
                                queryStr = "DELETE FROM free_duels LIMIT 1;";
                                await query(queryStr);
                            }
                            
                            const playerMultiplier = await weekly_ladeboard.browseMultiplier(req.params.username);

                            res.send({
                                duelID: null, 
                                playerScore: playerScore, 
                                tPlayer: null, 
                                adversaryScore: null, 
                                tAdversary: null, 
                                playerMultiplier: playerMultiplier.multiplier,
                                hasPlayerVotedLevel: hasPlayerVotedLevel
                            });

                            if (value.error) {

                                try {

                                    value.error.message = value.error.message.replace(/'/g, "");
                        
                                    var errorQuery=`INSERT INTO errors
                                    (fn,username,game ,error)
                                    VALUES ("fetch-seed",` +connection.escape(req.params.username) + "," + connection.escape(GAME_NAMES[req.params.gameid]) + ","+matchingUtils.returnSQLString(value.error.message) + ")";
                        
                                    await query(errorQuery);
                                } catch (ee) {
                                    console.log(ee);
                                }
                            }
                        }
                        
                    } else {
            
                        queryStr = "UPDATE free_duels SET player2logs = " + connection.escape(JSON.stringify(actions), true) + " WHERE id = " + duel_id + ";";
                        await query(queryStr);

                        const duelInfo= await duels.getDuelsByID(duel_id);
                        
                        if (duelInfo.error) {

                            queryStr = "UPDATE ongoing_games SET validating = 0 WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
                            await query(queryStr);

                            res.send({"state": "ERROR!", "value": duelInfo.error});
                            return;

                        } else {
            
                            if (duelInfo.length) {
            
                                const adversaryScore = duelInfo[0].player1Score;
                                const adversaryAccount = duelInfo[0].player1Account;
                                const tAdversary = duelInfo[0].player1Duration;

                                const d = new Date();

                                const day = (d.getUTCDate() < 10 ? "0" : "") + d.getUTCDate();
                                const month = ((d.getUTCMonth() + 1) < 10 ? "0" : "") + (d.getUTCMonth() + 1);
                                const today = parseInt(d.getUTCFullYear() + month + day);
                                
                                let finalinfo = await query("Select * from duels where id=" + duel_id);

                                finalinfo = finalinfo[0];

                                let multiplierP2 = await weekly_ladeboard.getStoredMultipier(req.params.username, GAME_NAMES[req.params.gameid]);
                                let multiplierP1 = await weekly_ladeboard.getP1Multipier(duel_id);

                                let matchResult= matchingUtils.calculateWinner(finalinfo.player1Account,finalinfo.player1Score,finalinfo.player1Duration,req.params.username,req.params.score,tPlayer,multiplierP1,multiplierP2,finalinfo.player1MMR, MMR);

                                const data = {id: duel_id, type: finalinfo.type, state: finalinfo.state, gamenumb: parseInt(req.params.gameid), fee: fee, booster_fee: boosterFee, day: today, winner_account: matchResult.winner_account , loser_account : matchResult.loser_account , winner_multiplier: matchResult.winner_multiplier, winner_duration : matchResult.winner_duration , loser_duration: matchResult.loser_duration, winner_score: matchResult.winner_score, loser_score: matchResult.loser_score,account2: req.params.username, memo: duel_id};
                                
                                const value = await blockchain.takeAction("clashdomedll", "clashdomedll", "finishgame", data, 0);

                                if (value.error || value == undefined || value.value ==undefined) {

                                    queryStr = "UPDATE ongoing_games SET validating = 0 WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
                                    await query(queryStr);
                                
                                    if (value.error ) {
                                        res.send({error: value.error.message});
                                        let v2 = value.error.message.replace(/'/g, "");
                                        var errorQuery=`INSERT INTO errors
                                        (fn,username,game ,error, duelID)
                                        VALUES ("update-score-close_game",` +connection.escape(req.params.username) + ","+ connection.escape(GAME_NAMES[req.params.gameid]) + ","+matchingUtils.returnSQLString(v2) + "," + duel_id + ")";
                                    
                                        await query(errorQuery);
                                    } else {
                                            res.send({error: "Blockchain error , please refresh and try again !"});
                                            var errorQuery=`INSERT INTO errors
                                            (fn,username,game ,error, duelID)
                                            VALUES ("update-score-close_game",` +connection.escape(req.params.username) + ","+ connection.escape(GAME_NAMES[req.params.gameid]) + ","+ "finishgame undefined error case !  " + "," + duel_id + ")";
                                        
                                            await query(errorQuery);
                                    }

                                    return;

                                } else {
                                    // UNA VEZ SE HAN GRABADO LOS RESULTADOS EN EL BLOCKCHAIN SE BORRAN DE ongoing_games
                                    queryStr = "DELETE FROM ongoing_games WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
                                    await query(queryStr);

                                    const playerMultiplier = await weekly_ladeboard.browseMultiplier(req.params.username);

                                    res.send({
                                        duelID: duel_id, 
                                        playerScore: playerScore, 
                                        tPlayer: tPlayer, 
                                        adversaryAccount: adversaryAccount, 
                                        adversaryScore: adversaryScore, 
                                        tAdversary: tAdversary, 
                                        playerMultiplier: playerMultiplier.multiplier,
                                        hasPlayerVotedLevel: hasPlayerVotedLevel
                                    });

                                    //update weekly_ladeboard
                                    weekly_ladeboard.calculateWinner(matchResult.winner_account,matchResult.loser_account,GAME_NAMES[req.params.gameid], fee);

                                    duels.updateDuel(req.params.username,tPlayer,req.params.score,duel_id,multiplierP2, fee);

                                    //update MMR DB
                                    matchingUtils.calculateWinnerMMR(matchResult.winner_account,matchResult.loser_account,fee,GAME_NAMES[req.params.gameid], matchResult.winner_score , matchResult.loser_score, duel_id, matchResult.winner_mmr, matchResult.loser_mmr);
                                }
                            }
                        }
                    }

                    clashDomeGameEngineRunner.updateNFTs();
                }

                // } else {
                    
                //     res.send({error: "Score validation missmatch.\nClient:" + playerScore.toLocaleString() + " Server:" + validatorResult.score.toLocaleString()});

                //     const error = "validation error, playerScore:" + playerScore + ", validatorResult.score:" + validatorResult.score;

                //     var errorQuery=`INSERT INTO errors
                //     (fn, username, game, error)
                //     VALUES ("update-score",` + connection.escape(req.params.username) + "," + connection.escape(GAME_NAMES[req.params.gameid]) + ", '" + error + "' )";
        
                //     await query(errorQuery);
                // }
    
            } else {
    
                res.send({error: "Wrong credential:" + req.params.credential});
                return;
            }
        }

    } catch (e) {

        try {

            e.message = e.message.replace(/'/g, "");

            var errorQuery=`INSERT INTO errors
            (fn,username,game ,error)
            VALUES ("update-score",` +connection.escape(req.params.username)+","+ connection.escape(GAME_NAMES[req.params.gameid])+","+matchingUtils.returnSQLString(e.message)+")";

            await query(errorQuery);

        } catch(ee){

            console.log(ee);
        }

        res.send({error: "" + e});
    }
});

router.get('/get-private-duels-pending/:username', async (req, res) => {

    try {
        let queryStr = "SELECT * FROM duels WHERE is_private = 1 and (state > 0 and state < 3 and ((player1Account = " + connection.escape(req.params.username) + " and player1Score IS NULL) or (player2Account = " + connection.escape(req.params.username) + " and player2Score IS NULL)) or (state = 0 and player2Account = " + connection.escape(req.params.username) + "));";
        const pendingDuelsresult = await query(queryStr);

        res.send({duels: pendingDuelsresult.length ? pendingDuelsresult.length : 0});
    } catch (e) {

        res.send({error: "" + e});
    }
});

router.get('/restore-game/:username/:gameid', async (req, res) => {
    
    try {

        // COMPROBAR Q EL JUGADOR HA MANDADO EL TIMESTAMP DE INICIO DE SESION AL SMART CONTRACT
        await blockchain.checkSessionTimestamp(req.params.username, GAME_NAMES[req.params.gameid], 0);

        let queryStr = "SELECT actions, duel_id, land_id, seed, seeds_counter, fee, is_private, adversary FROM ongoing_games WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
        let result = await query(queryStr);

        if (!result[0]) {

            res.send({error: "Duel can't be restored"});

        } else {

            let adversaryScore = null;
            let adversaryAccount = null;
            let roomId = null;

            // HAY QUE COMUNICARLE AL CLIENTE LA PUNTUACION DEL ADVERSARIO PARA PODER HACER SKIP
            if (result[0].duel_id !== -1) {

                queryStr = "SELECT * FROM free_duels WHERE id = " + result[0].duel_id + ";";
                const result2 = await query(queryStr);

                if (!result2[0]) {

                    res.send({error: "Can't find duel with ID:" + result[0].duel_id});
    
                } else {

                    //  esto es necesario debido a los duelos privados
                    let logs = result2[0].player1logs || result2[0].player2logs;

                    const actions = JSON.parse(logs);
                    const lastAction = actions ? actions[actions.length - 1] : null;
                    adversaryScore = lastAction ? lastAction.data.score : null;
                    adversaryAccount = lastAction ? lastAction.data.userName : "";
                    roomId = result2[0].roomId;
                }
            } 

            let levelData = null;

            if (GAME_NAMES[req.params.gameid] === "maze") {
                levelData = await mazeserver.getLevelData(result[0].land_id);
            }

            // creamos una credencial valida para esta sesión y se la mandamos al cliente
            const rn = Math.random();
            const credential = Math.floor(rn * 1e5);

            const data = {
                actions: result[0].actions, 
                landID: result[0].land_id || 1,
                levelData: levelData,
                seed: result[0].seed,
                seedsCounter: result[0].seeds_counter,
                adversaryScore: adversaryScore,
                adversaryAccount: adversaryAccount,
                fee: result[0].fee,
                credential: credential
            }

            if (result[0].is_private) {

                queryStr = "SELECT * FROM duels WHERE id = " + result[0].duel_id + ";";
                const result3 = await query(queryStr);

                if (!result3[0]) {

                    res.send({error: "Can't find duel with ID:" + result[0].duel_id});
    
                } else {

                    data.roomId = roomId;
                    data.state = result3[0].state;
                    data.private = true;
                    data.adversaryAccount = result[0].adversary;
                }
            }

            res.send(data);

            // guardamos la credencial en la bdd
            queryStr = "UPDATE ongoing_games SET credential = " + credential + " WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
            await query(queryStr);
        }

    } catch (e) {

        res.send({error: "" + e.message});
    }
});

router.get('/store-actions/:username/:gameid/:actions/:credential', async (req, res) => {

    try {

        const [row] = await database.query(
            "SELECT actions, credential FROM ongoing_games WHERE player_name = ? AND game_id = ?",
            [req.params.username, req.params.gameid]
        );

        if (!row) {

            res.status(400).json({error: "Expired game session"});

        } else {

            if (parseInt(req.params.credential) === row.credential) {

                let actions = JSON.parse(row.actions);
                actions = actions.concat(JSON.parse(req.params.actions));

                await database.query(
                    "UPDATE ongoing_games SET actions = ? WHERE player_name = ? AND game_id = ?",
                    [JSON.stringify(actions), req.params.username, req.params.gameid]
                );

                res.send({message: "sucess"});

            } else {

                res.status(400).json({error: "Access not allowed"});
            }
        }

    } catch (e) {

        res.status(400).json({error: "" + e.message});
    }
});

router.get('/booster-purchased/:username/:gameid/:fee/:credential', async (req, res) => {

    try {

        let queryStr = "SELECT actions, credential FROM ongoing_games WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
        const result = await query(queryStr);

        if (!result[0]) {

            res.send({error: "Purchasing booster. Game data not found."});

        } else {

            if (result[0].credential === parseInt(req.params.credential)) {

                let actions = JSON.parse(result[0].actions);
                
                const action = {type: "purchase booster", data: {fee: req.params.fee}};
                actions.push(action);   
                
                queryStr = "UPDATE ongoing_games SET actions = " + connection.escape(JSON.stringify(actions), true) + " WHERE player_name = " + connection.escape(req.params.username) + " AND game_id = " + connection.escape(req.params.gameid) + ";";
                await query(queryStr);

                res.send({error: null});

            } else {

                res.send({error: "Wrong credential:" + req.params.credential});
            }
        }

    } catch (e) {
        
        res.send({error: "" + e});
    }
});
router.get('/reject-duel/:username/:duelid/:gameid', async (req, res) => {

    try {

        await blockchain.checkSessionTimestamp(req.params.username, GAME_NAMES[req.params.gameid]);

        let queryStr = "SELECT * FROM duels WHERE id = " + connection.escape(req.params.duelid) + ";";
        const duelsResult = await query(queryStr);

        if (duelsResult[0].player1Account !== req.params.username && !duelsResult[0].whitelist.includes(req.params.username)) {
            res.send({error: "Invalid player username."});
            return;
        }

        if (duelsResult[0].state !== 0) {
            res.send({error: "This duel can't be rejected."});
            return;
        }

        if (duelsResult[0].player1Account === req.params.username) {

            let result = await blockchain.takeAction("clashdomedll", "clashdomedll", "retprivwax", {id: duelsResult[0].id, gamenumb: req.params.gameid, fee: duelsResult[0].fee, account: duelsResult[0].player1Account}, 0);

            if (!result.error) {
                queryStr = "UPDATE duels SET state = -1 WHERE id = " + connection.escape(req.params.duelid) + ";";
                await query(queryStr);   
            }

            res.send(result);
        } else {

            console.log(typeof duelsResult[0].rejections );
            let whitelist = duelsResult[0].whitelist[0] === "[" ? JSON.parse(duelsResult[0].whitelist) : duelsResult[0].whitelist.split(',');
            let rejections = duelsResult[0].rejections ? duelsResult[0].rejections[0] === "[" ? JSON.parse(duelsResult[0].rejections) : duelsResult[0].rejections.split(',') : [];

            const index = whitelist.indexOf(req.params.username);
            if (index > -1) {
                whitelist.splice(index, 1);

                // add to rejected
                rejections.push(req.params.username);

            }

            if (whitelist.length === 0) {

                let result = await blockchain.takeAction("clashdomedll", "clashdomedll", "retprivwax", {id: duelsResult[0].id, gamenumb: req.params.gameid, fee: duelsResult[0].fee, account: duelsResult[0].player1Account}, 0);

                if (!result.error) {
                    queryStr = "UPDATE duels SET state = -1, whitelist = '" + JSON.stringify(whitelist) + "', rejections = '" + JSON.stringify(rejections) + "' WHERE id = " + connection.escape(req.params.duelid) + ";";
                    await query(queryStr);   
                } 

                res.send(result);
            } else {

                queryStr = "UPDATE duels SET whitelist = '" + JSON.stringify(whitelist) + "', rejections = '" + JSON.stringify(rejections) + "' WHERE id = " + connection.escape(req.params.duelid) + ";";
                await query(queryStr); 
                
                res.send({res: "OK"});
            }

        }
        
    } catch(e){

        console.log(e);

        res.send({error: "" + e.message});
    }
});

// send ladeboard to client
router.get('/weekly-ladeboard/:type', async (req, res) => {
    try{
        var type= req.params.type;
        var lb=await weekly_ladeboard.getWeeklyLadeboard(type);
        res.send(lb);
    }
    catch(e){
        res.send({error: "" + e});
    }
});

router.get('/weekly-personal-stats/:username/:type', async (req, res) => {

    try{
        var type= req.params.type;
        var username= req.params.username;
        var lb= await weekly_ladeboard.getPersonalStats(username,type);
        res.send( lb);
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

//duel information router functions

router.get('/private-duels/:username', async (req, res) => {

    try{

        var duelsArray = await duels.clientPrivateDuels(req.params.username);
        res.send(duelsArray);
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

router.get('/get-duels-filter/:minDuelID/:limit/:game/:fee/:player', async (req, res) => {

    try{
        var result= await duels.clientGlobalDuelsFilters(req.params.minDuelID, req.params.limit, req.params.game , req.params.fee, req.params.player);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

router.get('/get-duels/:minDuelID/:limit', async (req, res) => {

    try{
        var result= await duels.clientGlobalDuels(req.params.minDuelID,req.params.limit);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

router.get('/get-player-duels/:player/:limit', async (req, res) => {

    try{
        var result= await duels.clientPlayerDuels(req.params.player,req.params.limit);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

router.get('/get-player-open-duels/:player', async (req, res) => {

    try{
        var result= await duels.clientOpenDuels(req.params.player);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

// unclaimed duels routers
router.get('/get-player-unclaimed-duels/:player', async (req, res) => {

    try{
        var result= await matchingUtils.QueryUnclaimedDuels(req.params.player);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

router.get('/remove-player-unclaimed-duels/:player', async (req, res) => {

    try{
        matchingUtils.RemoveUnclaimedDuels(req.params.player);
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

router.get('/claim-ludio-ratio/:game', async (req, res) => {

    try{
        var queryStr = "SELECT * FROM ludio_nfts_ratio WHERE game = " + connection.escape(req.params.game) + " order by day DESC;";
        var result = await query(queryStr);

        res.send({ratio: result.length ? result[0].ludio_ratio : 1});
    } catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

router.get('/claim-ludio-info/:assets_ids', async (req, res) => {

    try{
        let assets_ids = JSON.parse(req.params.assets_ids);

        let queryStr = "SELECT * FROM ludio_nfts WHERE asset_id IN (";

        for(let i = 0 ; i < assets_ids.length; i++){
            queryStr = queryStr + "'" +assets_ids[i] + "'" + ",";
        }

        queryStr = queryStr.substring(0, queryStr.length-1);
        queryStr = queryStr + ")";

        let ludio_nfts_result = await query(queryStr);

        res.send(ludio_nfts_result);
    } catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

router.get('/claim-ludio/:game/:player/:asset_id', async (req, res) => {

    try {

        await matchingUtils.sleep(1000);

        let timestampData = await blockchain.getTableRows("clashdomedst", "claimsts", 1, 1, "i64", req.params.player, req.params.player, false, 0);

        let timestamp = Math.floor(Date.now() / 1000);

        if (timestampData.rows.length === 0 || Math.abs(timestamp - timestampData.rows[0].timestamp) > 120) {

            await matchingUtils.sleep(1000);

            timestampData = await blockchain.getTableRows("clashdomedst", "claimsts", 1, 1, "i64", req.params.player, req.params.player, false, 0);

            if (timestampData.rows.length) {
                if (Math.abs(timestamp - timestampData.rows[0].timestamp) > 120) {
                    res.send({error: "Claim action timestamp error. Try again."});
                    return;
                }
            } else {
                res.send({error: "Claim action not found. Try again."});
                return;
            }
        }

        let url;
        if (process.env.SERVER_TYPE === "testnet") {
            url = "https://test.wax.api.atomicassets.io";
        } else {
            url = "https://aa.dapplica.io";
        }

        const api = new ExplorerApi(url, "atomicassets", {fetch});

        let asset = await api.getAsset(req.params.asset_id);

        if (asset.owner === req.params.player) {

            let queryStr = "SELECT * FROM ludio_nfts WHERE asset_id = " + connection.escape(req.params.asset_id) + ";";
            let ludio_nfts_result = await query(queryStr);

            if (ludio_nfts_result[0]) {
                if (ludio_nfts_result[0].partial_counter === 0) {
                    res.send({error: "Nothing to claim."});
                } else if (ludio_nfts_result[0].game === req.params.game) {

                    const d = new Date();

                    const day = (d.getUTCDate() < 10 ? "0" : "") + d.getUTCDate();
                    const month = ((d.getUTCMonth() + 1) < 10 ? "0" : "") + (d.getUTCMonth() + 1);
                    const formattedDay = d.getUTCFullYear() + month + day;

                    queryStr = "SELECT * FROM ludio_nfts_ratio WHERE game = '" + req.params.game + "' order by day DESC LIMIT 1;";
                    let ludio_nfts_ratio_result = await query(queryStr);

                    if (ludio_nfts_ratio_result[0]) {

                        if (req.params.game === "endless-siege" && ludio_nfts_result[0].partial_counter / ludio_nfts_ratio_result[0].ludio_ratio < 450) {
                            res.send({error: "Min. claimable amount 450 LUDIO"});
                            return;
                        } else if (req.params.game === "rug-pool" && ludio_nfts_result[0].partial_counter / ludio_nfts_ratio_result[0].ludio_ratio < 100) {
                            res.send({error: "Min. claimable amount 100 LUDIO"});
                            return;
                        }

                        let result_action = await blockchain.takeAction("clashdometkn", "clashdomedst", "transfer", {from: "clashdomedst", to: req.params.player, quantity: (ludio_nfts_result[0].partial_counter / ludio_nfts_ratio_result[0].ludio_ratio).toFixed(4) + " LUDIO", memo: "NFT claim " + req.params.asset_id}, 0);

                        if (result_action.error) {
                            res.send({error: result_action.error});
                        } else {

                            let timestamp = Math.floor(Date.now() / 1000);

                            queryStr = "UPDATE ludio_nfts SET partial_counter = 0, last_claim = " + timestamp + " WHERE asset_id = " + connection.escape(req.params.asset_id) + ";";
                            await query(queryStr);

                            res.send({res: "OK"});
                        }
                    } else {
                        res.send({error: "Invalid ludio_nfts_ratio"});
                    }
                    
                } else {
                    res.send({error: "Invalid game " + req.params.game});
                }
            } else {
                res.send({error: "Invalid id " + req.params.asset_id});
            }
        } else {
            res.send({error: req.params.player + " isn't the owner of the NFT with id " + req.params.asset_id});
        }
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

router.get('/ludio-nfts-values/:game', async (req, res) => {

    try{

        var queryStr = "select id, ROUND(COUNT(*) * AVG(total_counter)) as counter from ludio_nfts where game = " + connection.escape(req.params.game) + " group by id;";
        var result = await query(queryStr);

        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

let query = function(value) {

    return new Promise((resolve, reject) => {
        connection.query(value, (e, rows) => {
            if (e) {
                reject(e);
            } else {
                resolve(rows);
            }
        })
    })
}

//para enviar el nombre del contrato activo del stake al cliente 
router.get('/get-active-contract', async (req, res) => {

    try{
        res.send({ac: stakecpu.getActiveContract()});
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

router.get('/get-player-global-duels/:player', async (req, res) => {

    try{
        var result= await duels.playerGlobalStats(req.params.player);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

router.get('/get-player-unnotified-duels/:player', async (req, res) => {

    try{
        var result= await duels.playerduelnotifications(req.params.player);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

router.get('/get-player-pending-duels/:player', async (req, res) => {

    try{
        var result= await duels.player_pending_duels(req.params.player);
        res.send(result);
    }
    catch(e){
        console.log(e);
        res.send({error: "" + e});
    }
});

module.exports = router;