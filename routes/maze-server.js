const blockchain = require("./blockchain");
const database = require("../database/database");
const fetch = require('node-fetch');
const {ExplorerApi} = require("atomicassets");

async function storeCredential(username, credential) {

    try {

        await database.query(
            "INSERT INTO credentials (username, credential) VALUES (?, ?) ON DUPLICATE KEY UPDATE credential = ?",
            [username, credential, credential]
        );

        return {message: "success"};

    } catch (e) {
        
        throw e;
    }
}

async function onPlayerStakedLevel(username, nft_id) {

    try {

        let url;
        if (process.env.SERVER_TYPE === "testnet") {
            url = "https://test.wax.api.atomicassets.io";
        } else {
            url = "https://aa.dapplica.io";
        }

        const api = new ExplorerApi(url, "atomicassets", {fetch});
        const asset = await api.getAsset(nft_id);

        if (asset.mutable_data && !isNaN(asset.mutable_data.id)) {
            const result = await database.query(
                "UPDATE level_data SET staker = ?, staked = 1, nft_id = ? WHERE id = ? ",
                [username, nft_id, asset.mutable_data.id]
            );
    
            if (result.affectedRows === 0) {
                throw new Error("Level with ID:" + asset.mutable_data.id + "not found");
            }

        } else {
            
            // SE TRATA DE UN NIVEL EN BLANCO
            const result = await database.query(
                "INSERT INTO level_data (staked, staker, game_id, author, nft_id) VALUES (?, ?, ?, ?, ?)",
                [true, username, 6, "ClashDome", nft_id]
            );
    
            if (result.affectedRows === 0) {
                throw new Error("Error inserting level");
            }
        }     
        
        return {message: "success"};

    } catch (e) {
        throw e;
    }
}

async function checkPlayerStakedNFT(username) {
    
    try {

        const row = await database.query(
            "SELECT nft_id from level_data WHERE staker = ?",
            [username]
        );
          
        const nftIDs = row.map((result) => result.nft_id);

        if (!row[0]) {
            throw new Error("Player hasn't staked an NFT yet");
        }

        let data = await blockchain.getTableRows("clashdomepay", "transfers", 1, 1, "i64", username, username, false, 0);
        [data] = [...data.rows];

        const hasPlayerStakedNFT = data && data.t_data && data.t_data.some(transfer_data => nftIDs.indexOf(parseInt(transfer_data.id)) !== -1);

        if (!hasPlayerStakedNFT) {
            throw new Error("Player hasn't staked an NFT yet");
        }

    } catch (e) {
        throw e;
    }
}

// PARA VER SI EL JUGADOR HA VOTADO YA ESTE NIVEL
async function hasPlayerVoteLevel(username, level_id) {

    try {

        const [row] = await database.query(
            "SELECT voted_level_ids FROM player_info WHERE username = ?",
            [username]
        );

        if (!row) {
            return false;
        } 

        // DESERIALIZAMOS
        const votedLevelIDsStr = row.voted_level_ids;

        const votedLevelIDs = votedLevelIDsStr.split(",").map(n => parseInt(n));

        // HA VOTADO A ESTE NIVEL YA?
        if (votedLevelIDs.indexOf(level_id) !== -1) {
            return true;
        } else {
            return false;
        }
    
    } catch (e) {
        throw e;
    }
}

