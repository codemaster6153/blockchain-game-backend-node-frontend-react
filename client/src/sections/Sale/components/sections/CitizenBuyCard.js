import React, { useEffect, useState } from 'react'
import './citizenBuyCard.css'

function CitizenBuyCard({info}) {
    const [bgImg, setBgImg] = useState("/images/cd_back.png");

    const loadBackground = () => {
        const src = `${info.image}`;

        const imageLoader = new Image();
        imageLoader.src = src;

        imageLoader.onload = () => {
            setBgImg(src);
        };
    };

    useEffect(() => {
        loadBackground()
    }, [])
    
    return (
        <div className="buy-citizen-card">
                <p className='title'>{info.title}</p>
                <div className={"image-container"}>
                    <img src={bgImg} className="img-btm" alt="fadedcard" />
                </div>
                <div className='info-wrapper'>
                    <div className='info-line'>
                        <p className='info-line-label'>CUSTOMIZATION OPTIONS</p>
                        <p className='info-line-value'>{info.customizationOption}</p>
                    </div>
                    <div className='info-line'>
                        <p className='info-line-label'>TOKEN MINING BONUS</p>
                        <p className='info-line-value'>{info.tokenMiningBonus}</p>
                    </div>
                    <div className='info-line'>
                        <p className='info-line-label'>{info.title.toLowerCase().includes('citizens') ? 'MAX MINTS': 'TOTAL MINTS'}</p>
                        <p className='info-line-value'>{info.totalMints}</p>
                    </div>
                    <hr />
                    <div className='buy-wrapper'>
                        <p>BUY</p>
                        <div className='buttons-container'>
                            <a href={info.buyAtomic} target='_blank' rel="noopener">
                                <img src='/images/shop/btn_buy_atomic.svg' alt='buy atomic' />
                            </a>
                            <a href={info.buyNefty} target='_blank' rel="noopener">
                                <img src='/images/shop/btn_buy_nefty.svg' alt='buy atomic' />
                            </a>
                            <a href={info.buyNfthive} target='_blank' rel="noopener">
                                <img src='/images/shop/btn_buy_nfthive.svg' alt='buy atomic' />
                            </a>
                        </div>
                    </div>
                </div>
                
            </div>
    )
}

export default CitizenBuyCard