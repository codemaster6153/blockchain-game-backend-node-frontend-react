import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './index.css'

function TrialDummyClaimModal() {

    const modalRef = useRef()
    const dispatch = useDispatch()
    const wax = useSelector(state => state.wax);
    // this is the id of of land card
    const id = useSelector(state => state.landCardId)

    const handleIgnore = () => {
        document.getElementById('trialDummyClaimModal').style.zIndex = "-3"
        document.getElementById('trialDummyClaimModal').style.opacity = "0"
        document.getElementsByTagName('html')[0].style.overflow = "initial"
        // setParentLoading(false)
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

    const handleClose = () => {
        dispatch({
            type:'REMOVE_CLAIM_DUMMY_MODAL'
        })
    }

    const handleClick = async () => {
        
        try {

            let result;
            let actions;

            if (id) {
                actions = [{
                    account: "clashdomewld",
                    name: "claimhalltr",
                    authorization: [{
                        actor: wax.userAccount,
                        permission: "active",
                    }],
                    data: {
                        account: wax.userAccount,
                        asset_id: id,
                    },
                }];
            } else {
                actions = [{
                    account: "clashdomewld",
                    name: "claimtrial",
                    authorization: [{
                        actor: wax.userAccount,
                        permission: "active",
                    }],
                    data: {
                        account: wax.userAccount,
                        afiliate: "clashdomewld",
                    },
                }];
            }
            

            if (wax.type === "wcw") {
                result = await wax.api.transact({
                    actions: actions
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
            } else if (wax.type === "anchor") {

                result = await wax.signTransaction({
                    actions: actions
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
            }

            if (result) {
                notify("SUCCESSFUL TRANSACTION!", true);
                dispatch({
                    type:'REMOVE_CLAIM_DUMMY_MODAL'
                })
            }
        } catch (e) {
            notify(e.message.toUpperCase(), false);
            dispatch({
                type:'REMOVE_CLAIM_DUMMY_MODAL'
            })
        }
    }

    return (
        <div className="modal-container" id="trialDummyClaimModal" ref={modalRef} onClick={handleIgnore} >
            <div className="modal-box" onClick={(e) => {e.stopPropagation()}}>
                <div className='dummy-header'>
                    <img src="/images/btn_close.svg" onClick={handleClose} alt="close" />
                    <h2 className='modal-white-text'>BECOME A CLASHDOME MEMBER FIRST!</h2> 
                </div>
                <div className='main-content'>
                    <img src='/images/dummy.png' />
                    <div className='claim-btn' onClick={handleClick}>
                        <p>CLAIM MY FREE TRIAL DUMMY</p>
                    </div>    
                </div>
                <p>You can start playing ClashDome games with a Trial Dummy. <br/> Later you can get a Citizen NFT to enjoy all the benefits for members</p>
                <div className='disclaimer'>
                    DISCLAIMER
                </div>
                <span className='disclaimer-text'><b>This NFT CAN’T BE SOLD.</b> It’s a NON-TRANSFERABLE TOKEN.</span>

            </div>
        </div>   
    )
}

export default TrialDummyClaimModal