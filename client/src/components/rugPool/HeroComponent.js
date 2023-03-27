import React, { useEffect, useRef, useState } from 'react'
import './heroComponent.css'

export default function HeroComponent({casualties}) {

    const imageContainer = useRef();
    const necro = useRef()
    const landlord = useRef()

    const [bodyWidth, setBodyWidth] = useState(document.body.clientWidth)

    const updateWindowWidth = () => {
        setBodyWidth(document.body.clientWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', updateWindowWidth);

        if(bodyWidth < 1036){
            const height = necro.current.getBoundingClientRect().height
            // imageContainer.current.style.height = `${height}px`
        }

        return () => window.removeEventListener('resize', updateWindowWidth);
    }, [bodyWidth, necro.current])

    useEffect(() => {

        (async () => {

        
        })();
    },[]);

    return (
        <div className="hero-component">
            {
                (bodyWidth < 1036)?
                <div className="mobile-header">
                    <h1>“You wanna hustle pool, don’t you?”</h1>
                    <h2>Manage your Pool Hall biz and earn from the players’ activity.</h2>
                </div>:
                <></>
            }
            <div className="image-container" ref={imageContainer}>
                <img src="/images/newRugPool/hustler.png" ref={necro} style={{zIndex: 2}} alt="necro" />
                {/* <img src="/images/landlord.png" ref={landlord} style={{zIndex: 1}} alt="landlord" /> */}
            </div>
            <div className="hero-info">
                {
                    (bodyWidth > 1036)?
                    <>
                        <h1>“You wanna hustle pool, don’t you?”</h1>
                        <h2>Manage your Pool Hall biz and earn from the players’ activity.</h2>
                    </>:
                    <></>
                }
                <p>
                    What are the perks of being a Rug Pool Hall 
                    owner? Well, you can play on your own tables, 
                    since they are a cosmetic item. You can earn 
                    actively when you play and win against other 
                    players. And most importantly you can also 
                    earn from others playing on your Halls. Kinda 
                    big deal.
                </p>
                <div className="exchange-value-container">
                    <p>CURRENT EXCHANGE VALUE:</p>
                    <div className="exchange-value">
                        <div>
                            <img src="/images/newRugPool/8_ball.svg" width="58px" />
                            <p>{casualties + " POCKETED BALLS"}</p>
                        </div>
                        <p>=</p>
                        <div>
                            <img src="/images/newRugPool/newLudio.png" />
                            <p>1 LUDIO</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
