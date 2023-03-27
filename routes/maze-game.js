const express = require('express');
const router = express.Router();
const fs = require('fs');
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const blockchain = require("./blockchain");
const mazeserver = require("./maze-server");
const database = require("../database/database");
const fetch = require('node-fetch');
const {ExplorerApi} = require("atomicassets");

const Cells = {
    EMPTY : 0,
    PATH: 1,
    WALL: 2,
    GROUND: 3,
    DOT: 4,
    POWER_PELLET: 5,
    PACMAN_SPAWNING_POINT: 6,
    GHOSTS_SPAWNING_1_POINT: 7,
    GHOSTS_SPAWNING_2_POINT: 8,
    GHOSTS_SPAWNING_3_POINT: 9,
    GHOSTS_SPAWNING_4_POINT: 10,
    PORTAL_1: 11,
    PORTAL_2: 12,
    PORTAL_3: 13,
    PORTAL_4: 14 
};

const SCHEMA_NAME = 'testlevel1';

const TEMPLATE_ID_TESTNET = 610871;
const TEMPLATE_ID_MAINNET = 671386;

router.get('/aux', async (req, res) => {

    try {

        const [row] = await database.query(
            'SELECT COUNT(*) AS n FROM level_data_test WHERE staked = false'
        );

        let limit = Math.floor(row.n * Math.random());

        // con esto hacemos q los niveles mediocres salgan menos aun
        if (Math.random() < .5) {
            limit = Math.floor(limit / 2);
        }

        const levels = await database.query(
            '(SELECT * FROM level_data_test ORDER by (votes) desc LIMIT ?) UNION (SELECT * FROM level_data_test WHERE n_votes <= 5)',
            [limit]
        );

        const i = Math.floor(Math.random() * levels.length);

        res.send({id: levels[i].id, votes: levels[i].votes, n_votes: levels[i].n_votes});
    
    } catch (e) {

        res.status(400).json({ error: "" + e.message});
    }
});

