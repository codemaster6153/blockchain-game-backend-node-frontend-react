import React from 'react'
import { useDispatch } from 'react-redux'
import './index.css'

export default function LuckyCardModal() {
    const dispatch = useDispatch()

    const handleIgnore = () => {
        console.log("we are ignoring the lucky card modal")
        dispatch({
            type: 'REMOVE_LUCKY_CARD_MODAL',
        })
    }
    return (
        <div className="modal-container" id="luckCardModal" onClick={handleIgnore} >
            <div className="modal-box" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <p className="modal-white-text">CONGRATULATIONS, YOU GOT 1 EXTRA CARD!</p>
                <img src="/images/card.png" alt="card" style={{height: '150px', margin: '10px auto'}} />
                <p className="modal-blue-text">Luck factor: 6%</p>
                <div className="modal-button" >
                    <p>GREAT!</p>
                </div>
            </div>
        </div>
    )
}
