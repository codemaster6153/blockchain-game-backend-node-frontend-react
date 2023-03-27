import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { ClashdomeMessageServer } from '../../../../utils/ClashdomeMessageServer';

function TokenCard({img, name, mint_no, wax, asset_id, setAry, ary, index, setNav}) {

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

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

    const claimTokens = async () => {
        
        try {
            setLoading(true)

            let result;

            let actions = [{
                account: "atomicassets",
                name: "transfer",
                authorization: [{
                  actor: wax.userAccount,
                  permission: "active",
                }],
                data: {
                  from: wax.userAccount,
                  to: "clashdomewld",
                  asset_ids: [asset_id],
                  memo: "get tokens",
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
                let tempAry = ary
                tempAry.splice(index, 1)
                setAry([...tempAry])
                // SOMETHING TO DO

                setTimeout(() => {
                    setNav(0);
                    setNav(1);
                    ClashdomeMessageServer.dispatchMessageToGame({id: "token-mining-game", payload: "TOKENS PACK OPENED"});
                }, 1000);
                
                window.scrollTo(0, 0);
            }
        } catch (e) {
            notify(e.message.toUpperCase(), false);
            console.log(e.message);
            setLoading(false)
        }
        setLoading(false)
    }

    return (
        <div className="asset-card" style={{backgroundColor: `#C646FD4D`}}>
            <p className="top-text">{name}</p>
            <div className="img-wrapper">
                <img src={`https://ipfs.io/ipfs/${img}`} alt="img" />
                <p className="asset-id">#{mint_no}</p>
            </div>
            <div className="button-wrapper" onClick={claimTokens} >
                {
                    loading ?
                    <img className="loading" src="/images/loading_icon.png" />:
                    <button className="asset-button tokens">
                        CLAIM TOKENS
                    </button>

                }
            </div>
        </div>
    )
}

export default TokenCard
