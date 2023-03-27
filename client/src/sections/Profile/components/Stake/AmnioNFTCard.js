import React from 'react'
import './assetCard.css'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

function AmnioNftCard({ nft, staked }) {
    const dispatch = useDispatch()
    const wax = useSelector(state => state.wax)
    const history = useHistory()

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
        <div className="asset-card">
            <p className="top-text">AMNIO TANKS</p>
            <div className="img-wrapper">
                {nft && nft.data ? (
                    <img src={`https://ipfs.io/ipfs/${nft.data.img}`} className="img-top" alt="tokencard" />
                ) : (
                    <img src="/images/cd_back.png" className="img-btm" alt="fadedcard" />
                )}
                {nft && nft.template_mint ? (
                    <p className="asset-id">#{nft.template_mint}</p>
                ) : null}
            </div>
            <div className="button-wrapper">
                {
                    staked ?
                        <>
                            <button className="asset-button sm-button citizen" onClick={() => { history.push('/avatar-editor/') }}>
                                EDIT
                            </button>
                            <button className="asset-button sm-button citizen" onClick={unStake}>
                                RETRIEVE
                            </button>
                        </> :
                        <button className="asset-button citizen" onClick={editAndStake}>
                            EDIT + SUBMIT
                        </button>
                }
            </div>
        </div>
    )
}

export default AmnioNftCard
