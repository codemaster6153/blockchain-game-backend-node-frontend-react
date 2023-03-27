const mysql = require("mysql");
const config = require("../config/database.json");

var current_week = getCurrentWeek();

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

function getCurrentWeek() {
    let storedWeeks = 2;
    let now = new Date(); //current day
    let onejan = 1640995200000;//jan 1st epoch date 
    let week = Math.ceil((((now.getTime() - onejan) / 86400000) + 5) / 7);
    return ((week+1) % storedWeeks) + 1;
}

function getMultipier(player_position, ladeboard_length) {
    var increment = 0.025;
    var group_number = 5;
    var minimum_multiplier = 1;
    var starting_multiplier=1+increment;
    // last group of players get minimum multiplier
    var displacement=ladeboard_length-(group_number+Math.floor((ladeboard_length-group_number)/group_number)*group_number);
    //first game of the week multiplier for each player will be the minimum (last in ladeboard)
    if (player_position<0){return minimum_multiplier}
    if(player_position<displacement){
        var number_of_groups = Math.floor(ladeboard_length / group_number);
        return +(Math.round((starting_multiplier + (increment * (number_of_groups))) + "e+3") + "e-3");
    }else if(player_position>=ladeboard_length){
        return minimum_multiplier
    }
    else{
    var number_of_groups = Math.floor(ladeboard_length / group_number);
    var player_group = Math.floor((player_position+(group_number-displacement)) / group_number);
    var player_multiplier = starting_multiplier + (increment * (number_of_groups - player_group));
    return +(Math.round(player_multiplier + "e+3") + "e-3");}
}

function getLengthWithoutNulls(lb){
    if(lb.length <=1) return 0;
    var counter=lb.length-1;
    
    while(lb[counter].avg_wr==0){
        counter --;
    }
    counter++;
    return counter

}

async function browseMultiplier(player) {
    try {
        week =getCurrentWeek();
        var wax_played_flag= await query("SELECT AVG(wax_played_flag) as wpf FROM weekly_ladeboard WHERE username = "+connection.escape(player)+" AND week = "+week+ ";");

        if ( wax_played_flag[0].wpf == 0 ||wax_played_flag[0].wpf == null ) return {multiplier: 1.0 , waxDuelFlag : false};   // when no wax games have been played that week 
        var ladeboard = await getWeeklyLadeboard();
        var multiplier = getMultipier(ladeboard.findIndex(i => i.username === player), getLengthWithoutNulls(ladeboard));
        return {multiplier: multiplier , waxDuelFlag : true};
    } catch (e) {
        console.log(e);
        return { error: e };
    }
}

var games = ["candy-fiesta", "templok", "ringy-dingy", "endless-siege-2", "rug-pool"];

//updates   
async function updateWins(game, player,fee) {
    try {
        var increment = fee == "0.0000 CREDITS" ? 1 : 2;
        await insertWeekly(player);
        
        var UWquery = `UPDATE weekly_ladeboard
        SET game_wins = game_wins + ` + increment +
        ` WHERE username =` + connection.escape(player) + ` AND game = ` + connection.escape(game) + ` AND week = ` + connection.escape(week);
        query(UWquery);


    } catch (e) {
        console.log(e);
        return { error: e };
    }
}

async function updateLosses(game, player , fee) {
    try {

        await insertWeekly(player);

        var UWquery = `UPDATE weekly_ladeboard
        SET game_losses = game_losses + 1
        WHERE username = `+ connection.escape(player) + ` AND game = ` + connection.escape(game) + ` AND week = ` + connection.escape(week);
        query(UWquery);

    } catch (e) {
        console.log(e);
        return { error: e };
    }
}

async function insertWeekly(player) {
    try {
        
        week=getCurrentWeek();
        if (getCurrentWeek() != current_week) {
            current_week = getCurrentWeek();
            var deleteweekq = `DELETE FROM weekly_ladeboard WHERE week=` + current_week;
            await query(deleteweekq);
            query("Update players set WEEK_HIGH_SCORE = 0"); //Query to reset weeks high scores on new week
        }
        var queryStr = "Select * from weekly_ladeboard WHERE week= " + week + " AND username= " + connection.escape(player);
        var res = await query(queryStr);
        if (!res.length) {
            console.log("insert weekly with player:", player);
            for (let b in games) {
                queryStr = "INSERT INTO weekly_ladeboard (week, username, game,game_wins,game_losses) VALUES (" + connection.escape(week) + ", " + connection.escape(player) + ", " + connection.escape(games[b]) + ", " + 0 + ", " + 0 + ");";
                await query(queryStr);
            }
        }

    } catch (e) {
        console.log(e);
        return { error: e };
    }
}

