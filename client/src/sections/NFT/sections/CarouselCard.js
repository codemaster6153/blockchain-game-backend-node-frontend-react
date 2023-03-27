import React from 'react'

function CarouselCard({img, text, heading}) {
    return (
        <div className="nft-info-card">
            <h1>{heading}</h1>
            <img src={`/images/nft/${img}.jpg`} alt="active" />
            <p>{text}</p>
        </div>
    )
}

export default CarouselCard
