import initConfig from '../../initConfig';
const {JsonRpc} = require("eosjs");
const fetch = require('node-fetch');
let url = initConfig.waxUrl;
if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
    url = "https://wax.pink.gg"
}
var rpc;
let pairs;

(async () => {

    await sleep(250);
    rpc = new JsonRpc(url, { fetch });
    pairs =[{name:"LUDCDC",index: 1149, LUD: 0, CDC: 0},
                {name:"LUDWAX",index: 155, LUD: 0, WAX: 0},
                {name:"LUDCDJ",index: 1195, LUD: 0, CDJ: 0},
                {name:"WAXCDC",index: 1092, WAX: 0, CDC: 0},
                {name:"CDJCDC",index: 1193, CDJ: 0, CDC: 0},
                {name:"WAXCDJ",index: 1093, WAX: 0, CDJ: 0}];

    for(let i in pairs){

        let Pair_data = await rpc.get_table_rows({
            json: true,                 
            code: "alcorammswap",       
            scope: "alcorammswap",      
            table: "pairs",  
            limit: 1,
            index_position: 1,
            key_type: "i64",
            lower_bound: pairs[i].index,
            upper_bound: pairs[i].index,                
            reverse: false,             
            show_payer: false,    
        });
        var asset1 = pairs[i].name.slice(0,3);
        var asset2 = pairs[i].name.slice(3,6);

        pairs[i][asset1] = parseFloat(Pair_data.rows[0].pool1.quantity.split(' ')[0]);
        pairs[i][asset2] = parseFloat(Pair_data.rows[0].pool2.quantity.split(' ')[0]);
        await sleep(250);
    }
    
})();

export async function getStakePrices(){
    try{

        //we've to update the prices each time as there is variations
        var i = getPtr("WAX", "LUD");
        let Pair_data = await rpc.get_table_rows({
            json: true,                 
            code: "alcorammswap",       
            scope: "alcorammswap",      
            table: "pairs",  
            limit: 1,
            index_position: 1,
            key_type: "i64",
            lower_bound: pairs[i].index,
            upper_bound: pairs[i].index,                
            reverse: false,             
            show_payer: false,    
        });
        var asset1 = pairs[i].name.slice(0,3);
        var asset2 = pairs[i].name.slice(3,6);
    
        pairs[i][asset1] = parseFloat(Pair_data.rows[0].pool1.quantity.split(' ')[0]);
        pairs[i][asset2] = parseFloat(Pair_data.rows[0].pool2.quantity.split(' ')[0]);
        await sleep(250);


    //get the different prices on wax & return them as a json
    var wax_1 = getSwap(1,"WAX","CDJ");
    var wax_2_5 = getSwap(2.5,"WAX","CDJ");
    var wax_6 = getSwap(6 ,"WAX","CDJ");

    //return {wax_1: Math.ceil(wax_1), wax_2_5: Math.ceil(wax_2_5), wax_6: Math.ceil(wax_6)};
    return {wax_price: wax_1, rental_prices: [Math.ceil(wax_1), Math.ceil(wax_2_5),Math.ceil(wax_6)]};

    } catch(e) {
        return {error: e.message};
    }
}

export async function createAction(amount,assetIn, assetOut,wax){

    try {
        let nameDict = {LUD: "LUDIO", WAX : "WAX", CDC: "CDCARBZ" , CDJ: "CDJIGO" };
        var receiving = getSwap(amount,assetIn, assetOut,pairs) + " "+nameDict[assetOut];
        var sending;
        var account;
        var action;
        var contract;
        if(assetIn == "WAX"){
            sending =amount.toFixed(8) + " " +nameDict[assetIn];
            account = "eosio.token";
            action = "transfer";
            contract = "0.0000 " + nameDict[assetOut] + "@clashdometkn";
        }else{
            sending = amount.toFixed(4) + " " +nameDict[assetIn];
            account = "clashdometkn";
            action = "transfer";
            contract = assetOut == "WAX" ? "0.00000000 " + nameDict[assetOut] + "@eosio.token" : "0.0000 " + nameDict[assetOut] + "@clashdometkn";
        }
        
        var tries = await takeAction(wax,wax.userAccount,account,action,{
            from: wax.userAccount,
            to: "alcorammswap",
            quantity: sending,
            memo: contract,
        });

        return tries;
    }catch(e){

        return {error: e.message};
    } 
}

function getPtr(assetIn, assetOut){
    var pair=assetIn+assetOut;
    var invPair= assetOut+assetIn;
    for (let i = 0; i< pairs.length; ++i){

        if (pair == pairs[i].name || invPair ==pairs[i].name) {
            return i;
        }
    }
}

