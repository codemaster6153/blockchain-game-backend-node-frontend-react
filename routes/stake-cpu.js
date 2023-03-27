const blockchain = require("./blockchain");
var CronJob = require('cron').CronJob;


var contracts = ["clashdomestk","clashdomesk5","clashdomesk4"]//avalible contracts
var active_contract = "clashdomestk"; //contract using at the moment
var suspended_contracts = [];     //contracts that are waiting for unstaking, objecs with name + time of reactivation

function getActiveContract(){
    if (active_contract != undefined){return active_contract;}
    else{return "clashdomestk";}
}

async function  initContracts(){
    try {
        // fn to call when the server starts , since when it's reseted we won't know the states of the contracts !!!!works
        for(let initialContracts in contracts ){

            var is_active = await blockchain.getTableRows(contracts[initialContracts], "state", 500, 1, "i64", null, null, false, 0);
            await sleep(250);
            if(is_active.error || is_active == undefined ){
                var sc = {name: contracts[initialContracts], empty : false, time_of_sleep: 0};
                suspended_contracts.push(sc);
                contracts.splice(initialContracts,1);
            }else{
                if(is_active.rows.length){
                    if(is_active.rows[0].is_sleep != 0){
                        var empty = is_active.rows[0].timestamp_wake > 0 ? true : false; //to know if the contract has been totally emptied or not
                        var sc = {name: contracts[initialContracts], empty : empty, time_of_sleep: is_active.rows[0].timestamp_wake};
                        suspended_contracts.push(sc);
                        contracts.splice(initialContracts,1);
                    }
                }
            }
        }

        if(contracts.length >0) {
            active_contract = contracts[0];
        }
    
        return contracts.length;

    }catch(e){
        console.log("Error:",e)
    }
}

var active_contracts =  initContracts() ;

function startJob() {

    var check_unstake = new CronJob('00 00 * * * *', function(){
        (async () => {
            try {
                var staked_cpu = await blockchain.getTableRows(active_contract, "stake", 500, 1, "i64", null, null, false, 0);

                var d1 = new Date();
                var d2 = new Date( d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds());
                var timestamp = Math.floor(d2.getTime()/ 1000);
    
                for (let i = 0; i < staked_cpu.rows.length; i++) {

                    if (timestamp >= staked_cpu.rows[i].timestamp_end) {
                        await blockchain.takeAction(active_contract, active_contract, "unstakecpu", {key: staked_cpu.rows[i].key}, 0);
                        await sleep(250);
                    }
                }

                var contract_info = await blockchain.getWalletInfo(active_contract,0);
                await sleep(250);
                if(parseFloat(contract_info.core_liquid_balance.split(' ')[0]) < 200){ //swap contracts to next one  !!!working
                    await blockchain.takeAction(active_contract, active_contract, "swapsleep", {new_state: true, timestamp_wake : 0 }, 0); //unblock the contract staking interactions
                    await sleep(250);
                    var sc = {name: active_contract, empty : false, time_of_sleep: timestamp};
                    suspended_contracts.push(sc);
                    contracts.shift();
                    active_contract = contracts[0];
                }

                for ( sc in suspended_contracts){
                    if(suspended_contracts[sc].empty == false ){
                        staked_cpu = await blockchain.getTableRows(suspended_contracts[sc].name, "stake", 500, 1, "i64", null, null, false, 0);
                        if(staked_cpu.rows.length == 0) {
                            suspended_contracts[sc].empty = true;
                            suspended_contracts[sc].time_of_sleep = (timestamp + (86400*3));// cuando este vacio se espera 3 dias y luego se reactivará 
                            await blockchain.takeAction(suspended_contracts[sc].name, suspended_contracts[sc].name, "swapsleep", {new_state: true, timestamp_wake : (timestamp + (86400*3)) }, 0); //unblock the contract staking interactions

                        }else {
                            if((timestamp - suspended_contracts[sc].time_of_sleep)/86400 > 7 ){
                                //player without RAM issue
                                for (let i = 0; i < staked_cpu.rows.length; i++) {
                                    
                                    if (timestamp >= staked_cpu.rows[i].timestamp_end) {
                                        var wallet_info = await blockchain.getWalletInfo(staked_cpu.rows[i].account,0);
                                        if(wallet_info.ram_quota - wallet_info.ram_usage < 100){ //ask how much ram is needed
                                            //stake some ram to the resources of the player
                                            await sleep(250);
                                        }
                                        await blockchain.takeAction(suspended_contracts[sc].name, suspended_contracts[sc].name, "unstakecpu", {key: staked_cpu.rows[i].key}, 0);
                                        await sleep(250);
                                    }
                                }
                            }else{
                                for (let i = 0; i < staked_cpu.rows.length; i++) {
                                    //we have to do the same for the suspended contracts until they're empty 
                                    if (timestamp >= staked_cpu.rows[i].timestamp_end) {
                                        await blockchain.takeAction(suspended_contracts[sc].name, suspended_contracts[sc].name, "unstakecpu", {key: staked_cpu.rows[i].key}, 0);
                                        await sleep(250);
                                    }
                                }
                            }
                        }
                    }else{
                        
                        //reactivar contrato y borrar de suspendidos !!!!works
                        if((timestamp - suspended_contracts[sc].time_of_sleep)/86400 > 3  ){
                            var contract_info = await blockchain.getWalletInfo(suspended_contracts[sc].name,0);
                            await sleep(250);
                            if(parseFloat(contract_info.core_liquid_balance.split(' ')[0]) > 200){ // pongo este if dentro de otro para evitar hacer siempre la query de get wallet info cada hora
                            contracts.push(suspended_contracts[sc].name);
                            await blockchain.takeAction(suspended_contracts[sc].name, suspended_contracts[sc].name, "swapsleep", {new_state: false, timestamp_wake :0 }, 0); //unblock the contract staking interactions
                            suspended_contracts.splice(sc,1);
                            await sleep(250);

                            }
                        }
                    }
                }

            } catch (e) {
                console.log(e);
            }
        })();

    }, null, true, "Atlantic/Azores");

    var check_refund = new CronJob('00 00 10 * * *', function(){
        (async () => {
            try {
                await blockchain.takeAction("eosio", "clashdomestk", "refund", {owner: "clashdomestk"}, 0);
                await sleep(250);
                await blockchain.takeAction("eosio", "clashdomesk4", "refund", {owner: "clashdomesk2"}, 0);
                await sleep(250);
                await blockchain.takeAction("eosio", "clashdomesk5", "refund", {owner: "clashdomesk3"}, 0);
                await sleep(250);

                //vote producers with the contracts too
                await blockchain.takeAction("eosio", "clashdomestk", "voteproducer", {voter: "clashdomestk", proxy: "bloksioproxy", producers: []}, 0);
                await sleep(250);
                await blockchain.takeAction("eosio", "clashdomesk4", "voteproducer", {voter: "clashdomesk4", proxy: "bloksioproxy", producers: []}, 0);
                await sleep(250);
                await blockchain.takeAction("eosio", "clashdomesk5", "voteproducer", {voter: "clashdomesk5", proxy: "bloksioproxy", producers: []}, 0);
                await sleep(250);


            } catch (e) {
                console.log(e);
            }
        })();
    }, null, true, "Atlantic/Azores");
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {startJob, getActiveContract};
//module.exports.startJob = startJob;