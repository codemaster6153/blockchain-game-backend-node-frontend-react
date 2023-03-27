import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './index.css'
import { getStakePrices, getSwap }  from '../../sections/Finance/Exchange';
import { func } from 'prop-types';


function CpuRentModal() {

    const dispatch = useDispatch()
    const wax = useSelector(state => state.wax)
    const boostModalFocus = useSelector(state => state.boostModal)

    const [availableWax, setAvailableWax] = useState()
    const [disableOne, setDisableOne] = useState(false)
    const [disableTwo, setDisableTwo] = useState(false)
    const [disableThree, setDisableThree] = useState(false)

    const [waxToLudio, setWaxToLudio] = useState(0)
    const [rentals, setRentals] = useState([0,0,0])

    const modalRef = useRef()

    const handleIgnore = () => {
        document.getElementById('cpuRentModal').style.zIndex = "-3"
        document.getElementById('cpuRentModal').style.opacity = "0"
        document.getElementsByTagName('html')[0].style.overflow = "initial"
        // setParentLoading(false)
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleClose = () => {
        dispatch({
            type:'REMOVE_BOOST_MODAL'
        })
    }

    const fetchAvailableWax = async () => {
        if (wax.rpc) {
            let active_contract = await fetch('/api/clashdome-game/get-active-contract');
            active_contract = await active_contract.json();
            active_contract = active_contract.ac;
            const waxBalance = await wax.rpc.get_currency_balance("eosio.token", active_contract, "WAX");
            let parsedValue = waxBalance[0] ? parseFloat(waxBalance[0].split(' ')[0]).toFixed(2) : 0
            const commaString = parseFloat(parsedValue).toLocaleString('en')
            setAvailableWax(commaString)
            if(parseFloat(parsedValue) < 200){
                setDisableThree(true)
            }
            if(parseFloat(parsedValue) < 100){
                setDisableOne(true)
                setDisableTwo(true)
            }

            var prices = await getStakePrices();
            setWaxToLudio((Math.ceil(prices['wax_price'])))
            setRentals(prices['rental_prices'])
        }
    }

    const handleBoost = async (memo) => {
        await fetchAvailableWax()
        try{
            let active_contract = await fetch('/api/clashdome-game/get-active-contract');
            active_contract = await active_contract.json();
            active_contract = active_contract.ac;
            var prices = await getStakePrices();
            prices = prices.rental_prices[memo-1]+".0000 CDJIGO";
            let resp;
            if (wax.type === "wcw") {
                resp = await wax.api.transact({
                    actions: [{
                        account: "clashdometkn",
                        name: "transfer",
                        authorization: [{
                            actor: wax.userAccount,
                            permission: "active",
                        }],
                        data: {
                            from: wax.userAccount,
                            to: active_contract,
                            quantity: prices,
                            memo: memo
                        }
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30
                })
            }else if(wax.type === "anchor"){
                resp = await wax.signTransaction({
                    actions: [{
                        account: "clashdometkn",
                        name: "transfer",
                        authorization: [{
                            actor: wax.userAccount,
                            permission: "active",
                        }],
                        data: {
                            from: wax.userAccount,
                            to: active_contract ,
                            quantity: prices,
                            memo: memo
                        }
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30
                })
            }

            if (resp) {
                dispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                        text: "SUCCESSFUL TRANSACTION!",
                        success: true
                    }
                })
                console.log(resp)
                await sleep(4800)

                dispatch({
                    type: "REMOVE_NOTIFICATION",
                    payload: {
                        text: "",
                        success: false
                    }
                })
            }

        }catch(e) {

            dispatch({
                type: "SET_NOTIFICATION",
                payload: {
                    text: e.message.toUpperCase(),
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

    useEffect(() => {
        fetchAvailableWax()
    }, [boostModalFocus])

    useEffect(() => {
        fetchAvailableWax()
    }, [wax])

    return (
        <div className="modal-container" id="cpuRentModal" ref={modalRef} onClick={handleIgnore} >
            <div className="modal-box" onClick={(e) => {e.stopPropagation()}}>
                <img src="/images/btn_close.svg" onClick={handleClose} alt="close" />
                <h2 className='modal-white-text'>GET YOUR CPU BOOSTED!</h2>
                <p>The WAX Blockchain doesn’t charge you with transaction fees, but sometimes you run out of juice to keep working on it. Now you can get a CPU boost and keep the action going for a while.</p>
                <p className='modal-white-text'>{availableWax} WAXP available in the CPU pool</p>
                <div className='boostcard-wrapper'>
                    <div className='best-deal'>
                        <p className='left-text'></p>
                        <div className='boost-card one'>
                            <h3>24 hours <br/> BOOST</h3>
                            <p>Get 100 WAXP in CPU</p>
                            <div className={`${disableOne ? "disable" : "" }`} onClick={() => !disableOne ? handleBoost(1) : {}}>
                                <p>{rentals[0]}</p>
                                <img src="/images/icon_cdjigo.png" alt='token' />
                            </div>
                        </div>
                    </div>
                    <div className='best-deal'>
                        <p className='left-text'></p>
                        <div className='boost-card two'>
                            <h3>3 days <br/> BOOST</h3>
                            <p>Get 100 WAXP in CPU</p>
                            <div className={`${disableTwo ? "disable" : "" }`} onClick={() => !disableTwo ? handleBoost(2) : {}}>
                                <p>{rentals[1]}</p>
                                <img src="/images/icon_cdjigo.png" alt='token' />
                            </div>
                        </div>
                    </div>
                    <div className='best-deal'>
                        <p className='left-text'>Best Deal!</p>
                        <div className='boost-card three'>
                            <h3>1 week <br/> BOOST</h3>
                            <p>Get 200 WAXP in CPU</p>
                            <div className={`${disableThree ? "disable" : "" }`} onClick={() => !disableThree ? handleBoost(3) : {}} >
                                <p>{rentals[2]}</p>
                                <img src="/images/icon_cdjigo.png" alt='token' />
                            </div>
                        </div>
                    </div>
                </div>
                    <p className='modal-white-text'> 1 WAXP = {waxToLudio} CDJIGO</p>
            </div>
        </div>
    )
}

export default CpuRentModal