export function getSwap(amount,assetIn, assetOut ){

    var ptr = getPtr(assetIn,assetOut);
    var pool_in=pairs[ptr][assetIn];
    var pool_out= pairs[ptr][assetOut];
    var result = getAmountOut(amount,pool_in,pool_out,30);
    result = assetOut == "WAX" ? result.toFixed(8) : result.toFixed(4);

    return result;
}

//calculate 
function getAmountOut(amount,pool_in,pool_out){

    var amount_fee = amount *(10000-30);
    var numerator = amount_fee * pool_out;
    var denominator= pool_in * 10000 +amount_fee;
    var div= numerator/denominator;

    return div;
}

async function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeAction (wax, auth, name, action, dataValue) {
    
    try {

        var result;
        let actions = [{
            account: name,
            name: action,
            authorization: [{
                actor: auth,
                permission: "active",
            }],
            data: dataValue
        }];

        if (wax.type === "wcw") {
            result = await wax.api.transact({
                actions: actions
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            });
        } else if (wax.type === "anchor") {
            result = await wax.signTransaction({
                actions: actions
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            });
        }

        return result;

    } catch (err) {

        return {"error": err.message};
    }
}

//earn program
export async function getEarnData (wax){

    try {

        let player_data = await wax.rpc.get_table_rows({
            json: true,                 
            code: "clashdomewld",       
            scope: "clashdomewld",      
            table: "earn",  
            limit: 1,
            index_position: 1,
            key_type: "i64",
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,                
            reverse: false,             
            show_payer: false,    
        });

        var json_data = JSON.parse(player_data.rows[0].earn_data);
        var earn_data = [];

        for(var key in json_data) { 
            let nameDict = {L: "LUDIO", WAX : "WAX", C: "CDCARBZ" , J: "CDJIGO" };

                var id =  parseInt(key);
                var APY = json_data[key].APY;
                var quantity = json_data[key].q;
                var timestamp = json_data[key].t;
                var asset = nameDict[json_data[key].a];
        
            earn_data.push(getAssetInfo(quantity, timestamp , APY , asset, id));
        }
        
        return earn_data;

    } catch(e) {

        return {error: e.message};
    } 

}

function getAssetInfo (amount , timestamp, APY, asset, id ){

    var APY_to_weeks = {1 : 0.2 , 2: 2 ,5: 1 , 7: 2 , 10: 4 };

    var needed_time = APY_to_weeks[APY];
    const now = Math.floor(Date.now() / 1000); // ahora en segundos
    var time_passed = (now -timestamp) /604800 //semanas que han pasado
    var reward_time = Math.floor(time_passed / needed_time);
    var reward = getReward(amount, reward_time, APY, APY_to_weeks[APY]);

    var next_reward_time =  Math.ceil((needed_time *604800) - ((time_passed - (reward_time * needed_time)) * 604800 )); //formula para calcular cuanto tiempo le falta para la siguenete recompnensa (in s)

    return {id : id , amount : reward.quantity.toFixed(4) + " " + asset, APY: APY, auto_renew : true, cumulative_interest: reward.ci.toFixed(4), ends_in : next_reward_time * 1000, is_claimable: (reward_time>0)};
}

function getReward( amount, reward_time, APY, APY_to_weeks){

    var percent_gain = amount * (APY/100.0);
    var daily_gain = (7.0 * APY_to_weeks) /365.0;
    var stake_gain = percent_gain * daily_gain;

    return {quantity: amount , ci : stake_gain}
}

export async function stakeAction(amount, type, asset ,wax){

    try {
        let nameDict = {LUD: "LUDIO", WAX : "WAX", CDC: "CDCARBZ" , CDJ: "CDJIGO" };
        const APY_to_type = {5 : 1 , 7: 2 ,10: 3};

        var sending = amount.toFixed(4) + " " +nameDict[asset];
        var account = "clashdometkn";
        var action = "transfer";

        var tries = await takeAction(wax,wax.userAccount,account,action,{
            from: wax.userAccount,
            to: "clashdomewld",
            quantity: sending,
            memo: "earn:"+APY_to_type[type]
        });

        return tries;

    } catch(e) {

        return {error: e.message};
    } 
}

