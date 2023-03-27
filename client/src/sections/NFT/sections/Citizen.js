import React, { useEffect, useRef, useState } from 'react'
import {useParams, Link} from 'react-router-dom' 
import { useDispatch, useSelector } from 'react-redux'
import EmptyCard from '../../../components/endlessSeige/EmptyCard'
import EmptyNftCard from './EmptyNftCard'
import NftCard from './NftCard'
import {ExplorerApi} from 'atomicassets'
import Simple from './Carousel'
import initConfig from '../../../initConfig'
let JsonRpc = require("eosjs").JsonRpc;

function Citizen() {
    const {tab} = useParams()
    const all = useRef()
    const amnio = useRef()
    const citizen = useRef()
    const [allNft, setAllNft] = useState([])
    const [citizenNft, setCitizenNft] = useState([])
    const wax = useSelector(state => state.wax);
    const [stakedNft, setStakedNft] = useState()

    useEffect(() => {
        if(document && tab === 'your-nfts'){
            all.current.classList.add('active')
            amnio.current.classList.remove('active')
            citizen.current.classList.remove('active')
        }else if(document && tab === 'your-amnio-tanks'){
            all.current.classList.remove('active')
            amnio.current.classList.add('active')
            citizen.current.classList.remove('active')
        }else if(document && tab === 'your-citizens'){
            all.current.classList.remove('active')
            amnio.current.classList.remove('active')
            citizen.current.classList.add('active')
        }
    }, [tab])
    
    const getAllNft = async () => {

        if (!wax.userAccount) {
            setAllNft([])
            return;
        }

        let api  = new ExplorerApi(initConfig.atomicUrl, "atomicassets", {fetch});

        try{

            let templates = [];

            if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
                templates = [348479, 348478, 348477]
            } else {
                templates = [336217, 336216, 336214]
            }

            let assets = await api.getAssets({owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "packs", template_id: templates[0]});
            let assets2 = await api.getAssets({owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "packs", template_id: templates[1]});
            let assets3 = await api.getAssets({owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "packs", template_id: templates[2]});

            assets = assets.concat(assets2).concat(assets3);
            console.log("GET ALL NFTS");
            console.log(wax.userAccount);
            console.log(assets);

            if (assets.length > 0) {
                setAllNft([...assets])
            }
        }catch(err){
            console.log("the error is :", err)
        }
    }

    const getCitizenNft = async () => {

        if (!wax.userAccount) {
            setCitizenNft([])
            return;
        }
        let api  = new ExplorerApi(initConfig.atomicUrl, "atomicassets", {fetch});
        try{
            let assets = await api.getAssets({owner: wax.userAccount, collection_name: "clashdomenft", schema_name: "citizen"});

            if (assets.length > 0) {
                setCitizenNft([...assets])
            }
        }catch(err){

        }
    }

    const getStakedNft = async () => {

        if (!wax.userAccount) {
            setStakedNft(null)
            return;
        }

        if (wax.rpc) {
            let api  = new ExplorerApi(initConfig.atomicUrl, "atomicassets", {fetch});
            const result = await wax.rpc.get_table_rows({
                json: true,
                code: "packsopenerx",
                scope: "packsopenerx",
                table: "avatarpacks",
                index_position: 2,
                key_type: "i64",
                lower_bound: wax.userAccount,
                upper_bound: wax.userAccount,
                limit: 1
            });
    
            if (result.rows.length > 0) {
                let table_asset = result.rows[0];
    
                const asset = await api.getAsset(table_asset.pack_asset_id);
                
                setStakedNft(asset)
    
            }
        }
        
    }

    useEffect(() => {
        if(document && tab === 'your-nfts'){
            all.current.classList.add('active')
            amnio.current.classList.remove('active')
            citizen.current.classList.remove('active')
        }else if(document && tab === 'your-amnio-tanks'){
            all.current.classList.remove('active')
            amnio.current.classList.add('active')
            citizen.current.classList.remove('active')
        }else if(document && tab === 'your-citizens'){
            all.current.classList.remove('active')
            amnio.current.classList.remove('active')
            citizen.current.classList.add('active')
        }
        getAllNft()
        getStakedNft()
        getCitizenNft()
    }, [wax])

    useEffect(() => {
        if(document && tab === 'your-nfts'){
            all.current.classList.add('active')
            amnio.current.classList.remove('active')
            citizen.current.classList.remove('active')
        }else if(document && tab === 'your-amnio-tanks'){
            all.current.classList.remove('active')
            amnio.current.classList.add('active')
            citizen.current.classList.remove('active')
        }else if(document && tab === 'your-citizens'){
            all.current.classList.remove('active')
            amnio.current.classList.remove('active')
            citizen.current.classList.add('active')
        }
        getAllNft()
        getStakedNft()
        getCitizenNft()
    }, [])

    return (
        <div className="container citizen" id="citizen" >
            <h1 className="heading">Clashdome Citizen</h1>
            <div className="subnav">
                <Link to='/nfts/your-nfts' className="subnav-link" ref={all}>
                    <p>All NFTS</p>
                </Link>
                <Link to='/nfts/your-amnio-tanks' className="subnav-link" ref={amnio}>
                    <p>AMNIO-TANKS</p>
                </Link>
                <Link to='/nfts/your-citizens' className="subnav-link" ref={citizen}>
                    <p>CITIZENS</p>
                </Link>
            </div>
            <div className="nft-carousel">
                <Simple />
            </div>
            <div className="body">
                {
                    tab === 'your-nfts' ?
                    <>
                        {
                            stakedNft ?
                            <NftCard nft={stakedNft} staked={true} />:
                            ''
                        }
                        {
                            allNft.length > 0 && allNft.map((nft) => {
                                return <NftCard nft={nft} staked={false} />
                            })
                        }
                        {
                            citizenNft.length > 0 && citizenNft.map((nft) => {
                                return <NftCard nft={nft} staked={false} type="citizen" />
                            })
                        }
                        <EmptyNftCard />
                    </>:(
                        tab === 'your-amnio-tanks' ?
                        <>
                            {
                            stakedNft ?
                            <NftCard nft={stakedNft} staked={true} />:
                            ''
                            }
                            {
                                allNft.length > 0 && allNft.map((nft) => {
                                    return <NftCard nft={nft} staked={false} />
                                })
                            }
                            <EmptyNftCard />
                        </>:
                        <>
                            {
                                citizenNft.length > 0 && citizenNft.map((nft) => {
                                    return <NftCard nft={nft} staked={false} type="citizen" />
                                })
                            }
                            <EmptyNftCard />
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Citizen
