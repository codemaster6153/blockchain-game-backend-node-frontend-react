import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { ClashdomeMessageServer } from '../../../../utils/ClashdomeMessageServer';
import './craftCard.css'

function WalletCraftCard({data, wax, setNav}) {
    
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    for (let i = 0; i < data.craft.length; i++) {
        data.craft[i] = data.craft[i].replace("CREDITS", "LUDIO");
        if (!data.craft[i].includes("CDCARBZ")) {
            data.craft[i] = data.craft[i].replace("CARBZ", "CDCARBZ");
        }
        if (!data.craft[i].includes("CDJIGO")) {
            data.craft[i] = data.craft[i].replace("JIGO", "CDJIGO");
        }
    }

    function numFormatter(num) {
        if(num > 999 && num < 1000000){
            return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
        }else if(num > 1000000){
            return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
        }else if(num < 900){
            return num; // if value < 1000, nothing to do
        }
    }

    const craft = async () => {
        try {
            setLoading(true)
            let result;

            let actions = [{
                account: "clashdometkn",
                name: "transfers",
                authorization: [{
                  actor: wax.userAccount,
                  permission: "active",
                }],
                data: {
                  from: wax.userAccount,
                  to: "clashdomewld",
                  quantities: data.craft,
                  memo: "craft_wallet:" + data.template_id
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
                notify("SUCCESSFUL TRANSACTION!", true);
                setNav(1)

                setTimeout(() => {
                    setNav(1)
                    ClashdomeMessageServer.dispatchMessageToGame({id: "token-mining-game", payload: "NFT STAKED"});
                    window.scrollTo(0, 550);
                }, 500);
            }
        } catch (e) {
            notify(e.message.toUpperCase(), false);
            console.log(e.message);
            setLoading(false)
        }  
        setLoading(false) 
    }

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

    return (
        <div className="craft-card">
            <div className="top">
                <div className="heading">
                    <h1>{data.wallet_name}</h1>
                </div>
                <div className="card-cover">
                    <img src={`https://ipfs.io/ipfs/${data.img}`} alt="img" />
                </div>
            </div>
            <div className="bottom">
                <div className="entry">
                    <div className="label">
                        <p>STORING CAPACITY:</p>
                    </div>
                    <div className="values">
                        <div className="value">
                            <p>{numFormatter(parseFloat(data.extra_capacity) + 120)}</p>
                            <img src="/images/credits.png" alt="drop" />
                        </div>
                    </div>
                </div>
                <div className="entry">
                    <div className="label">
                        <p>BATTERY:</p>
                    </div>
                    <div className="values">
                        <div className="value">
                            <p>120</p>
                        </div>
                    </div>
                </div>
                <div className="entry">
                    <div className="label">
                        <p>BATTERY DECREASE PER CLAIM:</p>
                    </div>
                    <div className="values">
                        <div className="value">
                            <p>{data.battery_consumed}</p>
                        </div>
                    </div>
                </div>
                <div className="entry">
                    <div className="label">
                        <p>STAMINA DECREASE PER CLAIM</p>
                    </div>
                    <div className="values">
                        <div className="value">
                            <p>{data.stamina_consumed}</p>
                        </div>
                    </div>
                </div>
                <div className="entry">
                    <div className="label">
                        <p>CRAFTING COST:</p>
                    </div>
                    <div className="values">
                        <div className="value">
                            <p>{numFormatter(parseFloat(data.craft[0].split(' ')[0]))}</p>
                            <img src="/images/credits.png" alt="drop" />
                        </div>
                        <div className="value">
                            <p>{numFormatter(parseFloat(data.craft[1].split(' ')[0]))}</p>
                            <img src="/images/jigowatts.png" alt="drop" />
                        </div>
                    </div>
                </div>
                <div className="entry">
                    <div className="label">
                        <p>*ALLOWS OVERFILLING</p>
                    </div>
                </div>
                <div className="button-wrapper" >
                    {
                        loading ?
                        <img className="loading" src="/images/loading_icon.png" />:
                        <div className="asset-button" style={{cursor: 'not-allowed', opacity: 0.5}} >
                            <img src={`/images/stake_btn/btn_craft.png`} alt="stake" />
                            <img src={`/images/stake_btn/btn_craft_over.png`} alt="stake" />
                        </div>
                    }
                </div>
                <a href={`https://wax.atomichub.io/market?collection_name=clashdomenft&match=${encodeURIComponent(data.wallet_name)}&order=asc&sort=price&symbol=WAX`} target="_blank" >Buy on Atomic</a>
            </div>
        </div>
    )
}

export default WalletCraftCard