router.get('/claim/:username/:id', async (req, res) => {

    try {

        let url = process.env.SERVER_TYPE === "testnet" ? "https://test.wax.api.atomicassets.io" : "https://aa.dapplica.io";

        const api = new ExplorerApi(url, "atomicassets", {fetch});
        const assets = await api.getAssets({owner: req.params.username, collection_name: "tstclashdome", schema_name: "testlevel"});

        const assets_ids = assets.map(asset => asset.asset_id);

        const i = assets_ids.indexOf(req.params.id);

        if (i === -1) {
            throw new Error("Player doesn't own nft with id:", req.params.id);
        }

        const asset = assets[i];

        const [row] = await database.query(
            "SELECT votes, n_votes, total_collected_items, n_games, latest_game_time, partial_collected_items, rarity FROM level_data WHERE id = ?",
            [asset.mutable_data.id]
        );

        if (row.partial_collected_items === 0) {
            throw new Error("Noting to claim");
        }

        // LA RAREZA rarity NO SE UTILIZA TODAVIA
        const ludioAmount = 1 * row.partial_collected_items;

        // redondear a 4 decimales
        const roundedAmount = ludioAmount.toFixed(4);

        // convertir a cadena de texto
        const amountStr = roundedAmount.toString();

        // rellenar con ceros si no tiene 4 decimales
        const parts = amountStr.split('.');
        const decimals = parts[1] || '';
        const paddedDecimals = decimals.padEnd(4, '0');
        const ludioAmountStr = `${parts[0]}.${paddedDecimals}` + " LUDIO";

        let actionData = {
            from: "clashdomepay", 
            to: req.params.username,
            quantity: ludioAmountStr,
            memo: "ClashDome Maze level editor reward"
        };

        await blockchain.takeAction("clashdometkn", "clashdomepay", "transfer", actionData, 0);

        await database.query("UPDATE level_data SET partial_collected_items = 0, claim_time = CURRENT_TIMESTAMP, nft_id = ? WHERE id = ?",
            [req.params.id, asset.mutable_data.id]
        );

        const date = new Date();
        const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const timestamp = date.toLocaleDateString('en-GB', options).replace(/\//g, '/');

        const mutableData = [
            {"key":"name","value":["string", asset.mutable_data.name]},
            {"key":"img","value":["string", asset.mutable_data.img]},
            {"key":"id","value":["uint64", asset.mutable_data.id]},
            {"key":"rating","value":["float32", Math.floor(row.votes * 100) / 100]},
            {"key":"n_votes","value":["uint64", row.n_votes]},
            {"key":"n_games","value":["uint64", row.n_games]},
            {"key":"total_collected_items","value":["uint64", row.total_collected_items]},
            {"key":"last_claim","value":["string", timestamp]},
            {"key":"author","value":["string", asset.mutable_data.author]}
        ];

        actionData = {
            authorized_editor: "clashdomemaz", 
            asset_owner: req.params.username,
            asset_id: req.params.id,
            new_mutable_data: mutableData
        };

        await blockchain.takeAction("atomicassets", "clashdomemaz", "setassetdata", actionData, 0);

        res.send({message: "success"});
    
    } catch (e) {

        res.status(400).json({ error: "" + e.message});
    }
});

router.get('/get-level-info/:id', async (req, res) => {

    try {

        const [row] = await database.query(
            "SELECT votes, n_votes, total_collected_items, n_games, latest_game_time, partial_collected_items, latest_game_time, latest_duels_ids FROM level_data WHERE id = ?",
            [req.params.id]
        );

        if (!row) {
            throw new Error("Can't retrieve data for level:"+ req.params.id);
        }

        res.send(row);
    
    } catch (e) {

        res.status(400).json({ error: "" + e.message});
    }
});

router.get('/player-has-staked-level/:username/:nftid', async (req, res) => {

    try {

        await mazeserver.onPlayerStakedLevel(req.params.username, req.params.nftid);

        res.send({message: "success"});
    
    } catch (e) {

        res.status(400).json({ error: "" + e.message});
    }
});

router.get('/vote-level/:username/:level_id/:stars/:credential', async (req, res) => {

    try {

        await mazeserver.voteLevel(req.params.username, parseInt(req.params.level_id), parseInt(req.params.stars), parseInt(req.params.credential));

        res.send({message: "sucess"});
    
    } catch (e) {

        res.status(400).json({ error: "" + e.message});
    }
});

router.post('/mint-level-nft', async (req, res) => {

    try {

        await mazeserver.checkPlayerStakedNFT(req.body.userName);

        const wispsRequired = await checkNFTData(JSON.parse(req.body.nftData), req.body.userName);

        // CREAMOS UNA IMAGEN EN './maze-images/level.png'
        let id = await createLevelImage(JSON.parse(req.body.nftData), wispsRequired);

        const attr_map = [
            {"key":"name","value":["string", "Maze Level v2"]},
            {"key":"img","value":["string", "https://clashdome.io/maze-levels/level_" + id + ".png"]},
            {"key":"id","value":["uint64", id]},
            {"key":"rating","value":["float32", "0.0000000"]},
            {"key":"n_votes","value":["uint64", 0]},
            {"key":"n_games","value":["uint64", 0]},
            {"key":"total_collected_items","value":["uint64", 0]},
            {"key":"last_claim","value":["string", "-"]},
            {"key":"author","value":["string", req.body.userName]}
        ];

        const actionData = {
            account: req.body.userName, 
            fee: "250.0000 LUDIO",
            ...wispsRequired,
            schema_name: SCHEMA_NAME,
            template_id: process.env.SERVER_TYPE === "testnet" ? TEMPLATE_ID_TESTNET : TEMPLATE_ID_MAINNET,
            mutable_data: attr_map
        };

        await blockchain.takeAction("clashdomemaz", "clashdomemaz", "mintlevel", actionData, 0);

        await mazeserver.insertLevel(req.body.userName, req.body.gameID, req.body.nftData, req.body.userName);

        res.send({id: id});
    
    } catch (e) {

        res.status(400).json({ error: "" + e.message});
    }
});

async function createLevelImage(nftData, wisps) {

    const cellSize = 32;
    const backgroundWidth = 1120;

    const board = nftData.board;

    const cols = board.length;
    const rows = board[0].length;

    // para centrar el mapa
    const dx = (backgroundWidth - ((cols + 1 ) * cellSize)) / 2;
    const dy = (backgroundWidth - ((rows - 1 ) * cellSize)) / 2;

    const images = [];

    // EL FONDO DEL NFT
    images.push({src: './maze-images/empty_level_base.jpg', x: 0, y: 0});

    // LAS VIDAS
    const lifes = nftData.gameOverOptions.lifes;

    if (lifes) {
        images.push({src: './maze-images/empty_level_life_tab.png', x: 0, y: 0});
        drawNumbers(760, 1034, lifes, images, "white", "big", "right");
    }

    // EL TIEMPO
    if (nftData.gameOverOptions.time) {
        images.push({src: './maze-images/empty_level_time_tab.png', x: 0, y: 0});
        const time = nftData.gameOverOptions.time / 60;
        drawNumbers(970, 1034, time, images, "white", "big", "right");
    }
  
    // EL TERRENO
    for (let c = 0; c < cols; c ++) {
        for (let r = 0; r < rows; r ++) {
    
            let x = c * cellSize + dx;
            let y = r * cellSize + dy;
    
            let src;
    
            switch(board[c][r]) {
                case Cells.PATH: 
                    src = './maze-images/floor.png';
                    break; 
                case Cells.WALL: 
                    if (r + 1 === rows || board[c][r + 1] === Cells.GROUND || board[c][r + 1] === Cells.PATH) {
                        src = './maze-images/outer_wall.png';
                    } else {
                        src = './maze-images/v_wall.png';
                    } break; 
                default: 
                    break; 
            }
    
            if (src) {
                images.push(
                    {src: src, x: x, y: y}
                );
            }
        }   
    }   

    // LOS ELEMENTOS INTERACTIVOS
    const interactiveItems = nftData.interactiveItems;

    for (let c = 0; c < cols; c ++) {
        for (let r = 0; r < rows; r ++) {

            let x = c * cellSize + dx;
            let y = r * cellSize + dy;

            switch (interactiveItems[c][r]) {

                case Cells.DOT:
                    images.push({src: './maze-images/dot.png', x: x, y: y});
                    break;

                case Cells.POWER_PELLET:
                    images.push({src: './maze-images/pill_big_icon.png', x: x, y: y});
                    break;

                case Cells.PORTAL_1:
                    images.push({src: './maze-images/portal_1_icon.png', x: x, y: y}); 
                    break;

                case Cells.PORTAL_2:
                    images.push({src: './maze-images/portal_2_icon.png', x: x, y: y});
                    break;

                case Cells.PORTAL_3:
                    images.push({src:'./maze-images/portal_3_icon.png', x :x, y :y}); 
                    break;

                case Cells.PORTAL_4:
                    images.push({src: './maze-images/portal_4_icon.png', x: x, y: y});
                    break;
            
                default:
                    break;
            }
        }
    }

    drawNumbers(160, 1054, wisps.red, images, "red", "small", "left");
    drawNumbers(294, 1054, wisps.green, images, "green", "small", "left");
    drawNumbers(420, 1054, wisps.yellow, images, "yellow", "small", "left");
    drawNumbers(530, 1054, wisps.blue, images, "blue", "small", "left");

    // EL PUNTO DE INSTANCIACION DEL JUGADOR
    const playerPosition = nftData.playerData.position;

    images.push(
        {src: './maze-images/player-icon.png', x: playerPosition.x * cellSize + dx, y: playerPosition.y * cellSize + dy - 12}
    );

    // LOS PUNTOS DE INSTANCIACION DE LOS FANTASMAS
    const ghostData = nftData.ghostData;

    ghostData.forEach(data => {
    
        const x = data.position.x * cellSize + dx;
        const y = data.position.y * cellSize + dy;
    
        images.push({src: `./maze-images/ghost-icon-${data.ghosts.length}.png`, x, y});
    }); 

    const b64 = await mergeImages(images, {
        width: backgroundWidth,
        height: backgroundWidth,
        Canvas: Canvas,
        Image: Image
    }); 

    const base64Data = b64.replace(/^data:image\/png;base64,/, "");

    const id = await mazeserver.getNextLevelId();

    await fs.promises.writeFile('./client/build/maze-levels/level_' + id + '.png', base64Data, 'base64');

    return id;
}

async function checkNFTData(nftData, userName) {

    // COMPROBAR CUANTOS WISPS TIENE EL JUGADOR
    let data = await blockchain.getTableRows("clashdomemaz", "playerwisps", 1, 1, "i64", userName, userName, false, 0);

    let wispsOwned;

    if (data.rows.length > 0) {
        delete data.rows[0].account;
        wispsOwned = data.rows[0];
    } else {
        throw new Error(`Wisps data not found for user ${userName}`);
    }

    const cols = nftData.board.length;
    const rows = nftData.board[0].length;

    const interactiveItems = nftData.interactiveItems;
    const wispsRequired = {red: 0, blue: 0, yellow: 0, green: 0};

    for (let c = 0; c < cols; c ++) {
        for (let r = 0; r < rows; r ++) {

            switch (interactiveItems[c][r]) {

                case Cells.PORTAL_1:
                    wispsRequired.red ++;
                    break;

                case Cells.PORTAL_2:
                    wispsRequired.blue ++;
                    break;

                case Cells.PORTAL_3:
                    wispsRequired.yellow ++;
                    break;

                case Cells.PORTAL_4:
                    wispsRequired.green ++;
                    break;
            
                default:
                    break;
            }
        }
    }

    if (wispsRequired.red > wispsOwned.red) {
        throw new Error("Player doesn't have enough red wisps");
    }

    if (wispsRequired.green > wispsOwned.green) {
        throw new Error("Player doesn't have enough green wisps");
    }

    if (wispsRequired.yellow > wispsOwned.yellow) {
        throw new Error("Player doesn't have enough yellow wisps");
    }

    if (wispsRequired.blue > wispsOwned.blue) {
        throw new Error("Player doesn't have enough blue wisps");
    }

    // LOS CONTADORES DE WISPS
    if (wispsRequired.red > 99 || wispsRequired.green > 99 || wispsRequired.yellow > 99 || wispsRequired.blue > 99) {
        throw new Error("Wisps values above 99 not allowed");
    }

    // LA POSICION DEL JUGADOR
    const playerPosition = nftData.playerData.position;

    if (playerPosition.x < 0 || playerPosition.x >= cols || playerPosition.y < 0 || playerPosition.y >= rows) {
        throw new Error("Player position not valid");
    }

    // LOS PUNTOS DE INSTANCIACION DE LOS FANTASMAS
    nftData.ghostData.forEach(data => {
        if (data.position.x < 0 || data.position.x >= cols || data.position.y < 0 || data.position.y >= rows) {
            throw new Error("Ghost spawning point position not valid");
        } 
    }); 

    return wispsRequired;
} 

function drawNumbers(x, y, n, images, color, fontSize, center = "center") {

    if (n > 0) {

        let charactersWidth;

        if (fontSize === "big") {
            charactersWidth = {"0": 46, "1": 30, "2": 38, "3": 42, "4": 48, "5": 46, "6": 45, "7": 45, "8": 45, "9": 46};
        } else {
            charactersWidth = {"0": 31, "1": 24, "2": 26, "3": 29, "4": 33, "5": 32, "6": 31, "7": 31, "8": 34, "9": 32};
        }

        const spacing = 0.75; 
        const digits = n.toString().split('');        
        const totalWidth = digits.reduce((accumulator, digit) => accumulator + charactersWidth[digit], 0);
        let xPos;

        if (center === "center") {
            xPos = x - totalWidth / 2;
        } else if (center === "left") {
            xPos = x;
        } else if (center === "right") {
            xPos = x - totalWidth * .9;
        }

        digits.forEach(digit => {
            const dWidth = charactersWidth[digit];
            images.push({
                src: `./maze-images/digit_${color}_${digit}.png`, 
                x: xPos + dWidth / 2, // Centrado en el ancho del carácter
                y: y 
            });
            xPos += dWidth * spacing; // Ajuste de la separación entre caracteres
        });
    } else {
        images.push({
            src: `./maze-images/digit_${color}_-.png`, 
            x: x, // Centrado en el ancho del carácter
            y: y 
        });
    } 
  }

module.exports = router;
