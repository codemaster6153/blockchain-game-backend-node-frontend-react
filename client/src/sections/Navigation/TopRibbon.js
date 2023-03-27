import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import './topRibbon.css'


function TopRibbon({onLogin, wax, waxAvatar, waxp, ludio, carbz, jigo}) {
    const [accountInfo, setAccountInfo] = useState()
    const percentage = useRef()
    const percentageWrapper = useRef()
    const [used, setUsed] = useState(0)
    const dispatch = useDispatch()
    const boostModal = useSelector(state => state.boostModal)

    const getCpuValue = async () => {
        if(wax.userAccount){
            const res = await wax.rpc.get_account(wax.userAccount)
            setAccountInfo(res)
        }
    }

    useEffect(() => {
        getCpuValue()
    }, [wax])

    useEffect(() => {
        if(accountInfo && accountInfo.cpu_limit && accountInfo.cpu_limit.max !== 0){
            let per = parseInt(
                ((accountInfo.cpu_limit.used/accountInfo.cpu_limit.max)*100)
            )
            setUsed(per)
            percentage.current.style.width = `${per}%`
            if(per >= 0 && per < 50){
                percentageWrapper.current.style.backgroundColor = '#00C745'
                percentage.current.style.backgroundColor = '#00E34F'
            }else if(per >= 50 && per < 80){
                percentageWrapper.current.style.backgroundColor = '#FFA700'
                percentage.current.style.backgroundColor = '#FFCE00'
            }else{
                percentageWrapper.current.style.backgroundColor = '#D5003A'
                percentage.current.style.backgroundColor = '#FF0045'
            }
        }
    }, [accountInfo])

    const openBoostModal = () => {
        dispatch({
            type:'SET_BOOST_MODAL',
            payload: !boostModal
        })
    }

    return (
        <div className='top-ribbon' >
            <div className='value-wrapper'>
                    {
                        wax.userAccount ?
                        <>
                            <div className='right-push'></div>
                            <div className='carbz-jigo'>
                                <div className='pair'>
                                    <img className="mr-1" src="/images/icon_wax_small.png" />
                                    <span className="span-wax">{parseFloat(waxp).toLocaleString("en")}</span>
                                </div>
                                <div className='pair'>
                                    <img className="mr-1" src="/images/icon_cdcarbz.png" />
                                    <span className="span-carbz">{parseFloat(carbz).toLocaleString("en")}</span>
                                </div>
                                <div className='pair'>
                                    <img className="mr-1" src="/images/icon_ludio_small.png" />
                                    <span className="span-ludio">{parseFloat(ludio).toLocaleString("en")}</span>
                                </div>
                                <div className='pair'>
                                    <img className="mr-1" src="/images/icon_cdjigo.png" />
                                    <span className="span-jigo">{parseFloat(jigo).toLocaleString("en")}</span>
                                </div>
                            </div>
                            <div className='account-info'>
                                <div className="profile-bar">
                                    <Link to={`/token-mining-game/${wax.userAccount ? wax.userAccount : ""}`} >
                                        <img className="avatar" src={waxAvatar} />
                                        <span className="username mr-1">{wax.userAccount ? wax.userAccount : ""}</span>
                                    </Link>
                                    {
                                        accountInfo && accountInfo.cpu_limit && accountInfo.cpu_limit.max !== 0 &&
                                        <div className={`cpu-info ${used > 80 ? 'pulse' : ''}`} onClick={openBoostModal} ref={percentageWrapper}>
                                            <div className='percentage' ref={percentage}></div>
                                            <p>CPU {used}%</p>
                                        </div>
                                    }
                                    <button className="logout-button" onClick={onLogin} >&nbsp;</button>
                                </div>
                            </div>
                        </>:
                        <div className="login">
                            <button className="login-button" onClick={onLogin} >WAX Login</button>
                        </div>
                    }
            </div>
        </div>
    )
}

export default TopRibbon