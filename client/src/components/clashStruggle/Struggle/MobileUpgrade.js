import React, {useRef, useEffect, useState} from 'react'
import { useDispatch } from 'react-redux';
import StruggleCard from './StruggleCard'

export default function MobileUpgrade() {

    const [cardsAvailable, setCardsAvailable] = useState(4)

    const animator1 = useRef();
    const animator2 = useRef();
    const animator3 = useRef();
    const animator4 = useRef();
    const finalCard = useRef();
    const cardSection1 = useRef();
    const cardSection2 = useRef();
    const cardSection3 = useRef();
    const cardSection4 = useRef();

    const dispatch = useDispatch();
    const [warningAccepted, setWarningAccepted] = useState(false);
    const [ludio, setLudio] = useState(3)


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
        if(cardsAvailable === 1) {
            animator1.current.classList.add("active")
            animator2.current.classList.remove("active")
            animator3.current.classList.remove("active")
            animator4.current.classList.remove("active")
            cardSection2.current.style.background = "linear-gradient(rgb(0 0 0 / 50%), rgb(0 0 0 / 50%)), url(/images/arrows_bg.jpg)"
            cardSection3.current.style.background = "linear-gradient(rgb(0 0 0 / 50%), rgb(0 0 0 / 50%)), url(/images/arrows_bg.jpg)"
            cardSection4.current.style.background = "linear-gradient(rgb(0 0 0 / 50%), rgb(0 0 0 / 50%)), url(/images/arrows_bg.jpg)"
        } else if(cardsAvailable === 2){
            animator1.current.classList.add("active")
            animator2.current.classList.add("active")
            animator3.current.classList.remove("active")
            animator4.current.classList.remove("active")
            cardSection3.current.style.background = "linear-gradient(rgb(0 0 0 / 50%), rgb(0 0 0 / 50%)), url(/images/arrows_bg.jpg)"
            cardSection4.current.style.background = "linear-gradient(rgb(0 0 0 / 50%), rgb(0 0 0 / 50%)), url(/images/arrows_bg.jpg)"
        } else if(cardsAvailable === 3){
            animator1.current.classList.add("active")
            animator2.current.classList.add("active")
            animator3.current.classList.add("active")
            animator4.current.classList.remove("active")
            cardSection4.current.style.background = "linear-gradient(rgb(0 0 0 / 50%), rgb(0 0 0 / 50%)), url(/images/arrows_bg.jpg)"
        } else if(cardsAvailable > 3) {
            animator1.current.classList.add("active")
            animator2.current.classList.add("active")
            animator3.current.classList.add("active")
            animator4.current.classList.add("active")
        } else {
            cardSection1.current.style.background = "linear-gradient(rgb(0 0 0 / 50%), rgb(0 0 0 / 50%)), url(/images/arrows_bg.jpg)"
            cardSection2.current.style.background = "linear-gradient(rgb(0 0 0 / 50%), rgb(0 0 0 / 50%)), url(/images/arrows_bg.jpg)"
            cardSection3.current.style.background = "linear-gradient(rgb(0 0 0 / 50%), rgb(0 0 0 / 50%)), url(/images/arrows_bg.jpg)"
            cardSection4.current.style.background = "linear-gradient(rgb(0 0 0 / 50%), rgb(0 0 0 / 50%)), url(/images/arrows_bg.jpg)"
        }
    }, [cardsAvailable])

    return (
        <>
            <div className="mobile-upgrade-container">
                <div className="card-row-container">
                    <div className="mobile-card-row" ref={cardSection1}>
                        <div className="animator" ref={animator1}></div>
                    </div>
                    <div className="mobile-card-row" ref={cardSection2}>
                        <div className="animator" ref={animator2}></div>
                    </div>
                    <div className="mobile-card-row" ref={cardSection3}>
                        <div className="animator" ref={animator3}></div>
                    </div>
                    <div className="mobile-card-row" ref={cardSection4}>
                        <div className="animator" ref={animator4}></div>
                    </div>
                    <div className="absolute-top">
                        <div className="left">
                            <StruggleCard isAvailable={true} availableCards={1} />
                            <StruggleCard isAvailable={true} availableCards={1} />
                            <StruggleCard isAvailable={true} availableCards={1} />
                            <StruggleCard isAvailable={true} availableCards={1} />
                        </div>
                        <div className="right">
                            <div className="final-card" >
                                <img src="/images/card.png" className={(cardsAvailable >= 4) ? "animate" : ""} alt="final-card"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                (cardsAvailable > 3) ?
                <>
                    <div className="merge-button" onClick={handleUpgrade} >
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
