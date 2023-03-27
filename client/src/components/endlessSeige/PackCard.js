import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import initConfig from '../../initConfig';
import './packCard.css';

export default function PackCard({image, id, mint, type, asset_id, wax}) {

    const dispatch = useDispatch();

    const [claimed, setClaimed] = useState(false);
    const [loading, setLoading] = useState("disabled");
    const [currImage, setImage] = useState(image);
    const [currType, setType] = useState(type);
    const [currId, setId] = useState(id);
    const [currMint, setMint] = useState(mint);
    const [currAssetId, setAssetId] = useState(asset_id);

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

    const imageLoaded = () => {

        if (currType === "land") {
            setLoading("disabled");
        }
    }

    const claimPack = async () => {

        if (loading === "enabled") {
            return;
        }

        setLoading("enabled");

        if (currType === "land") {

            try {

                let result;

                let actions = [{
                    account: "packsopenerx",
                    name: "claimunboxed",
                    authorization: [{
                        actor: wax.userAccount,
                        permission: "active",
                    }],
                    data: {
                        pack_asset_id: currAssetId
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
                    setClaimed(true);
                }

                setLoading("disabled");

            } catch (e) {
                notify(e.message.toUpperCase(), false);
                console.log(e.message);
                setLoading("disabled");
            }

        } else {

            try {

                let result;

                let actions = [{
                    account: "atomicassets",
                    name: "transfer",
                    authorization: [{
                      actor: wax.userAccount,
                      permission: "active",
                    }],
                    data: {
                      from: wax.userAccount,
                      to: "packsopenerx",
                      asset_ids: [currId],
                      memo: "unbox",
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

                    let assets_ids = [];
    
                    while (assets_ids.length === 0) {
        
                        const result2 = await wax.rpc.get_table_rows({
                            json: true,
                            code: "packsopenerx",
                            scope: "packsopenerx",
                            table: "unboxpacks",
                            lower_bound: id,
                            upper_bound: id,
                            limit: 1
                        });
        
                        if (result2.rows.length) {
                            assets_ids = result2.rows[0].assets_ids;
                        }
                    }
        
                    const {ExplorerApi} = require("atomicassets");
                    let api  = new ExplorerApi(initConfig.atomicUrl, "atomicassets", {fetch});
                    const asset = await api.getAsset(assets_ids[0]);

                    setAssetId(id);
                    setType("land");
                    setImage(asset.data.img);
                    setId(asset.asset_id);
                    setMint(asset.template_mint)
                }
            } catch (e) {
                notify(e.message.toUpperCase(), false);
                console.log(e.message);
                setLoading("disabled");
            }
        } 
    }

    return (
        <div className="pack-card">
            <div className="image">
                <div className="imgs">
                    <img src={`/images/empty_pack.png`} alt="land" className="bck-img" width="88%" />
                    <img src={`https://ipfs.io/ipfs/${currImage}`} onLoad={imageLoaded} alt="pack-card" className="top-img" width="88%" />
                </div>
                <div className="mint-number">
                    <p>#{currMint}</p>
                </div> 
                {loading === "enabled" ? <img src={`/images/loading_icon.png`} className="loading" /> : ""} 
            </div>
            <p className="land-card-info">
                <span>ID:</span>
                #{currId}
            </p>
            {!claimed ?
                <div className={"open-pack-button loading-" + loading + " type-" + currType}  onClick={claimPack} >
                    <p>{currType === "pack" ? "OPEN PACK" : "CLAIM LAND"}</p>
                </div> : <p className="land-claimed">LAND CLAIMED!</p>
            }           
        </div>
    )
}
