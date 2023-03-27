import React, { useEffect, useRef, useState } from 'react';
import './expandedResult.css';
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux';

export default function ExpandedResult({item, account, game}) {

    const [resultSeen, setResultSeen] = useState(true);
    const [date, setDate] = useState('0-0-0')
    const [time, setTime] = useState('00:00')
    const [avatar1, setAvatar1] = useState()
    const [avatar2, setAvatar2] = useState()
    const [expand, setExpand] = useState(true)
    const [winner1, setWinner1] = useState(false)

    const socialUsernames = useSelector(state => state.social)
    const citizenAvatars = useSelector(state => state.citiz) 
    const trials = useSelector(state => state.trial)
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

        // TODO: change this
        if (citizenAvatars[`${item.player1.account}`]){
            setAvatar1(citizenAvatars[`${item.player1.account}`]);
        } else if (trials && trials[item.player1.account]) {
            setAvatar1("/images/trial_avatar.png");
        } else {
            setAvatar1("/images/dummy_avatar.png");
        }

        if (citizenAvatars[`${item.player2.account}`]){
            setAvatar2(citizenAvatars[`${item.player2.account}`]);
        } else if (trials && trials[item.player2.account]) {
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
        if (parseInt(item.player1.score) > parseInt(item.player2.score)) {
            setWinner1(true)
        } else if (parseInt(item.player1.score) < parseInt(item.player2.score)) {
            setWinner1(false)
        } else {
            if (parseInt(item.player1.duration) < parseInt(item.player2.duration)) {
                setWinner1(true)
            }
        }

        var date = new Date(item.timestamp * 1000);
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
    
    let game_name = "";
    let game_id = "";

    if (item.game === 1) {
        game_id = game_name = "candy-fiesta";
    } else if (item.game === 2) {
        game_id = game_name = "templok";
    } else if(item.game === 3){
        game_id = game_name = 'ringy-dingy'
    } else if (item.game === 4) {
        game_name = "endless-siege";
        game_id = "endless-siege-2"
    } else {
        game_id = game_name = 'rug-pool'
    }

    return (
        <div className={`
            early-access-row 
            ${(account === item.player1.account || account === item.player2.account ) ? "highlight" : ""}
            ${((account === item.player1.account && winner1) || (account === item.player2.account && !winner1)) ? 'won' : 'lose'}
            `} onClick={() => {setExpand(!expand)}} >
            <div className="left">
                <img src={"/images/" + item.game + "_title.png"} alt={game_name} />
            </div>
            <div className="center">
                {
                    resultSeen ?
                    <>
                        
                        <Link ref={replay1} to={"/" + game_id + "/play?replay=true&duel=true&player=1&id="+item.id}>
                            <img src="/images/btn_replay_duel.png" style={{height: '30px'}} alt={item.player1.account} />
                        </Link>
                        {
                            !expand ?
                            <img className={`unfolded-logo ${winner1 ? "green" : "red"}`} src={avatar1} width={40} height={40} onError={() => {handleAvatarError(1)}} alt={item.player1.account} />:
                            ''
                        }
                        <div className="player">
                            <img ref={avtr1} className={`logo ${winner1 ? "green" : "red"}`} src={avatar1} width={40} height={40} onError={() => {handleAvatarError(1)}} alt={item.player1.account} />
                            <Link to={`/token-mining-game/${item.player1.account}`} style={{color: 'inherit'}} >
                                <p className={`${winner1 ? "green" : "red"} ${item.player1.account === wax.userAccount ? 'my' : ''}`}>{socialUsernames[`${item.player1.account}`] ? socialUsernames[`${item.player1.account}`] : item.player1.account}</p>
                            </Link>
                            <p>{parseInt(item.player1.score).toLocaleString('en-GB')}</p>
                        </div>
                        <img src="/images/vs.png" alt="vs" />
                        <div className="player">
                            <img ref={avtr2} className={`logo rotate-y ${winner1 ? "red" : "green"}`} src={avatar2} width={40} height={40} onError={() => {handleAvatarError(2)}} alt={item.player2.account} />
                            <Link to={`/token-mining-game/${item.player2.account}`} style={{color: 'inherit'}} >
                                <p className={`${winner1 ? "red" : "green"} ${item.player2.account === wax.userAccount ? 'my' : ''}`}>{socialUsernames[`${item.player2.account}`] ? socialUsernames[`${item.player2.account}`] : item.player2.account}</p>
                            </Link>
                            <p>{parseInt(item.player2.score).toLocaleString('en-GB')}</p>
                        </div>
                        <Link ref={replay2} to={"/" + game_id + "/play?replay=true&duel=true&player=2&id="+item.id}>
                            <img src="/images/btn_replay_duel.png" style={{height: '30px'}} alt={item.player1.account} />
                        </Link>
                        {
                            !expand ?
                            <img className={`unfolded-logo rotate-y ${winner1 ? "red" : "green"}`} src={avatar2} width={40} height={40} onError={() => {handleAvatarError(2)}} alt={item.player2.account} />:
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
