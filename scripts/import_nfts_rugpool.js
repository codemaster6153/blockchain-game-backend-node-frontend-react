const blockchain = require("../routes/blockchain");
const mysql = require("mysql");
const config = require("../config/database.json");
const fetch = require('node-fetch');
const {ExplorerApi} = require("atomicassets");

var connection = createConnection();
handleDisconnect();

// TODO: Change to mainnet
// process.env.SERVER_TYPE = "mainnet";
process.env.SERVER_TYPE = "testnet";

let url;
if (process.env.SERVER_TYPE === "testnet") {
    url = "https://test.wax.api.atomicassets.io";
} else {
    url = "https://aa.dapplica.io";
}

(async () => {

    const api = new ExplorerApi(url, "atomicassets", {fetch});

    let page = 1;

    let assets = [];
    let newAssets = await api.getAssets({collection_name: "clashdomenft", schema_name: "poolhalls"}, page, 500);
    assets = assets.concat(newAssets);

    console.log(assets.length);

    while(newAssets.length === 500) {

        page++;

        await sleep(250);

        newAssets = await api.getAssets({collection_name: "clashdomenft", schema_name: "poolhalls"}, page, 500);
        assets = assets.concat(newAssets);

    }

    for (let i = 0; i < assets.length; i++) {

        const queryStr = "INSERT INTO ludio_nfts (asset_id, game, id, games_played, total_counter, partial_counter, last_claim) VALUES (" + assets[i].asset_id + ",'rug-pool'," + assets[i].data.hall_id + "," + (assets[i].data.games_played ? assets[i].data.games_played : 0) + "," + (assets[i].data.total_pocketed_balls ? (assets[i].data.total_pocketed_balls / assets[i].data["co-owners_amount"]).toFixed(4) : 0) + "," + (assets[i].data.partial_pocketed_balls ? (assets[i].data.partial_pocketed_balls / assets[i].data["co-owners_amount"]).toFixed(4) : 0) + "," + (assets[i].data.last_claim_timestamp ? assets[i].data.last_claim_timestamp : 0) + ")";

        await query(queryStr); 


        console.log(i);
    }

})();

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

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
