import React, {useEffect, useState} from 'react'
import PackCard from './PackCard'
import EmptyCard from './EmptyCard'
import initConfig from '../../initConfig';

export default function MyPacks({wax}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [packCards, setPackCards] = useState([]);
    
    const waxUser = wax.userAccount;

    const ipfsToimg = {
        "QmVWStwf3U7tZn5SZMajvKS2M1AfPe75M2mf5NbDbrMzjV": "rug_pool_nft_1.jpg",
        "QmVbsZgq2p4onjfWALsuy1maELFD3KxrqPtPYycy9Ua6Dr": "rug_pool_nft_2.jpg",
        "QmVmjJs6fW7KFRGRJy7FDENgEHnfL3vhZDXrz9xdpj5VYp": "rug_pool_nft_3.jpg",
        "QmdPdqusqiQE4XrSYax4DshT6bCNAvcQZPcjaoQZpSVyPJ": "rug_pool_nft_4.jpg",
        "QmZxsAHbxwPYs5D2QgmszvdNz4Ha5xxyUn28btCLy9kmMK": "rug_pool_nft_5.jpg",
        "QmPdtJbtEANZjs7HKgJEo3zL3n45XRBT9RV2ctxDWKLFg3": "rug_pool_nft_6.jpg",
        "QmPDXrzcw4cbaviEJ9w5UnvojsjzVFPHgNdNJ8hYuGc2W3": "rug_pool_nft_7.jpg",
        "QmcNNoFd9GwA47dcCHJYuGjcVHQdHF6MuVjGQF1q4Xz9Ru": "rug_pool_nft_8.jpg",
        "QmbqDVLpfrh4GBMdceqBRZg4HtoMit6i6bbWJ5zWK9hWVS": "rug_pool_nft_9.jpg",
        "QmXWANrfu6956Vns1LEwJr2G7oyntWUGebUXYfHB3rENJt": "rug_pool_nft_10.jpg"
    }

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
        
            let assets = await api.getAssets({owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "packs", template_id: process.env.REACT_APP_SERVER_TYPE === "testnet" ? 460305 : 546007});

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
                    return <PackCard key={item.id} image={item.type === "pack" ? "rug_pool_nft_pack.png" : ipfsToimg[item.img]} mint={item.mint} id={item.id} type={item.type} asset_id={item.pack_id} wax={wax}/>
                }):
                ""
            }
        </>
    )
}
