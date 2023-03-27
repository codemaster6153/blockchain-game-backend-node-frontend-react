const mysql = require("mysql");
const config = require("../config/database.json");
const weekly_leaderboard= require("./weekly-leaderboard");


if (!process.env.DEV_MODE) {
    var connection = createConnection();
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

    console.log("Create connection mysql");

    connection = createConnection();

    connection.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function (err) {
        console.log('db error', err);
        handleDisconnect();
    });
}

let query = function (value) {

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

function returnSQLString(str){

    return  "'"+str+"'"
}

async function createDuel(id,type,state,game,fee,player1Account,player1Duration,player1Score,player1MMR,multiplierP1,land_id) {
    try {
        const queryStr = `INSERT INTO duels (id,type,state,game , fee,player1Account,player1Duration,player1Score,player1MMR,multiplierP1,land_id)
        VALUES (`+id+","+type+","+state+","+returnSQLString(game)+","+ returnSQLString(fee)+","+connection.escape(player1Account)+","+player1Duration+","+player1Score+","+player1MMR+","+multiplierP1+","+land_id+")";
        await query(queryStr);
        
        //update the wax flag of the players
        weekly_leaderboard.setWaxFlag(player1Account,fee,"open");
        return { error: null };
    }
    catch (e) {
        return { error: e };
    }
}

async function createPrivateDuel(id, type, state, game,fee, player1Account, adversaries, land_id) {

    try {

        console.log(adversaries);
        
        const queryStr = `INSERT INTO duels (id, type, state, game, fee, player1Account, land_id, is_private, whitelist)
        VALUES (`+id+","+type+","+state+","+returnSQLString(game)+","+ returnSQLString(fee)+","+connection.escape(player1Account)+","+land_id+",1,'" + JSON.stringify(adversaries) + "')";
        
        await query(queryStr);

        return { error: null };

    } catch (e) {

        console.log("createPrivateDuel error")
        console.log(e);
        
        return { error: e };
    }
}

async function compromiseDuel(id, player) {
    try {
        const timestamp = Math.ceil(new Date().getTime()/1000);
        const queryStr = `UPDATE duels SET state = 1, date = `+ timestamp + `, player2Account=` + connection.escape(player) + ` WHERE id = ` + id + `;`;
        await query(queryStr); 
        return { error: null };
    }
    catch (e) {
        return { error: e }
    }
}
async function updateDuel(player2Account,player2Duration,player2Score,id,multiplierP2, fee) {
    try {
        const timestamp= Math.ceil(new Date().getTime()/1000);
        var uDQuery = `UPDATE duels
        SET player2Account = `+returnSQLString(player2Account)+" , player2Duration= "+player2Duration+" , state= 2 , player2Score= "+player2Score+" , multiplierP2= "+ multiplierP2 +" , date= "+ timestamp + ` WHERE id= `+id;
        await query(uDQuery);
        
        //update the wax flag of the players
        weekly_leaderboard.setWaxFlag(player2Account,fee,"close");
        return { error: null };
    }
    catch (e) {
        return { error: e }
    }
}

async function updatePrivateDuel(isPlayer1,playerAccount,playerDuration,playerScore,id, prevState) {

    try {

        const timestamp = Math.ceil(new Date().getTime()/1000);
        let uDQuery = "UPDATE duels SET " + (isPlayer1 ? "player1Account" : "player2Account") + " = "+ returnSQLString(playerAccount) + " , " + (isPlayer1 ? "player1Duration" : "player2Duration") +  " = " + playerDuration + " , state = LEAST(" + (parseInt(prevState) + 1) + ",3) , " + (isPlayer1 ? "player1Score" : "player2Score") +  " = " + playerScore + " , date = " + timestamp + " WHERE id = " + id;
        await query(uDQuery);

        return { error: null };
    }
    catch (e) {
        return { error: e }
    }
}

async function getPlayerDuels(username, game, fee) {
    try {
        const queryStr = `SELECT *
        FROM duels
        WHERE fee= `+ connection.escape(fee) + ` and game= ` + returnSQLString(game)+' and state=0 '+ "and player1Account = " + connection.escape(username);
        const result = await query(queryStr);
        return result;
    }
    catch (e) {
        return { error: e }
    }
}
async function getAvailableFreeDuels(username, game) {
    
    try {
        const queryStr = `SELECT * FROM duels WHERE game= ` + returnSQLString(game) + ' and state = 0'+ " and player1Account != " + connection.escape(username) + " and is_private = 0;";
        
        const result = await query(queryStr);
        return result;
    } catch (e) {
        return { error: e }
    }
}

async function reopenDuels() {
    try {
        const timestamp = Math.ceil(new Date().getTime()/1000);
        const rn = Math.floor(Math.random() * 1e8);
        if ((rn % 25) === 0) {
            const queryStr = `SELECT * FROM duels where state = 1 and is_private = 0`;
            const res = await query(queryStr);
            for (let i = 0; i < res.length; i++) {
                if((timestamp-res[i].date)>7500){
                    const uncomprQ = `UPDATE duels SET state = 0, player2Account=NULL, date =` + timestamp + ` WHERE id = ` + res[i].id;
                    await query(uncomprQ);
                }
            }
        }
    }
    catch (e) {
        return { error: e }
    }
}

function getDuelSQL(playerMMR, availableDuels, fee, landID ) {

    let land_id = 0;

    if (landID !== 0) {
        availableDuels = availableDuels.filter((row) => {return row.land_id === landID;});      
        land_id = landID;
    }

    let duelID = -1;
    
    // sacamos la informacion q nos interesa id, timestamp y MMR
    let availableDuelsInfo = [];

    for (let i = 0; i < availableDuels.length; i ++) {

        const id = availableDuels[i].id;
        const timestamp = availableDuels[i].date;
        const MMR = availableDuels[i].player1MMR;
        const lid = availableDuels[i].land_id;

        availableDuelsInfo.push({duelID:id, timestamp: timestamp, MMR: MMR, land_id: lid});
    }

    const now = Math.floor(Date.now() / 1000); // ahora en segundos

    let MMRIncreasePerHour;

    if (fee.indexOf("0.0000") !== -1) {
        MMRIncreasePerHour = 150;
    } else {
        // los duelos con WAX serán más restrictivos al tratarse de duelos de pago
        MMRIncreasePerHour = 50;
    }
    availableDuelsInfo = availableDuelsInfo.sort((a, b) => 0.5 - Math.random());

    for (let i = 0; i < availableDuelsInfo.length; i ++) {

        const timestamp = availableDuelsInfo[i].timestamp;
        const deltaTime = Math.floor((now - timestamp) / 3600 * 100) / 100; // las horas que han pasado
        const adversaryMMR = availableDuelsInfo[i].MMR;

        // Randomizar rivales 1 de cada 5 partidas, algunas partidas emparejaran con rivales más dispares (en partidas gratis)
        var delta_modifier = (Math.random()*100 <=40 && fee.indexOf("0.0000") != -1) ? 800 : 0;

        // sumamos 50 puntos por cada hora que el duelo lleva abierto
        const deltaMMRScore = Math.floor(100 + MMRIncreasePerHour * deltaTime) + delta_modifier;

        if (Math.abs(playerMMR - adversaryMMR) < deltaMMRScore) {

            duelID = availableDuelsInfo[i].duelID;
            land_id = availableDuelsInfo[i].land_id;
            break;
        }
    }

    return {duelID: duelID, landID: land_id};
}

async function getDuelsByID(duel_id) {

    try {
        const queryStr = `Select * from duels where id = ` + duel_id;
        const result = await query(queryStr);
        return result;
    } catch (e) {
        return { error: e }
    }
}

//Client information queries

async function clientGlobalDuels(minDuelID,limit) {
    try {
        let queryStr;

        if (minDuelID !== "undefined") {
            var mintime = await query("Select date from duels where id =" + connection.escape(minDuelID));
            mintime = mintime[0].date;
            queryStr = 'Select id, date, type, state, game, fee, player1Account, player1Duration, player1Score, player2Account, player2Duration, player2Score, land_id, multiplierP1, multiplierP2   from duels where date < '+mintime +' and state=2 ORDER BY date DESC LIMIT ' +connection.escape(Number(limit));
        } else {
            queryStr = 'Select id, date, type, state, game, fee, player1Account, player1Duration, player1Score, player2Account, player2Duration, player2Score, land_id, multiplierP1, multiplierP2 from duels where state=2 ORDER BY date DESC LIMIT ' +connection.escape(Number(limit));
        }

        const result = await query(queryStr);
        return result;
    }
    catch (e) {
        console.log(e);
        return { error: e }
    }
}

async function clientPlayerDuels(player,limit) {

    try {
        const queryStr = 'Select id, date, type, state, game, fee, player1Account, player1Duration, player1Score, player2Account, player2Duration, player2Score, land_id, multiplierP1, multiplierP2  from duels where ((is_private=0 and state=2) or (is_private=1 and state=3)) and (player1Account = ' +connection.escape(player) + 'or player2Account = '+connection.escape(player) + ') ORDER BY date DESC limit ' + connection.escape(Number(limit));
        const result = await query(queryStr);
        return result;
    }
    catch (e) {
        console.log(e);
        return { error: e }
    }
}

async function clientPrivateDuels(player) {
    try {
        const queryStr = "Select id, date, type, state, game, fee, player1Account, player1Duration, player1Score,player2Account, player2Duration, player2Score, is_private from duels where (player1Account = " + connection.escape(player) + " or player2Account = " + connection.escape(player) + ") and is_private = 1 ORDER BY id DESC"
        const result = await query(queryStr);
        return result;
    }
    catch (e) {
        console.log(e);
        return { error: e }
    }
}

async function clientOpenDuels(player) {
    try {
        const queryStr = `Select id, date, type, state, game, fee, player1Account, player1Duration, player2Account, player2Duration, land_id, multiplierP1, multiplierP2  from duels where ((is_private = 0 and (state = 0 or state = 1)) or (is_private=1 and (state = 0 or state = 1 or state = 2))) and player1Account= `+connection.escape(player) ;
        const result = await query(queryStr);
        return result;
    }
    catch (e) {
        console.log(e);
        return { error: e }
    }
}

async function clientGlobalDuelsFilters(minDuelID,limit,game,fee, player) {
    try {
        let gameConcat = game == "undefined" ? ""  :  " and game =  " + connection.escape(game)+" ";
        let feeConcat =  fee == "undefined" ? "" : (fee == "FREE") ? " and fee = '0.0000 CREDITS' " : "and fee != '0.0000 CREDITS' ";
        let playerConcat = player == "undefined" ? ""  :  " and (player1Account  =  " + connection.escape(player)+ " or player2Account = "+ connection.escape(player) +  " or id = "+ connection.escape(player) +   "  ) ";

        let queryStr;

        if (minDuelID !== "undefined") {
            var mintime = await query("Select date from duels where id = " + connection.escape(minDuelID));
            mintime = mintime[0].date;
            queryStr = 'Select id, date, type, state, game, fee, player1Account, player1Duration, player1Score, player2Account, player2Duration, player2Score, land_id, multiplierP1, multiplierP2   from duels where date < '+mintime +' and ((is_private=0 and state=2) or (is_private=1 and state=3)) '+ gameConcat + playerConcat + feeConcat +' ORDER BY date DESC LIMIT ' +connection.escape(Number(limit));
        } else {
            queryStr = 'Select id, date, type, state, game, fee, player1Account, player1Duration, player1Score, player2Account, player2Duration, player2Score, land_id, multiplierP1, multiplierP2 from duels where ((is_private=0 and state=2) or (is_private=1 and state=3)) ' + gameConcat + playerConcat + feeConcat + ' ORDER BY date DESC LIMIT ' +connection.escape(Number(limit));
        }

        const result = await query(queryStr);
        return result;
    }
    catch (e) {
        console.log(e);
        return { error: e }
    }
}


async function playerGlobalStats(player) {
    try {        
        const queryStr = "Select game,  WINS_FREE, WINS_PAID, TOTAL_DUELS_FREE, TOTAL_DUELS_PAID,LONGEST_WINNING_STREAK_PAID, LONGEST_WINNING_STREAK_FREE  from players where username ="+ connection.escape(player);

        //const queryStr = `Select id, date, type, state, game, fee, player1Account, player1Duration, player2Account, player2Duration, land_id, multiplierP1, multiplierP2  from duels where (state = 1 or state = 0) and player1Account= `+connection.escape(player) ;
        const result = await query(queryStr);
        return result;
    }
    catch (e) {
        console.log(e);
        return { error: e }
    }
}

async function playerduelnotifications(player) {
    try {        
        const queryStr = "Select id, is_private, date, type, state, game, fee, player1Account, player1Duration, player1Score, player2Account, player2Duration, player2Score, land_id, multiplierP1, multiplierP2, notified  from duels WHERE player1Account = "+ connection.escape(player) + "AND notified = false AND ((is_private=0 and state=2) or (is_private=1 and (state=3 or state = -1)))";
        
        const result = await query(queryStr);
        const queryDeleteNot = "Update duels set notified = true where player1Account = "+ connection.escape(player);
        query(queryDeleteNot);
        return result;
    }
    catch (e) {
        console.log(e);
        return { error: e }
    }
}


async function player_pending_duels(player) {
    try {        
        const queryStr = "Select id, date, type, state, game, fee, player1Account, player1Duration, player1Score, player2Account, player2Duration, player2Score, is_private, whitelist from duels where (player1Account = " + connection.escape(player) +" and ((is_private = 0 AND state = 0 ))) or ((player1Account = " + connection.escape(player) + " or player2Account = " + connection.escape(player) + " or (player2Account IS NULL and find_in_set(" + connection.escape(player) + ", REPLACE(REPLACE(REPLACE(REPLACE(whitelist,']','') ,  '[',''),'\"',''),' ','')))) and (is_private = 1 and state < 3 and state != -1)) ORDER BY id DESC"

        const result = await query(queryStr);
        return result;
    }
    catch (e) {
        console.log(e);
        return { error: e }
    }
}

function generateRoomId(length) {

    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    result += "-" + Math.round(Date.now() / 1000);

    return result;
}

module.exports = {
    createDuel,
    updateDuel,
    getAvailableFreeDuels,
    getPlayerDuels,
    compromiseDuel,
    reopenDuels,
    getDuelSQL,
    getDuelsByID,
    clientGlobalDuels,
    clientPlayerDuels,
    clientOpenDuels, 
    clientGlobalDuelsFilters, 
    playerGlobalStats, 
    generateRoomId, 
    createPrivateDuel,
     updatePrivateDuel, 
     clientPrivateDuels, 
     playerduelnotifications, 
     player_pending_duels
};