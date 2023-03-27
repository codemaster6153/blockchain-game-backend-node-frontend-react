import React, { memo } from 'react'
import { SlideDown } from 'react-slidedown'


function EarchProgramQuantity({ isOpen, isCurrentStep, setQuantity, quantity, token, onMaxButtonClick, assetlist }) {
    return (
        <div className={`single-step-box ${isCurrentStep ? 'active' : ''}`}>
            <p className='single-step-title'>2) Select the amount you want to stake</p>
            <SlideDown>
                {isOpen ? (
                    <div className='single-step-items'>
                        <div className='input-container'>
                            <input type='text' value={quantity} onChange={setQuantity} />
                            <div className='asset'>
                                <img src={assetlist[`${token}`].img} alt={assetlist[`${token}`].name} />
                                <p>{assetlist[`${token}`].name}</p>
                                <button onClick={onMaxButtonClick} className='max-button' type='button'>Max</button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </SlideDown>
        </div>
    )
}

export default memo(EarchProgramQuantity)