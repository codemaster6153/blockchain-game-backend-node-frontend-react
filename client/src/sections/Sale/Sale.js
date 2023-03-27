import React, { useEffect, useRef, useState, useMemo } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { JsonRpc } from 'eosjs'
import moment from 'moment';
import cn from 'classnames'

import AssetShop from './components/AssetShop';
import { ShopProvider } from './context/shop-context';
import ApartmentDecorationCard from './components/sections/ApartmentDecorationCard';
import initConfig from '../../initConfig';
import { data } from "./components/sections/HotCraftsData"

import './components/sections/index.css'
import './sale.css'
import CraftCard from './components/sections/CraftCard';
import WalletCraftCard from './components/sections/WalletCraftCard';
import PackCraftCard from './components/sections/PackCraftCart';

function Sale({ wax }) {

    const [shopData, setShopData] = useState()
    const [fullShopData, setFullShopData] = useState([])
    const [eventEnds, setEventEnds] = useState('')
    const [loading, setLoading] = useState(false)
    const [canBuy, setCanBuy] = useState(false)
    const [saleText, setSaleText] = useState('')
    const dispatch = useDispatch()

    const currencyIcon = {
        "LUDIO": '/images/icon_ludio_small.png',
        "CDCARBZ": '/images/icon_cdcarbz.png',
        "CDJIGO": '/images/icon_cdjigo.png',
        "WAX": '/images/token-small.png',
    }

    // const buyAsset = async () => {

    //     if (loading || !canBuy) {
    //         return;
    //     }
    //     try {
    //         setLoading(true)
    //         let result

    //         let actions = [{
    //             account: "clashdometkn",
    //             name: "transfers",
    //             authorization: [{
    //                 actor: wax.userAccount,
    //                 permission: "active",
    //             }],
    //             data: {
    //                 from: wax.userAccount,
    //                 to: "clashdomewld",
    //                 quantities: shopData.price,
    //                 memo: "buy_item:" + shopData.template_id
    //             },
    //         }];

    //         if (wax.type === "wcw") {
    //             result = await wax.api.transact({
    //                 actions: actions
    //             }, {
    //                 blocksBehind: 3,
    //                 expireSeconds: 30,
    //             });
    //         } else if (wax.type === "anchor") {
    //             result = await wax.signTransaction({
    //                 actions: actions
    //             }, {
    //                 blocksBehind: 3,
    //                 expireSeconds: 30,
    //             });
    //         }

    //         if (result) {
    //             notify("SUCCESSFUL TRANSACTION!", true);

    //             setTimeout(() => {
    //                 setLoading(false)
    //                 getShopData();
    //             }, 1000)
    //         }
    //     } catch (e) {
    //         notify(e.message.toUpperCase(), false);
    //         console.log(e.message);
    //         setLoading(false)
    //     }

    // }

    // const sleep = async (ms) => {
    //     return new Promise(resolve => setTimeout(resolve, ms))
    // }

    // const notify = async (text, success) => {
    //     dispatch({
    //         type: "SET_NOTIFICATION", payload: {
    //             text: text,
    //             success: success,
    //         }
    //     })

    //     await sleep(4800)

    //     dispatch({
    //         type: "REMOVE_NOTIFICATION", payload: {
    //             text: text,
    //             success: success,
    //         }
    //     })
    // }

    const getShopData = async () => {

        const rpc = new JsonRpc(initConfig.waxUrl, { fetch });

        let data = await rpc.get_table_rows({
            json: true,
            code: "clashdomewld",
            scope: "clashdomewld",
            table: "shop",
            limit: 500,
            index_position: 1,
            key_type: "i64",
            lower_bound: null,
            upper_bound: null,
            reverse: false,
            show_payer: false,
        });

        console.log("the data from the shop is :", data)
        let dataAssigned = false

        if (data.rows) {

            setFullShopData(data.rows.filter(row => row.timestamp_start === 0));

            // for (let i = 0; i < data.rows.length; i++) {
            //     let item = data.rows[i];
            //     if (moment(item.timestamp_start * 1000).utc().isBefore(moment().utc()) && moment(item.timestamp_end * 1000).utc().isAfter(moment().utc())) {
            //         setShopData(item);
            //         dataAssigned = true
            //         setSaleText('SALE ENDS IN')
            //     }
            // }
            // if (!dataAssigned) {
            //     let tempShopData = data.rows[data.rows.length - 1]
            //     setShopData(data.rows[data.rows.length - 1])
            //     if (!moment(tempShopData.timestamp_start * 1000).utc().isBefore(moment().utc())) {
            //         setSaleText("SALE STARTS IN")
            //     }
            //     if (!moment(tempShopData.timestamp_end * 1000).utc().isAfter(moment().utc())) {
            //         setSaleText("SALE ENDED")
            //     }
            // }
        }
    }

    // const timer = () => {

    //     if (!shopData || !shopData.timestamp_end) {
    //         return
    //     }

    //     const today = moment().utc()

    //     let endDate = !moment(shopData.timestamp_start * 1000).utc().isBefore(today) ? moment(shopData.timestamp_start * 1000).utc() : moment(shopData.timestamp_end * 1000).utc();

    //     // let endDate = moment().utc().endOf('day');

    //     let days = endDate.diff(today, 'days')
    //     let hours = endDate.diff(today, 'hours') % 24
    //     let minutes = endDate.diff(today, 'minutes') % 60
    //     let seconds = endDate.diff(today, 'seconds') % 60

    //     if (endDate.diff(today, 'seconds') === 0) {
    //         setTimeout(() => {
    //             getShopData();
    //         }, 1000)
    //     }

    //     let timeStr = `${Math.abs(days)}d ${Math.abs(hours)}h ${Math.abs(minutes)}m ${Math.abs(seconds)}s`
    //     setEventEnds(timeStr)
    // }

    // const handleCanBuy = async () => {
    //     if (!moment(shopData.timestamp_end * 1000).utc().isAfter(moment().utc())) {
    //         setCanBuy(false)
    //         return;
    //     }

    //     if (!moment(shopData.timestamp_start * 1000).utc().isBefore(moment().utc())) {
    //         setCanBuy(false)
    //         return;
    //     }

    //     if (wax.rpc && wax.userAccount) {
    //         let userData = await wax.rpc.get_table_rows({
    //             json: true,
    //             code: "clashdomewld",
    //             scope: wax.userAccount,
    //             table: "shopclaims",
    //             limit: 1,
    //             index_position: 1,
    //             key_type: "i64",
    //             lower_bound: shopData.template_id,
    //             upper_bound: shopData.template_id,
    //             reverse: false,
    //             show_payer: false,
    //         });
    //         console.log("the user data is :", userData)
    //         if (shopData.account_limit === -1) {
    //             // user can buy
    //             setCanBuy(true)
    //         } else if (!userData.rows.length) {
    //             // user can buy
    //             setCanBuy(true)
    //         } else {
    //             if (userData.rows[0].counter < shopData.account_limit) {
    //                 // user can buy
    //                 setCanBuy(true)
    //             } else {
    //                 // USER CAN'T BUY - DISABLE BUY BUTTON
    //                 setCanBuy(false)
    //             }

    //         }
    //     } else {
    //         setCanBuy(false)
    //     }
    // }

    // useEffect(() => {
    //     let id = setInterval(timer, 1000)
    //     if (shopData && shopData.template_id) {
    //         handleCanBuy()
    //     }
    //     return () => {
    //         clearInterval(id)
    //     }
    // }, [shopData])

    useEffect(() => {
        getShopData()
    }, [wax])

    // const hotCraftAssets = useMemo(() =>
    //     data?.map(data => {
    //         const newData = { ...data };

    //         if (newData?.img) {
    //             newData.img = 'https://ipfs.io/ipfs/' + newData?.img
    //         }
    //         else if (newData?.video) {
    //             newData.video = 'https://ipfs.io/ipfs/' + newData?.video
    //         }

    //         return newData
    //     })
    //     , [data])

    const renderHotCraft = (item) => {
        switch (item?.schema_name) {
            case "tool":
                return <CraftCard
                    data={item}
                    key={item?.tool_name}
                    wax={wax}
                    crafting={item.craft}
                    showBuySection={false}
                    titleClassName="specialCardTitle"
                    infoWrapperClassName="specialInfoWrapper"
                    className="specialCard"
                    frontWrapper="specialCardFront"
                    disableCraftButton={false}
                />

            case "wallet":
                return <WalletCraftCard
                    key={item?.template_id}
                    data={item}
                    crafting={item.craft}
                    template_id={item.template_id}
                    wax={wax}
                    showBuySection={false}
                    titleClassName="specialCardTitle"
                    infoWrapperClassName="specialInfoWrapper"
                    className="specialCard"
                    frontWrapper="specialCardFront"
                />

            case "packs":
                return <PackCraftCard
                    key={item?.template_id}
                    data={item}
                    crafting={item.craft}
                    template_id={item.template_id}
                    wax={wax}
                    showBuySection={false} titleClassName="specialCardTitle"
                    infoWrapperClassName="specialInfoWrapper"
                    className="specialCard"
                />

            default:
                return null
        }
    }

    return (
        <>
            <div className="sale-container">
                <div className='header-img'>
                    <img src='/images/shop/shop_header.png' alt='header' />
                    <p>SALES AND CRAFTS IN CLASHDOME’S TOKENS</p>
                </div>
                {/* {
                    shopData &&
                    <div className="sale">
                        <div className="sale-hero">
                            <div className="body">
                                <div className='grid-display'>
                                    <div className='saleinfo-header'>
                                        <p className='big-text'>{shopData.item_name}</p>
                                        <p className='timer'>{saleText} {eventEnds}</p>
                                    </div>

                                    <div className='sale-image'>
                                        {
                                            shopData.available_items === 0 &&
                                            <div className='sold-out-overlay'>
                                                <div>
                                                    <p>SOLD OUT!</p>
                                                </div>
                                            </div>
                                        }
                                        {shopData.img ?
                                            <img src={`https://atomichub-ipfs.com/ipfs/${shopData.img}`} alt="earlyaccess" /> :
                                            <video
                                                style={{ objectFit: "cover" }}
                                                width="100%"
                                                height="100%"
                                                autoPlay
                                                muted
                                                loop
                                                className={shopData.available_items === 0 ? 'hide' : ''}
                                                poster={'/images/cd_back.png'}
                                            >
                                                <source src={`https://atomichub-ipfs.com/ipfs/${shopData.video}`} type="video/mp4" />
                                                <source src={`https://atomichub-ipfs.com/ipfs/${shopData.video}`} type="video/ogg" />
                                                Your browser does not support the video tag.
                                            </video>
                                        }
                                    </div>

                                    <div className='sale-description'>
                                        <p className='description-text'>
                                            {shopData.description}
                                        </p>
                                        <div className='whitelist-container'>
                                            <div className='buy-btn' style={loading || !canBuy || shopData.available_items === 0 ? { cursor: 'not-allowed', opacity: 0.5 } : {}} onClick={buyAsset}>
                                                {
                                                    loading ?
                                                        <img className="loading" src="/images/loading_icon.png" /> :
                                                        <>
                                                            <p>{parseInt(shopData.price[0].split(' ')[0]).toLocaleString('en-GB')}</p>
                                                            <img src={currencyIcon[`${shopData.price[0].split(' ')[1]}`]} alt='ludio' />
                                                        </>
                                                }
                                            </div>
                                            {
                                                (shopData.whitelist.length === 0 || (wax && wax.userAccount && shopData.whitelist.includes(wax.userAccount))) ?
                                                    <p className='whitelist-icon'>✅</p> :
                                                    <p className='whitelist-icon'>❌</p>
                                            }
                                        </div>
                                        {(shopData.max_claimable !== -1) ?
                                            <p className='timer'>{`AVAILABLE SUPPLY: ${shopData.available_items}/${shopData.max_claimable}`}</p> :
                                            <p className='timer'>{`MIN MINT: ${shopData.available_items}`}</p>
                                        }
                                    </div>
                                </div>

                            </div>
                            <img className='abs-oldman' src='/images/shop/oldman.png' alt="oldman" />
                        </div>
                    </div>
                } */}

                {/* <div className='next-sale'>
                        <div className='next-sale-stripe'>
                            <p>NEXT WEEK: RUG POOL- EBONY CUE</p>
                            <div className='featured-image'>
                                <img src='/images/shop/next_week_star.svg' alt='star' className='star' />
                                <img src='/images/memorial_card.png' alt='card' className='featured-asset' />
                            </div>
                        </div>
                    </div> */}

                <div className={cn('assetshop-section customAssetShopSection', { "saleAssetShopSection": !!shopData })}>
                    <div className={cn(!!shopData ? "saleHotCraftWrapper" : "hotCraftWrapper")}>
                        <span className='hotCraftTitle'>HOT CRAFTS</span>
                    </div>
                    <div className={cn('cards-wrapper', !!shopData ? "saleCustomCardWrapper" : "customCardWrapper")}>
                        {data?.map((val) => (
                            renderHotCraft(val)
                        ))}
                    </div>
                </div>



            </div>
            <ShopProvider value={fullShopData}>
                <AssetShop wax={wax} />
            </ShopProvider>

        </>
    )
}

export default Sale
