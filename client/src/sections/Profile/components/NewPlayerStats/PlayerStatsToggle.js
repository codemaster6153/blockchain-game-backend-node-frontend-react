import React, { useEffect, useState } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import initConfig from '../../../../initConfig'
import FinalCalculation from './FinalCalculation'
import GameCardCandy from './GameCardCandy'
import GameCardEndless from './GameCardEndless'
import GameCardRingy from './GameCardRingy'
import GameCardTemplok from './GameCardTemplok'
import { useParams, Link } from 'react-router-dom'
import './playerStatsToggle.css'
import GameCardRugPool from './GameCardRugPool'
import { useSelector } from 'react-redux'
const { JsonRpc } = require('eosjs')

export const PlayerStatsToggle = ({ wax }) => {
    const [candy, setCandy] = useState({})
    const [endless, setEndless] = useState({})
    const [templok, setTemplok] = useState({})
    const [ringy, setRingy] = useState({})
    const [rugPool, setRugPool] = useState({})

    const [thisWeekCandy, setThisWeekCandy] = useState({})
    const [thisWeekendless, setThisWeekEndless] = useState({})
    const [thisWeektemplok, setThisWeekTemplok] = useState({})
    const [thisWeekringy, setThisWeekRingy] = useState({})
    const [thisWeekRugPool, setThisWeekRugPool] = useState({})
    const [autoscroll, setAutoscroll] = useState(false)

    const [allTimeStats, setAllTimeStats] = useState(false)
    const [gameAry, setGameAry] = useState([])

    const [blocksList, setBlocksList] = useState([])
    const visitorSelectorsData = useSelector((state) => state.visit)
    const citizenAvatars = useSelector((state) => state.citiz)
    const trials = useSelector((state) => state.trial)
    const socialFriends = useSelector((state) => state.socialFriends)
    const roomData = useSelector((state) => state.room);
    const { id } = useParams()

    const getProfileData = async () => {
        const rpc = new JsonRpc(initConfig.waxUrl, { fetch })

        let result = await fetch(
            `/api/clashdome-game/get-player-global-duels/${id}`
        )
        result = await result.json()

        if(result.length > 0){
            result.map((unparsed_game) => {
                const payload = {
                    wins: parseInt(unparsed_game.WINS_FREE) + parseInt(unparsed_game.WINS_PAID),
                    total_duels: parseInt(unparsed_game.TOTAL_DUELS_FREE) + parseInt(unparsed_game.TOTAL_DUELS_PAID),
                    win_streak: parseInt(unparsed_game.LONGEST_WINNING_STREAK_FREE) > parseInt(unparsed_game.LONGEST_WINNING_STREAK_PAID) ? parseInt(unparsed_game.LONGEST_WINNING_STREAK_FREE) : parseInt(unparsed_game.LONGEST_WINNING_STREAK_PAID)
                }
                if(unparsed_game.game === 'endless-siege-2'){
                    setEndless(payload)
                }else if(unparsed_game.game === "candy-fiesta"){
                    setCandy(payload)
                }else if(unparsed_game.game === "templok"){
                    setTemplok(payload)
                } else if (unparsed_game.game === "ringy-dingy") {
                    setRingy(payload)
                } else if (unparsed_game.game === "rug-pool") {
                    setRugPool(payload)
                }
            })
        }else{
            setCandy({})
            setEndless({})
            setTemplok({})
            setRingy({})
            setRugPool({})
        }
    }

    const handleScoreCalculation = async () => {
        let result = await fetch(`/api/clashdome-game/weekly-personal-stats/${id}/now`);
        result = await result.json()
        console.log("the results are :", result)
        if(result.length > 0){
            let tempgameAry = []

            let gotTemplok = false
            let gotCandy = false
            let gotRingy = false
            let gotEndless = false
            let gotRugPool = false

            result.map((game) => {
                if(game.Game.trim() === "templok"){
                    const obj ={
                        name: "Templok",
                        data: game
                    }
                    tempgameAry.push(obj)
                    gotTemplok = true
                    setThisWeekTemplok(game)

                }else if(game.Game.trim() === 'ringy-dingy'){
                    const obj ={
                        name: "Ringy Dingy",
                        data: game
                    }
                    tempgameAry.push(obj)
                    gotRingy = true
                    setThisWeekRingy(game)

                }else if(game.Game.trim() === "endless-siege-2"){
                    const obj ={
                        name: "Endless Siege",
                        data: game
                    }
                    tempgameAry.push(obj)
                    gotEndless = true
                    setThisWeekEndless(game)

                }else if(game.Game.trim() === "candy-fiesta"){
                    const obj ={
                        name: "Candy Fiesta",
                        data: game
                    }
                    tempgameAry.push(obj)
                    gotCandy = true
                    setThisWeekCandy(game)
                } else if(game.Game.trim() === "rug-pool"){
                    const obj ={
                        name: "Rug Pool",
                        data: game
                    }
                    tempgameAry.push(obj)
                    gotRugPool = true
                    setThisWeekRugPool(game)
                }
            })
            tempgameAry.sort((a, b) => (a.data.Winrate > b.data.Winrate) ? -1 : ((b.data.Winrate > a.data.Winrate) ? 1 : 0))

            if(!gotCandy){
                tempgameAry.push({ name: "Candy Fiesta", data: {}})
            }
            if(!gotTemplok){
                tempgameAry.push({ name: "Templok", data: {}})
            }
            if(!gotRingy){
                tempgameAry.push({ name: "Ringy Dingy", data: {}})
            }
            if(!gotEndless){
                tempgameAry.push({ name: "Endless Siege", data: {}})
            }
            if(!gotRugPool){
                tempgameAry.push({ name: "Rug Pool", data: {}})
            }

            setGameAry([...tempgameAry])
        }else{
            let tempgameAry = []
            tempgameAry.push({ name: "Candy Fiesta", data: {}})
            tempgameAry.push({ name: "Templok", data: {}})
            tempgameAry.push({ name: "Ringy Dingy", data: {}})
            tempgameAry.push({ name: "Endless Siege", data: {}})
            tempgameAry.push({ name: "Rug Pool", data: {}})

            setGameAry([...tempgameAry])
        }
    }

    useEffect(() => {
        setCandy({})
        setEndless({})
        setTemplok({})
        setRugPool({})
        setGameAry([])
        setThisWeekCandy({})
        setThisWeekEndless({})
        setThisWeekRingy({})
        setThisWeekTemplok({})
        setThisWeekRugPool({})
        getProfileData()
        handleScoreCalculation()
    }, [id])

    const gamesJSXObj = {
        'Endless Siege': <GameCardEndless data={endless} thisWeekData={thisWeekendless} key='endless' allTimeStats={allTimeStats} />,
        'Templok': <GameCardTemplok data={templok} thisWeekData={thisWeektemplok} key='templok' allTimeStats={allTimeStats} />,
        'Candy Fiesta': <GameCardCandy data={candy} thisWeekData={thisWeekCandy} key='candy' allTimeStats={allTimeStats} />,
        'Ringy Dingy': <GameCardRingy data={ringy} thisWeekData={thisWeekringy} key='ringy' allTimeStats={allTimeStats} />,
        'Rug Pool': <GameCardRugPool data={rugPool} thisWeekData={thisWeekRugPool} key='rugpool' allTimeStats={allTimeStats} />,
    }

    const friendsList = socialFriends[id] ? Object.keys(socialFriends[id]) : []

    return (
        <div className="player-stats-toggle">
            <div className="stats-switch">
                <div>
                    {!allTimeStats && (
                        <img
                            src="/images/arrow_white.svg"
                            className="rotate-y"
                            onClick={() => setAllTimeStats(true)}
                            alt="back"
                        />
                    )}
                </div>

                <p style={{ fontSize: '20px' }}>
                    {allTimeStats ? 'ALL TIME STATS' : 'CURRENT WEEK STATS'}
                </p>
                <div>
                    {allTimeStats && (
                        <img
                            src="/images/arrow_white.svg"
                            onClick={() => setAllTimeStats(false)}
                            alt="next"
                        />
                    )}
                </div>
            </div>
            <div className="game-card header">
                <div className="game-img game-data">
                    <p className="value">Game</p>
                </div>
                {!allTimeStats && (
                    <div className="game-data">
                        <p className="value">Points</p>
                    </div>
                )}
                <div className="game-data">
                    <p className="value">Win Rate</p>
                </div>
                <div className="game-data">
                    <p className="value">Played</p>
                </div>
                {allTimeStats && (
                    <div className="game-data">
                        <p className="value">Win Streak</p>
                    </div>
                )}
                {!allTimeStats && (
                    <div className="game-data">
                        <p className="value">Weight</p>
                    </div>
                )}
            </div>

            {gameAry.map((game, index) => {
                return gamesJSXObj[game.name]
            })}

            {!allTimeStats && <FinalCalculation gameAry={gameAry} />}

            {id !== wax.userAccount && (
                <>
                    <div className="stats-switch">
                        <p style={{ fontSize: '20px', margin: '0 auto' }}>
                            FRIENDO LIST ({friendsList.length})
                        </p>
                        <div>
                            {allTimeStats && (
                                <img
                                    src="/images/arrow_white.svg"
                                    onClick={() => setAllTimeStats(false)}
                                    alt="next"
                                />
                            )}
                        </div>
                    </div>
                    <div className="frindo-lists">
                        <div className="mobile-scroll">
                            <Carousel
                                // itemClass="image-item"
                                responsive={responsive}
                                showDots={false}
                                customRightArrow={
                                    <CustomRightArrow
                                        setScroll={setAutoscroll}
                                        scroll={autoscroll}
                                    />
                                }
                                customLeftArrow={
                                    <CustomLeftArrow
                                        setScroll={setAutoscroll}
                                        scroll={autoscroll}
                                    />
                                }
                                autoPlay={autoscroll}
                                autoPlaySpeed={3000}
                                infinite={false}
                                renderButtonGroupOutside={true}
                                // renderArrowsWhenDisabled={true}
                            >
                                {friendsList.map((username) => (
                                    <Link to={'/token-mining-game/' + username}>
                                        <img
                                            src={
                                                citizenAvatars[username]
                                                    ? citizenAvatars[username]
                                                    : trials[username]
                                                    ? '/images/trial_avatar.png'
                                                    : '/images/dummy_avatar.png'
                                            }
                                        />
                                    </Link>
                                ))}
                                {Array.from({ length: 10 - (friendsList.length % 10) }).map(
                                    () => (
                                        <div className='empty-item'  />
                                    )
                                )}                                
                            </Carousel>
                        </div>
                        <div className="desktop">
                            {friendsList.map((username) => (
                                <Link to={'/token-mining-game/' + username}>
                                    <div style={{position: 'relative'}}>
                                        <img
                                            src={
                                                citizenAvatars[username]
                                                    ? citizenAvatars[username]
                                                    : trials[username]
                                                    ? '/images/trial_avatar.png'
                                                    : '/images/dummy_avatar.png'
                                            }
                                        />
                                        {wax.userAccount !== username && roomData?.players[username] && roomData.players[username] === "ONLINE" && <div className='online-badge' />}
                                    </div>

                                </Link>
                            ))}
                            {Array.from({ length: 10 - (friendsList.length % 10) }).map(
                                () => (
                                    <div className='empty-item'  />
                                )
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

const responsive = {
    mobile: {
        breakpoint: { max: 730, min: 600 },
        items: 10,
        slidesToSlide: 4, // optional, default to 1.
    },
    mobile2: {
        breakpoint: { max: 600, min: 470 },
        items: 9,
        slidesToSlide: 3,
    },
    mobile1: {
        breakpoint: { max: 470, min: 350 },
        items: 8,
        slidesToSlide: 2,
    },
    mobile6: {
        breakpoint: { max: 350, min: 0 },
        items: 6,
        slidesToSlide: 1,
    },
}

const CustomLeftArrow = ({ onClick, setScroll, scroll }) => {
    const handleClick = () => {
        onClick()
        if (scroll) {
            setScroll(false)
        }
    }
    return (
        <button onClick={handleClick} className="left-arrow rotate-left">
            <img src="/images/arrow_white.svg" />
        </button>
    )
}
const CustomRightArrow = ({ onClick, setScroll, scroll }) => {
    const handleClick = () => {
        onClick()
        if (scroll) {
            setScroll(false)
        }
    }
    return (
        <button onClick={handleClick} className="right-arrow">
            <img src="/images/arrow_white.svg" />
        </button>
    )
}
