import React from 'react'
import { CSSTransition } from 'react-transition-group';
import './index.css'

function SuccessVote({ show, vote, receiver }) {
    const getTheLudioFromVote = () => {
        switch(vote){
            case "2":
                return 5
            case "3":
                return 10
            case "4":
                return 15
            case "5":
                return 20
            default:
                return null
        }
    }
    return (
        <CSSTransition in={show} timeout={500} classNames="success-vote-popup" unmountOnExit>
            <div className='success-vote-popup'>
                <img src='/images/token_alcor_ludio.png' alt='LUDIO' />
                <p className='info'><b>{receiver}</b> received {getTheLudioFromVote()} LUDIO</p>
            </div>
        </CSSTransition>
    )
}

export default SuccessVote