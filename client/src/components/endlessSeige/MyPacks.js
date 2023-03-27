import React, {useEffect, useState} from 'react'
import PackCard from './PackCard'
import EmptyCard from './EmptyCard'
import initConfig from '../../initConfig';

export default function MyPacks({wax}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [packCards, setPackCards] = useState([]);
    
    const waxUser = wax.userAccount;

    const loadPackCardsCall = async () => {

        if (waxUser) {

            const {ExplorerApi} = require("atomicassets");
            let api  = new ExplorerApi(initConfig.atomicUrl, "atomicassets", {fetch});

            const result = await wax.rpc.get_table_rows({
                json: true,
                code: "packsopenerx",
                scope: "packsopenerx",
                table: "unboxpacks",
                index_position: 2,
                key_type: "i64",
                lower_bound: wax.userAccount,
                upper_bound: wax.userAccount,
                limit: 100
            });
    
            let claimunboxed = result.rows;

            let unboxedassets = [];

            for (let i = 0; i < claimunboxed.length; i++) {
                if (claimunboxed[i].assets_ids.length) {
                    const asset = await api.getAsset(claimunboxed[i].assets_ids[0]);
                    unboxedassets.push({asset: asset, id: claimunboxed[i].pack_asset_id});
                }
            }

            let unboxedpacks = unboxedassets.map(function(pack) {
                return {
                    id: pack.asset.asset_id,
                    img: pack.asset.data.img,
                    mint: pack.asset.template_mint,
                    type: "land",
                    pack_id: pack.id
                };
            });
        
            let assets = await api.getAssets({owner: waxUser, collection_name: "clashdomenft", schema_name: "packs", template_id: 201123});

            let packs = assets.map(function(pack) {
                return {
                    id: pack.asset_id,
                    img: pack.data.img,
                    mint: pack.template_mint,
                    type: "pack"
                };
            });

            packs = unboxedpacks.concat(packs);
    
            // await sleep(2000);
            return packs;
        } else {
            return [];
        }
        
    }

    const handlePackCardLoad = async () => {
        setIsLoaded(false);
        const packCards = await loadPackCardsCall();
        if(packCards.length > 0){
            setIsLoaded(true);
            setPackCards([...packCards]);
        }
    }

    useEffect(() => {
        handlePackCardLoad()
    }, [waxUser])

    return (
        <>
            <EmptyCard navValue={2} />
            {
                (isLoaded && packCards.length > 0)?
                packCards.map((item) => {
                    return <PackCard key={item.id} image={item.img} mint={item.mint} id={item.id} type={item.type} asset_id={item.pack_id} wax={wax}/>
                }):
                ""
            }
        </>
    )
}
