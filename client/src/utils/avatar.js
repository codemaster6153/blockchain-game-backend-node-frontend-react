import {JsonRpc} from "eosjs";
import initConfig from "../initConfig";

export default async function getAvatar(username) {
    try{

    const rpc = new JsonRpc(initConfig.waxUrl, {fetch});
    let value = await rpc.get_table_rows({
        json: true,
        code: "wax.gg",
        scope: "wax.gg",
        table: "photos",
        lower_bound: username,
        upper_bound: username
    })
    if (value.rows.length > 0) {
        return "https://cloudflare-ipfs.com/ipfs/" + value.rows[0]["photo_hash"];
    } else {
        return "/images/token-small.png";
        }
    }catch(err){
    }
}