//main updatefuncion
async function getWeeklyLadeboard(type) {

    try {
        
        week= getCurrentWeek();
        if(type=="previous")week=(week)%2+1;
        var queryM2 = `WITH
            OrderedOrders
            AS
            (
            SELECT ROW_NUMBER() OVER(PARTITION BY username ORDER BY(CASE WHEN w.game_wins+w.game_losses > 20 THEN (w.game_wins / (w.game_wins + w.game_losses)) * 100
            WHEN w.game_wins+w.game_losses <= 0 THEN 0
            ELSE (w.game_wins / (w.game_wins + w.game_losses)) * 100*(w.game_wins+w.game_losses)/20
            END ) desc) as rownumb,
            w.game as game,
            username as id
            FROM weekly_ladeboard w
            where w.week = `+ connection.escape(week) + `
             ORDER BY id, rownumb
            )
            SELECT SUM(CASE WHEN w.game_wins+w.game_losses > 20 THEN (w.game_wins / (w.game_wins + w.game_losses)) * 100
            WHEN w.game_wins+w.game_losses <= 0 THEN 0
            ELSE (w.game_wins / (w.game_wins + w.game_losses)) * 100*(w.game_wins+w.game_losses)/20
            END *(3.5-(SELECT rownumb
            from OrderedOrders
            where game=w.game and id=w.username)/2)/10) AS avg_wr,
                w.username,
                SUM(w.game_wins+w.game_losses) AS week_games,
                AVG(w.wax_played_flag) as Entry_fee_flag
            FROM weekly_ladeboard w
            WHERE w.week = `+ connection.escape(week) + `
            GROUP BY w.username
            ORDER BY avg_wr desc, week_games DESC; `

        const result = await query(queryM2);

        return result;

    } catch (e) {
        console.log(e);
        return { error: e };
    }
}

async function getPersonalStats(username,type){
    try{
        var week= getCurrentWeek();
        if(type=="previous")week=(week)%2+1;
        var queryPersonalStats=`WITH
            OrderedOrders
            AS
            (
            SELECT ROW_NUMBER() OVER(PARTITION BY username ORDER BY(CASE WHEN w.game_wins+w.game_losses > 20 THEN (w.game_wins / (w.game_wins + w.game_losses)) * 100
            WHEN w.game_wins+w.game_losses <= 0 THEN 0
            ELSE (w.game_wins / (w.game_wins + w.game_losses)) * 100*(w.game_wins+w.game_losses)/20
            END ) desc) as rownumb,
            w.game as game,
            username as id
            FROM weekly_ladeboard w
            where username = `+connection.escape(username)+" and w.week=" + week+
            ` ORDER BY id, rownumb
            )
            SELECT
            w.game as Game,
            w.username as Username,
            CASE WHEN w.game_wins+w.game_losses > 20 THEN (w.game_wins / (w.game_wins + w.game_losses)) * 100
            WHEN w.game_wins+w.game_losses <= 0 THEN 0
            ELSE (w.game_wins / (w.game_wins + w.game_losses)) * 100*(w.game_wins+w.game_losses)/20
            END *(3.5-(SELECT rownumb
            from OrderedOrders
            where game=w.game and id=`+connection.escape(username)+`)/2)/10 as Winrate,
            w.game_wins as Wins,
            w.game_losses as Losses,
            CASE WHEN w.game_wins+w.game_losses > 20 THEN 1
            WHEN w.game_wins+w.game_losses <= 0 THEN 0
            ELSE (w.game_wins+game_losses)/20
            END as week_games_multiplier,
            (3.5-(SELECT rownumb
            from OrderedOrders
            where game=w.game and id=w.username)/2) as order_multiplier
            FROM weekly_ladeboard w
            WHERE Username=`+connection.escape(username)+` and w.week=`+week+` ORDER BY Winrate desc;`;
        const result= await query(queryPersonalStats);
        return result;
    }
    catch (e) {
        console.log("error", e);
        return { error: e };
    }
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


function calculateWinner(winner,loser,curr_game,fee){
  
  updateWins(curr_game,winner,fee);
  updateLosses(curr_game,loser,fee);

}  

//multiplier functions 
async function updateMultiplier(multiplier, game, username) {
    try {
        var uMQuery = `UPDATE players
        SET multiplier = `+multiplier+` WHERE username= `+connection.escape(username)+'and game ='+connection.escape(game);
        query(uMQuery);
        return { error: null };
    }
    catch (e) {
        return { error: e }
    }
}
async function getStoredMultipier(username, game) {
    try {
        const queryStr = `SELECT multiplier
            FROM players
            WHERE username= `+ connection.escape(username) + ` and game= ` + connection.escape(game);
        const result = await query(queryStr);
        return result[0].multiplier;
    }
    catch (e) {
        return { error: e }
    }
}

async function getP1Multipier(id) {
    try {
        const queryStr = `SELECT multiplierP1
            FROM duels
            WHERE id= `+id;
        const result = await query(queryStr);
        
        return result[0].multiplierP1;
    }
    catch (e) {
        return { error: e }
    }
}

async function setWaxFlag(username,fee, call) {
    try {
        
        if (fee != "0.0000 CREDITS"){
        if (call == "open") await insertWeekly(username);
        //Flag to require at least one game played to have the multiplier on the weekly_ladeboard ( the or week ==2 has to be removed once one week has been passed)
        week=getCurrentWeek();
        var fee_value = parseFloat(fee.split(' ')[0]);
        var queryStr = "UPDATE weekly_ladeboard SET wax_played_flag = wax_played_flag + " + fee_value  +  " where username = "+connection.escape(username)+" and week = "+connection.escape(week);
        await query(queryStr);
        }
    }
    catch (e) {
        return { error: e }
    }
}



module.exports = {calculateWinner,browseMultiplier,getWeeklyLadeboard,getPersonalStats,updateMultiplier,getStoredMultipier,getP1Multipier, setWaxFlag};