// PROCESAR EL VOTO
async function voteLevel(username, level_id, stars, credential) {

    try {

        // COMPROBAMOS LA CREDENCIAL
        let [row] = await database.query(
            "SELECT credential FROM credentials WHERE username = ?",
            [username]
        );
            
        if (!row) {
            throw new Error("Credential can't be found");
        } 

        if (credential !== row.credential) {
            throw new Error("Wrong credential");
        }
        
        // COMPROBAR SI EL JUGADOR YA HA VOTADO A ESTE NIVEL
        [row] = await database.query(
            "SELECT first_log_timestamp, voted_level_ids FROM player_info WHERE username = ?",
            [username]
        );
        
        let votedLevelIDs = [];

        let insertNewPlayer = false;
        let firstLogTimeStamp = 0;

        if (!row) {

            insertNewPlayer = true;
            votedLevelIDs.push(level_id);

        } else {

            const votedLevelIDsStr = row.voted_level_ids;
            votedLevelIDs = votedLevelIDsStr.split(",").map(n => parseInt(n));

            // HA VOTADO A ESTE NIVEL YA?
            if (votedLevelIDs.indexOf(level_id) !== -1) {
                throw new Error("Player already voted level with ID: " + level_id);
            } else {
                votedLevelIDs.push(level_id);
            }
        }

        if (insertNewPlayer) {

            // AVERIGUAR LA ANTIGUEDAD DEL JUGADOR
            let data = await blockchain.getTableRows("clashdomedll", "players2", 500, 1, "i64", username, username, false, 0);

            if (!data.rows[0] || !data.rows[0].first_log_timestamp) {
                throw new Error("Error while retrieving data from the blockchain");
            } 

            firstLogTimeStamp = data.rows[0].first_log_timestamp * 24 * 60 * 60;

            // INSERTAMOS AL JUGADOR 
            await database.query(
                "INSERT INTO player_info (username, first_log_timestamp, voted_level_ids) VALUES (?, ?, ?)",
                [username, firstLogTimeStamp, votedLevelIDs.join(",")]
            );
        
        } else {

            firstLogTimeStamp = row.first_log_timestamp;

            // ACTUALIZAMOS EL CAMPO voted_level_ids
            await database.query(
                "UPDATE player_info SET voted_level_ids = ? WHERE username = ?",
                [votedLevelIDs.join(","), username]
            );
        }

        // SE VOTA EL NIVEL
        // POTENCIA DE VOTO
        // x 10 mas de 1 año de antiguedad 
        // x 5 mas de 6 meses 
        // x 1 menos de 6 meses

        const now = Math.floor(new Date().getTime() / 1000);
        const deltaTime = now - firstLogTimeStamp;
        const f = deltaTime / (365 * 24 * 60 * 60); // tiempo en años

        let votingPower;

        if (f > 1) {
            votingPower = 10;
        } else if (f > .5) {
            votingPower = 5;
        } else {
            votingPower = 1;
        }

        [row] = await database.query(
            "SELECT votes, n_votes FROM level_data WHERE id = ?",
            [level_id]
        );

        if (!row) {
            throw new Error("Level not found");
        } 

        let v = row.votes;
        let n = row.n_votes;

        v = (v * n + votingPower * stars) / (n + votingPower);
        n ++;

        await database.query(
            "UPDATE level_data SET votes = ?, n_votes = ? WHERE id = ?",
            [v, n, level_id]
        );

        return {message: "success"};
         
    } catch (e) {

        throw e;
    }
}

// insertar un nuevo nivel en la BDD
async function insertLevel(username, game_id, level_data, author, nft_id = 0) {
    
    try {

        const result = await database.query(
            "INSERT INTO level_data (staked, staker, game_id, lvl_data, author, nft_id) VALUES (?, ?, ?, ?, ?, ?)",
            [false, username, game_id, JSON.stringify(level_data), author, nft_id]
        );

        if (result.affectedRows === 1) {
            return {message: "success"};
        } else {
            throw new Error("Error inserting level");
        }

    } catch (e) {

        throw e;
    }
}

// para saber cual sera el próximo nivel de la tabla 
async function getNextLevelId() {

    try {

        const [row] = await database.query(
            "SELECT MAX(id) + 1 AS next_id FROM level_data",
            []
        );

        return row.next_id;

    } catch (e) {
        throw e;
    }
}

async function getLevelId() {

    try {

        const [row] = await database.query(
            'SELECT COUNT(*) AS n FROM level_data WHERE staked = false AND cancelled = false'
        );

        let limit = Math.floor(row.n * Math.random());

        // con esto hacemos q los niveles mediocres salgan menos aun
        if (Math.random() < .5) {
            limit = Math.floor(limit / 2);
        }

        const rows = await database.query(
            '(SELECT id FROM level_data WHERE staked = false AND cancelled = false ORDER BY votes DESC LIMIT ?) UNION (SELECT id FROM level_data WHERE n_votes <= 5 AND staked = false AND cancelled = false)',
            [limit]
        );

        const i = Math.floor(Math.random() * rows.length);

        return rows[i].id;
    
    } catch (e) {

        throw e;
    }
}

async function getLevelData(id) {

    try {

        const [row] = await database.query(
            "SELECT lvl_data FROM level_data where id = ?",
            [id]
        );

        return row.lvl_data;

    } catch (e) {
        throw e;
    }
}

module.exports = {voteLevel, insertLevel, getNextLevelId, getLevelId, getLevelData, storeCredential, hasPlayerVoteLevel, onPlayerStakedLevel, checkPlayerStakedNFT};
