import React, { useState, useEffect } from 'react'
import UnstakableAssetCard from './UnstakableAssetCard';
import TokenCard from './TokenCard';
import initConfig from '../../../../initConfig';
import { map_check, map_dec, stakable_decoraions_dict_test } from './StakedAssets';
const { ExplorerApi } = require("atomicassets");

let staked_decorations_type = {}

function UnstakableAssets({ wax, unstakablePiggy, unstakableSlot, citizenStaked, unstakableTreadmill, unstakableVending, unstakableSlotReason, unstakableTreadmillReason, unstakableVendingReason }) {
    const [slotes, setSlotes] = useState([]);
    const [tools, setTools] = useState([]);
    const [citizens, setCitizens] = useState([])
    const [wallet, setWallet] = useState([])
    const [_tokens, setTokens] = useState([])
    const [_earlyAccess, setEarlyAccess] = useState()
    const [loading, setLoading] = useState(true)
    const [decorations, setDecorations] = useState([]);

    const getStakeData = async () => {
        if (!loading) {
            setLoading(true)
        }

        const atomicAPI = new ExplorerApi(initConfig.atomicUrl, "atomicassets", { fetch });

        //tokens
        let token_template_id;

        if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
            token_template_id = 403495;
        } else {
            token_template_id = 373360;
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

        let wallets = await atomicAPI.getAssets({ owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "wallet" });
        setWallet(wallets)

        let earlyAccessNFT = await atomicAPI.getAssets({ owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "vip" });
        if (earlyAccessNFT.length) {
            setEarlyAccess(earlyAccessNFT[0].asset_id)
        }

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
        setDecorations(decorations)



        setLoading(false)
    }

    useEffect(() => {
        if (wax && wax.userAccount) {
            getStakeData()
        }
    }, [wax])

    const unstakable_decorations = decorations.filter((dec) => map_check(Number(dec.template.template_id), staked_decorations_type))

    const NO_ASSETS = !citizens.length && !slotes.length && !tools.length && !wallet.length && !unstakable_decorations.length

    return (
        <>
            {
                loading ?
                    <img className="loading" src="/images/loading_icon.png" /> :
                    NO_ASSETS ?
                        <p className='no-result-text'>There are no unstakable Assets !</p> :
                        null
            }
            {
                !loading && citizenStaked && citizens && citizens.length > 0 &&
                citizens.map((item, index) => {
                    return <UnstakableAssetCard reason={"Unstake your previously staked citizen"} memo="stake citizen" type='citizen' setAry={setCitizens} ary={citizens} index={index} wax={wax} mint_no={item.template_mint} name={item.name} key={item.asset_id} asset_id={item.asset_id} img={item.data.img} />
                })
            }
            {
                !loading && (unstakableSlot || !citizenStaked) && slotes && slotes.length > 0 &&
                slotes.map((item, index) => {
                    return <UnstakableAssetCard reason={unstakableSlotReason} memo="stake slots" type='slot' setAry={setSlotes} ary={slotes} index={index} wax={wax} mint_no={item.template_mint} name={item.name} key={item.asset_id} asset_id={item.asset_id} img={item.data.img} />
                })
            }
            {
                !loading && (tools || !citizenStaked) && tools.length > 0 &&
                tools.map((item, index) => {
                    if ((item.data.type === "Jigowatts" && unstakableTreadmill) || !citizenStaked) {
                        return <UnstakableAssetCard reason={unstakableTreadmillReason} memo="stake tool" type={item.data.type} setAry={setTools} ary={tools} index={index} wax={wax} mint_no={item.template_mint} name={item.name} key={item.asset_id} asset_id={item.asset_id} img={item.data.img} />
                    } else if ((item.data.type === "Carbz" && unstakableVending) || !citizenStaked) {
                        return <UnstakableAssetCard reason={unstakableVendingReason} memo="stake tool" type={item.data.type} setAry={setTools} ary={tools} index={index} wax={wax} mint_no={item.template_mint} name={item.name} key={item.asset_id} asset_id={item.asset_id} img={item.data.img} />
                    }
                })
            }
            {
                !loading && (unstakablePiggy || !citizenStaked) && wallet && wallet.length > 0 && wallet.map((item, index) => {
                    return <UnstakableAssetCard reason={'You can only stake one wallet at a time'} memo="stake wallet" type='wallet' setAry={setWallet} ary={wallet} index={index} wax={wax} mint_no={item.template_mint} name={item.name} key={item.asset_id} asset_id={item.asset_id} img={item.data.img} />
                })
            }

            {
                !loading  && decorations.length > 0 && decorations.filter((dec) => map_check(Number(dec.template.template_id), staked_decorations_type)).map((item, index) => {
                    return <UnstakableAssetCard reason={`You can only stake one ${stakable_decoraions_dict_test[Number(item.template.template_id)]} at a time`} memo="stake decoration" type='decoration' setAry={setWallet} ary={wallet} index={index} wax={wax} mint_no={item.template_mint} name={item.name} key={item.asset_id} asset_id={item.asset_id} img={item.data.img} />
                })
            }

        </>
    )
}

export default UnstakableAssets