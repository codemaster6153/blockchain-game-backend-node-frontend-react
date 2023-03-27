const { Api, JsonRpc} = require("eosjs");
const fetch = require('node-fetch');
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig");
const { TextEncoder, TextDecoder } = require('util'); 
const {ExplorerApi} = require("atomicassets");

const GAME_IDS = {
    "candy-fiesta" : "1",
    "templok" : "2",
    "ringy-dingy" : "3",
    "endless-siege-2": "4",
    "rug-pool": "5",
    "maze": "6"
};

let urls = [];

if (process.env.SERVER_TYPE === "testnet") {
    urls = ["https://testnet.wax.pink.gg", "https://testnet.wax.eosdetroit.io", "https://wax-test.eosdac.io", "https://api.waxtest.alohaeos.com", "https://waxtest.eosn.io", "https://testnet.wax.eosrio.io"];
} else {
    urls = ["https://api.wax.alohaeos.com", "https://query.3dkrender.com", "https://wax.pink.gg" , "https://wax.eu.eosamsterdam.net", "https://api.waxsweden.org", "https://wax.blacklusion.io", "https://wax.dapplica.io", "https://api-wax.eosarabia.net", "https://wax.eoseoul.io", "https://api.wax.greeneosio.com", "https://wax.hkeos.com", "https://wax.eosn.io", "https://api-wax-mainnet.wecan.dev", "https://wax.cryptolions.io"];
}

let urls_i = 0;

async function emulateLatency(time) {

    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    }).then(function() {
        return;
    });
}

async function getTableRows(contract_name, table, limit, index_position, key_type, lower_bound, upper_bound, reverse, count) {

    const rpc = new JsonRpc(urls[urls_i], { fetch });

    urls_i = urls_i === urls.length - 1 ? 0 : urls_i + 1; 

    try {

        return await rpc.get_table_rows({
            json: true,                 
            code: contract_name,       
            scope: contract_name,      
            table: table,  
            limit: limit,
            index_position: index_position,
            key_type: key_type,
            lower_bound: lower_bound,
            upper_bound: upper_bound,                
            reverse: reverse,             
            show_payer: false,    
        });

    } catch (e) {
        if (count !== urls.length - 1) {
            return getTableRows(contract_name, table, limit, index_position, key_type, lower_bound, upper_bound, reverse, count + 1);
        } else {
            return {error: e};
        }
    }
}

