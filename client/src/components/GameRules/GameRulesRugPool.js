import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import './gameRulesRugPool.css'
import { Link } from 'react-router-dom'
import initConfig from '../../initConfig';
const { JsonRpc} = require("eosjs");

function GameRulesRugPool() {

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
            lower_bound: 5,
            upper_bound: 5,                
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
        <div className='rugPool-rules-container'>
            <div className='rugPool-hero'>
                <div className='abs-bg-img'>
                    <Link to='/rug-pool/hall-management'>
                        <div className='manage-land-btn'>
                            <img src='/images/newRugPool/8_ball.svg' alt='8ball' />
                            <p>POOL HALL MANAGEMENT</p>
                        </div>
                    </Link>
                </div>
                <div className='logo'>
                    <img src='/images/newRugPool/logo_rug_pool.png' alt='rugpoolHero' />
                </div>
                <div className='player-svg'>
                    <img src='/images/newRugPool/scene_rugpool.svg' alt='player' />
                    <video muted autoPlay loop playsInline src='/images/newRugPool/rugpool_loop_trailer.mp4' />
                    <div className='abs-triangle'></div>
                </div>
                <div className='text'>
                    <p className='heading'>THE FIRST TIME YOU WILL ENJOY BEING PART OF A ‘RUG POOL’</p>
                    <p className='sub-text'>So you want to earn by playing pool but don’t want to get involved in a bar fight, dodging stools and smashing beer bottles into other player’s heads? There’s no need to expose yourself when you can join the pool hall hustlers in our competitive billiard game from the coziness of your home!</p>
                </div>
                <Link to='/rug-pool/hall-management'>
                    <div className='manage-land-btn'>
                        <img src='/images/newRugPool/8_ball.svg' alt='8ball' />
                        <p>POOL HALL MANAGEMENT</p>
                    </div>
                </Link>
            </div>
            <div className='rugPool-replays'>
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
                                    <a href={`https://clashdome.io/rug-pool/play?replay=true&duel=true&player=${game.player}&id=${game.dualId}`} target='_blank' >
                                        <img className='replay' src='/images/btn_replay.svg' alt='replay' />
                                    </a>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='basic-tips'>
                <p>CHALK YOUR CUE AND KEEP POCKETING LIKE A CHAMP.</p>
                <div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy_wrapped.mp4' /> */}
                            <img src="/images/newRugPool/video/timer.svg" alt='wraped' />
                        </div>
                        <p className='heading'>60 SECONDS TO DO THE JOB</p>
                        <p className='sub-text'>Sink those balls quickly or your time will be over. Each pocketed ball will get you extra seconds.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy_stripped.mp4' /> */}
                            <img src="/images/newRugPool/video/new_rack.svg" alt='wraped' />
                        </div>
                        <p className='heading'>RUNNING OUT OF BALLS?</p>
                        <p className='sub-text'>Sink all the balls and clear the rack to will receive +150 points and a new rack.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy-bomb.mp4' /> */}
                            <img src="/images/newRugPool/video/combo.svg" alt='wraped' />
                        </div>
                        <p className='heading'>EXTRA POINTS WITH COMBOS</p>
                        <p className='sub-text'>Get combos by sinking multiple balls with a single shot and get your score multiplied.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/images/newRugPool/video/bounce.svg' /> */}
                            <img src="/images/newRugPool/video/bounce.svg" alt='wraped' />
                        </div>
                        <p className='heading'>BOUNCING THE CUE BALL</p>
                        <p className='sub-text'>Every time the white cue ball hits the pool table cushions you will score +5 points.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy-combo.mp4' /> */}
                            <img src="/images/newRugPool/video/bonus.svg" alt='wraped' />
                        </div>
                        <p className='heading'>BE AWARE OF THE BONUS</p>
                        <p className='sub-text'>Sink the ball in the highlighted pocket to multiply your points. Missing a shot will reset the Bonus.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameRulesRugPool