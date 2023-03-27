import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import './gameRulesRingy.css'
import { Link } from 'react-router-dom'
import initConfig from '../../initConfig';
const { JsonRpc} = require("eosjs");

function GameRulesRingy() {

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const citizenAvatars = useSelector(state => state.citiz)
    const [replay, setReplay] = useState([])
    const rpc = new JsonRpc(initConfig.waxUrl, { fetch });

    const setReplayLink = async () => {
        const temp = []
        let lastDualData = await rpc.get_table_rows({
            json: true,                 
            code: "clashdomedll",       
            scope: "clashdomedll",      
            table: "dclosed",  
            limit: 100,
            index_position: 3,
            key_type: "i64",
            lower_bound: 3,
            upper_bound: 3,                
            reverse: true,             
            show_payer: false,    
        });
        console.log("the game data is :", lastDualData)
        if(lastDualData.rows.length > 0){
            lastDualData.rows.sort(
                (a,b) => (
                    (
                        parseInt(a.player1.score) > parseInt(a.player1.score) ? 
                            parseInt(a.player1.score) : 
                            parseInt(a.player2.score)
                    ) > (
                        parseInt(b.player1.score) > parseInt(b.player1.score) ? 
                            parseInt(b.player1.score) : 
                            parseInt(b.player2.score)
                    )
                ) ? -1 : (
                    (
                        (
                            parseInt(a.player1.score) > parseInt(a.player1.score) ? 
                                parseInt(a.player1.score) : 
                                parseInt(a.player2.score)
                        ) < (
                            parseInt(b.player1.score) > parseInt(b.player1.score) ? 
                                parseInt(b.player1.score) : 
                                parseInt(b.player2.score)
                        )
                    ) ? 
                    1 : 0
                )
            )

            setReplay(lastDualData.rows)

            for(let i=0; i<lastDualData.rows.length; ++i){
                if(parseInt(lastDualData.rows[i].player1.score) > parseInt(lastDualData.rows[i].player2.score)){
                    if(temp.length > 0){
                        let continue_loop = false
                        for(let j=0; j<temp.length; ++j){
                            if(temp[j].account === lastDualData.rows[i].player1.account){
                                continue_loop = true;
                            }
                        }
                        if(continue_loop){
                            continue;
                        }
                    }
                    let obj = {
                        'account': lastDualData.rows[i].player1.account,
                        'player': 1,
                        'dualId': lastDualData.rows[i].id
                    }
                    temp.push(obj)
                }else{
                    if(temp.length > 0){
                        let continue_loop = false
                        for(let j=0; j<temp.length; ++j){
                            if(temp[j].account === lastDualData.rows[i].player2.account){
                                continue_loop = true;
                            }
                        }
                        if(continue_loop){
                            continue;
                        }
                    }
                    let obj = {
                        'account': lastDualData.rows[i].player2.account,
                        'player': 2,
                        'dualId': lastDualData.rows[i].id
                    }
                    temp.push(obj)
                }
                if(temp.length === 3){
                    break;
                }
            }
            setGames([...temp])

        }

    }

    useEffect(() => {
        setReplayLink()
    }, [])

    return (
        <div className='ringy-rules-container'>
            <div className='ringy-hero'>
                <div className='abs-bg-img'>
                </div>
                <div className='logo'>
                    <img src='/images/new_ringy/logo_ringy.png' alt='candyHero' />
                </div>
                <div className='player-svg'>
                    <img src='/images/new_ringy/svg/scene_ringy.svg' alt='player' />
                    <video muted autoPlay loop playsInline src='/images/new_ringy/ringy.mp4' />
                    <div className='abs-triangle'></div>
                </div>
                <div className='text'>
                    <p className='heading'>IMPROVING YOUR SKILLS IS THE MOST ADDICTIVE FEELING</p>
                    <p className='sub-text'>Everyone know how to play 3 in a row, but just by adding a few simple extra rules the game feels so fresh, challenging, and rewarding. Do you want to know how it feels stacking up to 8 different color rings in 3 different sizes?</p>
                </div>
            </div>
            <div className='ringy-replays'>
                <div>
                    <p>IMPROVE YOUR SKILLS BY WATCHING THE TOP PLAYERS’ REPLAYS</p>
                    {
                        games && games.length > 0 && games.map((game) => {
                            return(
                                <div className='replay-card'>
                                    <img alt='avatar' src={citizenAvatars[`${game.account}`] ? citizenAvatars[`${game.account}`] : '/images/dummy_avatar.png'} onError={(e) => {e.currentTarget.src = '/images/dummy_avatar.png'}} className='avatar' />
                                    <Link to={`/token-mining-game/${game.account}`} >
                                        <p>{game.account}</p>
                                    </Link>
                                    <a href={`https://clashdome.io/ringy-dingy/play?replay=true&duel=true&player=${game.player}&id=${game.dualId}`} target='_blank' >
                                        <img className='replay' src='/images/btn_replay.svg' alt='replay' />
                                    </a>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='basic-tips'>
                <p>TIC-TAC-TOE ON STEROIDS. SIMPLE YET CHALLENGING.</p>
                <div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy_wrapped.mp4' /> */}
                            <img src="/images/new_ringy/svg/rows.svg" alt='wraped' />
                        </div>
                        <p className='heading'>3 IN A ROW GONE WILD</p>
                        <p className='sub-text'>Connect 3 pieces of the same color in a line. You can stack up to 3 rings per slot.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy_stripped.mp4' /> */}
                            <img src="/images/new_ringy/svg/gameover.svg" alt='wraped' />
                        </div>
                        <p className='heading'>AVOID FILLING THE BOARD</p>
                        <p className='sub-text'>Keep adding pieces to the board until you run out of options.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy-bomb.mp4' /> */}
                            <img src="/images/new_ringy/svg/combo.svg" alt='wraped' />
                        </div>
                        <p className='heading'>COMBOS</p>
                        <p className='sub-text'>Clear several lines with one single piece to multiply the points you get by the number of lines cleared.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/images/new_ringy/combo.mp4' /> */}
                            <img src="/images/new_ringy/svg/reshuffle.svg" alt='wraped' />
                        </div>
                        <p className='heading'>RESHUFFLE</p>
                        <p className='sub-text'>You can reshuffle annoying pieces 3 times. You can get a more useful ring if you’re lucky.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy-combo.mp4' /> */}
                            <img src="/images/new_ringy/svg/swipe.svg" alt='wraped' />
                        </div>
                        <p className='heading'>SWIPE FOR BIGGER COMBOS</p>
                        <p className='sub-text'>The highest scoring combos are only reachable by swiping columns and rows.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy-combo.mp4' /> */}
                            <img src="/images/new_ringy/svg/colorstack.svg" alt='wraped' />
                        </div>
                        <p className='heading'>COLOR STACK</p>
                        <p className='sub-text'>Join 3 rings of the same color in one slot to remove that color across the board.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameRulesRingy