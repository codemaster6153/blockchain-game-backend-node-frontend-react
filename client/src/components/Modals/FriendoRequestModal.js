import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import './FriendoRequestModal.css'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'
import { sendFR } from '../../sections/Finance/ApartmentVoting'

function FriendoRequestModal({ open, onCloseModal, account, wax }) {

    const citizenAvatars = useSelector(state => state.citiz)
    const trials = useSelector((state) => state.trial)
    const socialUsernames = useSelector(state => state.social)
    const dispatch = useDispatch();
    
    const sendFriendRequest = async (account) => {
        let result = await sendFR(wax, account)
        if(result.error) {
            notify(result.error.toUpperCase(), false);
        } else {
            notify("SUCCESSFUL TRANSACTION!", true);
        }
        onCloseModal(false)
    }

    
    const sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const notify = async (text, success) => {
        dispatch({ type:"SET_NOTIFICATION", payload: {
            text: text,
            success: success,
        }})

        await sleep(4800)

        dispatch({ type:"REMOVE_NOTIFICATION", payload: {
            text: text,
            success: success,
        }})

    }

    return ReactDOM.createPortal(
        <Modal
            open={open}
            onClose={() => onCloseModal(false)}
            center
            showCloseIcon={false}
            styles={{ modal: { padding: 0, margin: 0, borderRadius: 8, background: 'transparent' } }}
            blockScroll={false}
        >
            <div id="friendo-request-modal">
                <div className="m-container">
                    <div className='close-button' onClick={() => onCloseModal(false)}>
                        ×
                    </div>
                    <div className='items-container'>
                        <span className='title'>SEND FRIENDO REQUEST</span>
                        <div className='profile'>
                            <div className='avatar-wrap'>
                                <img
                                    src={
                                        citizenAvatars[account]
                                            ? citizenAvatars[account]
                                            : trials[account]
                                            ? '/images/trial_avatar.png'
                                            : '/images/dummy_avatar.png'
                                    }
                                />
                            </div>
                            <div style={{flexDirection: 'column', display: 'flex'}}>
                                <span className='name'>{socialUsernames[`${account}`] ? socialUsernames[`${account}`] : account}</span>
                                <span className='username'>{account}</span>
                            </div>
                        </div>
                        <div className='action-button' onClick={() => sendFriendRequest(account)}>
                                    <img src='/images/send-request.svg'  />
                                    <span>100</span>
                                    <img src='/images/token_alcor_jigo.png' style={{margin: '0 0 0 6px', width: '20px'}} />
                                </div>
                        <span className='info'>Challenge this Citizen in private duels by becoming his/her Friendo.</span>
                    </div>
                </div>
            </div>
        </Modal>,
        document.getElementById("modal-root")
    )
}

export default FriendoRequestModal
