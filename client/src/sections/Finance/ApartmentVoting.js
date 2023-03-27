import initConfig from '../../initConfig';

let url = initConfig.waxUrl;
if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
    url = "https://wax.pink.gg"
}

export async function getApartmentNotification(wax){

    try {
        const now = Math.floor(Date.now() / 1000); // ahora en segundos
        let mission_info = await wax.rpc.get_table_rows({
            json: true,                 
            code: "clashdomewld",       
            scope: "clashdomewld",      
            table: "missions",  
            limit: 1,
            index_position: 1,
            key_type: "i64",
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,                
            reverse: false,             
            show_payer: false,    
            });
        if(mission_info.rows.length <= 0) {return true}
        var missions_json = JSON.parse(mission_info.rows[0].missions);
        var voting_mission = missions_json.avm ;
        var last_time = voting_mission.msst;
        return (now-last_time) > (3600*24*7) || voting_mission.mc == "false";

    } catch(e) {
        return {error: e.message};
    }
}

export async function initMission(wax){

    try {
        var account = "clashdomewld";
        var action = "initvotapt";
        var tries = await takeAction(wax,wax.userAccount,account,action,{
            account: wax.userAccount
        });

        if(tries.error){
            let mission_info = await wax.rpc.get_table_rows({
                json: true,                 
                code: "clashdomewld",       
                scope: "clashdomewld",      
                table: "missions",  
                limit: 1,
                index_position: 1,
                key_type: "i64",
                lower_bound: wax.userAccount,
                upper_bound: wax.userAccount,                
                reverse: false,             
                show_payer: false,    
                });
            if(mission_info.rows.length <=0) {return tries}
            var missions_json = JSON.parse(mission_info.rows[0].missions);
            var voting_mission = missions_json.avm;
            return voting_mission.apts;  
        }

        await sleep(1250); //propagatin wait

        let mission_info = await wax.rpc.get_table_rows({
            json: true,                 
            code: "clashdomewld",       
            scope: "clashdomewld",      
            table: "missions",  
            limit: 1,
            index_position: 1,
            key_type: "i64",
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,                
            reverse: false,             
            show_payer: false,    
            });
        if(mission_info.rows.length <=0) {return {error: "API error , please try again"}}
        var missions_json = JSON.parse(mission_info.rows[0].missions);
        var voting_mission = missions_json.avm;
        return voting_mission.apts;
        
    } catch(e) {
        return {error: e.message};
    } 
}

export async function endMission(wax, apartment_votes){

    try {
        var account = "clashdomewld";
        var action = "voteapts";
        var tries = await takeAction(wax,wax.userAccount,account,action,{
            account: wax.userAccount,
            scores: JSON.stringify(apartment_votes)
        });
    
        return tries;
    } catch(e) {
        return {error: e.message};
    } 
}

export async function disablenot(wax){

    try {
        var account = "clashdomewld";
        var action = "disablenot";
        var tries = await takeAction(wax,wax.userAccount,account,action,{
            account: wax.userAccount
        });

        return tries;
    } catch (e) {
        return {error: e.message};
    } 
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

        return {error: err.message};
    }
}

async function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms))
}

export async function getAptRating(account, wax, apartments ){

    try {
    
        if(apartments[account] && (typeof(apartments[account]["as"]) !== 'undefined') && (typeof(apartments[account]["as"]["v"]) !=='undefined') && (typeof(apartments[account]["as"]["n"]) !=='undefined') ){
                
            return {score: apartments[account].as.v / apartments[account].as.n, n_votes: apartments[account].as.n};
        } else{
            return {score: 0 , n_votes: 0} ;
        }

    } catch(e) {
        return 0 ;
    } 
}

export async function sendFR(wax, account){

    try {

        var acc = "clashdometkn";
        var action = "transfer";
        var tries = await takeAction(wax,wax.userAccount,acc,action,{
            from: wax.userAccount,
            to: "clashdomewld",
            quantity: "100.0000 CDJIGO",
            memo: "send_friend_request:" + account
        });

        return tries;

    }catch(e) {

        return {error: e.message};
    } 
}