//script to import players2 table from blockchain (it takes some time)

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

    //This is to know the lowest duel id for the foreign key contraint in unclaimed_duels
    var minDuelId= await query("select id from duels ORDER BY id limit 1");
    minDuelId= minDuelId[0].id;

    var maxDuelId= await query("select id from duels ORDER BY id desc limit 1");
    maxDuelId= maxDuelId[0].id;

    for (let index = 0; index < arr.length; index++) {
        console.log("Player imported :",index);
        var user_arr = arr[index].games_data;
        var username=arr[index].account;


        for (let i = 0; i < user_arr.length; i++) {
            var game_data= JSON.parse(user_arr[i]);
            var mF=game_data.mf; //MMRFREE
            var mP= game_data.mp; //MMRPAID
            var game= game_data.id; //GAMENAME

            var tf = game_data.tf; //TOTAL_DUELS_FREE
            var wf= game_data.wf; //WINS_FREE
            var sf = game_data.sf; //WINNING_STREAK_FREE
            var lf = game_data.lf; //LONGEST_WINNING_STREAK_FREE
            var lsf= game_data.lsf //LOSING_STREAK_FREE

            var tp = game_data.tp //TOTAL_DUELS_PAID
            var wp = game_data.wp //WINS_PAID
            var sp = game_data.sp //WINNING_STREAK_PAID
            var lp = game_data.lp //LONGEST_WINNING_STREAK_PAID
            var lsp = game_data.lsp //LOSING_STREAK_PAID
            if (lsp == undefined) lsp =0;
            if (lsf == undefined) lsf =0;

            var ud = game_data.ud //UNCLAIMED_DUELS
            
            const queryStr = "INSERT INTO players (username, game, mmrFree, mmrPaid, TOTAL_DUELS_FREE, WINS_FREE, WINNING_STREAK_FREE, LONGEST_WINNING_STREAK_FREE, LOSING_STREAK_FREE, TOTAL_DUELS_PAID, WINS_PAID, WINNING_STREAK_PAID, LONGEST_WINNING_STREAK_PAID, LOSING_STREAK_PAID) VALUES (" + returnSQLString(username) + ", " + returnSQLString(game) + ", " + returnSQLString(mF) +", "+returnSQLString(mP)
                            + " ," + returnSQLString(tf) + ", " + returnSQLString(wf) + ", " + returnSQLString(sf) +", "+returnSQLString(lf) + ", "+ returnSQLString(lsf) + ", " + returnSQLString(tp) + ", " + returnSQLString(wp) +", "+returnSQLString(sp) +", " +returnSQLString(lp) + ", " + returnSQLString(lsp)  + ") ON DUPLICATE KEY UPDATE "
                            + "TOTAL_DUELS_FREE = " + tf + " , WINS_FREE=" + wf + " , WINNING_STREAK_FREE=" + sf + " , LONGEST_WINNING_STREAK_FREE=" + lf + " , LOSING_STREAK_FREE=" + lsf + " ,TOTAL_DUELS_PAID=" + tp + " ,WINS_PAID=" + wp + " ,WINNING_STREAK_PAID=" + sp + " ,LONGEST_WINNING_STREAK_PAID=" + lp + " ,LOSING_STREAK_PAID= " +lsp ;
            await query(queryStr); 

            //unclaimed duels
            if(ud != undefined){
            for (let udIdx = 0; udIdx < ud.length; udIdx++) {
                const element = ud[udIdx];
                const queryStr= "INSERT INTO unclaimed_duels (username,id) VALUES (" +returnSQLString(username)+", "+element[0]+")";
                if(element[0]>=minDuelId && element[0]<=maxDuelId) await query(queryStr); 
            }}
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