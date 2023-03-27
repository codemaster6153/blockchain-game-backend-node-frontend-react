import React, { useEffect, useState } from 'react'
import './unclaimedVictories.css'
import { JsonRpc } from 'eosjs';
import {fetch as nodefetch} from 'node-fetch'
import EarlyAccessRow from '../../../../../components/Templok/EarlyAccessRow';
import { useDispatch, useSelector } from 'react-redux';
import CountryClaimModal from '../../../../../components/Modals/CountryClaimModal';

function UnclaimedVictories({wax}) {
    const [recentMatches, setRecentMatches] = useState([])
    const [claimAmount, setClaimAmount] = useState(0)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const amountClaimed = useSelector(state => state.amountClaimed)

    const getUnclaimedVictoriesData = async () => {
        setRecentMatches([])
        setClaimAmount(0)
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

        setClaimAmount(value.rows[0].claimable)
        dispatch({
            type: "SET_CLAIM_AMOUNT",
            payload: value.rows[0].claimable,
        })

    }

    const countrySelected = async () => {
        // setLoading(true)
        let value = await rpc.get_table_rows({
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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
                getUnclaimedVictoriesData()
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

    const handleOpenCountrySelectModal = () => {
        // window.scrollTo(0,0)
        document.getElementById('countryClaimModal').style.zIndex = "9"
        document.getElementById('countryClaimModal').style.opacity = "1"
        document.getElementsByTagName('html')[0].style.overflow = "hidden"
    }

    useEffect(() => {
        getUnclaimedVictoriesData()
    }, [amountClaimed]);

    return (
        <>
            {
                claimAmount !== 0 && claimAmount !== "0.00000000 WAX" &&
                <div className='unclaimed-victories-container'>
                    <div className='section-header'>
                        <p>MY UNCLAIMED VICTORIES</p>
                    </div>
                    <div className='body'>
                        {
                            recentMatches.length > 0 && recentMatches.map((item) => {
                                return <EarlyAccessRow item={item.item} key={item.item.id} account={wax.userAccount} game={item.item.game === 2 ? 'templok' : item.item.game === 4 ? 'endless-siege' : 'ringy'}/>
                            })
                        }
                    </div>
                    {/* <div className='claim-all-btn' onClick={countrySelected}>
                        {
                            loading ?
                            <img className="loading" src="/images/loading_icon.png" style={{height: '36px'}} />:
                            <p>CLAIM ALL: <span>{parseFloat(claimAmount).toPrecision(6)} <img src='/images/icon_wax_small.png' alt='wax' /></span></p>
                        }
                    </div> */}
                    {/* <CountryClaimModal setParentLoading={setLoading} claimAmount={claimAmount} wax={wax} /> */}
                </div>
            }
        </>
    )
}

export default UnclaimedVictories