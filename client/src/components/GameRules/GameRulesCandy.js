import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import './gameRulesCandy.css'
import { Link } from 'react-router-dom'
import initConfig from '../../initConfig';
const { JsonRpc} = require("eosjs");

function GameRulesCandy() {

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
            lower_bound: 1,
            upper_bound: 1,                
            reverse: true,             
            show_payer: false,    
        });

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
        <div className='candy-rules-container'>
            <div className='candy-hero'>
                <div className='abs-bg-img'>
                </div>
                <div className='logo'>
                    <img src='/images/candyHero.png' alt='candyHero' />
                </div>
                <div className='player-svg'>
                    <img src='/videos/scene_candy_home.svg' alt='player' />
                    <video muted autoPlay loop playsInline src='/videos/candy_Fiesta.mp4' />
                    <div className='abs-triangle'></div>
                </div>
                <div className='text'>
                    <p className='heading'>IMAGINE YOU COULD MAKE CASH BY PLAYING MATCH 3 GAMES…</p>
                    <p className='sub-text'>Just think of all the time you’ve spent playing Match 3 games on the bus or while you were chilling on the toilet. Now imagine each match could reward you with tokens. We’re not saying it’ll make you rich, but maybe you could pay the bus ticket or the piece of toilet paper you will be using.</p>
                </div>
            </div>
            <div className='candy-replays'>
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
                                    <a href={`https://clashdome.io/candy-fiesta/play?replay=true&duel=true&player=${game.player}&id=${game.dualId}`} target='_blank' >
                                        <img className='replay' src='/images/btn_replay.svg' alt='replay' />
                                    </a>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='basic-tips'>
                <p>A FEW BASIC TIPS TO MAXIMIZE YOUR COMBOS</p>
                <div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy_wrapped.mp4' /> */}
                            <img src="/images/new_candy_fiesta/wrapped.svg" alt='wraped' />
                        </div>
                        <p className='heading'>WRAPPED CANDY</p>
                        <p className='sub-text'>Get a wrapped candy by making a combination of +4 candies in T or L shape. When they are activated they will explode the adjacent 8 candies.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy_stripped.mp4' /> */}
                            <img src="/images/new_candy_fiesta/stripped.svg" alt='wraped' />
                        </div>
                        <p className='heading'>STRIPED CANDY</p>
                        <p className='sub-text'>Get a striped candy by connecting 4 candies in a row or column. When they are triggered they will clear a whole row or column of candies.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy-bomb.mp4' /> */}
                            <img src="/images/new_candy_fiesta/bomb.svg" alt='wraped' />
                        </div>
                        <p className='heading'>COLOUR BOMB</p>
                        <p className='sub-text'>Get a colour bomb by connecting +4 candies in a row or column. Swapping it with any candy of any color will clear all the candies of that colour.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy-combo.mp4' /> */}
                            <img src="/images/new_candy_fiesta/combo.svg" alt='wraped' />
                        </div>
                        <p className='heading'>MIX SPECIAL CANDIES</p>
                        <p className='sub-text'>Make combinations of special candies and discover all the possible outcomes.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameRulesCandy