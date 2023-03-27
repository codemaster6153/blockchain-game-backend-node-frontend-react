import React, { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import SuccessVote from "../SuccessVote"
import './VotingBar.css'

function VotingBar({
    showCapsule,
    onVote,
    currentApartment,
    totalApartments,
    lock,
    onRequestClose,
    showSuccessVotePopup,
    submitedVote,
    submitedVoteReceiver
}) {
    const [vote, setVote] = useState(0)

    useEffect(() => {
        if (showCapsule === false) {
            setVote(0)
        }
    }, [showCapsule])

    return (
        <div className="apartment-voting-bar">
            <div className="bg" />
            <div className="box-container">
                <CSSTransition
                    in={showCapsule}
                    // nodeRef={nodeRef}
                    timeout={2000}
                    classNames="apartment-voting-bar"
                    unmountOnExit={false}
                    onEnter={() => {}}
                    onExited={() => {}}
                >
                    <div className="vote-box">
                        {[1, 2, 3, 4, 5].map((star, index) => (
                            <img
                                key={star}
                                src={
                                    index < vote
                                        ? '/images/voting-star-active.svg'
                                        : '/images/voting-star-inactive.svg'
                                }
                                onMouseEnter={() => !lock && setVote(star)}
                                onClick={() => !lock && onVote(vote)}
                            />
                        ))}
                    </div>
                </CSSTransition>

                <span className="current-apartment">
                    {currentApartment}/{totalApartments} apartments
                </span>

                <div className='close-button' onClick={onRequestClose}>
                    ×
                </div>  
            </div>
            <SuccessVote show={showSuccessVotePopup} vote={submitedVote} receiver={submitedVoteReceiver} />
        </div>
    )
}

export default VotingBar