export async function getTokenBalances(wax){
    
    try {

        var waxBalance = await wax.rpc.get_currency_balance("eosio.token", wax.userAccount, "WAX");
        var ludioBalance = await wax.rpc.get_currency_balance("clashdometkn", wax.userAccount, "LUDIO");
        var carbzBalance = await wax.rpc.get_currency_balance("clashdometkn", wax.userAccount, "CDCARBZ");
        var jigoBalance = await wax.rpc.get_currency_balance("clashdometkn", wax.userAccount, "CDJIGO");

        waxBalance = waxBalance[0] == undefined ? 0 : parseInt(waxBalance[0]);
        ludioBalance = ludioBalance[0] == undefined ? 0 : parseInt(ludioBalance[0]);
        carbzBalance = carbzBalance[0] == undefined ? 0 : parseInt(carbzBalance[0]);
        jigoBalance = jigoBalance[0] == undefined ? 0 : parseInt(jigoBalance[0]);

        return {WAX: waxBalance, LUD: ludioBalance, CDC : carbzBalance, CDJ: jigoBalance};

    } catch(e) {

        return {error: e.message};
    }
}

export async function unstakeAction( wax, id ){
    
    try {
        
        var account = "clashdomewld";
        var action = "earnunstake";

        var tries = await takeAction(wax,wax.userAccount,account,action,{
            account: wax.userAccount,
            id: id
        });

        return tries;
        
    } catch(e) {

        return {error: e.message};
    } 
}

//tacoswap integration 
var global_quantities_taco={};

async function takeActions (wax, actions) {
    
    try {

        var result;

        if (wax.type === "wcw") {
            result = await wax.api.transact({
                actions: actions
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            });
        } else if (wax.type === "anchor") {
            result = await wax.signTransaction({
                actions: actions
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            });
        }

        return result;
    } catch (err) {

        return {"error": err.message};
    }
}

export async function stakeTaco(wax, WAX_quantity, quantity, code  ){
    try {

        if(global_quantities_taco[code].supply == undefined) {
            await getTacoInfo(wax);
        }

        var code_to_pool = {
            "LUDWAX": "LUDIO_pool",
            "CDCWAX": "CDC_pool",
            "CDJWAX": "CDJ_pool"
        }
        var staking_pool = code_to_pool[code];

        var pairamount = quantity / global_quantities_taco[code][staking_pool] * global_quantities_taco[code].supply * 0.99; //0.1% of all trade volume is distributed proportionally to all liquidity providers

        var code_to_pool = {
            "LUDWAX": "LUDIO",
            "CDCWAX": "CDCARBZ",
            "CDJWAX": "CDJIGO"
        };

        WAX_quantity = WAX_quantity.toFixed(8) + " " +"WAX";
        var LUDIO_quantity = quantity.toFixed(4) + " " +code_to_pool[code];
        pairamount = pairamount.toFixed(4)+ " " +code;
        
        var action1 = {account: "eosio.token" , name : "transfer" ,authorization: [{actor: wax.userAccount,permission: "active"}], data:{from : wax.userAccount , to: "swap.taco", quantity : WAX_quantity, memo: "deposit"}};
        var action2 = {account: "clashdometkn", name: "transfer", authorization: [{actor: wax.userAccount,permission: "active"}], data: { from : wax.userAccount, to: "swap.taco", quantity : LUDIO_quantity, memo: "deposit"}};
        var action3 = {account: "swap.taco", name: "addliquidity" ,authorization: [{actor: wax.userAccount,permission: "active"}], data: {user: wax.userAccount, to_buy: pairamount }};
        var actions = [action1, action2 ,action3];
        
        return await takeActions(wax, actions);

    }catch(e){

        return {error: e.message};
    }
}

export async function unstakeTaco(wax , code ){
    
    if (global_quantities_taco[code].supply == undefined) {
        await getTacoInfo(wax);
    }

    var pairamount = global_quantities_taco[code].player_holdings.player_balance;
    pairamount = pairamount.toFixed(4)+ " " + code;
    
    var action = {account: "swap.taco", name: "remliquidity" ,authorization: [{actor: wax.userAccount,permission: "active"}], data: {user: wax.userAccount, to_sell: pairamount }};
    
    var actions = [action];
    return await takeActions(wax, actions);
}

