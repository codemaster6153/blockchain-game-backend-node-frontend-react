require('dotenv').config();
const database = require("../database/database");

async function updateorcs(killedOrcs, terrainID) {

    try {

        killedOrcs =  Math.min(killedOrcs, 10E4);
  
        const numOwners = [35,35,25,15,10,10,15,25,35,35,35,35,25,15,10,10,15,25,35,35,35,35,25,15,10,1,15,25,35,35,35,35,25,15,10,10,15,25,35,35];
        updateDB(terrainID, "endless-siege", numOwners, killedOrcs);

        // STATS
        const d = new Date();
        const today = d.toISOString().slice(0, 10).replace(/-/g, "");

        await database.query(
            "INSERT INTO stats (day, killed_orcs) VALUES (?, ?) ON DUPLICATE KEY UPDATE killed_orcs = killed_orcs + ?",
            [today, killedOrcs, killedOrcs]
        );
        
    } catch (e) {
        console.log(e);
    } 
}

async function updateBalls(pocketedBalls, landID) {

    try {

        pocketedBalls = Math.min(pocketedBalls, 200);

        const numOwners = [120, 120, 120, 120, 100, 100, 100, 80, 80, 60];
        updateDB(landID, "rug-pool", numOwners, Math.min(pocketedBalls, 200));

        // STATS
        const d = new Date();
        const today = d.toISOString().slice(0, 10).replace(/-/g, "");

        await database.query(
            "INSERT INTO stats (day, pocketed_balls) VALUES (?, ?) ON DUPLICATE KEY UPDATE pocketed_balls = pocketed_balls + ?",
            [today, pocketedBalls, pocketedBalls]
        );

    } catch (e) {
        console.log(e);
    } 
}

async function updateDots(eatenDots, id, duelID) {

    try {

        eatenDots = Math.min(eatenDots, 10E4);

        const [row] = await database.query(
            "SELECT total_collected_items, partial_collected_items, n_games, latest_duels_ids FROM level_data WHERE id = ?",
            [id]
        );

        if (!row) {
            throw new Error("Maze eaten dots can't be updated. Level id:" + id);
        } 

        row.total_collected_items += eatenDots;
        row.partial_collected_items += eatenDots;
        row.n_games ++;

        // TODO: ACTUALIZAR EL TIMESTAMP DE LA ULTIMA PARTIDA Y TB EL ARRAY QUE CONTIENE LOS IDS DE LOS DUELOS
        if (duelID === -1) {
            await database.query(
                "UPDATE level_data SET total_collected_items = ?, partial_collected_items = ?, n_games = ?, latest_game_time = CURRENT_TIMESTAMP WHERE id = ?",
                [row.total_collected_items, row.partial_collected_items, row.n_games, id]
            );
        } else {

            let latestDuelIDs;

            if (row.latest_duels_ids) {

                latestDuelIDs = JSON.parse(row.latest_duels_ids);
                latestDuelIDs.push(duelID);

                if (latestDuelIDs.length > 10) {
                    latestDuelIDs.shift();
                }

            } else {
                latestDuelIDs = [duelID];
            }
        
            await database.query(
                "UPDATE level_data SET total_collected_items = ?, partial_collected_items = ?, n_games = ?, latest_duels_ids = ?, latest_game_time = CURRENT_TIMESTAMP WHERE id = ?",
                [row.total_collected_items, row.partial_collected_items, row.n_games, JSON.stringify(latestDuelIDs), id]
            );
        }
        
    } catch (e) {
        throw e;
    }
}

async function updateDB(id, game, ownersArray, counter) {

    try {

        const d = new Date();

        const day = (d.getUTCDate() < 10 ? "0" : "") + d.getUTCDate();
        const month = ((d.getUTCMonth() + 1) < 10 ? "0" : "") + (d.getUTCMonth() + 1);
        const formattedDay = d.getUTCFullYear() + month + day;

        // se mira si hay fila para el dia de hoy en
        var queryStr = "SELECT * FROM ludio_nfts_ratio WHERE game = '" + game + "';";
        var query = await database.query(queryStr);

        var tableLength = query.length;

        // si no hay fila se añade
        if (!query.length || query[query.length - 1].day != formattedDay) { 

            let ludio_ratio = getRatio(query, game);

            queryStr = "INSERT INTO ludio_nfts_ratio (day, game, total_counter, ludio_ratio) VALUES (" + formattedDay + ",'" + game + "'," + counter + "," + ludio_ratio + ");";
            query = await database.query(queryStr);

            // eliminar antiguas y dejar solo 5
            if (tableLength >= 5) {
                queryStr = "DELETE FROM ludio_nfts_ratio where game = '" + game + "' order by day ASC LIMIT 1;";
                query = await database.query(queryStr);
            }
        } else {
            queryStr = "UPDATE ludio_nfts_ratio SET total_counter = total_counter + " + counter + " WHERE day = " + formattedDay + " AND game = '" + game + "';";
            query = await database.query(queryStr);
        }
        
        // se actualizan todos los nfts de la base de datos
        queryStr = "UPDATE ludio_nfts SET games_played = games_played + 1, total_counter = round(total_counter + " + (counter / ownersArray[id - 1]).toFixed(4) + ",4), partial_counter = round(partial_counter + " + (counter / ownersArray[id - 1]).toFixed(4) + ",4) WHERE game = '" + game + "' AND id = " + id + ";";
        query = await database.query(queryStr);
    } catch (e) {
        console.log(e);
    } 
}

function getRatio(array, game) {

    if (game === "rug-pool") {

        let old_counter = 0;
        let r = 1.5;
    
        for(let i = 0; i < array.length; i++) {
            old_counter += array[i].total_counter;
        }
    
        if (array.length) {
            old_counter /= array.length;
        }
        
        if (old_counter < 15000) {
            r = 1.5;
        } else {
        
            let f;
    
            if (old_counter < 100000) {
                f = 0.85;
            } else if (old_counter < 200000) {
                f = 0.75;
            } else if (old_counter < 2000000) {
                f = 0.65;
            } else {
                f = 0.5;
            }
        
            r = parseFloat((old_counter / 15000 * 1.5 * f).toFixed(4));
        }
        
        return r;

    } else {

        let old_counter = 0;
        let r = 30;
    
        for(let i = 0; i < array.length; i++) {
            old_counter += array[i].total_counter;
        }
    
        if (array.length) {
            old_counter /= array.length;
        }
        
        if (old_counter < 750000) {
            r = 30;
        } else {
        
            let f;
    
            if (old_counter < 5E6) {
                f = 0.85;
            } else if (old_counter < 1E7) {
                f = 0.75;
            } else if (old_counter < 1E8) {
                f = 0.65;
            } else {
                f = 0.5;
            }
        
            r = parseFloat((old_counter / 750000 * 30 * f).toFixed(4));
        }
        
        return r;
    }    
}

module.exports = {updateorcs, updateBalls, updateDots};