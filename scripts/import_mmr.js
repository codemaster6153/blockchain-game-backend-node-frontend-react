//script to import player mmr from blockchain (it takes some time)

const blockchain = require("../routes/blockchain");
const mysql = require("mysql");
const config = require("../config/database.json");

var connection = createConnection();
handleDisconnect();

// force mainnet to get real data
process.env.SERVER_TYPE = "mainnet";

(async () => {
    let arr=[];
    let availableDuels = await blockchain.getTableRows("clashdomedll", "players2", 500, 1, "i64", null, null, false, 0);
    arr= arr.concat(availableDuels.rows);


    while(availableDuels.more){
        await sleep(250);
        availableDuels = await blockchain.getTableRows("clashdomedll", "players2", 500, 1, "i64", availableDuels.next_key, null, false, 0);
        arr= arr.concat(availableDuels.rows);   
        
    }
    console.log("Players to import",arr[arr.length-1]);
    //let availableDuels2 = await blockchain.getTableRows("clashdomedll", "players2", 500, 1, "i64", null, null, false, 0);
    for (let index = 0; index < arr.length; index++) {
        console.log("Player imported :",index);
        var user_arr = arr[index].games_data;
        var username=arr[index].account;


        for (let i = 0; i < user_arr.length; i++) {
            var game_data= JSON.parse(user_arr[i]);
            var mF=game_data.mf;
            var mP= game_data.mp;
            var game= game_data.id;
            const queryStr = "INSERT INTO mmr_table (username, game,mmrFree,mmrPaid) VALUES (" + returnSQLString(username) + ", " + returnSQLString(game) + ", " + returnSQLString(mF) +", "+returnSQLString(mP)+ ");";
            await query(queryStr); 
        }
    }
    console.log("DONE!!!")
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

//función para obtener formato valido para las queries con strings de sql
function returnSQLString(str){

    return  "'"+str+"'"
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