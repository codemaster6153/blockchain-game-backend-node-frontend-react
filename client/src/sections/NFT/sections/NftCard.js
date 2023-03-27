import React, { useState } from 'react'
import './index.css'
import { useDispatch, useSelector } from 'react-redux'
import {useHistory} from 'react-router-dom'

function NftCard({nft, staked, type}) {
    const dispatch = useDispatch()
    const wax = useSelector(state => state.wax)
    const history = useHistory()

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

    const unStake = async () => {
        try {

            let result;

            let actions = [{
                account: "packsopenerx",
                name: "unstakeav",
                authorization: [{
                  actor: wax.userAccount,
                  permission: "active",
                }],
                data: {
                  unboxer: wax.userAccount,
                  pack_asset_id: nft.asset_id
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

                window.location.reload();
            }
        } catch (e) {
            notify(e.message.toUpperCase(), false);
            console.log(e.message);
        }
    }

    const editAndStake = async () => {
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
                  to: "packsopenerx",
                  asset_ids: [nft.asset_id],
                  memo: "unbox avatar",
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

                window.location.href = window.location.origin + "/avatar-editor";
            }
        } catch (e) {
            notify(e.message.toUpperCase(), false);
            console.log(e.message);
        }
    }


    return (
        <div className="nft-card">
            <div className={staked ? "impulse image-container" : "image-container"}>
                {
                    nft && nft.template_mint &&
                    <div className="mint-number">
                        <p>#{nft.template_mint}</p>
                    </div>
                }
                <img src="/images/cd_back.png" className="img-btm" alt="fadedcard" />
                {
                    nft && nft.data &&
                    <img src={`https://ipfs.io/ipfs/${nft.data.img}`} className="img-top" alt="tokencard" />
                }
                {
                    staked ?
                    <div className="abs-text">
                        <p>SUBMITTED</p>
                    </div>:
                    <></>
                }
            </div>
            {
                type === 'citizen'?
                <p> 
                    <a href={`https://wax.atomichub.io/explorer/asset/${nft.asset_id}`} rel="noopener noreferrer">
                        <span>VIEW ON ATOMIC</span>
                    </a>
                </p>:
                <div className="button-container">
                    {
                        staked ?
                        <>
                            <div className="wide" onClick={() => {history.push('/avatar-editor/')}}>
                                <p>EDIT</p>
                                <img src="/images/icon_edit.png" height="21" alt='edit' />
                            </div>
                            <div className="wide" onClick={unStake}>
                                <p>RETRIEVE</p>
                                <img src="/images/icon_unstake.png" height="21" alt='edit' />
                            </div>
                        </>:
                        <div className="wide" onClick={editAndStake}>
                            <p>EDIT + SUBMIT</p>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default NftCard
