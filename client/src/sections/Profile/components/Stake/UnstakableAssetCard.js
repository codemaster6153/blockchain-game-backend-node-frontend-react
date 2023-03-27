import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { ClashdomeMessageServer } from '../../../../utils/ClashdomeMessageServer';
import './assetCard.css'

function UnstakableAssetCard({img, mint_no, name, wax, asset_id, type, memo, setAry, ary, index, reason}) {

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const colorCode = {
        'citizen': '#FFE3004D',
        'slot': '#FFFFFF4D',
        'Carbz': '#7DE2264D',
        'Jigowatts': '#17EDF44D',
        'wallet': '#FFE3004D',
    } 

    const btnColor = {
        'citizen': 'yellow',
        'slot': 'blue',
        'Carbz': 'green',
        'Jigowatts': 'blue',
        'wallet': 'yellow',
    }

    const stake = async (memoAddition) => {
        if(!loading){
            setLoading(true)
            try {
    
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
                      asset_ids: [asset_id ],
                      memo: memoAddition && memoAddition.length > 0 ? `${memo} ${memoAddition}`: memo ,
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
                        ClashdomeMessageServer.dispatchMessageToGame({id: "token-mining-game", payload: "NFT STAKED"});
                        window.scrollTo(0, 0);
                    }, 500)
                }
            } catch (e) {
                notify(e.message.toUpperCase(), false);
                console.log(e.message);
                setLoading(false)
            }
            setLoading(false)
        }
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
        <div className="asset-card" style={{backgroundColor: `${colorCode[type]}`}}>
            <p className="top-text">{name}</p>
            <div className="img-wrapper">
                <img src={`https://ipfs.io/ipfs/${img}`} alt="img" />
                <img src='/images/not_stakeable.png' style={{position: 'absolute', width: '67%'}} alt="cross" />
                <p className="asset-id">#{mint_no}</p>
            </div>
            <div className="button-wrapper" >
                <p className='red'>{reason ? reason : 'Unable to stake card'}</p>
            </div>
        </div>
    )
}

export default UnstakableAssetCard
