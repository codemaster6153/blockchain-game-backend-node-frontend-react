import React, { useState, useEffect, useRef, useMemo } from 'react'
import { createAction, getSwap, getEarnData, stakeAction, unstakeAction, getTokenBalances, getTacoInfo, unstakeTaco, claimTacoRewards } from '../../../Finance/Exchange';
import { useDispatch } from 'react-redux';
import humanizeDuration from 'humanize-duration'
import { JsonRpc } from 'eosjs';
import { fetch as nodefetch } from 'node-fetch'
import EarchProgramTokens from './EarnProgramTokens'
import EarchProgramQuantity from './EarnProgramQuantity'
import EarchProgramDuration from './EarnProgramDuration'
import TacoProgram from './TacoProgram'
import initConfig from '../../../../initConfig';

import './index.css'

const FIRST_STEP = "0"
const SECOND_STEP = "1"
const THIRD_STEP = "2"

function Exchange({ wax }) {
    const [sellQuantity, setSellQuantity] = useState(0);
    const [buyQuantity, setBuyQuantity] = useState(0)
    const [sellType, setSellType] = useState('LUD')
    const [buyType, setbuyType] = useState('CDC')
    const [balances, setBalances] = useState()
    const [earnProgramType, setEarnProgramType] = useState(null)
    const [defaultTacoPair, setDefaultTacoPair] = useState("LUDWAX")
    const [step, setStep] = useState(FIRST_STEP) // index of the active step in string
    const [token, setToken] = useState()
    const [duration, setDuration] = useState()
    const [selectedTokenQuantity, setSelectedTokenQuantity] = useState("0")
    const [holdings, setHoldings] = useState()
    const [totalEarnStaked, setTotalEarnStaked] = useState({ ludio: 0, jigo: 0, carbz: 0 })
    const [tacoInfo, setTacoInfo] = useState(null)

    const isFirstStepOpen = step === FIRST_STEP || step === SECOND_STEP || step === THIRD_STEP
    const isSecondStepOpen = step === SECOND_STEP || step === THIRD_STEP
    const isThirdStepOpen = step === THIRD_STEP

    const hasTacoLudioHoldings = useMemo(() => {
        return tacoInfo?.LUDWAX && tacoInfo?.LUDWAX?.player_holdings?.pool_ownership
    }, [tacoInfo])
    const hastTacoJigoHoldings = useMemo(() => {
        return tacoInfo?.CDJWAX && tacoInfo?.CDJWAX?.player_holdings?.pool_ownership
    }, [tacoInfo])
    const tacoHasCarbzHoldings = useMemo(() => {
        return tacoInfo?.CDCWAX && tacoInfo?.CDCWAX?.player_holdings?.pool_ownership
    }, [tacoInfo])

    const buyList = useRef()
    const sellList = useRef()

    const dispatch = useDispatch();

    const assetlist = {
        "LUD": {
            img: '/images/token_alcor_ludio.png',
            value: "LUD",
            name: "LUDIO",
            symbol: "LUDIO"
        },
        "CDJ": {
            img: '/images/token_alcor_jigo.png',
            value: "CDJ",
            name: "JIGOWATTS",
            symbol: "JIGO"
        },
        "CDC": {
            img: '/images/token_alcor_carbz.png',
            value: "CDC",
            name: "CARBZ",
            symbol: "CARBZ"
        },
        "WAX": {
            img: '/images/icon_wax_small.png',
            value: "WAX",
            name: "WAX",
            symbol: "WAX"
        },
    }

    const sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const notify = async (text, success) => {
        dispatch({
            type: "SET_NOTIFICATION", payload: {
                text: text,
                success: success,
            }
        })

        await sleep(4800)

        dispatch({
            type: "REMOVE_NOTIFICATION", payload: {
                text: text,
                success: success,
            }
        })

    }

    const handleSellInput = (e) => {
        e.preventDefault()
        let numValue = e.target.value.split(',').join('')
        if (!isNaN(numValue) && e.target.value.length) {
            setSellQuantity(parseFloat(numValue).toLocaleString('en-GB'))
        } else {
            setSellQuantity(0)
        }
    }

    const handleSelectedTokenInput = (e) => {
        e.preventDefault()

        let numValue = e.target.value.split(',').join('')

        if (!isNaN(numValue) && e.target.value.length) {
            setSelectedTokenQuantity(parseFloat(numValue).toLocaleString('en-GB'))
        } else {
            setSelectedTokenQuantity("0")
        }
    }

    const handleListOpen = (type) => {
        if (type === 'buy') {
            buyList.current.style.zIndex = '2'
            buyList.current.style.opacity = '1'
        } else {
            sellList.current.style.zIndex = '2'
            sellList.current.style.opacity = '1'
        }
    }

    const handleListClose = (type, value) => {
        if (type === 'buy') {
            buyList.current.style.zIndex = '-2'
            buyList.current.style.opacity = '0'
            setbuyType(value)
        } else {
            sellList.current.style.zIndex = '-2'
            sellList.current.style.opacity = '0'
            setSellType(value)
        }
    }

    const handleMidArrow = () => {
        let temp = sellType
        setSellType(buyType)
        setbuyType(temp)
        setSellQuantity(buyQuantity)
    }

    const handleSwap = async () => {

        if (sellType === buyType) {
            notify("SELL AND BUY TYPES CAN'T BE THE SAME!", false);
        } else {
            const numValue = sellQuantity.length ? parseFloat(sellQuantity.split(',').join('')) : 0
            let result = await createAction(numValue, sellType, buyType, wax);

            if (result.error) {
                notify(result.error.toUpperCase(), false);
            } else {
                notify("TRANSACTION EXECUTED SUCCESSFULLY!", true);
            }
        }

    }

    const handleSelectingToken = (token) => {
        setToken(token)
        if (step === FIRST_STEP) {
            setStep(SECOND_STEP)
        }
    }

    const handleMaxButtonClick = () => {
        const selectedTokenBalance = balances[token]
        setSelectedTokenQuantity(parseFloat(selectedTokenBalance).toLocaleString('en-GB'))
    }

    const handlingStake = async () => {
        const amount = Number(selectedTokenQuantity.split(',').join(''))
        const res = await stakeAction(amount, duration, token, wax)


        if (res?.error) {
            notify(res.error.toUpperCase(), false)
        } else {
            notify("TRANSACTION EXECUTED SUCCESSFULLY!", true)
            await sleep(500)
            fetchEarnData()
            fetchBalances()
            return
        }
    }

    const handlingUnStake = async (id) => {
        const res = await unstakeAction(wax, id)

        if (res?.error) {
            notify(res.error.toUpperCase(), false)
        } else if (res?.status === "executed") {
            notify("TRANSACTION EXECUTED SUCCESSFULLY!", true)
            await sleep(500)
            fetchEarnData()
            fetchBalances()
            return
        }
    }

    const fetchEarnData = async () => {
        const res = await getEarnData(wax)

        if (typeof res !== "string" && res != undefined) {
            // sort holdings so the lowest remained time shows at top
            const sortedResult = res.sort((a, b) => {
                return a.ends_in - b.ends_in
            })
            setHoldings(sortedResult)
        }
    }

    const fetchBalances = async () => {
        const balances = await getTokenBalances(wax)
        setBalances(balances)

        document.querySelector(".top-ribbon .span-wax").innerHTML = parseFloat(balances.WAX).toLocaleString("en")
        document.querySelector(".top-ribbon .span-carbz").innerHTML = parseFloat(balances.CDC).toLocaleString("en")
        document.querySelector(".top-ribbon .span-ludio").innerHTML = parseFloat(balances.LUD).toLocaleString("en")
        document.querySelector(".top-ribbon .span-jigo").innerHTML = parseFloat(balances.CDJ).toLocaleString("en")
    }

    const fetchTotalEarnTokensStaked = async () => {
        // Note: this piece of code is copied from Tokenomics page
        const rpc = new JsonRpc(initConfig.waxUrl, { nodefetch });
        const res = await rpc.get_table_rows({
            json: true,
            code: "clashdomewld",
            scope: "clashdomewld",
            table: "earnstats",
            limit: 30,
            index_position: 1,
            key_type: "i64",
            lower_bound: null,
            upper_bound: null,
            reverse: true,
            show_payer: false,
        })

        if (res && res.rows && res.rows.length) {
            const firstRow = res.rows[0]
            const staked_carbz = Number(firstRow["staked_carbz"].split(" ")[0] || 0)
            const staked_jigo = Number(firstRow["staked_jigo"].split(" ")[0] || 0)
            const staked_ludio = Number(firstRow["staked_ludio"].split(" ")[0] || 0)

            setTotalEarnStaked((state) => ({
                ...state,
                carbz: parseFloat(staked_carbz).toLocaleString('en-GB'),
                jigo: parseFloat(staked_jigo).toLocaleString('en-GB'),
                ludio: parseFloat(staked_ludio).toLocaleString('en-GB'),
            }))
        }
    }

    const fetchTacoInfo = async () => {
        const res = await getTacoInfo(wax)

        if(res){
            setTacoInfo(res)
        }
    }

    const getAssetsAmoutAndImage = (assetWithQuantity) => {
        const splitedAsset = assetWithQuantity.split(" ")

        const tokenName = splitedAsset.pop()
        const asset = Object.values(assetlist).filter((item) => tokenName.includes(item.value)).pop()

        const amount = Number(splitedAsset[0]).toFixed(0)
        const tokenImage = asset.img
        const tokenSymbol = asset.value


        return {
            amount: parseFloat(amount).toLocaleString('en-GB'),
            tokenName,
            tokenImage,
            tokenSymbol
        }

    }

    const getEndingTime = (endTimeInMilliseconds) => {
        const minutes = Math.floor(endTimeInMilliseconds / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days >= 1) {
            return humanizeDuration(endTimeInMilliseconds, { round: true, units: ["d"] })
        } else if (hours >= 1) {
            return humanizeDuration(endTimeInMilliseconds, { round: true, units: ["h"] })
        } else {
            return humanizeDuration(endTimeInMilliseconds, { round: true, units: ["m"] })
        }
    }

    const renderSellTypeAssets = () => {
        return Object.entries(assetlist).filter((key) => key[0] !== buyType).map((key) => {
            return (
                <div className='asset' key={key[1].name} onClick={() => handleListClose('sell', key[0])}>
                    <img src={key[1].img} alt={key[1].name} />
                    <p>{key[1].symbol}</p>
                </div>
            )
        })
    }

    const renderBuyTypeAssets = () => {
        return Object.entries(assetlist).filter((key) => key[0] !== sellType).map((key) => {
            return (
                <div className='asset' key={key[1].name} onClick={() => handleListClose('buy', key[0])}>
                    <img src={key[1].img} alt={key[1].name} />
                    <p>{key[1].symbol}</p>
                </div>
            )
        })
    }

    const closeTokenStake = () => {
        setEarnProgramType(null)
        setToken(null)
        setDuration(null)
        setStep(FIRST_STEP)
        setSelectedTokenQuantity("0")
    }

    const closeTacoStake = () => {
        setEarnProgramType(null)
    }

    const handleUnstakeTaco = async (pairCode) => {
        const res = await unstakeTaco(wax, pairCode)

        if (res && res?.error) {
            notify(res.error.toUpperCase(), false)
        } else {
            notify("SUCCESSFUL TRANSACTION!", true);
            fetchTacoInfo()
        }

    }

    const handleClaimTacoRewards = async (pairCode) => {
        const res = await claimTacoRewards(wax, pairCode)

        if (res && res?.error) {
            notify(res.error.toUpperCase(), false)
        } else {
            notify("SUCCESSFUL TRANSACTION!", true);
        }
    }

    const handleAddMoreTacoStake = (pairCode) => {
        setEarnProgramType("tacoReward")
        setDefaultTacoPair(pairCode)
        document.querySelector(".user-profile-nav").scrollIntoView()
    }

    useEffect(() => {
        const numValue = sellQuantity.length ? parseFloat(sellQuantity.split(',').join('')) : 0
        if (buyType === sellType) {
            setBuyQuantity(numValue)
            return;
        }
        const swapValue = getSwap(numValue, sellType, buyType)
        setBuyQuantity(swapValue)
    }, [sellQuantity, sellType, buyType])

    // getting the page data
    useEffect(() => {
        fetchEarnData()
        fetchBalances()
        fetchTotalEarnTokensStaked()
        fetchTacoInfo()
    }, [])

    // listen to selected token quantity changes
    // it helps to know when step 3 should be activated
    useEffect(() => {
        if (selectedTokenQuantity) {
            const plainNumber = selectedTokenQuantity.split(',').join('')
            const quantityNumber = Number(plainNumber)

            if (quantityNumber > 0 && step !== THIRD_STEP) {
                setStep(THIRD_STEP)
            } else if (quantityNumber <= 0 && step === THIRD_STEP) {
                setStep(SECOND_STEP)
            }
        }
    }, [selectedTokenQuantity])

    return (
        <div className='exchange-container'>
            <div className='exchange-row'>
                <div className='exchange-swap-column'>
                    <div className='swap-bpx'>
                        <div className='header'>
                            <p>SWAP TOKENS</p>
                        </div>
                        <div className='main'>
                            <div className='swap-wrapper'>
                                <p className='label'>SELL</p>
                                <div className='input-container'>
                                    <input type='text' value={sellQuantity} onChange={handleSellInput} />
                                    <div className='asset' onClick={() => handleListOpen('sell')}>
                                        <img src={assetlist[`${sellType}`].img} alt={assetlist[`${sellType}`].name} />
                                        <p>{assetlist[`${sellType}`].symbol}</p>
                                        <img src='/images/exchange/down-arrow-blue.png' alt='blue arrow' />
                                    </div>
                                    <div ref={sellList} className='assetList'>
                                        {
                                            renderSellTypeAssets()
                                        }
                                    </div>
                                </div>
                                <img className='mid-arrow' onClick={handleMidArrow} src='/images/exchange/down-arrow-white.png' alt='down arrow' />
                                <p className='label'>BUY</p>
                                <div className='input-container non-editable'>
                                    <input type='text' value={parseFloat(buyQuantity).toLocaleString('en-GB')} onChange={() => { }} />
                                    <div className='asset' onClick={() => handleListOpen('buy')}>
                                        <img src={assetlist[`${buyType}`].img} alt={assetlist[`${buyType}`].name} />
                                        <p>{assetlist[`${buyType}`].symbol}</p>
                                        <img src='/images/exchange/down-arrow-blue.png' alt='blue arrow' />
                                    </div>
                                    <div ref={buyList} className='assetList'>
                                        {
                                            renderBuyTypeAssets()
                                        }
                                    </div>
                                </div>
                                <div className='swap-button' onClick={handleSwap}>
                                    <p>SWAP {assetlist[`${sellType}`].name} TO {assetlist[`${buyType}`].name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* TODO: Javi told this section should be unpublished for now */}
                    {/* <div className='claim-bpx'>
                        <div className='header'>
                            <p>CLAIM ALL LUDIO {">"} CRYO-HOLO WALLET</p>
                        </div>
                        <div className='claiming-list'>
                            <div className='claim-item'>
                                <div className='claim-info'>
                                    <i className='icon' style={{ backgroundColor: "#0088D0" }} />
                                    Merryweather Heights
                                </div>
                                <div className='claim-tokens'>
                                    <span className='amount'>327.31</span>
                                    <img src='/images/token_alcor_ludio.png' alt='LUD' />
                                </div>
                            </div>
                            <div className='claim-item'>
                                <div className='claim-info'>
                                    <i className='icon' style={{ backgroundColor: "#FF7F00" }} />
                                    Chillin’ Ronnie
                                </div>
                                <div className='claim-tokens'>
                                    <span className='amount'>289.14</span>
                                    <img src='/images/token_alcor_ludio.png' alt='LUD' />
                                </div>
                            </div>
                            <div className='claim-item'>
                                <div className='claim-info'>
                                    <i className='icon' style={{ backgroundColor: "#C33CFF" }} />
                                    Marielito Management Co.
                                </div>
                                <div className='claim-tokens'>
                                    <span className='amount'>259.66</span>
                                    <img src='/images/token_alcor_ludio.png' alt='LUD' />
                                </div>
                            </div>
                            <div className='claim-item'>
                                <div className='claim-info'>
                                    <i className='icon' style={{ backgroundColor: "#C8ECF0" }} />
                                    MotherHustlers
                                </div>
                                <div className='claim-tokens'>
                                    <span className='amount'>197.29</span>
                                    <img src='/images/token_alcor_ludio.png' alt='LUD' />
                                </div>
                            </div>
                            <div className='claim-item'>
                                <div className='claim-info'>
                                    <i className='icon' style={{ backgroundColor: "#C8ECF0" }} />
                                    MotherHustlers
                                </div>
                                <div className='claim-tokens'>
                                    <span className='amount'>185.47</span>
                                    <img src='/images/token_alcor_ludio.png' alt='LUD' />
                                </div>
                            </div>
                        </div>
                        <div className='swap-button'>
                            <p>TRANSFER ALL LUDIO TO PIGGY</p>
                        </div>
                    </div> */}
                </div>
                <div className='exchange-earn-column'>
                    {!earnProgramType ? (
                        <div className='earn-box'>
                            <div className='header'>
                                <p>EARN PROGRAM</p>
                            </div>
                            <div className='earn-items'>
                                <a className='item' href="#" onClick={(event) => {
                                    event.preventDefault()
                                    setEarnProgramType("tokenStake")
                                }}>
                                    <div className='item-content'>
                                        <img src="/images/newHome/illust_chest.svg" alt="" />
                                        <div className='description'>
                                            <span className='title'>TOKEN’S STAKE</span>
                                            <p>
                                                Lock your tokens during periods of 7, 14 or 28 days to earn rewards. Unstake them immediately, anytime, at the only cost of losing the current period’s interests.
                                            </p>
                                        </div>
                                    </div>
                                    <div className='item-tokens'>
                                        <div className='token ludio'>
                                            {totalEarnStaked?.ludio}
                                            <img src="/images/token_alcor_ludio.png" alt="LUDIO" />
                                        </div>
                                        <div className='token carbz'>
                                            {totalEarnStaked?.carbz}
                                            <img src="/images/token_alcor_carbz.png" alt="CARBZ" />
                                        </div>
                                        <div className='token jigo'>
                                            {totalEarnStaked?.jigo}
                                            <img src="/images/token_alcor_jigo.png" alt="JIGOWATTS" />
                                        </div>
                                    </div>
                                </a>
                                <a className='item' href="#" onClick={(event) => {
                                    event.preventDefault()
                                    setEarnProgramType("tacoReward")
                                }}>
                                    <div className='item-content'>
                                        <img src="/images/newHome/illust_liquidity.svg" alt="" />
                                        <div className='description'>
                                            <span className='title'>TACO’S REWARDED LIQUIDITY POOLS</span>
                                            <p>
                                                Provide liquidity in Taco’s Ludio/WAX Liquidity Pool and earn daily rewards.
                                            </p>
                                        </div>
                                    </div>
                                    {!!tacoInfo ? (
                                        <div className='item-tokens grouped'>
                                            <div className='token token-rows ludio'>
                                                <p>
                                                    {parseFloat(tacoInfo?.LUDWAX?.LUDIO_pool.toFixed(0) || 0).toLocaleString("en-GB")}
                                                    <img src="/images/token_alcor_ludio.png" alt="LUDIO" />
                                                </p>
                                                <p className='wax'>
                                                    {parseFloat(tacoInfo?.LUDWAX?.WAX_pool.toFixed(0) || 0).toLocaleString("en-GB")}
                                                    <img src="/images/icon_wax_small.png" alt="WAX" />
                                                </p>

                                            </div>
                                            <div className='token token-rows carbz'>
                                                <p>
                                                    {parseFloat(tacoInfo?.CDCWAX?.CDC_pool.toFixed(0) || 0).toLocaleString("en-GB")}
                                                    <img src="/images/token_alcor_carbz.png" alt="CARBZ" />
                                                </p>
                                                <p className='wax'>
                                                    {parseFloat(tacoInfo?.CDCWAX?.WAX_pool.toFixed(0) || 0).toLocaleString("en-GB")}
                                                    <img src="/images/icon_wax_small.png" alt="WAX" />
                                                </p>
                                            </div>
                                            <div className='token token-rows jigo'>
                                                <p>
                                                    {parseFloat(tacoInfo?.CDJWAX?.CDJ_pool.toFixed(0) || 0).toLocaleString("en-GB")}
                                                    <img src="/images/token_alcor_jigo.png" alt="JIGOWATTS" />
                                                </p>
                                                <p className='wax'>
                                                    {parseFloat(tacoInfo?.CDJWAX?.WAX_pool.toFixed(0) || 0).toLocaleString("en-GB")}
                                                    <img src="/images/icon_wax_small.png" alt="WAX" />
                                                </p>
                                            </div>
                                        </div>
                                    ) : null}
                                </a>
                            </div>
                        </div>
                    ) : null}
                    {earnProgramType === "tokenStake" ? (
                        <div className='earn-box'>
                            <div className='header'>
                                <p>TOKEN’S STAKE</p>
                                <button className='close' onClick={closeTokenStake}>
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path><path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg>
                                </button>
                            </div>
                            <div className='step-boxes'>
                                <EarchProgramTokens isOpen={isFirstStepOpen} isCurrentStep={step === FIRST_STEP} onTokenSelect={handleSelectingToken} token={token} />
                                <EarchProgramQuantity isOpen={isSecondStepOpen} isCurrentStep={step === SECOND_STEP} setQuantity={handleSelectedTokenInput} quantity={selectedTokenQuantity} token={token} onMaxButtonClick={handleMaxButtonClick} assetlist={assetlist} />
                                <EarchProgramDuration isOpen={isThirdStepOpen} isCurrentStep={step === THIRD_STEP} duration={duration} setDuration={setDuration} token={token} quantity={selectedTokenQuantity} assetlist={assetlist} onDeposit={handlingStake} />
                            </div>
                        </div>
                    ) : null}
                    {earnProgramType === "tacoReward" ? (
                        <TacoProgram wax={wax} notify={notify} defaultTacoPair={defaultTacoPair} closeTacoStake={closeTacoStake} balances={balances} refetchTacoInfo={fetchTacoInfo} />
                    ) : null}
                    <div className='holdings-box'>
                        <div className='header'>
                            <p>YOUR ACCRUING HOLDINGS</p>
                        </div>
                        <div className='holdings-list'>
                            {holdings && holdings.length && holdings.map((holding, index) => {
                                const { tokenName, tokenSymbol, tokenImage, amount } = getAssetsAmoutAndImage(holding.amount)

                                return (
                                    <div className='holding-item' key={index}>
                                        <div className='holding-table'>
                                            <div className='amount'>
                                                <label>Amount</label>
                                                <span>{amount} <img src={tokenImage} alt={tokenName} /></span>
                                            </div>
                                            <div className='apy'>
                                                <label>APY</label>
                                                <span>{holding.APY}%</span>
                                            </div>
                                            <div className='auto-renew'>
                                                <label>Auto-Renew</label>
                                                <span>{holding.auto_renew ? "Yes" : "No"}</span>
                                            </div>
                                            <div className='interest'>
                                                <label>Estimated Interest</label>
                                                <span>{holding.cumulative_interest}</span>
                                            </div>
                                            <div className='end-time'>
                                                <label>Ends in</label>
                                                <span>{getEndingTime(holding.ends_in)}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handlingUnStake(holding.id)} className={holding.is_claimable ? 'claim' : 'cancel'}>{holding.is_claimable ? 'CLAIM' : 'CANCEL'}</button>
                                    </div>
                                )
                            })}

                            {hasTacoLudioHoldings ? (
                                <div className='holding-item'>
                                    <div className='holding-table taco-holdings'>
                                        <div className='amount'>
                                            <label>Total Staked</label>
                                            <div className='taco-pairs'>
                                                <span className='ludio'>{parseFloat(tacoInfo.LUDWAX.player_holdings.LUDIO_qty).toLocaleString('en-GB')} <img src="/images/token_alcor_ludio.png" alt="LUDIO" /></span>
                                                <span className='wax'>{parseFloat(tacoInfo.LUDWAX.player_holdings.WAX_qty).toLocaleString('en-GB')} <img src="/images/icon_wax_small.png" alt="WAX" /></span>
                                            </div>
                                        </div>
                                        <div className='apy'>
                                            <label>Pool Share</label>
                                            <span>{parseFloat(tacoInfo.LUDWAX.player_holdings.pool_ownership).toFixed(2)}%</span>
                                        </div>
                                        <div className='auto-renew'>
                                            <label>Daily Rewards</label>
                                            <span className='ludio'>{parseFloat(tacoInfo.LUDWAX.player_holdings.daily_reward).toLocaleString("en-GB")} <img src="/images/token_alcor_ludio.png" alt="LUDIO" /></span>
                                        </div>
                                        {tacoInfo.LUDWAX.player_holdings?.player_claims ? (
                                            <div className='interest'>
                                                <label>Claimable</label>
                                                <span className='ludio'>{parseFloat(tacoInfo.LUDWAX.player_holdings.player_claims.quantity.split(" ")[0]).toLocaleString("en-GB")} <img src="/images/token_alcor_ludio.png" alt="LUDIO" /></span>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className='actions-wrapper'>
                                        {tacoInfo.LUDWAX.player_holdings?.player_claims ? (
                                            <button className="claim" onClick={() => handleClaimTacoRewards("LUDWAX")}>CLAIM</button>
                                        ) : null}
                                        <button className="add" onClick={() => handleAddMoreTacoStake("LUDWAX")}>+ ADD</button>
                                        <button className="cancel" onClick={() => handleUnstakeTaco("LUDWAX")}>REMOVE</button>
                                    </div>
                                </div>
                            ) : null}

                            {hastTacoJigoHoldings ? (
                                <div className='holding-item'>
                                    <div className='holding-table taco-holdings'>
                                        <div className='amount'>
                                            <label>Total Staked</label>
                                            <div className='taco-pairs'>
                                                <span className='jigo'>{parseFloat(tacoInfo.CDJWAX.player_holdings.CDJ_qty).toLocaleString('en-GB')} <img src="/images/token_alcor_jigo.png" alt="JIGO" /></span>
                                                <span className='wax'>{parseFloat(tacoInfo.CDJWAX.player_holdings.WAX_qty).toLocaleString('en-GB')} <img src="/images/icon_wax_small.png" alt="WAX" /></span>
                                            </div>
                                        </div>
                                        <div className='apy'>
                                            <label>Pool Share</label>
                                            <span>{parseFloat(tacoInfo.CDJWAX.player_holdings.pool_ownership).toFixed(2)}%</span>
                                        </div>
                                        <div className='auto-renew'>
                                            <label>Daily Rewards</label>
                                            <span className='jigo'>{parseFloat(tacoInfo.CDJWAX.player_holdings.daily_reward).toLocaleString("en-GB")} <img src="/images/token_alcor_jigo.png" alt="JIGO" /></span>
                                        </div>
                                        {tacoInfo.CDJWAX.player_holdings?.player_claims ? (
                                            <div className='interest'>
                                                <label>Claimable</label>
                                                <span className='jigo'>{parseFloat(tacoInfo.CDJWAX.player_holdings.player_claims.quantity.split(" ")[0]).toLocaleString("en-GB")} <img src="/images/token_alcor_jigo.png" alt="JIGO" /></span>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className='actions-wrapper'>
                                        {tacoInfo.CDJWAX.player_holdings?.player_claims ? (
                                            <button className="claim" onClick={() => handleClaimTacoRewards("CDJWAX")}>CLAIM</button>
                                        ) : null}
                                        <button className="add" onClick={() => handleAddMoreTacoStake("CDJWAX")}>+ ADD</button>
                                        <button className="cancel" onClick={() => handleUnstakeTaco("CDJWAX")}>REMOVE</button>
                                    </div>
                                </div>
                            ) : null}

                            {tacoHasCarbzHoldings ? (
                                <div className='holding-item'>
                                    <div className='holding-table taco-holdings'>
                                        <div className='amount'>
                                            <label>Total Staked</label>
                                            <div className='taco-pairs'>
                                                <span className='carbz'>{parseFloat(tacoInfo.CDCWAX.player_holdings.CDC_qty).toLocaleString('en-GB')} <img src="/images/token_alcor_carbz.png" alt="CARBZ" /></span>
                                                <span className='wax'>{parseFloat(tacoInfo.CDCWAX.player_holdings.WAX_qty).toLocaleString('en-GB')} <img src="/images/icon_wax_small.png" alt="WAX" /></span>
                                            </div>
                                        </div>
                                        <div className='apy'>
                                            <label>Pool Share</label>
                                            <span>{parseFloat(tacoInfo.CDCWAX.player_holdings.pool_ownership).toFixed(2)}%</span>
                                        </div>
                                        <div className='auto-renew'>
                                            <label>Daily Rewards</label>
                                            <span className='carbz'>{parseFloat(tacoInfo.CDCWAX.player_holdings.daily_reward).toLocaleString("en-GB")} <img src="/images/token_alcor_carbz.png" alt="CARBZ" /></span>
                                        </div>
                                        {tacoInfo.CDCWAX.player_holdings?.player_claims ? (
                                            <div className='interest'>
                                                <label>Claimable</label>
                                                <span className='carbz'>{parseFloat(tacoInfo.CDCWAX.player_holdings.player_claims.quantity.split(" ")[0]).toLocaleString("en-GB")} <img src="/images/token_alcor_carbz.png" alt="CARBZ" /></span>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className='actions-wrapper'>
                                        {tacoInfo.CDCWAX.player_holdings?.player_claims ? (
                                            <button className="claim" onClick={() => handleClaimTacoRewards("CDCWAX")}>CLAIM</button>
                                        ) : null}
                                        <button className="add" onClick={() => handleAddMoreTacoStake("CDCWAX")}>+ ADD</button>
                                        <button className="cancel" onClick={() => handleUnstakeTaco("CDCWAX")}>REMOVE</button>
                                    </div>
                                </div>
                            ) : null}

                            {!holdings && !hasTacoLudioHoldings && !hastTacoJigoHoldings && !tacoHasCarbzHoldings ? (
                                <div className='holding-item'>
                                    <div className='holding-table'>
                                        <div className='amount'>
                                            <label>Amount</label>
                                            <span>-</span>
                                        </div>
                                        <div className='apy'>
                                            <label>APY</label>
                                            <span>-</span>
                                        </div>
                                        <div className='auto-renew'>
                                            <label>Auto-Renew</label>
                                            <span>-</span>
                                        </div>
                                        <div className='interest'>
                                            <label>Estimated Interest</label>
                                            <span>-</span>
                                        </div>
                                        <div className='end-time'>
                                            <label>Ends in</label>
                                            <span>-</span>
                                        </div>
                                    </div>
                                    <button className='claim disabled'>CLAIM</button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Exchange