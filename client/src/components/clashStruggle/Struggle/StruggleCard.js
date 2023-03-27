import React, { useEffect, useRef } from 'react'
import './struggleCard.css'

export default function StruggleCard({isAvailable, availableCards}) {

    const card = useRef();

    useEffect(() => {
        if(!isAvailable) {
            card.current.style.opacity = "0.5"
        }
    }, [isAvailable])
    return (
        <div className={(isAvailable) ? "card" : "card disabled"}>
            <img ref={card} src="/images/card.png" alt="card-image" />
            {
                (availableCards > 0 && availableCards <= 3 && !isAvailable) ?
                <div className="card-button">
                    <div className="nft-hive-button">
                        <p style={{}}>Get them at</p>
                        <img src="/images/nfthive-logo-small.png" width="80px" />
                    </div>
                </div> :
                <></>
            }
            {
                (isAvailable) ?
                <div className="card-number">
                    <p>#234</p>
                </div>:
                <></>
            }
        </div>
    )
}
