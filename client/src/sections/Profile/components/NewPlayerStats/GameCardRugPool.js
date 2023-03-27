import React from 'react'

function GameCardRugPool({data, allTimeStats, thisWeekData}) {
    return (
        <div className='game-card templok'>
            <div className='game-img'>
                <img src='/images/rug-pool_title.png' alt='candy' />
            </div>
            {
                !allTimeStats &&
                <div className='game-data'>
                    <p className='value yellow'>{Math.round(thisWeekData.Winrate ? thisWeekData.Winrate*100 : 0).toLocaleString('en')}</p>
                    {/* <p className='label'>Points</p> */}
                </div>
            }
            <div className='game-data'>
                {
                    allTimeStats ?
                    <p className='value'>{data.wins && data.wins !== 0 ? parseInt((data.wins/data.total_duels)*100) : 0 }%</p>:
                    <p className='value'>{thisWeekData.Winrate ? parseInt((thisWeekData.Wins/(thisWeekData.Wins + thisWeekData.Losses))*100) : 0 }%</p>
                }
                {/* <p className='label'>Win Rate</p> */}
            </div>
            <div className='game-data'>
                {
                    allTimeStats ?
                    <p className='value'>{data.total_duels !== undefined ? parseInt(data.total_duels).toLocaleString('en') : 0}</p>:
                    <p className='value'>{ thisWeekData.Wins !== undefined ? parseInt(thisWeekData.Wins) + parseInt(thisWeekData.Losses) : 0}</p>
                }
                {/* <p className='label'>Total Played</p> */}
            </div>
            {
                allTimeStats &&
                <div className='game-data'>
                    <p className='value'>{data.win_streak ? data.win_streak : 0}</p>
                    {/* <p className='label'>Win Streak</p> */}
                </div>
            }
            {
                !allTimeStats &&
                <div className='game-data'>
                    <p className='value'>{thisWeekData.order_multiplier ? thisWeekData.order_multiplier : 0}</p>
                    {/* <p className='label'>Weight</p> */}
                </div>
            }
        </div>
    )
}

export default GameCardRugPool