import React, { useEffect, useRef, useState } from 'react';
import {useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import './landCard.css';

export default function LandCard({rarity, name, id, owners, lastClaim, mint, collected, ludio, mapId, image, wax}) {

    const dispatch = useDispatch();
    
    const card = useRef();
    const [date, setDate] = useState();
    const [loading, setLoading] = useState("disabled");
    const [currLudio, setLudio] = useState(ludio);
    const [currCollected, setCollected] = useState(collected);
    const [claiming, setClaiming] = useState(false)

    const sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const notify = async (text, success) => {
        dispatch({ type:"SET_NOTIFICATION", payload: {
            text: text,
            success: success,
        }})

        await sleep(4800)

        dispatch({ type:"REMOVE_NOTIFICATION", payload: {
            text: text,
            success: success,
        }})

    }

    useEffect(() => {

        if (lastClaim) {
            var offset = new Date().getTimezoneOffset();
            let tempDate = new Date((parseInt(lastClaim) - offset * 60) * 1000)
            let dateSlice = tempDate.toISOString().slice(0, 10).split("-").reverse().join("/")
            let timeSlice = tempDate.toISOString().slice(11, 16)
            setDate(`${dateSlice} - ${timeSlice}`)
        }
        
    }, [])

    useEffect(() => {
        if(rarity.toLowerCase() === "common"){
            card.current.style.background = "#F5FFFD33"
        }else if(rarity.toLowerCase() === "rare"){
            card.current.style.background = "#11CBF933"
        }else if(rarity.toLowerCase() === "legendary"){
            card.current.style.background = "#FFAB3980"
        }else if(rarity.toLowerCase() === "mythical"){
            card.current.style.background = "#FFEE5780"
        }else if(rarity.toLowerCase() === "epic"){
            card.current.style.background = "#BC6EFF33"
        }
    }, [rarity])

    const claimLand = async () => {

        if (loading === "enabled" || currLudio === 0 || currLudio < 450) {
            return;
        }

        setLoading("enabled");
        setClaiming(true)

        try {

            let result;

            let actions = [{
                account: "clashdomedst",
                name: "claim",
                authorization: [{
                    actor: wax.userAccount,
                    permission: "active",
                }],
                data: {
                    account: wax.userAccount
                },
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

            if (result) {
                let res = await fetch("/api/clashdome-game/claim-ludio/endless-siege/" + wax.userAccount + "/" + id);
                let result2 = await res.json();

                if (result2.error) {
                    notify(result2.error.toUpperCase(), false);
                    console.log(result2.error);
                    setLoading("disabled");
                    setClaiming(false)
                } else {
                    notify("SUCCESSFUL TRANSACTION!", true);
                    setLudio(0);
                    setCollected(0);
                    setLoading("disabled");
                    setClaiming(false)
                }
            }
            
        } catch (e) {
            notify(e.message.toUpperCase(), false);
            console.log(e.message);
            setLoading("disabled");
            setClaiming(false)
        }
    }

    return (
        <div className="land-card" ref={card}>
            <h1>{name}</h1>
            <h2>{rarity.charAt(0).toUpperCase() + rarity.slice(1)} - Co-owned by {owners} landlords</h2>
            <div className="image">
                <div className="imgs">
                    <img src={`/images/empty_land.jpg`} alt="land" className="bck-img" width="240px" />
                    <img src={`https://ipfs.io/ipfs/${image}`} alt="land" className="top-img" width="240px" />
                </div>
                <div className="mint-number">
                    <p>#{mint}</p>
                </div>
                <div className="map-id">
                    <p>{mapId}</p>
                </div>
                {loading === "enabled" ? <img src={`/images/loading_icon.png`} className="loading" /> : ""} 
            </div>
            <Link to={`/endless-siege-2/play?duel=true&land=${mapId}`}>
                <div className='play-button'>
                    <p>PLAY</p>
                    <div className='triangle'></div>
                </div>
            </Link>
            
            <div className="collected-goblin">
                <p>
                    <span>COLLECTED:</span>
                    {(currCollected > 1) ? (Math.round((currCollected) * 100) / 100).toLocaleString() :  (Math.round((currCollected) * 10000) / 10000)}
                </p>
                <img src="/images/head_orc.png" alt="head-orc" width="46px" />
            </div>
            <div className={"claim-button loading-" + loading + " claimable-" + (currLudio && currLudio >= 450 ? "enabled" : "disabled")} onClick={claimLand} >
                {/* {
                    claiming ?
                    <div className='loading' onClick={(e) => {e.stopPropagation()}}>
                        <img src="/images/loading_icon.png" />
                    </div>:
                    ''
                } */}
                <p>CLAIM: {(currLudio > 1) ? (Math.round((currLudio) * 100) / 100).toLocaleString() :  (Math.round((currLudio) * 10000) / 10000).toLocaleString() } LUDIO</p>
                <img src="/images/ludio_icon_solid_36.png" width="36px" />
            </div>

            <p className="land-card-info">
                <span>LAST CLAIM:</span>
                {date}
            </p>
            <p className="land-card-info mt-2" style={{fontSize: '14px'}}>
                {/* <span>ID:</span> */}
                *Min. claimable amount 450 LUDIO
            </p>
        </div>
    )
}
