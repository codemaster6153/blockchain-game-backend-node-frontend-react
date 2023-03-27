import React, { useEffect, useRef, useState } from 'react'
import SubmitCard from './SubmitCard';
import './submit.css'
import { useDispatch } from 'react-redux';

export default function Submit() {

    const [isAllSelected, setIsAllSelected] = useState(false);
    const [selectedCards, setSelectedCards] = useState([]);
    const [SelectedSum, setSelectedSum] = useState(0);
    const [scrollTop, setScrollTop] = useState();
    const [warningAccepted, setWarningAccepted] = useState(false);

    const stickySubmitBar = useRef()
    const dispatch = useDispatch()

    const handleSubmit = () => {
        document.getElementsByTagName('html')[0].scrollTop = 0
        dispatch({
            type: 'SET_WARNING_MODAL',
            payload: {
                body: 'THE SELECTED CARDS WILL BE DESTROYED IN ORDER TO SUBMIT THEIR SCORE',
                button: 'CONFIRM AND SUBMIT',
                type: 'submit',
                setAcceptance: setWarningAccepted
            }
        })
    }

    useEffect(() => {
        if(warningAccepted){
            console.log("you have accepted the warnings so submitting cards")
        }
    }, [warningAccepted])

    const cardsValue = [
        {
            mint: 213,
            value: 200,
        },{
            mint: 223,
            value: 200,
        },{
            mint: 233,
            value: 200,
        },{
            mint: 243,
            value: 200,
        },{
            mint: 253,
            value: 200,
        },{
            mint: 263,
            value: 200,
        },{
            mint: 273,
            value: 200,
        },{
            mint: 283,
            value: 200,
        },{
            mint: 293,
            value: 200,
        },{
            mint: 303,
            value: 200,
        },{
            mint: 313,
            value: 200,
        },{
            mint: 323,
            value: 200,
        },{
            mint: 333,
            value: 200,
        },{
            mint: 343,
            value: 200,
        },

    ]

    const handleCardSelect = (isSelected, value, mint) => {
        // console.log("handle select ran for ", mint, selectedCards)
        if(isSelected){
            if(selectedCards.indexOf(mint) === -1){
                setSelectedSum(SelectedSum + value)
                setSelectedCards([...selectedCards, mint])
            }
        } else {
            if(selectedCards.indexOf(mint) !== -1){
                setSelectedSum(SelectedSum - value)
                let newSelectedCards = selectedCards.filter(value => value !== mint)
                setSelectedCards([...newSelectedCards])
            }
        }
    }

    useEffect(() => {
        if(isAllSelected){
            let totalsum = 0
            let cardarry = []
            cardsValue.map((obj) => {
                console.log("mapping ", totalsum, cardarry)
                totalsum = totalsum + obj.value
                cardarry = [...cardarry, obj.mint]
            })

            setSelectedCards([...cardarry])
            setSelectedSum(totalsum)
        }
    }, [isAllSelected])

    // this section cover the scrolling behaviour

    const handleScrollTop = () => {
        console.log("handeling the scroll on html")
        setScrollTop(document.getElementsByTagName('html')[0].scrollTop)
    }


    useEffect(() => {
        window.addEventListener('scroll', handleScrollTop)

        if(scrollTop > 99){
            stickySubmitBar.current.classList.add("sticky")
            document.getElementById('root').style.paddingBottom = '6rem'
        }else{
            stickySubmitBar.current.classList.remove("sticky")
            document.getElementById('root').style.paddingBottom = '0px'
        }

        return () => {
            document.getElementById('root').style.paddingBottom = '0px'
            window.removeEventListener('scroll', handleScrollTop)
        }
    }, [scrollTop])

    

    return (
        <div className="struggle-submit-container">

            <div className="selected-card-info" ref={stickySubmitBar}>
                <p>SELECTED CARDS TOTAL SCORE: {SelectedSum}</p>
                <div className="selected-card-submit" onClick={handleSubmit} >
                    <p>SUBMIT SELECTED</p>
                    <img src="/images/awesome-telegram.png" />
                </div>
            </div>

            <div className="available-card-container">
                <h1>AVAILABLE CARDS</h1>

                <div className="all-cards-selector">
                    <p>SELECT ALL</p>
                    <label className="checkbox-label">
                        <input type="checkbox" checked={isAllSelected} onChange={(e) => setIsAllSelected(e.target.checked)} />
                        <span className="checkbox-custom rectangular"></span>
                    </label>
                </div>

                <div className="cards-grid">
                    {
                        cardsValue.map((obj) => {
                            return <SubmitCard mint={obj.mint} key={obj.mint} value={obj.value} handleCardSelect={handleCardSelect} isAllSelected={isAllSelected} setIsAllSelected={setIsAllSelected} />
                        })
                    }
                </div>
            </div>

        </div>
    )
}
