import React from 'react'
import { CSSTransition } from 'react-transition-group';
import './EventAlert.css'

function EventAlert({show, onRequestClose, onPlayClick}) {
    return (
        <CSSTransition
            in={show}
            // nodeRef={nodeRef}
            timeout={500}
            classNames="apartment-voting-event-alert"
            unmountOnExit
            onEnter={() => {}}
            onExited={() => {}}
        >
            <div className='apartment-voting-event-alert'>
                <div style={{ width: "100%" }}>
                    <span className='title'>Vote 5 apartments</span>
                    <span className='reward'>Rewards: <span style={{color: '#FFFF4E'}}>10 LUDIO</span></span>
                </div>
                
                <div className='play-button' onClick={onPlayClick}>
                    <img src='/images/play-button.svg'  />
                </div>
                <div className='close-button' onClick={onRequestClose}>
                    ×
                </div>             
            </div>
        </CSSTransition>
    )
}

export default EventAlert