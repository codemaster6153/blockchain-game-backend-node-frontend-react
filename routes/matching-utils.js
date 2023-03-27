const mysql = require("mysql");
const config = require("../config/database.json");

function getMaxOpenDuels(playerMMR) {

    let maxDuels = 1e3;
    let MMRLevel = 0;

    if (playerMMR > 2500) {
        maxDuels = 5;
        MMRLevel = 2500;
    } else if (playerMMR > 2000) {
        maxDuels = 10;
        MMRLevel = 2000;
    } else if (playerMMR > 1500) {
        maxDuels = 15;
        MMRLevel = 1500;
    } else if (playerMMR > 1100) {
        maxDuels = 20;
        MMRLevel = 1100;
    }

    return {maxDuels: maxDuels, MMRLevel: MMRLevel};
}

function getLudioFee(actions) {

    let fee = "0.0000 CREDITS";

    for (let i = 0; i < actions.length; i ++) {
        
        const action = actions[i];

        if (action.type === "purchase booster") {

            fee = action.data.fee;
            break;
        }
    }

    return fee;
}

//SQL mmr functions

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
async function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms))
}

// función para obtener formato valido para las queries con strings de sql
function returnSQLString(str){

    return  "'"+str+"'"
}

async function updatePlayer(username, game, fee, result,score , duelID, adversary_MMR) {
    try {
        var queryStr = `SELECT *
            FROM players
            WHERE username= `+ returnSQLString(username) + ` and game= ` + returnSQLString(game);
        var res = await query(queryStr);

        if (res != 0 && fee) {

            var high_score = Math.max(res[0].ALL_TIME_HIGH_SCORE,score);
            var week_high_score = Math.max(res[0].WEEK_HIGH_SCORE,score);

            var avg_score = Math.floor(parseInt(res[0].AVG_score) + parseInt(score));
            if (fee == "0.0000 CREDITS"  ) {
                //Update free games

                //players stats table 
                var current_streak = res[0].WINNING_STREAK_FREE ;
                var winning_streak = res[0].LONGEST_WINNING_STREAK_FREE ;
                var total_games = res[0].TOTAL_DUELS_FREE +1 ;
                var total_wins = res[0].WINS_FREE ;
                var losing_streak = res[0].LOSING_STREAK_FREE;

                var curr_mmr = res[0].mmrFree;
                var mmr_change;
                if(result != 0){
                    current_streak ++;
                    total_wins++;
                    losing_streak = 0;
                    mmr_change = getMMRChange(curr_mmr,current_streak,losing_streak,adversary_MMR,total_games,"winner");
                }else{
                    losing_streak++;
                    current_streak = 0;
                    mmr_change = getMMRChange(curr_mmr,current_streak,losing_streak,adversary_MMR,total_games,"loser");
                }
                var addedQuery = current_streak>winning_streak ? current_streak : winning_streak;

                
                curr_mmr = curr_mmr + mmr_change;
                if (curr_mmr > 3000) {
                    curr_mmr = 3000;
                } else if (curr_mmr < 500) {
                    curr_mmr = 500;
                }

                var Uquery = `UPDATE players
                            SET mmrFree = `+ curr_mmr + ` , LONGEST_WINNING_STREAK_FREE = `+ addedQuery +` , WINNING_STREAK_FREE = ` + current_streak + ` , WINS_FREE= ` + total_wins +` , TOTAL_DUELS_FREE = `+ total_games + ` , LOSING_STREAK_FREE = `+ losing_streak +` , ALL_TIME_HIGH_SCORE= `+high_score+
                            ` , WEEK_HIGH_SCORE =  `+ week_high_score+ ` , AVG_score =  `+ avg_score + ` , AVG_score_games = AVG_score_games + 1 ` + ` WHERE username = `+ returnSQLString(username) + ` AND game = ` + returnSQLString(game);
                query(Uquery);

            } else {
                //Update Wax games

                //players stats table
                var current_streak = res[0].WINNING_STREAK_PAID;
                var winning_streak = res[0].LONGEST_WINNING_STREAK_PAID;
                var total_games = res[0].TOTAL_DUELS_PAID +1;
                var total_wins = res[0].WINS_PAID;
                var losing_streak = res[0].LOSING_STREAK_PAID;
                var mmr_change;
                if(result != 0){
                    current_streak ++;
                    total_wins++;
                    losing_streak = 0;
                    mmr_change = getMMRChange(curr_mmr,current_streak,losing_streak,adversary_MMR,total_games,"winner");

                    //update the player's unclaimed duels table 
                    var UDquery= `INSERT INTO unclaimed_duels (username,id) VALUES (`+returnSQLString(username) + " , " + duelID + " )"; 
                    query(UDquery);
                }else{
                    losing_streak++;
                    current_streak = 0;
                    mmr_change =getMMRChange(curr_mmr,current_streak,losing_streak,adversary_MMR,total_games,"loser");
                }
                var addedQuery = Math.max(current_streak, winning_streak);

                var curr_mmr = res[0].mmrPaid;
                curr_mmr = curr_mmr + mmr_change;

                if (curr_mmr > 3000) {
                    curr_mmr = 3000;
                } else if (curr_mmr < 500) {
                    curr_mmr = 500;
                }

                var Uquery = `UPDATE players
                            SET mmrPaid = `+ curr_mmr + ` , LONGEST_WINNING_STREAK_PAID = `+ addedQuery +` , WINNING_STREAK_PAID = ` + current_streak + ` , WINS_PAID= ` + total_wins +` , TOTAL_DUELS_PAID = `+ total_games + ` , LOSING_STREAK_PAID = `+ losing_streak +` , ALL_TIME_HIGH_SCORE= `+high_score+
                            ` , WEEK_HIGH_SCORE =  `+ week_high_score+ ` , AVG_score =  `+ avg_score + ` , AVG_score_games = AVG_score_games + 1` + ` WHERE username = `+ returnSQLString(username) + ` AND game = ` + returnSQLString(game);
                query(Uquery);
                
            }
        } else {
            if (res == 0) await insertUser(username, game);
        }
    }
    catch (e) {
        console.log(e);
        return { error: e };
    }
}

