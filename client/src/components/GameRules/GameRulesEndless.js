import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import './gameRulesEndless.css'
import { Link } from 'react-router-dom'
import initConfig from '../../initConfig';
const { JsonRpc} = require("eosjs");

function GameRulesEndless() {

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
            lower_bound: 4,
            upper_bound: 4,                
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
        <div className='endless-rules-container'>
            <div className='endless-hero'>
                <div className='abs-bg-img'>
                    <Link to='/endless-siege/land-management'>
                        <div className='manage-land-btn'>
                            <img src='/images/head_orc.png' alt='headorc' />
                            <p>LAND MANAGEMENT</p>
                        </div>
                    </Link>
                </div>
                <div className='logo'>
                    <img src='/images/new_endless_section/logo.png' alt='candyHero' />
                </div>
                <div className='player-svg'>
                    <img src='/images/new_endless_section/scene.svg' alt='player' />
                    <video muted autoPlay playsInline={true} loop src='/images/new_endless_section/endless.mp4' />
                    <div className='abs-triangle'></div>
                </div>
                <div className='text'>
                    <p className='heading'>DO TOWER DEFENSE GAMES BRING YOU GOOD MEMORIES?</p>
                    <p className='sub-text'>Tower Defense is not to everyone’s taste, and yet, when you enter in the proper mental flow state, it hooks you and you can’t get enough of it. Optimizing your tactics will take time but the learning process is always so gratifying…</p>
                </div>
                <Link to='/endless-siege/land-management'>
                    <div className='manage-land-btn'>
                        <img src='/images/head_orc.png' alt='headorc' />
                        <p>LAND MANAGEMENT</p>
                    </div>
                </Link>
            </div>
            <div className='endless-replays'>
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
                                    <a href={`https://clashdome.io/endless-siege-2/play?replay=true&duel=true&player=${game.player}&id=${game.dualId}`} target='_blank' >
                                        <img className='replay' src='/images/btn_replay.svg' alt='replay' />
                                    </a>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='basic-tips'>
                <p>WITH THESE 4 TOWERS YOU’LL DEFEND OUR KINGDOM</p>
                <div>
                    <div className='tip-card'>
                        <div className='img'>
                            <video playsInline={true} muted autoPlay loop src='/images/new_endless_section/ballista.mp4' />
                        </div>
                        <p className='heading'>BALLISTA</p>
                        <p className='sub-text'>High fire rate. Low damage.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            <video playsInline={true} muted autoPlay loop src='/images/new_endless_section/cannon.mp4' />
                        </div>
                        <p className='heading'>CANNON</p>
                        <p className='sub-text'>Area damage. Low fire rate.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            <video playsInline={true} muted autoPlay loop src='/images/new_endless_section/fire.mp4' />
                        </div>
                        <p className='heading'>TORCH</p>
                        <p className='sub-text'>High damage. Low fire rate.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            <video playsInline={true} muted autoPlay loop src='/images/new_endless_section/timewrap.mp4' />
                        </div>
                        <p className='heading'>TIME WARP</p>
                        <p className='sub-text'>Slows the enemies down (area).</p>
                    </div>
                </div>
            </div>
            <div className='basic-tips'>
                <p>A FEW BASICS TO GET YOUR GAME GOING</p>
                <div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/images/new_endless_section/ballista.mp4' /> */}
                            <img src='/images/new_endless_section/make_room.svg' alt='pickaxe' />
                        </div>
                        <p className='heading'>MAKE ROOM WITH PICKAXES</p>
                        <p className='sub-text'>Use pickaxes to clear additional building spots. Rocks need 2 pickaxes to get removed.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/images/new_endless_section/cannon.mp4' /> */}
                            <img src='/images/new_endless_section/speed_up.svg' alt='pickaxe' />
                        </div>
                        <p className='heading'>SPEED UP THOSE ORCS</p>
                        <p className='sub-text'>Once you’re cool with your setup of towers you can speed up things and end your match quicker.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/images/new_endless_section/fire.mp4' /> */}
                            <img src='/images/new_endless_section/next_wave.svg' alt='pickaxe' />
                        </div>
                        <p className='heading'>CALL NEW WAVES OF ENEMIES</p>
                        <p className='sub-text'>The sooner you call a new wave, the biggest gold reward you’ll get. Taking the risk pays off.</p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/images/new_endless_section/timewrap.mp4' /> */}
                            <img src='/images/new_endless_section/one_life.svg' alt='pickaxe' />
                        </div>
                        <p className='heading'>1 SINGLE LIFE</p>
                        <p className='sub-text'>It only takes one orc to cross the border and your dreams of a pure, orc-free kingdom will be over.</p>
                    </div>
                </div>
            </div>
            <div className='basic-tips'>
                <p>DRAG MORE CARDS TO LEVEL UP AND UPGRADE</p>
                <div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/images/new_endless_section/ballista.mp4' /> */}
                            <img src='/images/new_endless_section/ballista.svg' alt='pickaxe' />
                        </div>
                        <p className='heading'>BALLISTA UPGRADES TO</p>
                        <p className='sub-text'>
                            <ul>
                                <li>Ballista II</li>
                                <li>Ballista III</li>
                            </ul>
                        </p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/images/new_endless_section/cannon.mp4' /> */}
                            <img src='/images/new_endless_section/cannon.svg' alt='pickaxe' />
                        </div>
                        <p className='heading'>CANNON UPGRADES TO</p>
                        <p className='sub-text'>
                            <ul>
                                <li>Mine Launcher (area)</li>
                                <li>Rocket Launcher (area)</li>
                            </ul>
                        </p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/images/new_endless_section/fire.mp4' /> */}
                            <img src='/images/new_endless_section/fire_torch.svg' alt='pickaxe' />
                        </div>
                        <p className='heading'>TORCH UPGRADES TO</p>
                        <p className='sub-text'>
                            <ul>
                                <li>Zapper (multi-target)</li>
                                <li>Plasma Beam (area)</li>
                            </ul>
                        </p>
                    </div>
                    <div className='tip-card'>
                        <div className='img'>
                            {/* <video muted autoPlay loop src='/images/new_endless_section/timewrap.mp4' /> */}
                            <img src='/images/new_endless_section/timewrap.svg' alt='pickaxe' />
                        </div>
                        <p className='heading'>TIME WARP UPGRADES TO</p>
                        <p className='sub-text'>
                            <ul>
                                <li>Freezer (single target)</li>
                                <li>Teleporter (single target)</li>
                            </ul>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameRulesEndless