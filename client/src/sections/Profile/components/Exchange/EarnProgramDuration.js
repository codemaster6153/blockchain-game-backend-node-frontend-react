import React, { memo, useCallback } from 'react'
import { SlideDown } from 'react-slidedown'


function EarchProgramDuration({ isOpen, isCurrentStep, duration, setDuration, assetlist, token, quantity, onDeposit }) {
    const getCalculatedInterest = useCallback(() => {
        if(!duration) {
            return 0
        }
        
        const numericQuantity = Number(quantity.split(',').join(''))
        const theWeekNumber = duration === "5" ? 1 : duration === "7" ? 2 : duration === "10" ? 4 : null
        const percent_gain = numericQuantity * (duration/100.0);
        const daily_gain = (7.0 * theWeekNumber) / 365.0;
        const deviedTokenQuantity = (numericQuantity / Number(duration)) / 365
        const interest = percent_gain * daily_gain;

        return interest.toFixed(4)
    }, [duration, quantity])

    return (
        <div className={`single-step-box ${isCurrentStep ? 'active' : ''}`}>
            <p className='single-step-title'>3) Choose your staking duration and Annual Percentage Yield</p>
            <SlideDown>
                {isOpen ? (
                    <div className='single-step-items-container'>
                        <div className='single-step-items durations'>
                            <button onClick={() => setDuration("5")} type='button' className={`duration-item ${duration === "5" && "active"}`}>
                                <span className='duration-name'>1 WEEK</span>
                                <span className='duration-apy'>5% APY</span>
                            </button>
                            <button onClick={() => setDuration("7")} type='button' className={`duration-item ${duration === "7" && "active"}`}>
                                <span className='duration-name'>2 WEEKS</span>
                                <span className='duration-apy'>7% APY</span>
                            </button>
                            <button onClick={() => setDuration("10")} type='button' className={`duration-item ${duration === "10" && "active"}`}>
                                <span className='duration-name'>4 WEEKS</span>
                                <span className='duration-apy'>10% APY</span>
                            </button>
                        </div>
                        <div className='single-step-items interest'>
                            <p>
                                Estimated Interest <span className='estimate-number'>{getCalculatedInterest() || 0}</span>
                            </p>
                        </div>
                        <div className='single-step-items deposit'>
                            <div className={`swap-button ${!duration ? 'disabled' : ''}`} onClick={onDeposit}>
                                <p>DEPOSIT {assetlist[`${token}`].name}</p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </SlideDown>
        </div>
    )
}

export default memo(EarchProgramDuration)