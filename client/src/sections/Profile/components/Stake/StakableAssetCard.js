import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ClashdomeMessageServer } from '../../../../utils/ClashdomeMessageServer';
import './assetCard.css'

function StakableAssetCard({ img, vid, mint_no, name, wax, asset_id, type, memo, setAry, ary, index, disableCarbzStaking, disableJigoStaking, setNav, template_id, trialCitizen }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [video, setVideo] = useState(false)
    const [image, setImage] = useState(false)

    const colorCode = {
        'citizen': '#FFE3004D',
        'slot': '#FFFFFF4D',
        'Carbz': '#7DE2264D',
        'Jigowatts': '#17EDF44D',
        'wallet': '#FFE3004D',
        'decoration': '#FFE3004D',
    }

    const TRIAL_TEMPLATE_ID = process.env.REACT_APP_SERVER_TYPE === "testnet" ? 447908 : 530445;

    const stake = async (memoAddition, trial) => {
        if (!loading) {
            setLoading(true)
            try {

                let result;

                let actions;

                if (trial) {
                    actions = [{
                        account: "clashdomewld",
                        name: "staketrial",
                        authorization: [{
                            actor: wax.userAccount,
                            permission: "active",
                        }],
                        data: {
                            account: wax.userAccount,
                            asset_id: asset_id
                        },
                    }];
                } else {
                    actions = [{
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
                            memo: memoAddition && memoAddition.length > 0 ? `${memo} ${memoAddition}` : memo,
                        },
                    }];

                    if (trialCitizen && type === "citizen") {
                        actions.push({
                            account: "atomicassets",
                            name: "burnasset",
                            authorization: [{
                                actor: wax.userAccount,
                                permission: "active",
                            }],
                            data: {
                                asset_owner: wax.userAccount,
                                asset_id: trialCitizen.asset_id
                            },
                        })
                    }
                }

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
                        ClashdomeMessageServer.dispatchMessageToGame({ id: "token-mining-game", payload: "NFT STAKED " + type });
                        window.scrollTo(0, 0);
                        setNav(0);
                        setNav(1);
                    }, 1000)
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
        dispatch({
            type: "SET_NOTIFICATION", payload: {
                text: text,
                success: success,
            }
        })

        await sleep(4800)

        dispatch({
            type: "REMOVE_NOTIFICATION", payload: {
                text: text,
                success: success,
            }
        })
    }

    const getStakedAssetData = async () => {

        if (vid !== null && vid !== undefined) {
            setImage(false);
            setVideo(true);
        } else {
            setImage(true);
            setVideo(false);
        }
    }

    useEffect(() => {
        getStakedAssetData();
    }, [])

    return (
        <div className="asset-card" style={{ backgroundColor: `${colorCode[type]}` }}>
            <p className="top-text">{name}</p>
            <div className="img-wrapper">
                {video && <video muted autoPlay loop><source src={`https://ipfs.io/ipfs/${vid}`}></source></video>}
                {image && <img src={`https://ipfs.io/ipfs/${img}`} alt="img" />}
                <p className="asset-id">#{mint_no}</p>
            </div>
            <div className="button-wrapper">
                {
                    loading ?
                        <img className="loading" src="/images/loading_icon.png" /> :
                        <button className={`asset-button ${type}`}
                            style={
                                (disableJigoStaking && type === 'slot') ?
                                    { opacity: 0.5, cursor: 'not-allowed' } :
                                    {}
                            }
                            onClick={() => {
                                if (type === 'slot' && !disableJigoStaking) {
                                    stake("Jigowatts")
                                } else if (type !== 'slot') {
                                    if (type === 'citizen' && parseInt(template_id) === TRIAL_TEMPLATE_ID) {
                                        stake("", true)
                                    } else {
                                        stake()
                                    }

                                }
                            }}
                        >
                            {type === 'slot' ? "UNLOCK" : "EQUIP"}
                        </button>

                }
                {
                    type === 'slot' && !loading ?
                    <button className={`asset-button ${type}-green`}
                            style={
                                (disableCarbzStaking && type === 'slot') ?
                                    { opacity: 0.5, cursor: 'not-allowed' } :
                                    {}
                            }
                            onClick={() => {
                                if (!disableCarbzStaking) {
                                    stake("Carbz")
                                }
                            }}
                        >
                            UNLOCK
                        </button> :
                        null
                }
            </div>
        </div>
    )
}

export default StakableAssetCard