export async function getPairQty(wax , main , quantity, code){

    try {
        var main_qty;
        var return_qty;
        if(global_quantities_taco[code].supply == undefined) await getTacoInfo(wax);
        var code_to_pool = {
            "LUDWAX": "LUDIO_pool",
            "CDCWAX": "CDC_pool",
            "CDJWAX": "CDJ_pool"
        }
        var pool_name = code_to_pool[code];
        if(main == "WAX"){
            main_qty = global_quantities_taco[code].WAX_pool;
            return_qty = global_quantities_taco[code][pool_name];
        }else{
            main_qty = global_quantities_taco[code][pool_name];
            return_qty = global_quantities_taco[code].WAX_pool;
        }
        var pairamount = quantity / main_qty * global_quantities_taco[code].supply * 0.99; //0.1% of all trade volume is distributed proportionally to all liquidity providers
        pairamount = pairamount / (global_quantities_taco[code].supply + pairamount);
        var percent_pool = quantity/main_qty;

        return  {quantity: percent_pool * return_qty, percent_pool : pairamount *100, rates: global_quantities_taco[code].rates};

    } catch(e) {

        return {error: e.message};
    }
}

export async function getTacoInfo(wax){

    try {
        var taco_rpc = wax.rpc;
        if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
            taco_rpc = rpc;
        }
        //pairs
        let pool_info = await taco_rpc.get_table_rows({
            json: true,                 
            code: "swap.taco",       
            scope: "swap.taco",      
            table: "pairs",  
            limit: 1,
            index_position: 1,
            key_type: "i64",
            lower_bound: "LUDWAX",
            upper_bound: "LUDWAX",                
            reverse: false,             
            show_payer: false,    
            });
        pool_info = pool_info.rows[0]
        var supply = parseFloat(pool_info.supply.split(' ')[0]);
        var LUDIO_pool = parseFloat(pool_info.pool1.quantity.split(' ')[0]);
        var WAX_pool = parseFloat(pool_info.pool2.quantity.split(' ')[0]);

        var LUDIOtoWAX_rate = LUDIO_pool / WAX_pool;
        var WAXtoLUDIO_rate = WAX_pool / LUDIO_pool;
        var rates = {LUDIOtoWAX_rate: LUDIOtoWAX_rate, WAXtoLUDIO_rate: WAXtoLUDIO_rate };
        global_quantities_taco.LUDWAX = {supply : supply , LUDIO_pool: LUDIO_pool, WAX_pool : WAX_pool, rates : rates}; 
        
        await sleep(250);

        let CDC_pool_info = await taco_rpc.get_table_rows({
            json: true,                 
            code: "swap.taco",       
            scope: "swap.taco",      
            table: "pairs",  
            limit: 1,
            index_position: 1,
            key_type: "i64",
            lower_bound: "CDCWAX",
            upper_bound: "CDCWAX",                
            reverse: false,             
            show_payer: false,    
            });
        CDC_pool_info = CDC_pool_info.rows[0]
        var supply = parseFloat(CDC_pool_info.supply.split(' ')[0]);
        var CDC_pool = parseFloat(CDC_pool_info.pool1.quantity.split(' ')[0]);
        var WAX_pool = parseFloat(CDC_pool_info.pool2.quantity.split(' ')[0]);

        var CDCtoWAX_rate = CDC_pool / WAX_pool;
        var WAXtoCDC_rate = WAX_pool / CDC_pool;
        var rates = {CDCtoWAX_rate: CDCtoWAX_rate, WAXtoCDC_rate: WAXtoCDC_rate };
        global_quantities_taco.CDCWAX = {supply : supply , CDC_pool: CDC_pool, WAX_pool : WAX_pool, rates : rates}; 

        let CDJ_pool_info = await taco_rpc.get_table_rows({
            json: true,                 
            code: "swap.taco",       
            scope: "swap.taco",      
            table: "pairs",  
            limit: 1,
            index_position: 1,
            key_type: "i64",
            lower_bound: "CDJWAX",
            upper_bound: "CDJWAX",                
            reverse: false,             
            show_payer: false,    
            });
        CDJ_pool_info = CDJ_pool_info.rows[0]
        var supply = parseFloat(CDJ_pool_info.supply.split(' ')[0]);
        var CDJ_pool = parseFloat(CDJ_pool_info.pool1.quantity.split(' ')[0]);
        var WAX_pool = parseFloat(CDJ_pool_info.pool2.quantity.split(' ')[0]);

        var CDJtoWAX_rate = CDJ_pool / WAX_pool;
        var WAXtoCDJ_rate = WAX_pool / CDJ_pool;
        var rates = {CDJtoWAX_rate: CDJtoWAX_rate, WAXtoCDJ_rate: WAXtoCDJ_rate };
        global_quantities_taco.CDJWAX = {supply : supply , CDJ_pool: CDJ_pool, WAX_pool : WAX_pool, rates : rates}; 
        
        //get players rewards
        let player_info = await taco_rpc.get_table_rows({
            json: true,                 
            code: "swap.taco",       
            scope: wax.userAccount,      
            table: "accounts",  
            limit: 100,
            index_position: 1,
            key_type: "i64",                
            reverse: false,             
            show_payer: false,    
        });
        let pool = player_info.rows.find(element => element.balance.includes("LUDWAX" || "CDCWAX"|| "CDJWAX"));
        if(player_info.rows.length >0 && pool != undefined ){
            let claim_info = await taco_rpc.get_table_rows({
                json: true,                 
                code: "wallet.taco",       
                scope: wax.userAccount,      
                table: "wallets",  
                limit: 100,
                index_position: 1,
                key_type: "i64",                
                reverse: false,             
                show_payer: false,    
            });
            var claims = {};
            if(claim_info.rows.length >0 ){
                var ludio_rw_ptr = claim_info.rows.find(c => c.balance.quantity.includes("LUDIO"));
                claims.LUDIO = ludio_rw_ptr != undefined ?  ludio_rw_ptr.balance : undefined ;
                var CDJ_rw_ptr = claim_info.rows.find(c => c.balance.quantity.includes("CDJIGO"));
                claims.CDJ = CDJ_rw_ptr != undefined ?  CDJ_rw_ptr.balance : undefined;
                var CDC_rw_ptr = claim_info.rows.find(c => c.balance.quantity.includes("CDCARBZ"));
                claims.CDC =  CDC_rw_ptr != undefined ? CDC_rw_ptr.balance : undefined;
                
            }
            pool = player_info.rows.find(element => element.balance.includes("LUDWAX"));

            var player_balance =   parseFloat(pool.balance.split(' ')[0])
            var pool_ownership = player_balance/global_quantities_taco.LUDWAX.supply;
            var LUDIO_qty = pool_ownership * global_quantities_taco.LUDWAX.LUDIO_pool;
            var WAX_qty = pool_ownership * global_quantities_taco.LUDWAX.WAX_pool;
            var player_holdings = {pool_ownership: pool_ownership * 100, LUDIO_qty : LUDIO_qty , WAX_qty : WAX_qty, player_balance: player_balance, player_claims: claims.LUDIO, daily_reward: 500 * pool_ownership  };
            global_quantities_taco.LUDWAX.player_holdings = player_holdings;

            let pool_cdc = player_info.rows.find(element => element.balance.includes("CDCWAX"));
            
            if(player_info.rows.length >0 && pool_cdc != undefined ){
                var player_balance =   parseFloat(pool_cdc.balance.split(' ')[0])
                var pool_ownership = player_balance/global_quantities_taco.CDCWAX.supply;
                var CDC_qty = pool_ownership * global_quantities_taco.CDCWAX.CDC_pool;
                var WAX_qty = pool_ownership * global_quantities_taco.CDCWAX.WAX_pool;
                var player_holdings = {pool_ownership: pool_ownership * 100, CDC_qty : CDC_qty , WAX_qty : WAX_qty, player_balance: player_balance, player_claims: claims.CDC, daily_reward: 500 * pool_ownership  };
                global_quantities_taco.CDCWAX.player_holdings = player_holdings;
            }

            let pool_cdj = player_info.rows.find(element => element.balance.includes("CDJWAX"));
            
            if(player_info.rows.length >0 && pool_cdj != undefined ){
                var player_balance =   parseFloat(pool_cdj.balance.split(' ')[0])
                var pool_ownership = player_balance/global_quantities_taco.CDJWAX.supply;
                var CDJ_qty = pool_ownership * global_quantities_taco.CDJWAX.CDJ_pool;
                var WAX_qty = pool_ownership * global_quantities_taco.CDJWAX.WAX_pool;
                var player_holdings = {pool_ownership: pool_ownership * 100, CDJ_qty : CDJ_qty , WAX_qty : WAX_qty, player_balance: player_balance, player_claims: claims.CDJ, daily_reward: 500 * pool_ownership  };
                global_quantities_taco.CDJWAX.player_holdings = player_holdings;
            }


            return global_quantities_taco;
        }

        return global_quantities_taco;

    } catch(e) {

        return {error: e.message};
    }
}

export async function claimTacoRewards(wax, code){

    try {

        var account = "wallet.taco";
        var action = "withdraw";

        var tries = await takeAction(wax,wax.userAccount,account,action,{
            owner: wax.userAccount,
            ext_asset : global_quantities_taco[code].player_holdings.player_claims
        });

        return tries;

    } catch(e) {

        return {error: e.message};
    } 
}