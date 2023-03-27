const express = require('express');
const router = express.Router();
const blockchain = require("./blockchain");

require('dotenv').config();

const mysql = require("mysql");
const config = require("../config/database.json");  

var gm = require('gm').subClass({ imageMagick: true });

const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const {IDsManager} = require("../validators/avatar/avatar-validator");

const avatar_parts = ["backhair", "cape", "leg_skin", "leg", "pelvis", "bottom_back", "bottom", "shoes", "torso", "tops", "belts", "jackets", "neck_skin", "neck", "arm_skin", "arm", "flaps", "head", "beard", "mouth", "nose", "facialmark", "eyebrows", "eyes", "bangs", "accessory_ear", "accessory"];

const no_fill = ["accessory", "accessory_ear", "eyes", "pelvis"];
const only_fill = ["neck_skin", "facialmark"];
const leg_dup = ["leg", "leg_skin", "arm", "arm_skin", "shoes"];

let lock = false;

if (!process.env.DEV_MODE) {
    var connection = createConnection();
    handleDisconnect();
}

router.post('/update-avatar', async (req, res) => {

    try {

        let pack_asset_id = req.body.pack_asset_id;

        let pack_info = await blockchain.getTableRows("packsopenerx", "avatarpacks", 1, 1, "i64", pack_asset_id, pack_asset_id, false, 0);

        if (!pack_info.rows.length) {
            res.send({error: "Get pack asset info error"});
            return;
        }

        pack_info = pack_info.rows[0];

        if (pack_info.unboxer !== req.body.username) {
            res.send({error: "Get pack asset info error. Unboxer mismatch." + pack_info.unboxer + " != " + req.body.username});
            return;
        }

        if (!pack_info.claimable) {
            res.send({error: "Pack not claimable yet."});
            return;
        }

        let stringData = req.body.data;
        stringData = stringData.replace(/\"/g, '"');

        let queryString = "SELECT template_id FROM avatars WHERE data = '" + stringData + "'";
        let queryResult = await query(queryString);

        if (queryResult.length) {
            res.send({error: "There is a Citizen that looks exactly like yours. No two Citizens are allowed to look the same. Please make some changes."});
            return;
        }

        let avatarData = JSON.parse(req.body.data);

        let validator = new IDsManager();
        let correctAvatar = validator.checkAvatar(req.body.is_thin, pack_info.rarity.toUpperCase(), avatarData);

        console.log(correctAvatar);

        if (!correctAvatar.ret) {
            res.send({error: "Server validator error with message:\n" + correctAvatar.error});
            return;
        }

        if (lock) {
            res.send({error: 'You are in the minting queue. Please try minting your character again in ONE MINUTE.'});
            return;
        }

        lock = true;

        let images = [];

        if (pack_info.rarity === "Pleb") {
            images.push("./avatar-images/bg/bg_pleb.png")
        } else if (pack_info.rarity === "UberNorm") {
            images.push("./avatar-images/bg/bg_uber.png")
        } else if (pack_info.rarity === "Hi-Clone") {
            images.push("./avatar-images/bg/bg_hi-clone.png")
        } else {
            images.push("./avatar-images/bg/bg_pleb.png")
        }

        let t1 = Date.now();

        let countArmDup = 0;

        for(let i = 0; i < avatar_parts.length; i++) {
            if (avatarData[avatar_parts[i]] && avatarData[avatar_parts[i]].id !== null && avatarData[avatar_parts[i]].id !== undefined) {

                if (!no_fill.includes(avatar_parts[i])) {

                    let color = "";

                    if (avatarData[avatar_parts[i]].color) {
                        color = "_" + avatarData[avatar_parts[i]].color;
                    }

                    let url = "./avatar-images/" + avatar_parts[i] + "/" + avatar_parts[i] + "_" + avatarData[avatar_parts[i]].id;

                    if (avatarData[avatar_parts[i]].id === "") {
                        url += "fill" + color + ".png";
                    } else {
                        url += "_fill" + color + ".png";
                    }
                    images.push(url);

                    if (leg_dup.includes(avatar_parts[i])) {
                        let url = "./avatar-images/" + avatar_parts[i] + "_dup/" + avatar_parts[i] + "_" + avatarData[avatar_parts[i]].id;

                        if (avatarData[avatar_parts[i]].id === "") {
                            url += "fill" + color + "_dup.png";
                        } else {
                            url += "_fill" + color + "_dup.png";
                        }

                        if (avatar_parts[i] === "arm" || avatar_parts[i] === "arm_skin") {
                            images.splice(7 + countArmDup, 0, url);
                            countArmDup++;
                        } else {
                            images.push(url);
                        }
                    }
                }

                if (!only_fill.includes(avatar_parts[i])) {

                    let color = "";

                    if (avatarData[avatar_parts[i]].color && no_fill.includes(avatar_parts[i])) {
                        color = "_" + avatarData[avatar_parts[i]].color;
                    }

                    let url = "./avatar-images/" + avatar_parts[i] + "/" + avatar_parts[i] + "_" + avatarData[avatar_parts[i]].id + color + ".png";

                    if (avatarData[avatar_parts[i]].id === "") {
                        url = "./avatar-images/" + avatar_parts[i] + "/" + avatar_parts[i] + color + ".png";
                    }
                    
                    images.push(url);

                    if (leg_dup.includes(avatar_parts[i])) {

                        let url = "./avatar-images/" + avatar_parts[i] + "_dup/" + avatar_parts[i] + "_" + avatarData[avatar_parts[i]].id + color + "_dup.png";

                        if (avatarData[avatar_parts[i]].id === "") {
                            url = "./avatar-images/" + avatar_parts[i] + "_dup/" + avatar_parts[i] + color + "_dup.png";
                        }

                        if (avatar_parts[i] === "arm" || avatar_parts[i] === "arm_skin") {
                            images.splice(7 + countArmDup, 0, url);
                            countArmDup++;
                        } else {
                            images.push(url);
                        }
                    }
                }
            }
        }

        for(let i = 0; i < images.length; i++) {
            if (!fs.existsSync(images[i])) {
                console.log(images[i] + " NO ESTA!!")
                lock = false;
                res.send({error: "Missing file " + images[i]});
                return;
            }
        }

        let b64 = await mergeImages(images, {
            Canvas: Canvas,
            Image: Image
        }); 

        var base64Data = b64.replace(/^data:image\/png;base64,/, "");

        await fs.promises.writeFile('./avatar-images/avatar' + req.body.username + '.png', base64Data, 'base64');

        let result = await createAvatar('./avatar-images/avatar' + req.body.username + '.png', './avatar-images/avatar' + req.body.username + '_cropped.jpg');

        console.log(result);

        if (result !== "OK") {
            lock = false;
            res.send({error: "ERROR CREATE AVATAR: " + result});
            return;
        }

        // TODO: remove
        // lock = false;
        // res.send({result: "OK"});
        
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let data = new FormData();
        data.append('file', fs.createReadStream('./avatar-images/avatar' + req.body.username + '.png'));
        let response = await axios.post(url,
            data,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
                    pinata_api_key: "9361ae1467d4992af54a",
                    pinata_secret_api_key: "d0172a9672dcc216bc7c76a183b34198a13cd1d2fcd78672b9cfe592178e75db"
                }
            }
        );

        if (response.data.IpfsHash) {

            data = new FormData();
            data.append('file', fs.createReadStream('./avatar-images/avatar' + req.body.username + '_cropped.jpg'));
            let response_avatar = await axios.post(url,
                data,
                {
                    headers: {
                        'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
                        pinata_api_key: "9361ae1467d4992af54a",
                        pinata_secret_api_key: "d0172a9672dcc216bc7c76a183b34198a13cd1d2fcd78672b9cfe592178e75db"
                    }
                }
            );

            fs.unlinkSync('./avatar-images/avatar' + req.body.username + '.png');
            fs.unlinkSync('./avatar-images/avatar' + req.body.username + '_cropped.jpg');

            if (response_avatar.data.IpfsHash) {
                let attr_map = [
                    {"key":"name","value":["string","Clashdome Citizen - " + pack_info.rarity]},
                    {"key":"img","value":["string",response.data.IpfsHash]},
                    {"key":"rarity","value":["string",pack_info.rarity]},
                    {"key":"data","value":["string",stringData]},
                    {"key":"artist","value":["string", "ClashDome Studio (Abeestart)"]},
                    {"key":"link","value":["string", "https://clashdome.io/nfts"]},
                    {"key":"avatar","value":["string",response_avatar.data.IpfsHash]},
                ];
        
                let actionData = {authorized_creator: "packsopenerx", collection_name: "clashdomenft", schema_name: "citizen", transferable: true, burnable: true, max_supply: 1, immutable_data: attr_map};
                let result = await blockchain.takeAction("atomicassets", "packsopenerx", "createtempl", actionData, 0);

                if (result.error) {
                    lock = false;
                    res.send({error: result.error.message});
                    return;
                }
        
                console.log(result);
                console.log(result.value.processed.action_traces[0].inline_traces[0].act.data.template_id)
                
                let template_id = result.value.processed.action_traces[0].inline_traces[0].act.data.template_id;

                actionData = {unboxer: req.body.username, pack_asset_id: req.body.pack_asset_id, template_id: template_id};
                result = await blockchain.takeAction("packsopenerx", "packsopenerx", "createavatar", actionData, 0);

                if (result.error) {

                    actionData = {unboxer: req.body.username, pack_asset_id: req.body.pack_asset_id, template_id: template_id};
                    result = await blockchain.takeAction("packsopenerx", "packsopenerx", "createavatar", actionData, 0); 

                    if (result.error) {
                        lock = false;
                        res.send({error: result.error.message});
                        return;
                    }
                }

                let queryString = "INSERT INTO avatars(template_id, creator_name, data) VALUES (" + template_id + ", '" + req.body.username + "','" + stringData + "')";
                let queryResult = await query(queryString);

                console.log("TIME");
                console.log(Date.now() - t1);
                lock = false;
                res.send({result: result});
            } else {
                lock = false;
                res.send({error: "IPFS 2 ERROR"});
            }
        } else {
            lock = false;
            res.send({error: "IPFS 1 ERROR"});
        }

        // TODO: remove this
        // res.send({error: "SERVER DISABLED"});

    } catch(e) {
        lock = false;
        res.send({error: e});
        console.log(e);
    }
});

async function createAvatar(input, output) {

    var size = 140;
  
    return new Promise(resolve => {
      gm(input)
        .sharpen(5)
        .crop(280, 280, 245, 168)
        .resize(size, size)
        .write(output, function(err) {
          resolve(err || 'OK');
        });
    });
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

    connection = createConnection();

    connection.connect(function(err) {              // The server is either down
        if(err) {                                   // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                       // to avoid a hot loop, and to allow our node script to
        });                                     // process asynchronous requests in the meantime.
                                                // If you're also serving http, display a 503 error.
        connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

let query = function( value ) {
    // devolver una promesa
    return new Promise(( resolve, reject ) => {
        connection.query(value, ( err, rows) => {
            if ( err ) {
            reject( err )
            } else {
            resolve( rows )
            }
        })
    })
}

module.exports = router;