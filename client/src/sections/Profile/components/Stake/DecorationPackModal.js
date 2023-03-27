import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

import './DecorationPackModal.css'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'
import { claimAsset, getDecorationsPack } from './StakableAssets'
var testnet_dict


if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
    testnet_dict = {
        603629 : "rugpool_cabinet.png",
        603630 : "ceiling_modding.png",
        603631 : "ceiling_gamerism.png",
        603632 : "ceiling_rugpool.png",
        603633 : "item_1_modding.png",
        603634 : "item_2_modding.png",
        603635 : "item_3_modding.png",
        603636 : "item_4_modding.png",
        603637 : "item_1_gamerism.png",
        603638 : "item_2_gamerism.png",
        603639 : "item_3_gamerism.png",
        603640 : "item_4_gamerism.png",
        603641 : "item_1_rugpool.png",
        603642 : "item_2_rugpool.png",
        603643 : "item_3_rugpool.png",
        603645 : "floor_texture_modding.png",
        603645 : "floor_texture_rugpool.png",
        603646 : "floor_texture_gamerism.png",
        603647 : "wall_texture_modding.png",
        603648 : "wall_texture_rugpool.png",
        603649 : "wall_texture_gamerism.png",
        603650 : "baseboard_texture_modding.png",
        603651 : "baseboard_texture_rugpool.png",
        603652 : "baseboard_texture_gamerism.png",
        603653 : "arcade_marquee_gamerism.png",
        603654 : "arcade_panel_gamerism.png",
        603655 : "arcade_sides_gamerism.png"
    }
}
else{
    testnet_dict = {
        642431 : "rugpool_cabinet.png",
        642432 : "ceiling_modding.png",
        642433 : "ceiling_gamerism.png",
        642434 : "ceiling_rugpool.png",
        642435 : "item_1_modding.png",
        642436 : "item_2_modding.png",
        642437 : "item_3_modding.png",
        642438 : "item_4_modding.png",
        642439 : "item_1_gamerism.png",
        642440 : "item_2_gamerism.png",
        642441 : "item_3_gamerism.png",
        642442 : "item_4_gamerism.png",
        642443 : "item_1_rugpool.png",
        642444 : "item_2_rugpool.png",
        642445 : "item_3_rugpool.png",
        642446 : "floor_texture_modding.png",
        642447 : "floor_texture_rugpool.png",
        642448 : "floor_texture_gamerism.png",
        642449 : "wall_texture_modding.png",
        642450 : "wall_texture_rugpool.png",
        642451 : "wall_texture_gamerism.png",
        642452 : "baseboard_texture_modding.png",
        642453 : "baseboard_texture_rugpool.png",
        642454 : "baseboard_texture_gamerism.png",
        642455 : "arcade_marquee_gamerism.png",
        642456 : "arcade_panel_gamerism.png",
        642457 : "arcade_sides_gamerism.png"
    }
}

function DecorationPackModal({ open, onCloseModal, wax, asset_id, fetchDecorations }) {
    const [decorations, setDecorations] = useState({})
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [claiming, setClaiming] = useState(false)

    useEffect(() => {
        if (open && wax)
            getDecorations()
    }, [open, wax])

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(() => resolve(ms), ms))
    }

    const getDecorations = async () => {
        setLoading(true)
        while (true) {
            const dec = await getDecorationsPack(wax)
            if (dec[asset_id]) {
                if (typeof dec[asset_id] === "object" && Object.keys(dec[asset_id]).length > 0) {
                    setDecorations(dec)
                    setLoading(false)
                    return
                }
            }
            await sleep(1000)
        }

    }

    const claim = async () => {
        setClaiming(true)
        var keys = Object.keys(decorations[asset_id]);
        let res = await claimAsset(wax, asset_id, keys)
        if (res['error']) {
            notify(res.error)
            setClaiming(false)
            return
            } else {
                onCloseModal()
                notify("SUCCESSFUL TRANSACTION!", true);
                await sleep(1500)
                fetchDecorations()
            }
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
        <Modal
            open={open}
            onClose={onCloseModal}
            center
            showCloseIcon={false}
            styles={{ modal: { padding: 0, margin: 0, borderRadius: 8, background: 'transparent' } }}
            blockScroll={false}
        >
            <div id="decoration-pack-modal">
                <div className="m-container">
                    <div className='close-button' onClick={onCloseModal}>
                        ×
                    </div>
                    <div className='items-container'>
                        {loading? (
                            <>
                                <img src='/images/open-pack/closed-pack.png' style={{width: 275}} />
                                <div className='loading-container'>
                                    OPENING PACK
                                    <img className="loading" src="/images/loading_icon.png" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='items' style={{display: 'flex', alignItems: 'center'}}>
                                    {Object.values(decorations[asset_id] ?? {}).map((dec, i) => (
                                        <CSSTransition
                                            in={true}
                                            appear={true}
                                            timeout={1000}
                                            classNames="decoration-pack-item"
                                            unmountOnExit={false}
                                            onEnter={() => {}}
                                            onExited={() => {}}
                                        >
                                            <img src={"/images/open-pack/" + testnet_dict[dec]}  />
                                        </CSSTransition>
                                    ))}
                                </div>

                                <div className='claim-button' onClick={claim}>
                                    CLAIM NFTS
                                </div>
                            </>
                            )}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default DecorationPackModal
