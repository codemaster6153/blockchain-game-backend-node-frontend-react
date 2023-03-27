import React, { useEffect, useState } from 'react'
import NftCard from '../../../NFT/sections/NftCard';
import initConfig from '../../../../initConfig';
import StakedAssetCard from './StakedAssetCard';
import AmnioNftCard from './AmnioNFTCard';
const { ExplorerApi } = require("atomicassets");

export var stakable_decoraions_dict_test;
    if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
        stakable_decoraions_dict_test = {
            603653:"Marquee",
            463749:"Marquee",
        
            603654: "Panel",
            462396: "Panel",
        
            603655: "Sides",
            463757: "Sides",
        
            603646: "Floor",
            603645: "Floor",
            603644: "Floor",
        
            603649: "Wall",
            603648: "Wall",
            603647: "Wall",
        
            603652: "Baseboard",
            603651: "Baseboard",
            603650: "Baseboard",
        
            603632: "Ceiling",
            603631: "Ceiling",
            603630: "Ceiling"
        }
    }else{
        stakable_decoraions_dict_test = {
            642455:"Marquee",
            569457:"Marquee",
    
            642456: "Panel",
            551953: "Panel",
    
            642457: "Sides",
            556725: "Sides",
        
            642448: "Floor",
            642447: "Floor",
            642446: "Floor",
    
            642451: "Wall",
            642450: "Wall",
            642449: "Wall",
    
            642454: "Baseboard",
            642453: "Baseboard",
            642452: "Baseboard",
    
            642434: "Ceiling",
            642433: "Ceiling",
            642432: "Ceiling"
        }
    }

export function map_dec(template_id, staked_decorations_type = {}){
    var tid = template_id.template_id;
    if(stakable_decoraions_dict_test[tid]) staked_decorations_type[stakable_decoraions_dict_test[tid]] = true;
}

export function map_check(tid, staked_decorations_type){
    return staked_decorations_type[stakable_decoraions_dict_test[tid]] != undefined
}


