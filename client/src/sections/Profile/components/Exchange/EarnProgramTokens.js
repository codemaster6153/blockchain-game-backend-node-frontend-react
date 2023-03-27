import React, { memo } from 'react'
import { SlideDown } from 'react-slidedown'

function EarchProgramTokens({ isOpen, isCurrentStep, onTokenSelect, token }) {
    return (
        <div className={`single-step-box ${isCurrentStep ? 'active' : ''}`}>
            <p className='single-step-title'>1) Choose the token you want to stake</p>
            <SlideDown>
                {isOpen ? (
                    <div className='single-step-items tokens'>
                        <button onClick={() => onTokenSelect("LUD")} type='button' className={`token-item ${token === "LUD" && "active"}`}>
                            <img src='/images/token_alcor_ludio.png' alt='LUD' />
                        </button>
                        <button onClick={() => onTokenSelect("CDC")} type='button' className={`token-item ${token === "CDC" && "active"}`}>
                            <img src='/images/token_alcor_carbz.png' alt='CDC' />
                        </button>
                        <button onClick={() => onTokenSelect("CDJ")} type='button' className={`token-item ${token === "CDJ" && "active"}`}>
                            <img src='/images/token_alcor_jigo.png' alt='CDJ' />
                        </button>
                    </div>
                ) : null}
            </SlideDown>
        </div>
    )
}

export default memo(EarchProgramTokens)