import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { ClashdomeMessageServer } from '../../../../utils/ClashdomeMessageServer';
import './craftCard.css'

function SlotCraftCard({name, crafting, image, template_id, wax, setNav}) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    for (let i = 0; i < crafting.length; i++) {
        crafting[i] = crafting[i].replace("CREDITS", "LUDIO");
        if (!crafting[i].includes("CDCARBZ")) {
            crafting[i] = crafting[i].replace("CARBZ", "CDCARBZ");
        }
        if (!crafting[i].includes("CDJIGO")) {
            crafting[i] = crafting[i].replace("JIGO", "CDJIGO");
        }
    }

    function numFormatter(num) {
        if(num > 999 && num < 1000000){
            return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
        }else if(num > 1000000){
            return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
        }else if(num <= 999){
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
                  quantities: crafting,
                  memo: "craft_slot:" + template_id
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
                    <h1>{name}</h1>
                </div>
                <div className="card-cover">
                    <img src={`https://ipfs.io/ipfs/${image}`} alt="img" />
                </div>
            </div>
            <div className="bottom">
                <div className="entry">
                    <div className="label">
                        <p>CRAFTING COST:</p>
                    </div>
                    <div className="values">
                        <div className="value">
                            <p>{numFormatter(parseFloat(crafting[0].split(' ')[0]))}</p>
                            <img src="/images/credits.png" alt="drop" />
                        </div>
                        <div className="value">
                            <p>{numFormatter(parseFloat(crafting[1].split(' ')[0]))}</p>
                            <img src="/images/jigowatts.png" alt="drop" />
                        </div>
                        <div className="value">
                            <p>{numFormatter(parseFloat(crafting[2].split(' ')[0]))}</p>
                            <img src="/images/carbz.png" alt="drop" />
                        </div>
                    </div>
                </div>
                <div className="button-wrapper" >
                    {
                        loading ?
                        <img className="loading" src="/images/loading_icon.png" />:
                        <div className="asset-button" onClick={craft} >
                            <img src={`/images/stake_btn/btn_craft.png`} alt="stake" />
                            <img src={`/images/stake_btn/btn_craft_over.png`} alt="stake" />
                        </div>
                    }
                </div>
                <a href={`https://wax.atomichub.io/market?collection_name=clashdomenft&match=${encodeURIComponent(name)}&order=asc&sort=price&symbol=WAX`} target="_blank" >Buy on Atomic</a>
            </div>
        </div>
    )
}

export default SlotCraftCard
