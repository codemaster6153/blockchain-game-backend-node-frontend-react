import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import './gameRulesTemplok.css'
import { Link } from 'react-router-dom'
import initConfig from '../../initConfig';
const { JsonRpc} = require("eosjs");

function GameRulesTemplok() {

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
            lower_bound: 2,
            upper_bound: 2,                
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
        <div className='templok-rules-container'>
            <div className='templok-hero'>
                <div className='abs-bg-img'>
                </div>
                <div className='logo'>
                    <img src='/images/new_templok/logo_templok.png' alt='candyHero' />
                </div>
                <div className='player-svg'>
                    <img src='/images/new_templok/svg/scene_templok.svg' alt='player' />
                    <video muted autoPlay loop playsInline src='/images/new_templok/templok.mp4' />
                    <div className='abs-triangle'></div>
                </div>
                <div className='text'>
                    <p className='heading'>LET’S PLAY TEMPLOK, THE MYTHICAL SPORT/ART FROM ATLANTIS</p>
                    <p className='sub-text'>Just like Atlantean merfolks composed a delicate visual poetry using luminescent blocks, you can play this chilling gravity-free version of Tetris. Clear columns and rows and set up carefully your best combos. Don’t overthink. Be one with the flow.</p>
                </div>
            </div>
            <div className='templok-replays'>
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
                                    <a href={`https://clashdome.io/templok/play?replay=true&duel=true&player=${game.player}&id=${game.dualId}`} target='_blank' >
                                        <img className='replay' src='/images/btn_replay.svg' alt='replay' />
                                    </a>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='basic-tips'>
                <p>WATER YOU WAITING FOR? LET’S DIVE INTO TEMPLOK!</p>
                <div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy_wrapped.mp4' /> */}
                            <img src="/images/new_templok/svg/dashboard.svg" alt='wraped' />
                        </div>
                        <p className='heading'>DASHBOARD</p>
                        <p className='sub-text'>Drag all the pieces from the dashboard to the main board and get 3 new pieces.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy_stripped.mp4' /> */}
                            <img src="/images/new_templok/svg/board_space.svg" alt='wraped' />
                        </div>
                        <p className='heading'>MANAGING THE BOARD SPACE</p>
                        <p className='sub-text'>Keep adding pieces to the board until it’s full. Make more room by completing columns or rows.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy-bomb.mp4' /> */}
                            <img src="/images/new_templok/svg/black_blocks.svg" alt='wraped' />
                        </div>
                        <p className='heading'>BLACK BLOCKS</p>
                        <p className='sub-text'>Black blocks can’t be cleared, so they will restrain your building space.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            <video muted autoPlay loop src='/images/new_templok/combo.mp4' />
                            {/* <img src="/images/new_candy_fiesta/combo.svg" alt='wraped' /> */}
                        </div>
                        <p className='heading'>COMBOS</p>
                        <p className='sub-text'>Clear more than 2 lines and/or rows with a single piece to get a multiplier added to your score.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy-combo.mp4' /> */}
                            <img src="/images/new_templok/svg/holder.svg" alt='wraped' />
                        </div>
                        <p className='heading'>PIECE HOLDER</p>
                        <p className='sub-text'>Drag pieces from the dashboard to the Holder to keep cycling pieces and make use of the features.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy-combo.mp4' /> */}
                            <img src="/images/new_templok/svg/reroll.svg" alt='wraped' />
                        </div>
                        <p className='heading'>FEATURE: RE-ROLL PIECES</p>
                        <p className='sub-text'>Place a piece on the Holder and use this feature to get a new random piece.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/videos/candy-combo.mp4' /> */}
                            <img src="/images/new_templok/svg/turn.svg" alt='wraped' />
                        </div>
                        <p className='heading'>FEATURE: TURN PIECES</p>
                        <p className='sub-text'>Place a piece on the Holder and use this feature to rotate the piece to a more useful orientation.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            <video muted autoPlay loop playsInline src='/images/new_templok/cross_combo.mp4' />
                            {/* <img src="/images/new_candy_fiesta/combo.svg" alt='wraped' /> */}
                        </div>
                        <p className='heading'>CROSS-CLEARING</p>
                        <p className='sub-text'>Clearing columns AND rows with a single piece will get you new Re-Rolls and Turns.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameRulesTemplok