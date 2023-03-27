import React, {useRef, useEffect, useState} from 'react'
import { useDispatch } from 'react-redux';
import StruggleCard from './StruggleCard'

export default function DesktopUpgrade() {
    const [cardsAvailable, setCardsAvailable] = useState(4);
    const [ludio, setLudio] = useState(3);

    const animator = useRef();
    const finalCard = useRef();
    const cardSection = useRef();

    const dispatch = useDispatch();
    const [warningAccepted, setWarningAccepted] = useState(false);


    const handleUpgrade = () => {
        if(ludio < 10){
            document.getElementsByTagName('html')[0].scrollTop = 0
            dispatch({
                type: 'SET_LOW_LUDIO_WARNING',
            })
        } else {
            document.getElementsByTagName('html')[0].scrollTop = 0
            dispatch({
                type: 'SET_WARNING_MODAL',
                payload: {
                    body: 'THESE 4 CARDS WILL BE DESTROYED TO CREATE THE UPGRADED CARD',
                    button: 'CONFIRM AND UPGRADE',
                    type: 'upgrade',
                    setAcceptance: setWarningAccepted
                }
            })
        }
    }

    const luckFactorInfo = () => {
        document.getElementsByTagName('html')[0].scrollTop = 0
        dispatch({
            type: 'SET_LUCK_FACTOR_MODAL'
        })
    }

    useEffect(() => {
        if(warningAccepted){
            console.log("as you have accpet the warning so buring the 4 cards")
        }
    }, [warningAccepted])

    useEffect(() => {
        if(cardsAvailable > 3) {
            animator.current.classList.add("active")
        } else {
            cardSection.current.style.background = "linear-gradient(rgb(0 0 0 / 50%), rgb(0 0 0 / 50%)), url(/images/arrows_bg.jpg)"
        }
    }, [cardsAvailable])

    return (
        <>
            <div className="card-section" ref={cardSection}>
                <div className="animator" ref={animator} >
                </div>
                <div className="merge-container">
                    <div className="cards-container">
                        <StruggleCard isAvailable={(cardsAvailable > 0)} availableCards={cardsAvailable} />
                        <StruggleCard isAvailable={(cardsAvailable > 1)} availableCards={cardsAvailable} />
                        <StruggleCard isAvailable={(cardsAvailable > 2)} availableCards={cardsAvailable} />
                        <StruggleCard isAvailable={(cardsAvailable > 3)} availableCards={cardsAvailable} />
                        {
                            (cardsAvailable === 0) ?
                            <div className="play-tournament-label">
                                <p>COLLECT MORE CARDS PLAYING DAILY TOURNAMENTS</p>
                                <div className="nft-hive-button">
                                    <p>Get them at</p>
                                    <img src="/images/nfthive-logo-small.png" width="140px" />
                                </div>
                            </div> :
                            <></>
                        }
                    </div>
                    <div className="final-card-container">
                        <div className="final-card" ref={finalCard} >
                            <img src="/images/card.png" className={(cardsAvailable >= 4) ? "animate" : ""} alt="final-card"/>
                        </div>
                    </div>
                </div>
            </div>

            {
                (cardsAvailable > 3) ?
                <>
                    <div className="merge-button" onClick={handleUpgrade}>
                        <p>MERGE AND UPGRADE</p>
                        <div>
                            <p>25 LUDIO</p>
                            <img src="/images/ludio_60X60.png" width="28px" alt="ludio" />
                        </div>
                    </div>
                    <div className="luck-factor">
                        <p>Current Luck factor: 5%</p>
                        <img src="/images/infoCircle.svg" style={{cursor: 'pointer'}} alt="info" width="46px" onClick={luckFactorInfo} />
                    </div>
                </>:
                <></>
            }
        </>
    )
}