async function takeAction(contractName, account, action, actionData, count) {

    let defaultPrivateKey;

    switch (account) {

        case "clashdomedll":
            defaultPrivateKey = process.env.FREE_DUELS_KEY;
            break;
        case "clashdomedst":
            defaultPrivateKey = process.env.DIST_KEY;
            break;
        case "packsopenerx":
            defaultPrivateKey = process.env.PACKS_OPENER_KEY;
            break;
        case "clashdomestk":
            defaultPrivateKey = process.env.STAKE_KEY;
            break;
        case "clashdomesk4":
            defaultPrivateKey = process.env.STAKE_KEY;
            break;
        case "clashdomesk5":
            defaultPrivateKey = process.env.STAKE_KEY;
            break;
        case "clashdomemaz":
            defaultPrivateKey = process.env.MAZE_KEY;
            break;
        case "clashdomepay":
            defaultPrivateKey = process.env.PAY_KEY;
            break;
        default:
            break;
    }
    
    const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
    const rpc = new JsonRpc(urls[urls_i], { fetch });
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder()});

    urls_i = urls_i === urls.length - 1 ? 0 : urls_i + 1; 

    try {

        const result = await api.transact({
            actions: [{
                account: contractName,
                name: action,
                authorization: [{
                    actor: account,
                    permission: "active",
                }],
                data: actionData
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30
        });
       
        return {"value": result};

    } catch (e) {

        if ((e.message && e.message.indexOf("ClashDome") !== -1) || count === urls.length - 1) {
            throw new Error(e.message);
        } else {
            return takeAction (contractName, account, action, actionData, count + 1)
        }
    }
}

async function getGamesReward(connection) {

    let feesData;
    const gameIDs = [1, 2, 3, 4, 5, 6];

    const d = new Date();

    const day = (d.getUTCDate() < 10 ? "0" : "") + d.getUTCDate();
    const month = ((d.getUTCMonth() + 1) < 10 ? "0" : "") + (d.getUTCMonth() + 1);
    const today = d.getUTCFullYear() + month + day;

    // MIRAR SI EN LA BDD ESTAN DISPONIBLES LOS DATOS PARA HOY
    let queryStr = "SELECT fees FROM fees_data WHERE day = " + today + ";";
    let result = await query(connection, queryStr);

    if (!result[0]) {

        feesData = {
            "1": {fees: null, reward: "", waxToLudioFactor: 0, creditsToJigoFactor: 0}, 
            "2": {fees: null, reward: "", waxToLudioFactor: 0, creditsToJigoFactor: 0}, 
            "3": {fees: null, reward: "", waxToLudioFactor: 0, creditsToJigoFactor: 0}, 
            "4": {fees: null, reward: "", waxToLudioFactor: 0, creditsToJigoFactor: 0},
            "5": {fees: null, reward: "", waxToLudioFactor: 0, creditsToJigoFactor: 0},
            "6": {fees: null, reward: "", waxToLudioFactor: 0, creditsToJigoFactor: 0}
        }

        const rewardsInfo = await getTableRows("clashdomedll", "rewards", 1, 1, "i64", today, today, false, 0);

        if (rewardsInfo.rows[0]) {
    
            const rewards = rewardsInfo.rows[0].games;

            for (let i = 0; i < rewards.length; i ++) {
    
                const name = rewards[i].id;
                const id = GAME_IDS[name];
                const reward = rewards[i].reward;
        
                feesData[id].reward = reward;
            }
        }
    
        const feesInfo = await getTableRows("clashdomedll", "fees", 100, 1, "i64", null, null, false, 0);
    
        for (let i = 0; i < feesInfo.rows.length; i ++) {

            const game = feesInfo.rows[i].game;

            feesData[game.toString()].fees = feesInfo.rows[i].fees;
        }

        const boostersInfo = await getTableRows("clashdomedll", "boosters", 100, 1, "i64", null, null, false, 0);

        for (let i = 0; i < boostersInfo.rows.length; i ++) {

            const game = boostersInfo.rows[i].game;

            feesData[game.toString()].waxToLudioFactor = boostersInfo.rows[i].wax_to_ludio_factor;
            feesData[game.toString()].creditsToJigoFactor = boostersInfo.rows[i].credits_to_ludio_factor;
        }

        queryStr = "DELETE FROM fees_data;";

        await query(connection, queryStr);

        queryStr = "INSERT INTO fees_data (day, fees) VALUES (" + today + ", '" + JSON.stringify(feesData) + "');";
                
        await query(connection, queryStr);

    } else {

        feesData = JSON.parse(result[0].fees);

        // VER SI HAY ALGUN JUEGO CUYO PREMIO GRATIS NO HA SIDO ACTUALIZADO AUN
        let readRewardsFromBlockchain = false;

        for (let i = 0; i < gameIDs.length; i ++) {
            
            const reward = feesData[gameIDs[i].toString()].reward;

            if (reward === "") {
                readRewardsFromBlockchain = true;
                break;
            }
        }

        if (readRewardsFromBlockchain) {

            const rewardsInfo = await getTableRows("clashdomedll", "rewards", 1, 1, "i64", today, today, false, 0);

            if (rewardsInfo.rows[0]) {
        
                const rewards = rewardsInfo.rows[0].games;
        
                for (let i = 0; i < rewards.length; i ++) {
        
                    const name = rewards[i].id;
                    const id = GAME_IDS[name];
                    const reward = rewards[i].reward;
            
                    feesData[id].reward = reward;
                }
            } 

            queryStr = "UPDATE fees_data SET fees = '" + JSON.stringify(feesData) + "' WHERE day = " + today + ";";

            await query(connection, queryStr);
        } 
    }

    return feesData;
}

async function checkSessionTimestamp(userName, gameName, n) {

    await emulateLatency(750);

    try {

        const playersInfo = await getTableRows("clashdomedll", "players2", 1, 1, "i64", userName, userName, false, 0);

        if (playersInfo.error) {

            throw new Error("" + playersInfo.error);
            
        } else {

            let games_data = playersInfo.rows[0].games_data;

            if (games_data) {

                let startSessionTimestamp = 0;

                for (let i = 0; i < games_data.length; i ++) {

                    game_data = JSON.parse(games_data[i]);

                    if (game_data.id === gameName) {
                        startSessionTimestamp = game_data.sst || 0; 
                        break;
                    }
                }

                const now = Math.floor(new Date().getTime() / 1000);
    
                const valid = Math.abs(now - startSessionTimestamp) < 60;                        // si hace menos de 60 segundos que el jugador grabó el timestamp
                
                if (!valid) {

                    // hacemos 2 pasadas por esta función
                    if (n < 2) {

                        await emulateLatency(2000);

                        await checkSessionTimestamp(userName, gameName, n + 1);

                    } else {

                        throw new Error("Please try again. Start session transaction couldn't be verified\nt1: " + startSessionTimestamp % 1e6 + "   t2: " + now % 1e6);
                    }

                } else {

                    return {message: "success"};
                }
                
            } else {

                throw new Error("game session not found");
            }
        }

    } catch (e) {

        throw e;
    }
}

async function checkDuelFriendship(userName, adversaries, duelID, res) {


    if (duelID === -1) {
        
        const playerData = await getTableRows("clashdomewld", "social", 1, 1, "i64", userName, userName, false, 0);

        if (!adversaries || !adversaries.length) {
            if (playerData && playerData.rows.length && JSON.parse(playerData.rows[0].data).fr) {
                adversaries = Object.keys(JSON.parse(playerData.rows[0].data).fr);
            } else {
                res.send({error: "You need at least one friend."});
                return;
            }
        } else {
    
            if (!playerData || playerData.rows.length === 0) {
                res.send({error: "You need at least one friend."});
                return;
            } 
    
            let fr = JSON.parse(playerData.rows[0].data).fr;
    
            for (let i = 0; i < adversaries.length; i++) {
                if (!fr || !fr[adversaries[i]]) {
                    res.send({error: adversaries[i] + " isn't your friend."});
                    return;
                }
            }
        }
    }

    return adversaries;
}

async function getPaidDuelFee(userName, gameName) {

    let paidFee = null;

    const data = await getTableRows("clashdomedll", "payments2", 1, 1, "i64", userName, userName, false, 0);
   
    if (data.rows[0]) {

        const games = data.rows[0].games;

        for (let i = 0; i < games.length; i ++) {
            if (games[i].id === gameName) {
                paidFee = games[i].entries[games[i].entries.length - 1];
                break;
            }
        }
    }

    return paidFee;
}

let query = function(connection, value) {

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

async function getWalletInfo(userName, count) {

    //get the wallet information
    const rpc = new JsonRpc(urls[urls_i], { fetch });

    urls_i = urls_i === urls.length - 1 ? 0 : urls_i + 1; 

    try {

        return await rpc.get_account(userName);

    } catch (e) {
        if (count !== urls.length - 1) {
            return getWalletInfo(userName, count + 1);
        } else {
            return {error: e};
        }
    }
}

async function checkCitizen(username, fee) {
    
    try {

        if (fee === "0.0000 CREDITS") {

            const citizenData = await getTableRows("clashdomewld", "citiz", 1, 1, "i64", username, username, false, 0);

            if (citizenData.rows.length === 0) {

                const trialData = await getTableRows("clashdomewld", "trials", 1, 1, "i64", username, username, false, 0);

                if (trialData.rows.length === 0 || !trialData.rows[0].staked) {
                    throw {message: "You need a Trial citizen or own a ClashDome citizen to play this game."};
                } else if  (trialData.rows.length > 0 && trialData.rows[0].full) {
                    throw {message: "Your Trial citizen is full. You need to own and stake a ClashDome citizen"};
                }
            } 
        } 

    } catch (e) {
        throw e;
    }
}

async function checkVIPPass(username) {
    
    try {

        let url;

        if (process.env.SERVER_TYPE === "testnet") {
            url = "https://test.wax.api.atomicassets.io";
        } else {
            url = "https://aa.dapplica.io";
        }

        const api = new ExplorerApi(url, "atomicassets", {fetch});

        const assets = await api.getAssets({owner: username, collection_name: "clashdomenft", schema_name: "vip"});

        if (assets.length === 0) {
            throw new Error("You need an Early Access Pass NFT to play this game during the beta testing period");
        }

    } catch (e) {
        throw e;
    }
}

module.exports = {getTableRows, takeAction, getGamesReward, emulateLatency, checkSessionTimestamp, getPaidDuelFee, getWalletInfo, checkDuelFriendship, checkCitizen, checkVIPPass};

