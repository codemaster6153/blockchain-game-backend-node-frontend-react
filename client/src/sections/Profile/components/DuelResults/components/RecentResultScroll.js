import React, { useState, useEffect } from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import RecentResultCard from './RecentResultCard';
import './recentResultScroll.css'
import { JsonRpc } from 'eosjs';
import {fetch as nodefetch} from 'node-fetch'
import ExpandedResult from './ExpandedResult';
import ExpandedPendingRow from './ExpandedPendingRow';


const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1345 },
    items: 11,
    slidesToSlide: 10 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1345, min: 1010 },
    items: 8,
    slidesToSlide: 7 // optional, default to 1.
  },
  tablet2: {
    breakpoint: { max: 1010, min: 730 },
    items: 6,
    slidesToSlide: 5 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 730, min: 600 },
    items: 5,
    slidesToSlide: 4 // optional, default to 1.
  },
  mobile2: {
    breakpoint: { max: 600, min: 470 },
    items: 4,
    slidesToSlide: 3
  },
  mobile1: {
    breakpoint: { max: 470, min: 350 },
    items: 3,
    slidesToSlide: 2
  },
  mobile6: {
    breakpoint: { max: 350, min: 0 },
    items: 2,
    slidesToSlide: 1
  }
};

const CustomLeftArrow = ({ onClick, setScroll, scroll }) => {
    const handleClick = () => {
        onClick() 
        if(scroll){
            setScroll(false)
        }
    }
    return(
        <button onClick={handleClick} className="custom-left-arrow-result rotate-left" >
            <img src="/images/arrow_white.svg" />
        </button>
    )
}
const CustomRightArrow = ({ onClick, setScroll, scroll }) => {
    const handleClick = () => {
        onClick() 
        if(scroll){
            setScroll(false)
        }
    }
    return( 
    <button onClick={handleClick} className="custom-right-arrow-result" >
        <img src="/images/arrow_white.svg" />
    </button>
    )
};


function RecentResultScroll({wax}) {
    const [autoscroll, setAutoscroll] = useState(false)
    const [recentMatches, setRecentMatches] = useState([])
    const [openDuals, setOpenDuals] = useState([])

    const [pendingMatchSelected, setPendingMatchSelected] = useState({})
    const [matchSelected, setMatchSelected] = useState({})

    const getRecentMatches = async () => {

        let res = await fetch('/api/clashdome-game/get-player-duels/' + wax.userAccount + '/50');
        let result = await res.json();

        const gameAry = []

        // console.log("the recent matches are :", value)

        result.map((duel) => {

            let won = false;

            if (wax.userAccount === duel.player1Account) {
                if (duel.player1Score > duel.player2Score) {
                    won = true;
                } else if (duel.player1Score === duel.player2Score && duel.player1Duration <= duel.player2Duration) {
                    won = true;
                }
            } else if (wax.userAccount === duel.player2Account) {
                if (duel.player2Score > duel.player1Score) {
                    won = true;
                } else if (duel.player1Score === duel.player2Score && duel.player2Duration <= duel.player1Duration) {
                    won = true;
                }
            }

            const obj = {
                fee: parseInt(duel.fee.split('.')[0]) === 0 ? 'Free' : (parseInt(duel.fee.split('.')[0])),
                won: won,
                gameName: duel.game,
                time: duel.date,
                opponent: wax.userAccount === duel.player1Account ? duel.player2Account : duel.player1Account,
                matchId: duel.id,
                item: {
                    player1: {
                        score: duel.player1Score,
                        account: duel.player1Account
                    },
                    player2: {
                        score: duel.player2Score,
                        account: duel.player2Account
                    },
                    timestamp: duel.date,
                    game: duel.game,
                    id: duel.id
                },
                account: wax.userAccount
            }

            gameAry.push(obj)
        })

        gameAry.sort((a,b) => (a.time > b.time) ? -1 : ((b.time > a.time) ? 1 : 0))

        setRecentMatches(gameAry)
    }

    const getOpenDuels = async () => {

        if (wax.userAccount) {

            let res = await fetch('/api/clashdome-game/get-player-open-duels/' + wax.userAccount);
            let result = await res.json();

            if (result.state === "ERROR") {
                // console.log(result);
                // TODO: manage error
            } else {
                result = result.reverse();
                let ary = []
                if(result.length > 0){
                    // setOpenDuels(result.duels);
                    result.map((duel, index) => {
                        const obj = {
                            won: 'pending',
                            gameName: duel.game,
                            fee: parseInt(duel.fee.split('.')[0]) === 0 ? 'Free' : (parseInt(duel.fee.split('.')[0])),
                            time: duel.date,
                            id: duel.id,
                            item: duel,
                        }
                        ary.push(obj)
                    })
                }
                setOpenDuals([...ary])
            }
        }
    }

    useEffect(() => {
        getRecentMatches()
        getOpenDuels()
    }, []);
        
    return (
        <>
            {
                (recentMatches.length > 0 || openDuals.length > 0) &&
                <div className='recent-matches-container customSlider'>
                    <div className='section-header'>
                        <p>MY LAST MATCHES</p>
                    </div>
                    <Carousel
                        itemClass="image-item"
                        responsive={responsive}
                        showDots={false}
                        customRightArrow={<CustomRightArrow setScroll={setAutoscroll} scroll={autoscroll} />}
                        customLeftArrow={<CustomLeftArrow setScroll={setAutoscroll} scroll={autoscroll} />}
                        autoPlay={autoscroll}
                        autoPlaySpeed={3000}
                        infinite={false}
                        renderButtonGroupOutside={true}
                        // renderArrowsWhenDisabled={true}
                    >
                        {
                            openDuals.length > 0 && openDuals.map((match, index) => {
                                return(
                                    <RecentResultCard highlight={pendingMatchSelected.id && pendingMatchSelected.id === match.id} wax={wax} key={index} setPendingMatchSelected={setPendingMatchSelected} setMatchSelected={setMatchSelected} match={match} />
                                )
                            })
                        }
                        {
                            recentMatches.length > 0 && recentMatches.map((match, index) => {
                                return(
                                    <RecentResultCard highlight={matchSelected.item && matchSelected.item.id === match.matchId } wax={wax} key={index} setPendingMatchSelected={setPendingMatchSelected} setMatchSelected={setMatchSelected} match={match} />
                                )
                            })
                        }
                    </Carousel>

                    <div className='body'>
                        {
                            pendingMatchSelected && pendingMatchSelected.id &&
                            <ExpandedPendingRow item={pendingMatchSelected.item} key={pendingMatchSelected.item.id} account={wax.userAccount} game={pendingMatchSelected.item.game}/>
                        }
                        {
                            matchSelected && matchSelected.item &&
                            <ExpandedResult item={matchSelected.item} key={matchSelected.item.id} account={wax.userAccount} game={matchSelected.item.game === 2 ? 'templok' : matchSelected.item.game === 4 ? 'endless-siege' : matchSelected.item.game === 5 ? 'rug-pool' : 'ringy'} />
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default RecentResultScroll


