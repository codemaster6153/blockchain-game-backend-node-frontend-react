import React, { useEffect, useState } from 'react'
import LandCard from './LandCard'
import EmptyCard from './EmptyCard'
import initConfig from '../../initConfig';
const { JsonRpc} = require("eosjs");

export default function MyLands({wax}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [landCards, setLandCards] = useState([]);
    const [clashdomeAccounts, setClashdomeAccounts] = useState();
    const [clashdomeTrial, setClashdomeTrial] = useState();

    const waxUser = wax.userAccount;

    const fetchData = async (table, setData) => {
        let payload = {}
        const rpc = new JsonRpc(initConfig.waxUrl, { fetch });
        if(rpc != undefined){
            let result = await rpc.get_table_rows({
                json: true,
                    code: "clashdomewld",
                    scope: "clashdomewld",
                    table: table,
                key_type: "i64",
                lower_bound: wax.userAccount,
                upper_bound: wax.userAccount,
                limit: 100
            });
            
            console.log("result for table is :", result)
            if(result.rows.length > 0){
                setData(true)
            }else{
                setData(false)
            }

        }
    }

    const loadLandCardsCall = async () => {

        if (waxUser) {

            let resFetch = await fetch("/api/clashdome-game/claim-ludio-ratio/rug-pool");
            let result2 = await resFetch.json();
            
            let casualties = 1;

            if (result2.ratio) {
                casualties = result2.ratio;
            }

            const {ExplorerApi} = require("atomicassets");
            let api  = new ExplorerApi(initConfig.atomicUrl, "atomicassets", {fetch});
        
            let assets = await api.getAssets({owner: waxUser, collection_name: "clashdomenft", schema_name: "poolhalls"});

            let ids = assets.map(function(land) { return land.asset_id});

            let res = await fetch("/api/clashdome-game/claim-ludio-info/" + JSON.stringify(ids));
            let result = await res.json();

            let lands = assets.map(function(land) {

                return {
                    id: land.asset_id,
                    name: land.data.name,
                    rarity: land.data.rarity,
                    owners: land.data["co-owners_amount"],
                    last_claim: 0,
                    mint: land.template_mint,
                    collected: 0,
                    ludio: 0,
                    map_id: land.data.hall_id,
                    img: land.data.img
                };
            });

            for (let i = 0; i < lands.length; i++) {

                for (let j = 0; j < result.length; j++) {
                    if (parseInt(lands[i].id) === parseInt(result[j].asset_id)) {
                        lands[i].last_claim = result[j].last_claim;
                        lands[i].collected = result[j].partial_counter;
    
                        if (result[j].partial_counter) {
                            lands[i].ludio = (result[j].partial_counter / casualties).toFixed(4);
                        }
                    }
                    
                }
            }

            let rarities = {
                "Mythical": 5,
                "Legendary": 4,
                "Epic": 3,
                "Rare": 2,
                "Common": 1
            };

            lands = lands.sort((a, b) => (rarities[a.rarity] < rarities[b.rarity]) ? 1 : -1)
    
            return lands;
        } else {
            return [];
        }
    }

    const handleLandCardLoad = async () => {
        setIsLoaded(false);
        const landCards = await loadLandCardsCall()
        if(landCards.length > 0){
            setIsLoaded(true);
            setLandCards([...landCards]);
        }
    }

    useEffect(() => {
        handleLandCardLoad()
        fetchData("accounts", setClashdomeAccounts)
        fetchData("trials", setClashdomeTrial)
    }, [waxUser])


    return (
        <>
            <EmptyCard navValue={1} />
            {   
                (isLoaded && (landCards.length > 0))?
                landCards.map((item) => {
                    return <LandCard
                            key={item.id}
                            rarity= {item.rarity}
                            name= {item.name} 
                            owners={item.owners} 
                            lastClaim={item.last_claim} 
                            mint={item.mint} 
                            collected={item.collected} 
                            ludio={item.ludio} 
                            mapId={item.map_id} 
                            image={"rug_pool_nft_" + item.map_id + ".jpg"}
                            id={item.id}
                            canPlayDummy={!(!clashdomeAccounts && !clashdomeTrial)}
                            wax={wax}
                        />
                }):
                ""
            }
        </>
    )
}
