import React, { useRef, useState, useEffect } from 'react'
import cn from 'classnames'
import './craftCard.css'
import { externalLinks } from './externalLinks';
import { useDispatch } from 'react-redux';

function WalletCraftCard({ data, wax, crafting, template_id, showBuySection = true, infoWrapperClassName = "", titleClassName = "", className = "", frontWrapper }) {
    const [rotate, setRotate] = useState(false);
    const [loading, setLoading] = useState(false)
    const cardRef = useRef()

    const dispatch = useDispatch()

    const [bgImg, setBgImg] = useState("/images/cd_back.png");

    for (let i = 0; i < crafting.length; i++) {
        crafting[i] = crafting[i].replace("CREDITS", "LUDIO");
        if (!crafting[i].includes("CDCARBZ")) {
            crafting[i] = crafting[i].replace("CARBZ", "CDCARBZ");
        }
        if (!crafting[i].includes("CDJIGO")) {
            crafting[i] = crafting[i].replace("JIGO", "CDJIGO");
        }
    }

    const craft = async () => {
        if (loading) {
            return
        }
        try {
            setLoading(true)
            let result;

            let actions = [{
                account: "clashdometkn",
                name: "transfers",
                authorization: [{
                    actor: wax.userAccount,
                    permission: "active",
                }],
                data: {
                    from: wax.userAccount,
                    to: "clashdomewld",
                    quantities: crafting,
                    memo: "craft_wallet:" + template_id
                },
            }];

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
            }
        } catch (e) {
            notify(e.message.toUpperCase(), false);
            console.log(e.message);
            setLoading(false)
        }
        setLoading(false)
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

    const loadBackground = () => {
        const src = `https://ipfs.io/ipfs/${data.img}`;

        const imageLoader = new Image();
        imageLoader.src = src;

        imageLoader.onload = () => {
            setBgImg(src);
        };
    };

    function numFormatter(num) {
        if (num > 999 && num < 1000000) {
            return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
        } else if (num > 1000000) {
            return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
        } else if (num < 1000) {
            return num; // if value < 1000, nothing to do
        }
    }

    useEffect(() => {
        loadBackground()
    }, [])

    return (
        <div ref={cardRef} style={rotate ? { transform: 'rotateY(180deg)' } : {}} className={cn('shop-craft-card-wrapper', className)}>
            <div className={cn('front', frontWrapper)}>
                <p className={cn('title', titleClassName)}>{data.wallet_name}</p>
                <div className={"image-container"}>
                    <img src={bgImg} className="img-btm" alt="fadedcard" />
                    <img onClick={() => { setRotate(!rotate) }} src="/images/infoCircle.svg" alt="info" className='abs-info' />
                </div>
                <div className={cn('info-wrapper', infoWrapperClassName)}>
                    <div className='craft-info'>
                        <div class="asset-button" onClick={craft}>
                            <img src="/images/stake_btn/btn_craft.png" alt="stake" />
                            <img src="/images/stake_btn/btn_craft_over.png" alt="stake" />
                        </div>
                        <div class="values">
                            <div class="value">
                                <p>{numFormatter(parseFloat(data.craft[0].split(' ')[0]))}</p>
                                <img src="/images/credits.png" alt="drop" />
                            </div>
                            <div class="value">
                                <p>{numFormatter(parseFloat(data.craft[1].split(' ')[0]))}</p>
                                <img src="/images/jigowatts.png" alt="drop" />
                            </div>
                        </div>
                    </div>
                    {showBuySection && <>
                        <hr />
                        <div className='buy-wrapper'>
                            <p>BUY</p>
                            <div className='buttons-container'>
                                <a href={externalLinks[`${data.wallet_name.toLowerCase()}`].atomic} target='_blank' rel="noopener">
                                    <img src='/images/shop/btn_buy_atomic.svg' alt='buy atomic' />
                                </a>
                                <a href={externalLinks[`${data.wallet_name.toLowerCase()}`].nefty} target='_blank' rel="noopener">
                                    <img src='/images/shop/btn_buy_nefty.svg' alt='buy atomic' />
                                </a>
                                <a href={externalLinks[`${data.wallet_name.toLowerCase()}`].nftHive} target='_blank' rel="noopener">
                                    <img src='/images/shop/btn_buy_nfthive.svg' alt='buy atomic' />
                                </a>
                            </div>
                        </div></>}
                </div>
            </div>
            <div className='back'>
                <img src="/images/btn_close.svg" onClick={() => { setRotate(!rotate) }} />
                <div className='back-wrapper'>
                    <div className="entry">
                        <div className="label">
                            <p>STORING CAPACITY:</p>
                        </div>
                        <div className="values">
                            <div className="value">
                                <p>{numFormatter(parseFloat(data.extra_capacity) + 120)}</p>
                                <img src="/images/credits.png" alt="drop" />
                            </div>
                        </div>
                    </div>
                    <div className="entry">
                        <div className="label">
                            <p>BATTERY:</p>
                        </div>
                        <div className="values">
                            <div className="value">
                                <p>120</p>
                            </div>
                        </div>
                    </div>
                    <div className="entry">
                        <div className="label">
                            <p>BATTERY DECREASE PER CLAIM:</p>
                        </div>
                        <div className="values">
                            <div className="value">
                                <p>{data.battery_consumed}</p>
                            </div>
                        </div>
                    </div>
                    <div className="entry">
                        <div className="label">
                            <p>STAMINA DECREASE PER CLAIM</p>
                        </div>
                        <div className="values">
                            <div className="value">
                                <p>{data.stamina_consumed}</p>
                            </div>
                        </div>
                    </div>
                    <div className="entry">
                        <div className="label">
                            <p>*ALLOWS OVERFILLING</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletCraftCard