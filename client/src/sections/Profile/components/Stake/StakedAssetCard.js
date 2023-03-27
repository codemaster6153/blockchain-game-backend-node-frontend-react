import React, { useEffect, useState } from 'react'
import './assetCard.css'
import { useDispatch } from 'react-redux';
import { ClashdomeMessageServer } from '../../../../utils/ClashdomeMessageServer';
import initConfig from '../../../../initConfig';
const {ExplorerApi} = require("atomicassets");

function StakedAssetCard({img, mint_no, name, type, wax, memo, asset_id, setAry, ary, index, setNav}) {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [assetData, setAssetData] = useState()
    const [video,setVideo]=useState(false)
    const [image,setImage]=useState(false)

    const colorCode = {
        'citizen': '#FFE3004D',
        'slot': '#FFFFFF4D',
        'Carbz': '#7DE2264D',
        'Jigowatts': '#17EDF44D',
        'wallet': '#FFE3004D',
        'decoration': '#FFE3004D',
    } 

    const sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const notify = async (text, success) => {
        dispatch({ type:"SET_NOTIFICATION", payload: {
            text: text,
            success: success,
        }})

        await sleep(4800)

        dispatch({ type:"REMOVE_NOTIFICATION", payload: {
            text: text,
            success: success,
        }})
    }

    const getStakedAssetData = async () => {

        let api  = new ExplorerApi(initConfig.atomicUrl, "atomicassets", {fetch});
        const asset = await api.getAsset(asset_id);
        setAssetData(asset);

        if (asset && asset.data.video) {
            setImage(false);
            setVideo(true);
        } else if (asset && asset.data.img) {
            setImage(true);
            setVideo(false);
        }
    }

    const unstake = async () => {
        try {
            setLoading(true)
            let result;

            let actions = [{
                account: "clashdomewld",
                name: "unstake",
                authorization: [{
                  actor: wax.userAccount,
                  permission: "active",
                }],
                data: {
                  account: wax.userAccount,
                  asset_id: asset_id,
                  type: memo
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
                let tempAry = ary
                tempAry.splice(index, 1)
                setAry([...tempAry])

                setTimeout(() => {
                    ClashdomeMessageServer.dispatchMessageToGame({id: "token-mining-game", payload: "NFT UNSTAKED " + memo});
                    window.scrollTo(0, 0);
                    setNav(0);
                    setNav(1);
                }, 1000)
            }
        } catch (e) {
            notify(e.message.toUpperCase(), false);
            console.log(e.message);
            setLoading(false)
        }
        setLoading(false)
    }

    useEffect(() => {
        getStakedAssetData()
    }, [])
    
    return (
        <div className="asset-card" style={{backgroundColor: `${colorCode[type]}`}} >
            <p className="top-text">{assetData && assetData.name ? assetData.name : name}</p>
            <div className="img-wrapper">
                {video && <video muted autoPlay loop><source src={`https://ipfs.io/ipfs/${assetData.data.video}`}></source></video>}
                {image && <img src={assetData && assetData.data.img ? `https://ipfs.io/ipfs/${assetData.data.img}` : `/images/cards/${type}.png`} alt="img" />}
                <p className="asset-id">#{assetData && assetData.template_mint ? assetData.template_mint : mint_no}</p>
            </div>
            <div className="button-wrapper" >
                {
                    loading ?
                    <img className="loading" src="/images/loading_icon.png" />:
                    <button className={`asset-button ${type}`} onClick={() => {unstake()}} >
                        UNEQUIP
                    </button>
                }
            </div>
        </div>
    )
}

export default StakedAssetCard