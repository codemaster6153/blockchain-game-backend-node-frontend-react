import React from 'react'
import './recentResultCard.css'
import moment from 'moment'

function RecentResultCard({match, setMatchSelected, wax, highlight, setPendingMatchSelected}) {

    const image = {
        'templok': '/images/icon_templok.jpg',
        'ringy-dingy': '/images/icon_ringy.jpg',
        'endless-siege-2': '/images/icon_endless.jpg',
        'candy-fiesta': '/images/icon_candy.jpg',
        'rug-pool': '/images/icon_rug-pool.jpg'
    }

    const bgcolor = {
        '0.03': '#ec7c05',
        '50': '#ec7c05',
        '25': '#f2ba0a',
        '10': '#f8e80b',
        '0.02': '#f2ba0a',
        '0.01': '#f8e80b',
        'Free': '#ffff1f'
    }

    const handleClick = () => {
        if(match.won !== 'pending'){
            setMatchSelected(match)
            setPendingMatchSelected({})
        }else{
            setMatchSelected({})
            setPendingMatchSelected(match)
        }
    }
    return (
        <div className={`recent-dual-scroll-card ${highlight && match.won === 'pending' ? 'pending-highlight' : highlight && match.won ? 'win-highlight' : highlight && !match.won ? 'lose-highlight' : ''}`} onClick={handleClick}>
            <div className='header'>
                <div className='bg-img'>
                    <img src={image[`${match.gameName}`]} alt={match.gameName} />
                </div>
                <div className='abs-result'>
                    <img src={match.won === 'pending' ? "/images/icon_pending.svg" : match.won ? '/images/icon_victory.svg' : '/images/icon_defeat.svg'} />
                </div>
            </div>
            <div className='dual-type' style={{backgroundColor: `${bgcolor[match.fee]}`}}>
                <p>{match.fee}</p>
            </div>
            <div className='recent-dual-footer'>
                <p>{match.time !== 0 ? moment(match.time * 1000).format('HH:mm DD-MM') : "???"}</p>
            </div>
        </div>
    )
}

export default RecentResultCard