function StakedAssets({wax, setCitizenStaked, setUnstakablePiggy, setNav}) {
    const [slotes, setSlotes] = useState('');
    const [tools, setTools] = useState('');
    const [citizens, setCitizens] = useState('')
    const [wallets, setWallets] = useState('')
    const [decorations, setDecorations] = useState('')
    const [stakedAmnio, setStakedAmnio] = useState(null)
    const [loading, setLoading] = useState(true)

    const NO_ASSETS = !citizens.length && !tools.length && !slotes.length && wallets.length && !decorations.length && !stakedAmnio

    const getStakedData = async () => {
        if(!loading){
            setLoading(true)
        }

        // TOOLS
        let tools = await wax.rpc.get_table_rows({
            json: true,                 
            code: "clashdomewld",       
            scope: "clashdomewld",      
            table: "tools",  
            limit: 100,
            index_position: 2,
            key_type: "i64",
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,                
            reverse: false,             
            show_payer: false,    
        });
        setTools(tools.rows)

        // SLOTS
        let slots = await wax.rpc.get_table_rows({
            json: true,                 
            code: "clashdomewld",       
            scope: "clashdomewld",      
            table: "slots",  
            limit: 100,
            index_position: 2,
            key_type: "i64",
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,                
            reverse: false,             
            show_payer: false,    
        });
        setSlotes(slots.rows)
        
        // CITIZEN
        let citizen = await wax.rpc.get_table_rows({
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
        setCitizens(citizen.rows)

        if(citizen.rows.length > 0){
            setCitizenStaked(true)
        }else{
            setCitizenStaked(false)
        }
        
        // WALLETS
        let wallet = await wax.rpc.get_table_rows({
            json: true,                 
            code: "clashdomewld",       
            scope: "clashdomewld",      
            table: "wallets",  
            limit: 100,
            index_position: 2,
            key_type: "i64",
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,                
            reverse: false,             
            show_payer: false,    
        });
        setWallets(wallet.rows)

        if(wallet.rows.length > 0){
            setUnstakablePiggy(true)
        }else{
            setUnstakablePiggy(false)
        }

        // DECORATIONS
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
        setDecorations(decoraion.rows)

        const stakedAmnioNft = await getStakedAmnioNft()
        setStakedAmnio(stakedAmnioNft)
        
        setLoading(false)
    }

    const getStakedAmnioNft = async () => {
        if(!wax.rpc) return

        try {
            // initiate explorere api
            let api = new ExplorerApi(initConfig.atomicUrl, "atomicassets", { fetch });

            const result = await wax.rpc.get_table_rows({
                json: true,
                code: "packsopenerx",
                scope: "packsopenerx",
                table: "avatarpacks",
                index_position: 2,
                key_type: "i64",
                lower_bound: wax.userAccount,
                upper_bound: wax.userAccount,
                limit: 1
            });

            if (result.rows.length) {
                // fetching staked amnio nft
                let table_asset = result.rows[0];
                const asset = await api.getAsset(table_asset.pack_asset_id);

                return asset
            }
        } catch(err){
            console.log("Error while fetching staked Amnio Nfts: ", err)
            return null
        }
    }

    useEffect(() => {
        if(wax && wax.rpc){
            getStakedData()
            getStakedAmnioNft()
        }
    }, [wax])

    return (
        <>
            {
                loading ?
                <img className="loading" src="/images/loading_icon.png" />:
                NO_ASSETS ?
                <p className='no-result-text'>There are no staked Assets !</p>:
                null
            }
            {
                !loading && citizens && citizens.length > 0 && citizens.map((item, index) => {
                    return <StakedAssetCard wax={wax} memo="citizen" setAry={setCitizens} ary={citizens} index={index} type="citizen" img={'QmXinDAFYd7etBFy56ahmisYxFZrTqjAh6CYRTQz46bpva'} key={item.citizen_id} asset_id={item.citizen_id} mint_no={'123'} name={'Citizen'} setNav={setNav} />
                })
            }
            {
                !loading && tools && tools.length > 0 && tools.map((item, index) => {
                    return <StakedAssetCard wax={wax} memo="tool" setAry={setTools} ary={tools} index={index} type={item.type} img={'QmXinDAFYd7etBFy56ahmisYxFZrTqjAh6CYRTQz46bpva'} key={item.asset_id} asset_id={item.asset_id} mint_no={'123'} name={'Tool'} setNav={setNav} />
                })
            }
            {
                !loading && slotes && slotes.length > 0 && slotes.map((item, index) => {
                    return <StakedAssetCard wax={wax} memo="slot" type={item.type} setAry={setSlotes} ary={slotes} index={index} img={'QmXinDAFYd7etBFy56ahmisYxFZrTqjAh6CYRTQz46bpva'} key={item.asset_id} asset_id={item.asset_id} mint_no={'123'} name={'Slot'} setNav={setNav} />
                }) 
            }
            {
                !loading && wallets && wallets.length > 0 && wallets.map((item, index) => {
                    return <StakedAssetCard wax={wax} memo="wallet" setAry={setWallets} ary={wallets} index={index} type="wallet" img={'QmXinDAFYd7etBFy56ahmisYxFZrTqjAh6CYRTQz46bpva'} key={item.asset_id} asset_id={item.asset_id} mint_no={'123'} name={'Wallet'} setNav={setNav} />
                }) 
            }
            {
                !loading && decorations && decorations.length > 0 && decorations.map((item, index) => {
                    return <StakedAssetCard wax={wax} memo="decoration" setAry={setWallets} ary={decorations} index={index} type="decoration" img={'QmXinDAFYd7etBFy56ahmisYxFZrTqjAh6CYRTQz46bpva'} key={item.asset_id} asset_id={item.asset_id} mint_no={'123'} name={'Decoration'} setNav={setNav} />
                }) 
            }
            {
                !loading && !!stakedAmnio ? (
                    <AmnioNftCard nft={stakedAmnio} staked />
                ) : null
            }
        </>
    )
}

export default StakedAssets
