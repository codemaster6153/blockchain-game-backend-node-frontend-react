var fs = require('fs'); 
const { parse } = require('csv-parse');
var orders=[];
//algorithm parameters 
var MMR_match_serach= 15;
var base_MMR_change = 30;
var days = 10;
var mmr_decrease = 10;
var players;
var players1 = parse({columns: true}, function (err, records) {
    //console.log(records);
    players = records;
    var games_played = 0;

    
    /*for(let p in players){
        var maxScore= 16000;
        players[p].mmrFree = parseFloat(players[p].mmrFree) * (parseFloat(players[p].AVG_score)/maxScore);
    }*/

    for (let days_itr = 0; days_itr <days; days_itr++) {
        
        for (let i = 0; i < 24; i++) { //24h loop
            var shuffledArray = JSON.parse(JSON.stringify(players));
            shuffledArray = shuffledArray.sort((a, b) => 0.5 - Math.random());
            for (let player in shuffledArray) {
                var playerIdx = players.findIndex((row) => {return row.username ===shuffledArray[player].username ;});
                orders.push(playerIdx);
                var p = players[playerIdx];
                var daily_games = p.AVG_score_games/(24 *days);
                var prob_of_games = Math.random() % 100;
                if (daily_games <1){
                    if(prob_of_games*100 >= daily_games *100){
                        //create or serach game 
                        games_played++;
                        resolveMatchings(p.mmrFree,i+(days_itr*24),p.AVG_score,p.username);

                        //console.log("search game 1")
                    }
    
                }else{
                    for(let j = 0 ; j <Math.floor(daily_games) ; j++){
                        //create or serach game 
                        games_played++;
                        resolveMatchings(p.mmrFree,i+(days_itr*24),p.AVG_score,p.username);

                        //console.log("search game 2")
                    }
                    //decimal part 
                    var extra_game_prob = (daily_games % 1).toFixed(4);
                    if(prob_of_games *100 >= extra_game_prob *100){
                        //create or serach game 
                        games_played++;
                        resolveMatchings(p.mmrFree,i+(days_itr*24),p.AVG_score,p.username);
                        //console.log("search game 3")
                    }
                    
                }
    
            }
        }
        console.log("Day: ", days_itr +1 , "finished", " GAMES PLAYED:",games_played);
        var money = 0;
        for (let player in players) {
            console.log("player:", players[player].username, " mmr:  ", players[player].mmrFree, "opened games :", players[player].opened_games, " opened games closed ", players[player].opened_duels_closed, " duels closed : ", players[player].closed_duels, " balance:", players[player].balance, " + (", players[player].frozen_money,")", " = ", players[player].balance + players[player].frozen_money );
            money = money +parseInt(players[player].balance);
        }
        var frozen_money=0;
        for (let duel in duels){
            if(duels[duel].state ==0){
                frozen_money +=10;
            }
        }
        console.log("$$$$: ", money, " + ", frozen_money , " = ", money + frozen_money);
    }

console.log("Daily duels", duels.length);
});

 fs.createReadStream("emulation_data.csv").pipe(players1);

var duels=[];



