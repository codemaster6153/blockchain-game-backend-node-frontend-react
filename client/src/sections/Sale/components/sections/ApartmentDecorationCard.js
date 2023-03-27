import React from "react"

import cn from "classnames"
import { useDispatch } from 'react-redux';

const ApartmentDecorationCard = ({ data, hasCraft, hasBuySection = true, infoWrapperClassName = "",
    className = "", titleClassName = "", wax }) => {

    const dispatch = useDispatch();


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

    const onClickCraft = async (quantities, template_id) => {
        try {
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
                    quantities: quantities,
                    memo: "buy_item:" + template_id
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
        }
    }

    return (
        <div className={cn("buy-citizen-card card-box-new-2 apartment-decor-card", className)}>
            <p className={cn('title', titleClassName)}>{data?.name || data?.item_name}</p>

            <div className={"image-container"}>
                {data.video ?
                    <video className="img-btm" alt="fadedcard" autoPlay muted loop>
                        <source src={data.video} type="video/mp4" />
                        <source src={data.video} type="video/ogg" />
                    </video> :
                    <img src={data?.image || data?.img} className="img-btm" alt={data?.name || data?.item_name} />}
            </div>

            <div className={cn('info-wrapper', infoWrapperClassName)}>
                {
                    hasCraft ?
                        <div className='craft-info'>
                            <div className="asset-button">
                                <img src="/images/stake_btn/btn_craft.png" alt="stake" onClick={() => onClickCraft(data?.price, data?.template_id)} />
                            </div>
                            <div className="values">
                                <div className="value">
                                    <p>{parseInt(data?.price?.[0])}</p>
                                    <img src="/images/icon_credits_40px.png" alt="drop" />
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <div className='info-line'>
                                <p className='info-line-label'>TYPE:</p>
                                <p className='info-line-value'>{data?.type}</p>
                            </div>
                            <div className='info-line'>
                                <p className='info-line-label'>MINTS:</p>
                                <p className='info-line-value'>{data?.mints}</p>
                            </div>
                        </div>
                }

                {hasBuySection &&
                    <>
                        <hr />
                        <div className='buy-wrapper'>
                            <p>BUY</p>
                            <div className='buttons-container'>
                                <a href={'https://wax.atomichub.io/market?collection_name=clashdomenft&order=asc&sort=price&symbol=WAX&search=' + (data?.name || data?.item_name).split(" ").join("+")} target='_blank' rel="noopener">
                                    <img src='/images/shop/btn_buy_atomic.svg' alt='buy atomic' />
                                </a>
                                <a href={'https://nfthive.io/market?collection=clashdomenft&order_by=offer_asc&search_type=sales&offer_type=sales&term=' + (data?.name || data?.item_name).split(" ").join("+")} target='_blank' rel="noopener">
                                    <img src='/images/shop/btn_buy_nefty.svg' alt='buy atomic' />
                                </a>
                                <a href={'https://neftyblocks.com/marketplace/listing?page=1&collection_name=clashdomenft&sort=price&order=asc&match=' + (data?.name || data?.item_name).split(" ").join("+")} target='_blank' rel="noopener">
                                    <img src='/images/shop/btn_buy_nfthive.svg' alt='buy atomic' />
                                </a>
                            </div>
                        </div>
                    </>}
            </div>
        </div>
    )
}
export default ApartmentDecorationCard