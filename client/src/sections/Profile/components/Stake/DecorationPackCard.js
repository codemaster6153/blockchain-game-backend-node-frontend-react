import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import ReactDOM from 'react-dom'
import { ClashdomeMessageServer } from '../../../../utils/ClashdomeMessageServer';
import { openPack } from './StakableAssets';
import DecorationPackModal from './DecorationPackModal';

function DecorationPackCard({img, name, mint_no, wax, asset_id, isOpened, fetchDecorations}) {
    const [loading, setLoading] = useState(false)
    const [docorationPackModal, setDocorationPackModal] = useState(false)
    const dispatch = useDispatch()

    const claimTokens = async () => {
        if (!isOpened) {
            console.log("rerere")
            let res = await openPack(wax, asset_id)
            if (res['error']) {
                notify(res.error)
            } else {
                setDocorationPackModal(true)
            }

        } else {
            setDocorationPackModal(true)
        }


    }

    const sleep = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms))

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
        <div className="asset-card" style={{backgroundColor: `#C646FD4D`}}>
            <p className="top-text">{name}</p>
            <div className="img-wrapper">
                <img src={isOpened? `/images/open-pack/opened-pack.png` : `https://ipfs.io/ipfs/${img}`} alt="img" />
                {!isOpened && <p className="asset-id">#{mint_no}</p>}
            </div>
            <div className="button-wrapper" onClick={claimTokens}>
                {
                    loading?
                    <img className="loading" src="/images/loading_icon.png" /> :
                    <button className="asset-button tokens">
                        OPEN PACK
                    </button>
                }
            </div>
            {ReactDOM.createPortal(
                <DecorationPackModal 
                    asset_id={asset_id} 
                    open={docorationPackModal} 
                    onCloseModal={() => setDocorationPackModal(false)} 
                    wax={wax}
                    fetchDecorations={fetchDecorations}
                />,
                document.getElementById("modal-root")
            )}
        </div>
    )
}

export default DecorationPackCard