//función para tener el mismo mmr en el servidor que en la blockchain 
//suma el valor numerico de todas los caracteres del nombre del nuevo jugador 
function hash(word) {
    var sum = 0;
    for (let i = 0; i < word.length; i++) {
        sum = sum + word[i].charCodeAt(0)
    }
    return sum = sum % 200;
}

async function insertUser(username, game) {
    try {
        var mmrFree = 1000 - hash(username);
        var mmrPaid = 3500;
        const queryStr = "INSERT INTO players (username, game,mmrFree,mmrPaid) VALUES (" + returnSQLString(username) + ", " + returnSQLString(game) + ", " + returnSQLString(mmrFree) + ", " + returnSQLString(mmrPaid) + ");";
        query(queryStr);
    }
    catch (e) {
        console.log(e);
        return { error: e };
    }
}

async function getMMR(username, game, fee) {
    try {
        const queryStr = `SELECT *
            FROM players
            WHERE username= `+ returnSQLString(username) + ` and game= ` + returnSQLString(game);
        const result = await query(queryStr);
        var type = fee == "0.0000 CREDITS" ? result[0].mmrFree : result[0].mmrPaid;
        return { error: null, MMR: type };
    }
    catch (e) {
        return { error: e }
    }
}

function calculateWinnerMMR(winner,loser,fee,curr_game, winner_score, loser_score, duelID, winner_mmr, loser_mmr){
    
    updatePlayer(winner, curr_game,fee, 1, winner_score, duelID,loser_mmr);
    updatePlayer(loser, curr_game, fee, 0, loser_score, duelID, winner_mmr);
}