var abcd=0;
function resolveMatchings(playerMMR , hour, baseScore, player) {
    let land_id = 0;
    var availableDuels = duels;
    
    if (availableDuels.length === 0) {
       console.log("no duelssss");
    }

    let duelID = -1;
    
    // sacamos la informacion q nos interesa id, timestamp y MMR
    const availableDuelsInfo = [];
    //console.log(availableDuels.length);
    

    MMRIncreasePerHour = mmr_decrease;
    var playerIdx = players.findIndex((row) => {return row.username ===player ;});

    for (let i = 0; i < availableDuels.length; i ++) {

        const timestamp = availableDuels[i].timestamp;
        const deltaTime = hour - timestamp ;
        const adversaryMMR = availableDuels[i].MMR;

        // sumamos 50 puntos por cada hora que el duelo lleva abierto
        //var deltaMMRScore = Math.floor(MMR_match_serach + MMRIncreasePerHour * deltaTime);
        var deltaMMRScore = 500;


        if ((Math.abs(playerMMR - adversaryMMR) < deltaMMRScore) && availableDuels[i].state == 0 && availableDuels[i].P1 != player && players[playerIdx].balance >= 10 && deltaMMRScore <=500) {

            duelID = availableDuels[i].duelID;
            land_id=availableDuels[i].land_id;
            availableDuels[i].state = 1;
            //console.log(playerMMR," - ", adversaryMMR, " < ", deltaMMRScore , "     " ,Math.abs(playerMMR - adversaryMMR) < deltaMMRScore, "duel found :",duelID);
            break;
        }
    }

    //resolve duels if matched else create new duel
    if(duelID >=0 && players[playerIdx].balance >= 10){ //resolve duel
        
        availableDuels[duelID].state = 2;
        var score = parseFloat(baseScore) +Math.pow(-1,Math.round(Math.random())) *((Math.random() % 2500))*100;
        var adversaryScore = availableDuels[duelID].P1Score;
        var winner;
        var loser;

        var playerOpenedDuels = players.findIndex((row) => {return row.username ===availableDuels[duelID].P1 ;});
        var playerClosedDuel= playerIdx;
        var winnerIdx ;
        var loserIdx ;
        if( adversaryScore >= score){
            winner = availableDuels[duelID].P1;
            winnerIdx = playerOpenedDuels;
            loserIdx = playerClosedDuel;
            loser = player

            //balance exchange 
            players[playerOpenedDuels].balance = parseFloat(players[playerOpenedDuels].balance)  + 20;
            players[playerClosedDuel].balance = parseFloat(players[playerClosedDuel].balance) - 10;

            


        }else{
            loser = availableDuels[duelID].P1;
            winner = player
            winnerIdx = playerClosedDuel;
            loserIdx = playerOpenedDuels
            players[playerClosedDuel].balance = parseFloat(players[playerClosedDuel].balance) + 10;

        }
        players[playerOpenedDuels].frozen_money -=10;
        //get mmrs changes
        //update MMRs
        
        //console.log("winner:", winner, "loser:", loser);

        //update duel
        players[playerClosedDuel].closed_duels = players[playerClosedDuel].closed_duels ==undefined ? 1 : players[playerClosedDuel].closed_duels + 1 ;
        players[playerOpenedDuels].opened_duels_closed =  players[playerOpenedDuels].opened_duels_closed == undefined ? 1 : players[playerOpenedDuels].opened_duels_closed + 1 ;
        availableDuels[duelID].P2 = player;
        availableDuels[duelID].P2Score= score;
        availableDuels[duelID].time_open = hour - availableDuels[duelID].timestamp 

        //console.log("closed duel", availableDuels[duelID]);

        //winner
        players[winnerIdx].WINNING_STREAK_FREE += 1;
        players[winnerIdx].LOSING_STREAK_FREE = 0;
        players[winnerIdx].MMR_DUELS += 1;

        //call mmrfn
        var mmr_increase = getMMRChange(players[winnerIdx].mmrFree, players[winnerIdx].WINNING_STREAK_FREE,players[winnerIdx].LOSING_STREAK_FREE,players[loserIdx].mmrFree,players[winnerIdx].MMR_DUELS,"winner",players.length);

        players[winnerIdx].mmrFree = parseFloat(players[winnerIdx].mmrFree) + mmr_increase;


        //loser
        players[loserIdx].WINNING_STREAK_FREE = 0;
        players[loserIdx].LOSING_STREAK_FREE += 1;
        players[loserIdx].MMR_DUELS += 1;
        var mmr_change = getMMRChange(players[loserIdx].mmrFree, players[loserIdx].WINNING_STREAK_FREE,players[loserIdx].LOSING_STREAK_FREE,players[winnerIdx].mmrFree,players[loserIdx].MMR_DUELS,"loser",players.length);
        players[loserIdx].mmrFree = parseFloat(players[loserIdx].mmrFree) - mmr_change;

        


    }else{ // new duel
        var playerIdx = players.findIndex((row) => {return row.username === player;});

        if(players[playerIdx].balance >= 10){
            players[playerIdx].balance = parseInt(players[playerIdx].balance) - 10;
            var score = parseFloat(baseScore) + ((Math.random() % 2500))*100;
            var newD = {duelID : duels.length, MMR: playerMMR , timestamp: hour,P1: player, P1Score: score, state : 0};
            duels.push(newD);

        
            players[playerIdx].opened_games = players[playerIdx].opened_games ==undefined ? 1 : players[playerIdx].opened_games + 1 ;
            players[playerIdx].frozen_money = players[playerIdx].frozen_money ==undefined ? 10 : players[playerIdx].frozen_money + 10 ;

            //console.log("new duel");
            //console.log("new duel", newD);
        }
    }

}


function getMMRChange( player_MMR ,winning_streak, losing_streak , adversary_MMR, number_of_games, game_outcome, numberOfPlayers ) {

    var finalMMR = base_MMR_change;


    if((player_MMR <=400 && game_outcome =="loser" )  || ( player_MMR >=5000 && game_outcome =="winner")){
        return 0;
    }

    //increment * variable on last weeks # of players
    var modifier = numberOfPlayers/200;

    //winning streaks & losing streaks (bad players)
    /*LOGARITHMIC
    if (game_outcome =="loser"){
        if(losing_streak>3) finalMMR *= Math.min((Math.exp(losing_streak)/Math.log(3)),2) // A partir de rachas de 4 con un maximo de x2 
    }else{
        if(winning_streak>3) finalMMR *= Math.min((Math.log(winning_streak)/Math.log(3)),2) // A partir de rachas de 4 con un maximo de x2 
    }*/

    //exponential
    if (game_outcome =="loser"){
        if(losing_streak>3) finalMMR += Math.min(Math.pow(2,losing_streak),400) // A partir de rachas de 4 con un maximo de 100
    }else{
        if(winning_streak>3) finalMMR += Math.min(Math.pow(2,winning_streak),400) // A partir de rachas de 4 con un maximo de 100
    }

    //diference between players , if a player bad wins a good one it increases more 

    var mmrDiff = player_MMR - adversary_MMR;

    var increment_per_difference = 25;
    if (mmrDiff > 0 ){ // only fo rwinning 
        //how many times is the mmr greater 
        var degree = Math.ceil(mmrDiff /50);
        finalMMR += increment_per_difference * degree; //linear funtion on how many times more mmr the adversary had more than you  

    } //jugador ha ganado a alguien más bueno que él

    var initial_games = 20;
    //more increment if player has few games  , first 10 games have a greater impact
    if(number_of_games <=initial_games && game_outcome == "winner"){ //only for victories 

        var max_increment = 3;
        var final_increment = Math.max((max_increment /initial_games ) * (initial_games - number_of_games),1); // linear function for first 15 games that go from a x3 in mmr to a x1 
        
        finalMMR *= final_increment; // flat increment ?  
    }

    // q de tant en tant emparelli amb algú random una mica mes dolent
    return finalMMR;

}
