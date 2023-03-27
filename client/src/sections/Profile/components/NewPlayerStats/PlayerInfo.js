import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import initConfig from '../../../../initConfig';
import CountrySelector from './CountrySelector';
import './playerInfo.css'
import moment from 'moment'
import { getAptRating } from '../../../Finance/ApartmentVoting';
import FriendoRequestModal from '../../../../components/Modals/FriendoRequestModal';
const { JsonRpc} = require("eosjs");

function PlayerInfo({borderColor, wax, joinedOn, playerPosition}) {

    const [editing, setEditing] = useState(false)
    const [avatar, setAvatar] = useState()
    const [userData, setUserData] = useState({});
    const citizenAvatars = useSelector(state => state.citiz)
    const trials = useSelector(state => state.trial);

    // this is for edit profile
    const [twitter, setTwitter] = useState(userData.tw ? userData.tw.startsWith("@") ? `${userData.tw}` : `@${userData.tw}` : "")
    const [telegram, setTelegram] = useState(userData.tg)
    const [discord, setDiscord] = useState(userData.dc)
    const [name, setName] = useState(userData.cn)
    const [country, setCountry] = useState(userData.co)
    const [position, setPosition] = useState("#XXX")
    const dispatch = useDispatch()
    const [aptRating, setAptRating] = useState(0)
    const visitorSelectorsData = useSelector(state => state.visit);
    const [friendoRequestModal, setFriendoRequestModal] = useState({open: false, account: ''})
    const roomData = useSelector((state) => state.room);

    const { id } = useParams()

    const rpc = new JsonRpc(initConfig.waxUrl, { fetch });

    const handleDpLoadError = (e) => {e.currentTarget.src = '/images/dummy_avatar.png'}

    const handleGetAvatar = async () => {

        if(citizenAvatars && citizenAvatars[id]){
            setAvatar(citizenAvatars[id]);
        } else if (trials && trials[id]) {
            setAvatar("/images/trial_avatar.png");
        } else {
            setAvatar("/images/dummy_avatar.png");
        }
    }

    const getInitialValues = async () => {
        const resp = await rpc.get_table_rows({
            json: true,                 
            code: "clashdomewld",       
            scope: "clashdomewld",      
            table: "social",  
            limit: 1,
            lower_bound: id,
            upper_bound: id,            
            show_payer: false,    
        });
        if(resp.rows.length > 0){
            setUserData(JSON.parse(resp.rows[0].data))
        }
    }

    function getFlagEmoji(countryCode) {
        if(countryCode === 'none'){
            return '🏳️'
        }
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char =>  127397 + char.charCodeAt());
        return String.fromCodePoint(...codePoints);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const validateDiscordUsername = async () => {
        if(discord.trim().length > 32 || discord.trim().length < 7){
            dispatch({
                type: "SET_NOTIFICATION",
                payload: {
                    text: "Discord username must be 7 to 32 char long",
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
            return false
        }
        return true;
    }

    const saveInfoFree = async () => {
        if(!await validateDiscordUsername()){
            return
        }
        const payload = {
            "cn": name,
            "co": country,
            "tw": twitter.startsWith("@") ? `${twitter}` : `@${twitter}`,
            "tg": telegram,
            "dc": discord
        }
        const memo = "social" + JSON.stringify(payload)
        try{
            let resp;
            if (wax.type === "wcw") {
                resp = await wax.api.transact({
                    actions: [{
                        account: "clashdomewld",
                        name: "editsocial",
                        authorization: [{
                            actor: id,
                            permission: "active",
                        }],
                        data: {
                            account: id,
                            memo: memo
                        }
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30
                })
            }else if(wax.type === "anchor"){
                resp = await wax.signTransaction({
                    actions: [{
                        account: "clashdomewld",
                        name: "editsocial",
                        authorization: [{
                            actor: id,
                            permission: "active",
                        }],
                        data: {
                            account: id,
                            memo: memo
                        }
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30
                })
            }

            if (resp) {
                setEditing(false)
                dispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                        text: "SUCCESSFUL TRANSACTION!",
                        success: true
                    }
                })
                console.log(resp)
                await sleep(4800)

                dispatch({
                    type: "REMOVE_NOTIFICATION",
                    payload: {
                        text: "",
                        success: false
                    }
                })
            }

        }catch(e) {
            dispatch({
                type: "SET_NOTIFICATION",
                payload: {
                    text: e.message.toUpperCase(),
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

    const saveInfo = async () => {
        if(!await validateDiscordUsername()){
            return
        }
        const payload = {
            "cn": name ? name : '',
            "co": country ? country : '',
            "tw": twitter.length > 1 ? twitter : '',
            "tg": telegram ? telegram : '',
            "dc": discord ? discord : ''
        }
        const memo = "social" + JSON.stringify(payload)
        try{
            let resp;
            if (wax.type === "wcw") {
                resp = await wax.api.transact({
                    actions: [{
                        account: "clashdometkn",
                        name: "transfer",
                        authorization: [{
                            actor: id,
                            permission: "active",
                        }],
                        data: {
                            from: id,
                            to: "clashdomewld",
                            quantity: "350.0000 CDCARBZ",
                            memo: memo
                        }
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30
                })
            }else if(wax.type === "anchor"){
                resp = await wax.signTransaction({
                    actions: [{
                        account: "clashdometkn",
                        name: "transfer",
                        authorization: [{
                            actor: id,
                            permission: "active",
                        }],
                        data: {
                            from: id,
                            to: "clashdomewld",
                            quantity: "350.0000 CDCARBZ",
                            memo: memo
                        }
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30
                })
            }

            if (resp) {
                setEditing(false)
                dispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                        text: "SUCCESSFUL TRANSACTION!",
                        success: true
                    }
                })
                console.log(resp)
                await sleep(4800)

                dispatch({
                    type: "REMOVE_NOTIFICATION",
                    payload: {
                        text: "",
                        success: false
                    }
                })
            }

        }catch(e) {
            dispatch({
                type: "SET_NOTIFICATION",
                payload: {
                    text: e.message.toUpperCase(),
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

    useEffect(() => {
        setUserData({})
        handleGetAvatar()
        getInitialValues()
    }, [id, trials])

    useEffect(() => {
        if(editing){
            setTwitter(userData.tw ? userData.tw.startsWith("@") ? `${userData.tw}` : `@${userData.tw}` : "")
            setTelegram(userData.tg ? userData.tg : '')
            setDiscord(userData.dc ? userData.dc : '')
            setName(userData.cn ? userData.cn : '')
            setCountry(userData.co ? userData.co : 'none')
        }else{
            getInitialValues()
        }
    }, [editing])

    useEffect(() => {
        if (wax && visitorSelectorsData && id) {
            getApartmentRating(visitorSelectorsData)
        }
    }, [wax, id, visitorSelectorsData])

    const getApartmentRating = async (a) => {
        let score = await getAptRating(id,  wax, a)
        
        setAptRating(score? score : {score: 0, n_votes: 0})
    }

    return (
        <div className='player-info-wrapper'>
            <div className='player-info-container'>
                <div className='top-info'>
                    <div className='display-picture'>
                        <img src={avatar} onError={handleDpLoadError} alt='avatar' />
                        <p className='rank'>{playerPosition}</p>
                        {wax.userAccount !== id && roomData?.players[id] && roomData.players[id] === "ONLINE" && <div className='online-badge' />}
                    </div>
                    <div className='username-link'>
                        <div className='username'>
                            <p className='mem-since'>member since {moment(joinedOn).format("MMMM DD, YYYY")}</p>
                            {
                                editing ?
                                <>
                                    <input type={'text'} defaultValue={userData.cn} onChange={(e) => {setName(e.target.value)}} placeholder={'Custom Name'} />
                                    <CountrySelector defaultValue={userData.co} setCountry={setCountry} />
                                </>:
                                <p>{userData.cn ? userData.cn : id} {userData.co && getFlagEmoji(userData.co)}</p>
                            }
                        </div>
                        <div className='stars-container'>
                            <div className='stars'>
                                <img src='/images/stars-empty.svg' className='stars-empty' />
                                <img src='/images/stars-full.svg' className='stars-full' style={{clip: `rect(0px, ${150 * aptRating.score / 5}px,200px,0px)`}} />
                            </div>
                            <span className='nvotes'>({aptRating.n_votes} votes)</span>
                        </div>


                        <div className='userlinks'>
                            <div className='wallet-name'>
                                <p>{id}</p>
                            </div>
                            <div className='links'>
                                <a className="block" target='_blank' href={`https://wax.bloks.io/account/${id}`}>View on Bloks</a>
                                <a className="atomic" target='_blank' href={`https://wax.atomichub.io/explorer/account/${id}`}>View on Atomic Hub</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bottom-info'>
                    <div className='social-usernames'>
                        {
                            !editing ?
                            <a href={userData.tw ? `https://twitter.com/${userData.tw.split('@')[1] ? userData.tw.split('@')[1] : userData.tw }` : ''} target="_blank" className="link" >
                                <img src='/images/twitter-brands.svg' />
                                <p>{userData.tw ? userData.tw : '@username'}</p>
                            </a>:
                            <p className="link" >
                                <img src='/images/twitter-brands.svg' />    
                                <input type={'text'} defaultValue={userData.tw} onChange={(e) => {setTwitter(e.target.value)}} placeholder={'@username'} />
                            </p>
                        }
                        {
                            !editing ?
                            <a className="link" >
                                <img src='/images/telegram-brands.svg' />
                                <p>{userData.tg ? userData.tg : '@username'}</p>
                            </a>:
                            <p className="link" >
                                <img src='/images/telegram-brands.svg' />
                                <input type={'text'} defaultValue={userData.tg} onChange={(e) => {setTelegram(e.target.value)}} placeholder={'@username'} />
                            </p>
                        }
                        {
                            !editing ?
                            <a className="link" >
                                <img src='/images/discord-brands.svg' />
                                <p>{userData.dc ? userData.dc : '@username'}</p>
                            </a>:
                            <p className="link" >
                                <img src='/images/discord-brands.svg' />
                                <input type={'text'} defaultValue={userData.dc} onChange={(e) => {setDiscord(e.target.value)}} placeholder={'@username'} />
                            </p>
                        }
                    </div>
                    <div className='edit-btns'>
                        {
                            id === wax.userAccount ?
                            (
                                !editing ? 
                                <div className='edit-btn' onClick={() => setEditing(true)} >
                                    <p>EDIT</p>
                                    <img src="/images/edit-solid.svg" alt='edit' />
                                </div>:
                                <>
                                    {
                                        !userData.cn &&
                                        <p className='mb-2' style={{textAlign: 'right', color: '#f3002a'}}> * 350 CDCARBZ</p>
                                    }
                                    <div className='save-btns'>
                                        <div className='edit-btn' onClick={userData.cn ? saveInfoFree : saveInfo} >
                                            <p>SAVE</p>
                                            <img src="/images/icon_floppy.svg" alt='edit' />
                                        </div>
                                        <div onClick={(e) => {setEditing(false)}} style={{marginLeft: '10px'}} className='close-editing'>
                                            <img src='/images/btn_close.svg' />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='edit-btn' onClick={() => setFriendoRequestModal({open: true, account: id})} style={{height: 35, width: 55}}>
                                    <img src="/images/send-request.svg" alt='send-friend-request' style={{transform: 'scale(1.3)'}}  />
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <FriendoRequestModal open={friendoRequestModal.open} account={friendoRequestModal.account} onCloseModal={() => setFriendoRequestModal({open: false, account: ''})} wax={wax} />
        </div>
    )
}

export default PlayerInfo