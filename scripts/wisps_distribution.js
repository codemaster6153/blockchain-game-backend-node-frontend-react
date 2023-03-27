const {ExplorerApi} = require("atomicassets");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig");
const { Api, JsonRpc} = require("eosjs");
const fetch = require('node-fetch');

// REPARTIR 99 WISPS DE CADA COLOR A LAS CUENTAS QUE TENGAN EL NFT VIP
const TESTNET = false;

const ATOMIC_URL_TESTNET = 'https://test.wax.api.atomicassets.io';
const ATOMIC_URL_MAINNET = 'https://aa.dapplica.io';

const WAX_URL_TESTNET = 'https://testnet.waxsweden.org';
const WAX_URL_MAINNET = 'https://api.waxsweden.org';

const CLASHDOMEMAZ_ACTIVE_PRIVATE_KEY_TESTNET = '5JgsmAsQ14uNeyCztXSuqGRao6Eawh8t3DoqEpJ1JxuTPgeVWUa';
const CLASHDOMEMAZ_ACTIVE_PRIVATE_KEY_MAINNET = '5JTsk7Dbk5zVwDJZLKsv1HjkYtzV5bSF7fS6RV1TAxivvn4tPU4';

const SCHEMA_NAME = "testlevel1";

const TEMPLATE_ID_TESTNET = 610871;
const TEMPLATE_ID_MAINNET = 671386;

const api = new ExplorerApi(TESTNET ? ATOMIC_URL_TESTNET : ATOMIC_URL_MAINNET, "atomicassets", {fetch});

(async () => {

    const assets = await api.getAssets({collection_name: "clashdomenft", schema_name: "vip"}, 1, 500);

    const accounts = assets.map(asset => asset.owner);

    let uniqueAccounts = accounts.filter((account, index) => accounts.indexOf(account) === index);

    // console.log(uniqueAccounts);

    uniqueAccounts = ["fitzcarraldo"];

    // transferWisps(uniqueAccounts);
    transferNFTs(uniqueAccounts);

})();

async function transferWisps(accounts) {

    // TRANSFERIMOS 99 WISPS DE CADA COLOR A CADA CUENTA
    accounts.forEach(async account => {

        const actionData = {
            account: account, 
            n_red: 99,
            n_green: 49,
            n_yellow: 19,
            n_blue: 9
        }

        const result = await takeAction('clashdomemaz', 'clashdomemaz', 'addwisps', actionData);

        console.log("**** 99 wisps set for:", account, "transaction id:", result.transaction_id);

        await emulateLatency(350);
    });
}

async function transferNFTs(accounts) {

    const attr_map = [
        {"key":"name","value":["string","Maze Level Blank v2"]},
        {"key":"img","value":["string","QmXrDQ82oKzRyHojgFCVWjgAWaiH6Rq8Gy4UPimUiqLaGp"]}, // este hash se tendra q cambiar para mainnet
        {"key":"author","value":["string","ClashDome"]}
    ];

    for (let i = 0; i < accounts.length; i ++) {

        // if (accounts[i] !== "fitzcarraldo") {

            const actionData = {
                authorized_minter: "clashdomemaz", 
                collection_name: "tstclashdome",
                schema_name: SCHEMA_NAME,
                template_id: TESTNET ? TEMPLATE_ID_TESTNET : TEMPLATE_ID_MAINNET,
                new_asset_owner: accounts[i],
                immutable_data: attr_map,
                mutable_data: [],
                tokens_to_back: []
            };
    
            const result = await takeAction('atomicassets', 'clashdomemaz', 'mintasset', actionData);
    
            console.log("**** nft minted for:", accounts[i], "transaction id:", result.transaction_id);
        // }

       await emulateLatency(350);
    }
}

async function emulateLatency(time) {

    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    }).then(function() {
        return;
    });
}

async function takeAction(contractName, account, action, actionData) {

    const signatureProvider = new JsSignatureProvider([TESTNET ? CLASHDOMEMAZ_ACTIVE_PRIVATE_KEY_TESTNET : CLASHDOMEMAZ_ACTIVE_PRIVATE_KEY_MAINNET]);
    const rpc = new JsonRpc(TESTNET ? WAX_URL_TESTNET : WAX_URL_MAINNET, { fetch });
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder()});

    try {

        const result = await api.transact({
            actions: [{
                account: contractName,
                name: action,
                authorization: [{
                    actor: account,
                    permission: "active",
                }],
                data: actionData
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30
        });
       
        return result;

    } catch (e) {
       
        throw new Error(e.message);
    }
}