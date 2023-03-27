import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CountrySelector from './CountrySelector'
import './index.css'


export default function CountryClaimModal({wax}) {
    const [country, setCountry] = useState()
    const [loading, setLoading] = useState(false)
    const claimAmount = useSelector(state => state.claimAmount)
    const amountClaimed = useSelector(state => state.amountClaimed)
    
    const dispatch = useDispatch()

    const getCountry = async () => {
        let res = await fetch("https://ipapi.co/json/")
        res = await res.json()
        setCountry(res.country)
    }

    useEffect(() => {
        getCountry()
    }, [])

    const handleClaim = async () => {
        if(!loading){
            setLoading(true)
            // setParentLoading(true)
            try{
                if (wax.type === "wcw") {
                    const res = await wax.api.transact({
                        actions: [{
                            account: "clashdomedll",
                            name: "claim2",
                            authorization: [{
                                actor: wax.userAccount,
                                permission: "active",
                            }],
                            data: {
                                account: wax.userAccount,
                                country: country
                            }
                        }]
                    }, {
                        blocksBehind: 3,
                        expireSeconds: 30
                    }) 
                }else if(wax.type === "anchor"){
                    const res = await wax.signTransaction({
                        actions: [{
                            account: "clashdomedll",
                            name: "claim2",
                            authorization: [{
                                actor: wax.userAccount,
                                permission: "active",
                            }],
                            data: {
                                account: wax.userAccount,
                                country: country
                            }
                        }]
                    }, {
                        blocksBehind: 3,
                        expireSeconds: 30
                    })
                }
                setLoading(false)
                // setParentLoading(false)
                handleIgnore()
                dispatch({
                    type: "SET_AMOUNT_CLAIMED",
                    payload: !amountClaimed
                })
                dispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                        text: "SUCCESSFUL TRANSACTION!",
                        success: true
                    }
                })
                await sleep(4800)
                dispatch({
                    type: "REMOVE_NOTIFICATION",
                    payload: {
                        text: "",
                        success: false
                    }
                })
                
            }catch(err){
                //console.log("setting loading false")

                handleIgnore()
                setLoading(false)
                // setParentLoading(false)
                dispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                        text: err.message.toUpperCase(),
                        success: false
                    }
                })
    
                await sleep(4800)
    
                dispatch({
                    type: "REMOVE_NOTIFICATION",
                    payload: {
                        text: "",
                        success: false
                    }
                })
            }
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleIgnore = () => {
        document.getElementById('countryClaimModal').style.zIndex = "-3"
        document.getElementById('countryClaimModal').style.opacity = "0"
        document.getElementsByTagName('html')[0].style.overflow = "initial"
        // setParentLoading(false)
    }

    return (
        <div className="modal-container" id="countryClaimModal" onClick={handleIgnore} >
            <div className="modal-box" onClick={(e) => {e.stopPropagation()}}>
                <p className="modal-blue-text">PLEASE CONFIRM YOUR NATIONALITY</p>
                <CountrySelector setCountry={setCountry} defaultValue={country} />
                <div className='claim-all-btn' onClick={handleClaim}>
                    {
                        loading ?
                        <img className="loading" src="/images/loading_icon.png" style={{height: '36px'}} />:
                        <p>CLAIM ALL: <span>{parseFloat(claimAmount).toPrecision(6)} <img src='/images/icon_wax_small.png' alt='wax' /></span></p>
                    }
                </div>
            </div>
        </div>
    )
}
