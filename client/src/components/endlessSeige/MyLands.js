import React, { useEffect, useState } from 'react'
import LandCard from './LandCard'
import EmptyCard from './EmptyCard'
import initConfig from '../../initConfig';

export default function MyLands({wax}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [landCards, setLandCards] = useState([]);

    const waxUser = wax.userAccount;

    const loadLandCardsCall = async () => {

        if (waxUser) {

            let resFetch = await fetch("/api/clashdome-game/claim-ludio-ratio/endless-siege");
            let result2 = await resFetch.json();
            
            let casualties = 1;

            if (result2.ratio) {
                casualties = result2.ratio;
            }

            const {ExplorerApi} = require("atomicassets");
            let api  = new ExplorerApi(initConfig.atomicUrl, "atomicassets", {fetch});
        
            let assets = await api.getAssets({owner: waxUser, collection_name: "clashdomenft", schema_name: "lands"});

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
                    map_id: land.data.land_id,
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
                            image={item.img}
                            id={item.id}
                            wax={wax}
                        />
                }):
                ""
            }
        </>
    )
}
