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
                    <h1>“As you command, my liege”</h1>
                    <h2>Start managing your lands in Endless Siege Duels.</h2>
                </div>:
                <></>
            }
            <div className="image-container" ref={imageContainer}>
                <img src="/images/necro.png" ref={necro} style={{zIndex: 2}} alt="necro" />
                <img src="/images/landlord.png" ref={landlord} style={{zIndex: 1}} alt="landlord" />
            </div>
            <div className="hero-info">
                {
                    (bodyWidth > 1036)?
                    <>
                        <h1>“As you command, my liege”</h1>
                        <h2>Start managing your lands in Endless Siege Duels.</h2>
                    </>:
                    <></>
                }
                <p>
                    All the matches played on your lands on Endless Siege 
                    Duels will leave thousands of orc casualties. Luckily, 
                    necromancers in your area have a totally not-shady 
                    interest in collecting those body parts, and they will 
                    give you LUDIO in exchange.
                </p>
                <div className="exchange-value-container">
                    <p>CURRENT EXCHANGE VALUE:</p>
                    <div className="exchange-value">
                        <div>
                            <img src="/images/head_orc.png" width="58px" />
                            <p>{casualties + " CASUALTIES"}</p>
                        </div>
                        <p>=</p>
                        <div>
                            <img src="/images/ludio_60X60.png" />
                            <p>1 LUDIO</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
