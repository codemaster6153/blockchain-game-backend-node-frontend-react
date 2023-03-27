import { func } from 'prop-types';
import React, { useState, useEffect } from 'react'
import initConfig from '../../../../initConfig';
import AmnioNftCard from './AmnioNFTCard';
import DecorationPackCard from './DecorationPackCard';
import StakableAssetCard from './StakableAssetCard';
import { map_check, map_dec } from './StakedAssets';
import TokenCard from './TokenCard';
const { ExplorerApi } = require("atomicassets");
var dec_pack_id
if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
    dec_pack_id = 2289;
}else{
    dec_pack_id = 9572;
}

let staked_decorations_type = {}

export async function getDecorationsPack(wax){
    try{
        var asset_ids = [];
        var to_claim = {};
        let value = await wax.rpc.get_table_rows({
            json: true,                 
            code: "atomicpacksx",       
            scope: "atomicpacksx",      
            table: "unboxpacks",  
            limit: 500,
            index_position: 2,
            key_type: "i64",               
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,                
            reverse: true,             
            show_payer: false,    
        });
        if(value.rows.length > 0){
            for (let index = 0; index < value.rows.length; index++) {
                    if(parseInt(value.rows[index].pack_id) != dec_pack_id) continue;
                    var asset_id = parseInt(value.rows[index].pack_asset_id)
                    asset_ids.push(asset_id);

                    let assets = await wax.rpc.get_table_rows({
                        json: true,                 
                        code: "atomicpacksx",       
                        scope: asset_id,      
                        table: "unboxassets",  
                        limit: 3,
                        index_position: 1,
                        key_type: "i64",                          
                        reverse: true,             
                        show_payer: false,    
                    });
                    to_claim[asset_id] = {}
                    for (let j = 0; j < assets.rows.length; j++) {
                        console.log(assets.rows[j].origin_roll_id, assets.rows[j].template_id)
                        to_claim[asset_id][assets.rows[j].origin_roll_id] = assets.rows[j].template_id;
                        
                    }
            }
            console.log(to_claim);
            return to_claim
        }

    }catch(e){
        console.log(e);
        return{error: e}
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
        }]

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


export async function claimAsset(wax, asset_id, number_id){
    try{

        var account = "atomicpacksx";
        var action = "claimunboxed";

        var tries = await takeAction(wax,wax.userAccount,account,action,{
            pack_asset_id: asset_id,
            origin_roll_ids: number_id
        });

        return tries;

    }catch(e){

        console.log(e.message);
        return {error: e.message}
    } 
}

export async function openPack(wax, asset_id){
    try{

        var account = "atomicassets";
        var action = "transfer";

        var tries = await takeAction(wax,wax.userAccount,account,action,{
            from: wax.userAccount,
            to: "atomicpacksx",
            asset_ids: [asset_id],
            memo: "unbox"
        });

        return tries;

    }catch(e){

        console.log(e.message);
        return {error: e.message}
    } 
}

