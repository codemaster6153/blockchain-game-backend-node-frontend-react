import React, { useState } from 'react'

function SelectPriceDropdown({price, setPrice}) {
    const [isActive, setIsActive] = useState(false);

    const PriceNames = {
        "FREE": 'Free',
        "PAID": 'Paid',
    }

    return (
        <div className={`dropdown mt-0 mb-0 ${isActive ? 'is-active' : ''}`}>
            <div className="dropdown-trigger">
                <button className="custom-button" aria-haspopup="true" style={{minWidth: '140px'}} onClick={() => {setIsActive(!isActive)}} aria-controls="dropdown-menu">
                    <span>{price !== undefined ? PriceNames[`${price}`] : 'All Tiers'}</span>
                    <div className={`arrow ${!isActive ? 'down' : ''}`}></div>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content" style={{maxWidth: '140px', maxHeight: '114px', overflow: 'hidden'}}>
                    <a className={`dropdown-item ${price === undefined ? 'is-active' : ''}`} onClick={() => {
                        setPrice(undefined)
                        setIsActive(!isActive)
                    }} >
                        All Tiers
                    </a>
                    <a className={`dropdown-item ${price === 'FREE' ? 'is-active' : ''}`} onClick={() => {
                        setPrice('FREE')
                        setIsActive(!isActive)
                    }} >
                        Free
                    </a>
                    <a className={`dropdown-item ${price === 'PAID' ? 'is-active' : ''}`} onClick={() => {
                        setPrice('PAID')
                        setIsActive(!isActive)
                    }} >
                        Paid
                    </a>
                </div>
            </div>
        </div>
    )
}

export default SelectPriceDropdown