import React from 'react'
import { useDispatch } from 'react-redux'
import './index.css'

export default function LuckFactorModal() {
    const dispatch = useDispatch()

    const handleIgnore = () => {
        console.log("we are ignoring the lucky factor modal")
        dispatch({
            type: 'REMOVE_LUCK_FACTOR_MODAL',
        })
    }

    return (
        <div className="modal-container" id="luckFactorModal" onClick={handleIgnore} >
            <div className="modal-box">
                <p className="modal-white-text">Current Luck factor: 5%</p>
                <p className="modal-blue-text">Chance of receiving a base card when upgrading your cards.</p>
                <div style={{display: 'flex', gap: '20px 20px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', margin: '20px auto'}}>
                    <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '99px'}}>
                        <img src="/images/memorial_card.png" alt="memorial-card" />
                        <p className="modal-blue-text">+1</p>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '99px'}}>
                        <img src="/images/memorial_card.png" alt="memorial-card" />
                        <p className="modal-blue-text">+1</p>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '99px'}}>
                        <img src="/images/memorial_card.png" alt="memorial-card" />
                        <p className="modal-blue-text">+1</p>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '99px'}}>
                        <img src="/images/memorial_card.png" alt="memorial-card" />
                        <p className="modal-blue-text">+1</p>
                    </div>
                    <div style={{display: 'flex', opacity: '0.5', justifyContent: 'center', flexDirection: 'column', width: '99px'}}>
                        <img src="/images/memorial_card.png" alt="memorial-card" />
                    </div>
                    
                </div>
                <p  className="modal-blue-text" style={{fontWeight: '500'}}>BASE LUCK: 1%</p>
            </div>
        </div>
    )
}