function StakableAssets({ wax, setNav, unstakablePiggy, unstakableSlot, disableCarbzStaking, disableJigoStaking, unstakableTreadmill, unstakableVending, citizenStaked }) {
    const [slotes, setSlotes] = useState([]);
    const [tools, setTools] = useState([]);
    const [citizens, setCitizens] = useState([])
    const [wallet, setWallet] = useState([])
    const [tokens, setTokens] = useState([])
    const [decorations, setDecorations] = useState([]);
    const [earlyAccess, setEarlyAccess] = useState()
    const [showCitizen, setShowCitizen] = useState(true)
    const [trialCitizen, setTrialCitizen] = useState()
    const [amnioNfts, setAmnioNfts] = useState([])
    const [decorationsPacks, setDecorationsPacks] = useState([]);
    const [openedDecorationsPacks, setOpenedDecorationsPacks] = useState([]);
    const [loading, setLoading] = useState(true)
    

    // const NO_ASSETS = !citizens.length && !slotes.length && !tools.length && !wallet.length && !decorations.length && !tokens.length && !amnioNfts.length;

    const NO_ASSETS = false;

    const getStakeData = async () => {
        if(!loading){
            setLoading(true)
        }
        
        const atomicAPI = new ExplorerApi(initConfig.atomicUrl, "atomicassets", { fetch });
        let staked_citizen = await wax.rpc.get_table_rows({
            json: true,
            code: "clashdomewld",
            scope: "clashdomewld",
            table: "citiz",
            limit: 1,
            index_position: 1,
            key_type: "i64",
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,
            reverse: false,
            show_payer: false,
        });

        if (staked_citizen && staked_citizen.rows && staked_citizen.rows.length > 0) {
            setShowCitizen(false)
        }

        //tokens
        let token_template_id;
        let decorations_pack_tid;
        if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
            token_template_id = 403495;
            decorations_pack_tid = 603794;
        } else {
            token_template_id = 373360;
            decorations_pack_tid = 603794;
        }
        let tokens = await atomicAPI.getAssets({ owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "packs", template_id: token_template_id });

        setTokens(tokens)

        // CITIZENS
        let citizen = await atomicAPI.getAssets({ owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "citizen" });
        setCitizens(citizen)

        // slots
        let slots = await atomicAPI.getAssets({ owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "slot" });
        setSlotes(slots)

        // TOOLS
        let tools = await atomicAPI.getAssets({ owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "tool" });
        setTools(tools)

        // WALLETS
        let wallets = await atomicAPI.getAssets({ owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "wallet" });
        setWallet(wallets)

        await fetchDecorations()

        // EARLY ACCESS NFT
        let earlyAccessNFT = await atomicAPI.getAssets({ owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "vip" });
        if (earlyAccessNFT.length) {
            setEarlyAccess(earlyAccessNFT[0].asset_id)
        }

        // TRIAL
        let trial_citizen = await wax.rpc.get_table_rows({
            json: true,
            code: "clashdomewld",
            scope: "clashdomewld",
            table: "trials",
            limit: 1,
            index_position: 1,
            key_type: "i64",
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,
            reverse: false,
            show_payer: false,
        });
        if (trial_citizen && trial_citizen.rows && trial_citizen.rows.length > 0 && trial_citizen.rows[0].staked) {
            setTrialCitizen(trial_citizen.rows[0]);
        }

        // AMNIO TANKS
        const amnioNFTs = await getAmnioNfts()
        setAmnioNfts(amnioNFTs)

        // Finish loading assets
        setLoading(false)
    }

    const getAmnioNfts = async () => {
        // initiate explorere api
        let api = new ExplorerApi(initConfig.atomicUrl, "atomicassets", { fetch });

        // assets templates
        let templates = [];
        if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
            templates = [348479, 348478, 348477]
        } else {
            templates = [336217, 336216, 336214]
        }

        try {
            // fetching all assets from explorer api
            const assets = await api.getAssets({ owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "packs", template_id: templates[0] });
            const assets2 = await api.getAssets({ owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "packs", template_id: templates[1] });
            const assets3 = await api.getAssets({ owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "packs", template_id: templates[2] });

            const allAssets = [...assets, ...assets2, ...assets3]

            if (allAssets.length) {
                return allAssets
            }
        } catch (err) {
            console.log("Error while fetching Amnio NFTs: ", err)
            return null
        }
    }

    const fetchDecorations = async () => {
        let token_template_id;
        let decorations_pack_tid;
        if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
            token_template_id = 403495;
            decorations_pack_tid = 603794;
        } else {
            token_template_id = 373360;
            decorations_pack_tid = 643405;
        }

        const atomicAPI = new ExplorerApi(initConfig.atomicUrl, "atomicassets", { fetch });

        // STAKED DECORATIONS
        let decoraion = await wax.rpc.get_table_rows({
            json: true,                 
            code: "clashdomewld",       
            scope: "clashdomewld",      
            table: "decorations",  
            limit: 100,
            index_position: 2,
            key_type: "i64",
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,                
            reverse: false,             
            show_payer: false,    
        });
        staked_decorations_type = {};
        decoraion.rows.map(row => map_dec(row, staked_decorations_type));

        // DECORATIONS
        let decorations = await atomicAPI.getAssets({ owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "decoration" });
        // Filter out decoration of same type that is already equiped.
        setDecorations(decorations.filter((dec) => !map_check(Number(dec.template.template_id), staked_decorations_type)))

        // UNOPNED PACKS
        let decorationsPacks = await atomicAPI.getAssets({ owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "packs", template_id: decorations_pack_tid });
        setDecorationsPacks(decorationsPacks)

        // OPNED PACKS
        let openedDecorationsPacks = await getDecorationsPack(wax)
        setOpenedDecorationsPacks(openedDecorationsPacks)
    }

    useEffect(() => {
        if (wax && wax.userAccount && wax.rpc) {
            getStakeData()
            getAmnioNfts()
        }
    }, [wax])

    useEffect(() => {
        let citiz = JSON.parse(JSON.stringify(citizens));
        if (citiz.length && trialCitizen) {
            for (let i = 0; i < citiz.length; i++) {
                if (trialCitizen.asset_id === citiz[i].asset_id) {
                    citiz.splice(i, 1)
                    setCitizens(citiz);
                    break;
                }
            }
        }
    }, [trialCitizen])

    useEffect(() => {
        console.log(citizens);
    }, [citizens])

    return (
        <>
            {
                loading ?
                    <img className="loading" src="/images/loading_icon.png" /> :
                    NO_ASSETS ?
                        <p className='no-result-text'>There are no stakable Assets !</p> :
                        null
            }
            {
                !loading && showCitizen && citizens && citizens.length > 0 &&
                citizens.map((item, index) => {
                    return <StakableAssetCard memo="stake citizen" type='citizen' setAry={setCitizens} ary={citizens} index={index} wax={wax} mint_no={item.template_mint} name={item.name} key={item.asset_id} asset_id={item.asset_id} img={item.data.img} setNav={setNav} template_id={item.template.template_id} trialCitizen={trialCitizen} />
                })
            }
            {
                !loading && citizenStaked && !unstakableSlot && slotes && slotes.length > 0 &&
                slotes.map((item, index) => {
                    return <StakableAssetCard disableCarbzStaking={disableCarbzStaking} disableJigoStaking={disableJigoStaking} memo="stake slots" type='slot' setAry={setSlotes} ary={slotes} index={index} wax={wax} mint_no={item.template_mint} name={item.name} key={item.asset_id} asset_id={item.asset_id} img={item.data.img} setNav={setNav} />
                })
            }
            {
                !loading && citizenStaked && tools && tools.length > 0 &&
                tools.map((item, index) => {
                    if (item.data.type === "Jigowatts" && !unstakableTreadmill) {
                        return <StakableAssetCard memo="stake tool" type={item.data.type} setAry={setTools} ary={tools} index={index} wax={wax} mint_no={item.template_mint} name={item.name} key={item.asset_id} asset_id={item.asset_id} img={item.data.img} setNav={setNav} />
                    } else if (item.data.type === "Carbz" && !unstakableVending) {
                        return <StakableAssetCard memo="stake tool" type={item.data.type} setAry={setTools} ary={tools} index={index} wax={wax} mint_no={item.template_mint} name={item.name} key={item.asset_id} asset_id={item.asset_id} img={item.data.img} setNav={setNav} />
                    }
                })
            }
            {
                !loading && citizenStaked && !unstakablePiggy && wallet && wallet.length > 0 && wallet.map((item, index) => {
                    return <StakableAssetCard memo="stake wallet" type='wallet' setAry={setWallet} ary={wallet} index={index} wax={wax} mint_no={item.template_mint} name={item.name} key={item.asset_id} asset_id={item.asset_id} img={item.data.img} setNav={setNav} />
                })
            }
            {
                !loading && decorations && decorations.length > 0 && decorations.map((item, index) => {
                    return <StakableAssetCard memo="stake decoration" type='decoration' setAry={setDecorations} ary={wallet} index={index} wax={wax} mint_no={item.template_mint} name={item.name} key={item.asset_id} asset_id={item.asset_id} img={item.data.img} vid={item.data.video} setNav={setNav} />
                })
            }
            {
                !loading && tokens && tokens.length > 0 && tokens.map((item, index) => {
                    return <TokenCard name={'Token Pack'} key={item.asset_id} setAry={setTokens} ary={tokens} index={index} img={item.data.img} mint_no={item.template_mint} wax={wax} asset_id={item.asset_id} setNav={setNav} />
                })
            }
            {!loading && amnioNfts && amnioNfts.length ? (
                amnioNfts.map((nft) => {
                    return <AmnioNftCard nft={nft} staked={false} />
                })
            ) : null}
            {
                !loading && decorationsPacks && decorationsPacks.length > 0 && decorationsPacks.map((item, index) => {
                    return <DecorationPackCard isOpened={false} name={'Decoration Pack'} key={item.asset_id} img={item.data.img} wax={wax} asset_id={item.asset_id} mint_no={item.template_mint} fetchDecorations={fetchDecorations} />
                })
            }
            {
                !loading && openedDecorationsPacks && Object.keys(openedDecorationsPacks).length > 0 &&  Object.keys(openedDecorationsPacks).map((item, index) => {
                    return <DecorationPackCard isOpened={true} name={'Decoration Pack'} key={item} wax={wax} asset_id={item} fetchDecorations={fetchDecorations} />
                })
            }
        </>
    )
}

export default StakableAssets
