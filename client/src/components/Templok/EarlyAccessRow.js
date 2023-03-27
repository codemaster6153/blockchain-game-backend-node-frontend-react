import React, { useEffect, useRef, useState } from 'react';
import getAvatar from '../../utils/avatar';
import './earlyAccessRow.css';
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux';

export default function EarlyAccessRow({item, account, game}) {

    const [resultSeen, setResultSeen] = useState(true);
    const [date, setDate] = useState('0-0-0')
    const [time, setTime] = useState('00:00')
    const [avatar1, setAvatar1] = useState()
    const [avatar2, setAvatar2] = useState()
    const [expand, setExpand] = useState()
    const [winner1, setWinner1] = useState(false)

    const socialUsernames = useSelector(state => state.social)
    const citizenAvatars = useSelector(state => state.citiz)
    const trials = useSelector(state => state.trial);
    const wax = useSelector(state => state.wax)

    const avtr1 = useRef()
    const avtr2 = useRef()
    const replay1 = useRef()
    const replay2 = useRef()
    const bgcolor = {
        '0.03': '#ec7c05',
        '25': '#ec7c05',
        '10': '#f2ba0a',
        '0.02': '#f2ba0a',
        '5': '#f8e80b',
        '0.01': '#f8e80b',
        'Free': '#ffff1f'
    }

    const revealResult = () => {
        setResultSeen(true)
    }

    const handleGetAvatar = async () => {

        if (citizenAvatars[`${item.player1Account}`]){
            setAvatar1(citizenAvatars[`${item.player1Account}`]);
        } else if (trials && trials[item.player1Account]) {
            setAvatar1("/images/trial_avatar.png");
        } else {
            setAvatar1("/images/dummy_avatar.png");
        }

        if (citizenAvatars[`${item.player2Account}`]){
            setAvatar2(citizenAvatars[`${item.player2Account}`]);
        } else if (trials && trials[item.player2Account]) {
            setAvatar2("/images/trial_avatar.png");
        } else{
            setAvatar2("/images/dummy_avatar.png");
        }
    }

    const handleAvatarError = (avtarId) => {
        if(avtarId === 1){
            setAvatar1("/images/dummy_avatar.png");
        }else if(avtarId === 2){
            setAvatar2("/images/dummy_avatar.png");
        }
    }

    useEffect(() => {
        if (parseInt(item.player1Score) > parseInt(item.player2Score)) {
            setWinner1(true)
        } else if (parseInt(item.player1Score) < parseInt(item.player2Score)) {
            setWinner1(false)
        } else {
            if (parseInt(item.player1Duration) < parseInt(item.player2Duration)) {
                setWinner1(true)
            }
        }

        var date = new Date(item.date * 1000);
        setDate(`${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`)
        setTime(`${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`)
        handleGetAvatar()
    }, [])

    useEffect(() => {
        if(expand){
            avtr1.current.style.position = "relative"
            avtr1.current.style.opacity = 1
            avtr2.current.style.position = "relative"
            avtr2.current.style.opacity = 1
            replay1.current.style.position = "relative"
            replay1.current.style.zIndex = "2"
            replay1.current.style.opacity = 1
            replay2.current.style.position = "relative"
            replay2.current.style.zIndex = "2"
            replay2.current.style.opacity = 1
        }else{
            avtr1.current.style.position = "absolute"
            avtr1.current.style.opacity = 0
            avtr2.current.style.position = "absolute"
            avtr2.current.style.opacity = 0
            replay1.current.style.position = "absolute"
            replay1.current.style.zIndex = "-1"
            replay1.current.style.opacity = 0
            replay2.current.style.position = "absolute"
            replay2.current.style.zIndex = "-1"
            replay2.current.style.opacity = 0
        }
    }, [expand])
    
    let game_name = item.game;

    if (item.game === "endless-siege-2") {
        game_name = "endless-siege";
    }

    return (
        <div className={`
            early-access-row 
                ${(account === item.player1Account || account === item.player2Account ) ? "highlight" : ""}
                ${((account === item.player1Account && winner1) || (account === item.player2Account && !winner1)) ? 'won' : 'lose'}
            `} onClick={() => {setExpand(!expand)}} >
            <div className="left">
                <img src={"/images/" + game_name + "_title.png"} alt={game_name} />
            </div>
            <div className="center">
                {
                    resultSeen ?
                    <>
                        
                        <Link ref={replay1} to={"/" + item.game + "/play?replay=true&duel=true&player=1&id="+item.id}>
                            <img src="/images/btn_replay_duel.png" style={{height: '30px'}} alt={item.player1Account} />
                        </Link>
                        {
                            !expand ?
                            <img className={`unfolded-logo ${winner1 ? "green" : "red"}`} src={avatar1} width={40} height={40} onError={() => {handleAvatarError(1)}} alt={item.player1Account} />:
                            ''
                        }
                        <div className="player">
                            <img ref={avtr1} className={`logo ${winner1 ? "green" : "red"}`} src={avatar1} width={40} height={40} onError={() => {handleAvatarError(1)}} alt={item.player1Account} />
                            <Link to={`/token-mining-game/${item.player1Account}`} style={{color: 'inherit'}} >
                                <p className={`${winner1 ? "green" : "red"} ${item.player1Account === wax.userAccount ? 'my' : ''}`}>{socialUsernames[`${item.player1Account}`] ? socialUsernames[`${item.player1Account}`] : item.player1Account}</p>
                            </Link>
                            <p>{parseInt(item.player1Score).toLocaleString('en-GB')}</p>
                        </div>
                        <img src="/images/vs.png" alt="vs" />
                        <div className="player">
                            <img ref={avtr2} className={`logo rotate-y ${winner1 ? "red" : "green"}`} src={avatar2} width={40} height={40} onError={() => {handleAvatarError(2)}} alt={item.player2Account} />
                            <Link to={`/token-mining-game/${item.player2Account}`} style={{color: 'inherit'}} >
                                <p className={`${winner1 ? "red" : "green"} ${item.player2Account === wax.userAccount ? 'my' : ''}`}>{socialUsernames[`${item.player2Account}`] ? socialUsernames[`${item.player2Account}`] : item.player2Account}</p>
                            </Link>
                            <p>{parseInt(item.player2Score).toLocaleString('en-GB')}</p>
                        </div>
                        <Link ref={replay2} to={"/" + item.game + "/play?replay=true&duel=true&player=2&id="+item.id}>
                            <img src="/images/btn_replay_duel.png" style={{height: '30px'}} alt={item.player1Account} />
                        </Link>
                        {
                            !expand ?
                            <img className={`unfolded-logo rotate-y ${winner1 ? "red" : "green"}`} src={avatar2} width={40} height={40} onError={() => {handleAvatarError(2)}} alt={item.player2Account} />:
                            ''
                        }
                    </>:
                    <div className="reveal-result" onClick={revealResult}>
                        <p className="head">DUEL FINISHED!</p>
                        <p className="subtext">see result</p>
                    </div>
                }
            </div>
            <div className="right">
                <p>{date}</p>
                <p>{time}</p>
                <p>ID: {item.id}</p>
            </div>
            {
                item.fee && parseInt(item.fee.split('.')[0]) !== 0 &&
                <div className='tier' style={{backgroundColor: `${bgcolor[item.fee.split('.')[0]]}`}} >
                    <p>{item.fee.split('.')[0]}</p>
                </div>
            }
        </div>
    )
}
