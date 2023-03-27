import React, { useEffect, useRef, useState } from 'react'
import initConfig from '../../initConfig';
import HeroComponent from './HeroComponent'
import './landManagement.css'
import MyLands from './MyLands';
import MyPacks from './MyPacks';
import Stats from './Stats';


export default function LandManagement({wax}) {

    const [navValue, setNavValue] = useState(1);
    const [init, setInit] = useState(false);

    const myLands = useRef();
    const myPacks = useRef();
    const myStats = useRef();

    const [casualties, setCasualties] = useState(25);

    useEffect(() => {

        if (init) {
            return;
        }
        
        (async () => {

            if (wax.rpc) {
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
        
                let assets = await api.getAssets({owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "packs", template_id: 201123});
        
                if (assets.length || claimunboxed.length) {
                    setNavValue(1);
                } else {
                    setNavValue(1);
                }
    
                setInit(true);
    
                let res = await fetch("/api/clashdome-game/claim-ludio-ratio/endless-siege");
                let result2 = await res.json();

                console.log("CASUALTIES: " + result2.ratio);
        
                if (result2.ratio) {
                    setCasualties(result2.ratio);
                }
            }
    
        })();
    });

    useEffect(() => {
        if(navValue === 1){
            myPacks.current.classList.remove("active")
            myLands.current.classList.add("active")
            // myStats.current.classList.remove("active")
        } else if(navValue === 2){
            myLands.current.classList.remove("active")
            myPacks.current.classList.add("active")
            // myStats.current.classList.remove("active")
        } else if(navValue === 3){
            myLands.current.classList.remove("active")
            myPacks.current.classList.remove("active")
            // myStats.current.classList.add("active")
        }
    }, [navValue])

    return (
        <div className="land-management-container">
            <HeroComponent casualties={casualties}/>
            <div className="land-subnav">
                <div className="subnav" onClick={() => {setNavValue(1)}} ref={myLands}>
                    <p>MY LANDS</p>
                </div>
                <div className="subnav active" onClick={() => {setNavValue(2)}} ref={myPacks}>
                    <p>MY PACKS</p>
                </div>
                {/* <div className="subnav active" onClick={() => {setNavValue(3)}} ref={myStats}>
                    <p>STATS</p>
                </div> */}
            </div>
            <div className="land-cards-container">
                <div className="land-cards">
                    {
                        (navValue === 1) ?
                            <MyLands wax={wax}/>:
                            (navValue === 2)?
                                <MyPacks wax={wax}/>:
                                <Stats />
                    }
                </div>
            </div>
        </div>
    )
}
