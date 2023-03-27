import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ClosedDuels from './components/ClosedDuels';
import DuelsHistory from './components/DuelsHistory'
import PendingDuels from './components/PendingDuels'
import RecentResultScroll from './components/RecentResultScroll'
import ResultTable from './components/ResultTable'
import UnclaimedVictories from './components/UnclaimedVictories'
import './index.css'

function DuelResults({wax}) {
    const [claimAmount, setClaimAmount] = useState(0)
    const [claimTokensAmount, setClaimTokensAmount] = useState([])
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        wax && getUnclaimedVictoriesData();
    }, [wax])
    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const getUnclaimedVictoriesData = async () => {

        if (wax.userAccount) {
            let value = await wax.rpc.get_table_rows({
                json: true,                 
                code: "clashdomedll",       
                scope: "clashdomedll",      
                table: "players2",  
                limit: 1,
                index_position: 1,
                key_type: "i64",               
                lower_bound: wax.userAccount,
                upper_bound: wax.userAccount,                
                reverse: true,             
                show_payer: false,    
            });

            if (value.rows.length) {
                setClaimAmount(value.rows[0].claimable)
            }
            
            
            dispatch({
                type: "SET_CLAIM_AMOUNT",
                payload: value.rows[0].claimable,
            })

            await sleep(250);

            value = await wax.rpc.get_table_rows({
                json: true,                 
                code: "clashdomedll",       
                scope: "clashdomedll",      
                table: "claims",  
                limit: 1,
                index_position: 1,
                key_type: "i64",               
                lower_bound: wax.userAccount,
                upper_bound: wax.userAccount,                
                reverse: true,             
                show_payer: false,    
            });

            if (value.rows.length) {
                setClaimTokensAmount(value.rows[0].claimable)
            }
        }
    }

    const countrySelected = async () => {
        // setLoading(true)

        let value = await wax.rpc.get_table_rows({
            json: true,                 
            code: "clashdomedll",       
            scope: "clashdomedll",      
            table: "countries",  
            limit: 1,
            index_position: 1,
            key_type: "i64",               
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,                
            reverse: true,             
            show_payer: false,    
        });
        if(value.rows.length > 0){
            handleClaim()
        }else{
            handleOpenCountrySelectModal()
        }
    }

    const handleOpenCountrySelectModal = () => {
        // window.scrollTo(0,0)
        document.getElementById('countryClaimModal').style.zIndex = "9"
        document.getElementById('countryClaimModal').style.opacity = "1"
        document.getElementsByTagName('html')[0].style.overflow = "hidden"
}

    const handleClaim = async () => {
        if(!loading){
            setLoading(true)
            try{
                if (wax.type === "wcw") {
                    const res = await wax.api.transact({
                        actions: [{
                            account: "clashdomedll",
                            name: "claim",
                            authorization: [{
                                actor: wax.userAccount,
                                permission: "active",
                            }],
                            data: {
                                account: wax.userAccount
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
                            name: "claim",
                            authorization: [{
                                actor: wax.userAccount,
                                permission: "active",
                            }],
                            data: {
                                account: wax.userAccount
                            }
                        }]
                    }, {
                        blocksBehind: 3,
                        expireSeconds: 30
                    })
                }

                setLoading(false)
                //getUnclaimedVictoriesData()
                setClaimAmount(0);
                setClaimTokensAmount([]);
                await sleep(1000)
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
                setLoading(false)
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

    return (
        <div className='token-mining-result-container'>
            <PendingDuels wax={wax} />
            <ClosedDuels wax={wax} />
            <div className='claims-container'>
                {
                    ((claimAmount !== 0 && claimAmount !== "0.00000000 WAX") || claimTokensAmount.length > 0) && ( 
                        <div className='claim-all-btn' onClick={countrySelected}>
                            {
                                loading ?
                                <img className="loading" src="/images/loading_icon.png" style={{height: '36px'}} />:
                                <p><span>{parseFloat(claimAmount).toPrecision(6)} <img src='/images/icon_wax_small.png' alt='wax' style={{height: '22px'}} /></span> + <span>{parseFloat(claimTokensAmount[0] || 0).toPrecision(6)} <img src='/images/icon_cdjigo.png' alt='wax' style={{height: '22px'}} /></span> - CLAIM ALL</p>
                            }
                        </div>
                    )
                }
            </div>

            <DuelsHistory wax={wax} />
        </div>
    )
}

export default DuelResults