function calculateWinner(player1,score1,time1,player2,score2,time2,multiplierP1,multiplierP2,P1_mmr, P2_mmr){

    var winner_account;
    var loser_account;
    var winner_multiplier;
    var winner_duration = 0;
    var loser_duration = 0;
    var winner_score;
    var loser_score;
    var winner_mmr;
    var loser_mmr;

    if(score1>score2){
        winner_account = player1;
        loser_account = player2;
        winner_duration = time1;
        winner_score = score1;
        loser_score = score2;
        winner_multiplier=multiplierP1;
        winner_mmr = P1_mmr;
        loser_mmr = P2_mmr;
    }else if(score1 == score2){
        if(time1<time2){
            winner_account = player1;
            loser_account = player2;
            winner_duration = time1;
            loser_duration = time2;
            winner_multiplier=multiplierP1;
            winner_mmr = P1_mmr;
        loser_mmr = P2_mmr;
        }else{
            winner_account = player2;
            loser_account = player1;
            winner_duration = time2;
            loser_duration = time1;
            winner_multiplier=multiplierP2;
            winner_mmr = P2_mmr;
            loser_mmr = P1_mmr;
        }
        winner_score = score1;
        loser_score = score2;
    }else{
        winner_account = player2;
        loser_account = player1;
        winner_duration = time2;
        winner_score = score2;
        loser_score = score1;
        winner_multiplier = multiplierP2;
        winner_mmr = P2_mmr;
        loser_mmr = P1_mmr;
    }

    return {winner_account: winner_account , loser_account : loser_account , winner_multiplier: winner_multiplier, winner_duration : winner_duration , loser_duration: loser_duration, winner_score: winner_score, loser_score: loser_score, winner_mmr : winner_mmr, loser_mmr: loser_mmr  }

}

//Unclaimed duels queries 
async function RemoveUnclaimedDuels(username) {
    try {
        const queryStr = "Delete from unclaimed_duels where username =" + connection.escape(username);
        query(queryStr);
    }
    catch (e) {
        console.log(e);
        return { error: e };
    }
}

async function QueryUnclaimedDuels(username) {
    try {
        const queryStr = `SELECT * 
        from duels dd
        inner JOIN unclaimed_duels d on d.username = `+connection.escape(username)+`
            where d.id = dd.id;`
        var res = await query(queryStr);
        return res
    }
    catch (e) {
        console.log(e);
        return { error: e };
    }
}

//Return high scores for a player
async function getHighScores(username,game) {
    try {
        const queryStr = `Select ALL_TIME_HIGH_SCORE, WEEK_HIGH_SCORE from players where username= `+ connection.escape(username)+ " and game = "+connection.escape(game);
        var res = await query(queryStr);
        if(!res.length) return {ALL_TIME_HIGH_SCORE: 0, WEEK_HIGH_SCORE: 0 };
        return {ALL_TIME_HIGH_SCORE: res[0].ALL_TIME_HIGH_SCORE, WEEK_HIGH_SCORE: res[0].WEEK_HIGH_SCORE }
    }
    catch (e) {
        console.log(e);
        return { error: e };
    }
}

//mmr algorithm 

function getMMRChange( player_MMR ,winning_streak, losing_streak , adversary_MMR, number_of_games, game_outcome ) {

    var finalMMR = 30;
    const min_mmr= 500;
    const max_mmr = 5000;

    if(player_MMR <=min_mmr && game_outcome =="loser" ){
        return min_mmr -player_MMR;
    }else if( player_MMR >=max_mmr && game_outcome =="winner"){
        return player_MMR -max_mmr;
    }

    ////jugador ha ganado a alguien más bueno que él
    var mmrDiff = player_MMR - adversary_MMR;

    var increment_per_difference = 25;
    if (mmrDiff > 0 ){ // only fo rwinning 
        //how many times is the mmr greater 
        var degree = Math.ceil(mmrDiff /50);
        finalMMR += increment_per_difference * degree; //linear funtion on how many times more mmr the adversary had more than you  

    } 

    var initial_games = 20;
    //linear function for first 15 games that go from a x3 in mmr to a x1
    if(number_of_games <=initial_games && game_outcome == "winner"){

        var max_increment = 3;
        var final_increment = Math.max((max_increment /initial_games ) * (initial_games - number_of_games),1);
        
        finalMMR *= final_increment; 
    }

    //exponential
    if (game_outcome =="loser"){
        
        if(losing_streak>3) finalMMR +=Math.min(Math.pow(2,losing_streak),450) // A partir de rachas de 4 con un maximo de 450
        finalMMR *= -1;
    }else{
        if(winning_streak>3) finalMMR += Math.min(Math.pow(2,winning_streak),450) // A partir de rachas de 4 con un maximo de 450
    }

    return finalMMR;

}

module.exports = {getMaxOpenDuels, getLudioFee, updatePlayer, getMMR, returnSQLString, calculateWinnerMMR, calculateWinner, RemoveUnclaimedDuels, QueryUnclaimedDuels, getHighScores, sleep};
