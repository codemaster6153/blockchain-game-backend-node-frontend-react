import React, { useState, useMemo, useCallback, useEffect } from "react";
import { getPairQty, stakeTaco } from '../../../Finance/Exchange';

const tokens = {
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

function TacoProgram({ wax, notify, defaultTacoPair, closeTacoStake, balances, refetchTacoInfo }) {
    const [selectedPair, setSelectedPair] = useState(defaultTacoPair) // LUDWAX, CDCWAX, CDJWAX

    // calculate the token name everytime the pairs are changing
    const selectedPairTokenName = useMemo(() => {
        switch (selectedPair) {
            case "LUDWAX":
                return "LUD"
            case "CDCWAX":
                return "CDC"
            case "CDJWAX":
                return "CDJ"
            default:
                return null
        }
    }, [selectedPair])

    const [mainToken, setMainToken] = useState(selectedPairTokenName) // LUD, CDC, CDJ, WAX
    const [mainTokenAmount, setMainTokenAmount] = useState(0)
    const [calculatedPairTokenQuantity, setCalculatedPairTokenQuantity] = useState(0) // it will be calculated everytime the main token amount changes
    const [poolShare, setPoolShare] = useState(0)
    const [tacoPariTokensRates, setTacoPariTokensRates] = useState()
    
    const numValueOfTacoMainTokenAmount = mainTokenAmount ? mainTokenAmount.split(',').join('') : null
    const isTacoAmountOverBalanced = balances && balances[selectedPairTokenName] && numValueOfTacoMainTokenAmount && numValueOfTacoMainTokenAmount > balances[selectedPairTokenName]
    const nonMainToken = mainToken === "WAX" ? selectedPairTokenName : "WAX"


    const setMaxAmountMainToken = () => {
        const maxBalance = balances[mainToken];

        setMainTokenAmount(
            parseFloat(Number(maxBalance).toFixed(0)).toLocaleString("en-GB")
        );
    };

    const getTokenBalances = (tokenName) => {
        if (!balances) return null;

        const selectedTokenBalance = balances[tokenName];
        if (!selectedTokenBalance) return null;

        return parseFloat(selectedTokenBalance).toLocaleString("en-GB");
    };

    const onMainTokenChange = (event) => {
        const numValue = event.target.value.split(',').join('')

        if (!isNaN(numValue) && event.target.value.length) {
            setMainTokenAmount(parseFloat(numValue).toLocaleString('en-GB'))
        } else {
            setMainTokenAmount(0)
        }
    }

    const onExchangeTokensClick = (event) => {
        event.preventDefault()

        setMainToken(nonMainToken)
    }

    const fetchTacoPairRates = async () => {
        const tokenName = tokens[mainToken].symbol
        const numValue = mainTokenAmount != 0 ? mainTokenAmount.split(',').join('') : 0;

        const tacoPairQty = await getPairQty(wax, tokenName, numValue, selectedPair)

        setTacoPariTokensRates(state => ({
            ...state,
            ...tacoPairQty.rates
        }))

        setPoolShare(tacoPairQty.percent_pool)

        setCalculatedPairTokenQuantity(tacoPairQty.quantity)
    }

    const handleStakeTaco = async () => {
        const tacoMainTokenAmount = mainTokenAmount.split(',').join('')
        const WAXquantity = parseFloat(mainToken === "WAX" ? tacoMainTokenAmount : calculatedPairTokenQuantity)
        const pariQuantity = parseFloat(mainToken === "WAX" ? calculatedPairTokenQuantity : tacoMainTokenAmount)

        const res = await stakeTaco(wax, WAXquantity, pariQuantity, selectedPair);

        if (res && res?.error) {
            notify(res.error.toUpperCase(), false)
        } else {
            notify("SUCCESSFUL TRANSACTION!", true);
        }

        refetchTacoInfo()
    }

    const openTokensDropdown = () => {
        document.querySelector(".tacos-container .assetList").style.opacity = 1
        document.querySelector(".tacos-container .assetList").style.zIndex = 2
    }

    const closeTokensDropdown = (selectedToken) => {
        document.querySelector(".tacos-container .assetList").style.opacity = 0
        document.querySelector(".tacos-container .assetList").style.zIndex = -2

        const pairName = `${selectedToken}WAX`
        setSelectedPair(pairName)
        setMainToken(selectedToken)
    }

    const renderTokensDropdown = () => {
        return Object.entries(tokens).filter((key) => key[0] !== nonMainToken).map((key) => {
            return (
                <div className='asset' key={key[1].name} onClick={() => closeTokensDropdown(key[0])}>
                    <img src={key[1].img} alt={key[1].name} />
                    <p>{key[1].symbol}</p>
                </div>
            )
        })
    }

    const renderRatesBasedOnSelectedPair = useCallback(() => {
        if (selectedPair === "LUDWAX") {
            return (
                <>
                    <p>
                        LUDIO/WAX rate
                        <span>{tacoPariTokensRates?.LUDIOtoWAX_rate.toFixed(2)}</span>
                    </p>
                    <p>
                        WAX/LUDIO rate
                        <span>{tacoPariTokensRates?.WAXtoLUDIO_rate.toFixed(2)}</span>
                    </p>
                </>
            )
        } else if (selectedPair === "CDCWAX") {
            return (
                <>
                    <p>
                        CARBZ/WAX rate
                        <span>{tacoPariTokensRates?.CDCtoWAX_rate.toFixed(2)}</span>
                    </p>
                    <p>
                        WAX/CARBZ rate
                        <span>{tacoPariTokensRates?.WAXtoCDC_rate.toFixed(2)}</span>
                    </p>
                </>
            )
        } else if (selectedPair === "CDJWAX") {
            return (
                <>
                    <p>
                        JIGO/WAX rate
                        <span>{tacoPariTokensRates?.CDJtoWAX_rate.toFixed(2)}</span>
                    </p>
                    <p>
                        WAX/JIGO rate
                        <span>{tacoPariTokensRates?.WAXtoCDJ_rate.toFixed(2)}</span>
                    </p>
                </>
            )
        }
    }, [tacoPariTokensRates])

    useEffect(() => {
        fetchTacoPairRates()
    }, [mainToken, mainTokenAmount, selectedPair])

    return (
        <div className="earn-box">
            <div className="header">
                <p>TACO’S REWARDED LIQUIDITY POOLS</p>
                <button className="close" onClick={closeTacoStake}>
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 1024 1024"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path>
                        <path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                    </svg>
                </button>
            </div>
            <div className="step-boxes">
                <div className="single-step-box tacos">
                    <div className="tacos-container">
                        <div className="input-token-container">
                            <div className="token-container">
                                <span>Token 1</span>
                                <span
                                    className="amount"
                                    onClick={setMaxAmountMainToken}
                                    style={{ cursor: "pointer" }}
                                >
                                    {getTokenBalances(mainToken)}{" "}
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        stroke-width="0"
                                        viewBox="0 0 512 512"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M461.2 128H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h384c8.84 0 16-7.16 16-16 0-26.51-21.49-48-48-48H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h397.2c28.02 0 50.8-21.53 50.8-48V176c0-26.47-22.78-48-50.8-48zM416 336c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"></path>
                                    </svg>
                                </span>
                            </div>
                            <div
                                className={`input-container ${isTacoAmountOverBalanced ? "red" : ""}`}
                            >
                                <input
                                    type="text"
                                    onChange={onMainTokenChange}
                                    value={mainTokenAmount}
                                />
                                {mainToken !== "WAX" ? (
                                    <>
                                        <div className="asset" onClick={openTokensDropdown}>
                                            <img src={tokens[mainToken].img} alt={tokens[mainToken].symbol} />
                                            <p>{tokens[mainToken].symbol}</p>
                                            <img src='/images/exchange/down-arrow-blue.png' alt='blue arrow' />
                                        </div>
                                        <div className='assetList'>
                                            {renderTokensDropdown()}
                                        </div>
                                    </>
                                ) : (
                                    <div className="asset">
                                        <img src={tokens[mainToken].img} alt={tokens[mainToken].symbol} />
                                        <p>{tokens[mainToken].symbol}</p>
                                    </div>
                                )}

                            </div>
                        </div>
                        <div className="inputs-divider">
                            <a href="#" onClick={onExchangeTokensClick}>
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    version="1.1"
                                    viewBox="0 0 17 17"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g></g>
                                    <path d="M6 15.043v-7.043h-1v7.043l-3.646-3.646-0.707 0.707 4.853 4.853 4.854-4.854-0.707-0.707-3.647 3.647zM5.488 15.531h0.023l-0.011 0.012-0.012-0.012zM15.646 5.604l-3.646-3.647v7.096h-1v-7.096l-3.646 3.647-0.708-0.708 4.854-4.853 4.854 4.854-0.708 0.707z"></path>
                                </svg>
                            </a>
                        </div>
                        <div className="input-token-container">
                            <div className="token-container">
                                <span>Token 2</span>
                                <span className="amount">
                                    {getTokenBalances(nonMainToken)}{" "}
                                    <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        stroke-width="0"
                                        viewBox="0 0 512 512"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M461.2 128H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h384c8.84 0 16-7.16 16-16 0-26.51-21.49-48-48-48H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h397.2c28.02 0 50.8-21.53 50.8-48V176c0-26.47-22.78-48-50.8-48zM416 336c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"></path>
                                    </svg>
                                </span>
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    onChange={() => { }}
                                    value={parseFloat(
                                        calculatedPairTokenQuantity.toFixed(2)
                                    ).toLocaleString("en-GB")}
                                    disabled
                                />
                                <div className="asset">
                                    <img src={tokens[nonMainToken].img} alt={tokens[nonMainToken].symbol} />
                                    <p>{tokens[nonMainToken].symbol}</p>
                                </div>
                            </div>
                        </div>
                        <div className="rates-container">
                            {renderRatesBasedOnSelectedPair()}
                            <p>
                                Pool Share
                                <span>{poolShare.toFixed(2)}%</span>
                            </p>
                        </div>
                        <div className="swap-button" onClick={handleStakeTaco}>
                            <p>+ ADD LIQUIDITY</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TacoProgram;
