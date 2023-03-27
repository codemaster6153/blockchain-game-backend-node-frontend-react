import React from 'react'
import { useDispatch } from 'react-redux'
import './index.css'

export default function LowLudioModal() {
    const dispatch = useDispatch()

    const handleIgnore = () => {
        console.log("we are ignoring the low ludio modal")
        dispatch({
            type: 'REMOVE_LOW_LUDIO_WARNING',
        })
    }

    return (
        <div className="modal-container" id="lowLudioModal" onClick={handleIgnore} >
            <div className="modal-box">
                <p className="modal-red-text">INSUFFICIENT LUDIO BALANCE</p>
                <p className="modal-red-text-small">you can either:</p>
                <p className="modal-white-text-small" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    EARN LUDIO
                    <span className="inline-ludio">
                        <img src="/images/ludio28x28.png" />
                    </span> 
                    PLAYING DUELS
                </p>
                <p className="modal-white-text-small" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    GET LUDIO
                    <span className="inline-ludio">
                        <img src="/images/ludio28x28.png" />
                    </span> 
                    ON ANCHOR
                </p>
            </div>
        </div>
    )
}
