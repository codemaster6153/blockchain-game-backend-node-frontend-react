import React, { useState } from 'react'
import './index.css'
import './gameCard.css'
import RankingTable from './RankingTable'
import PlayerInfo from './PlayerInfo'
import { PlayerStatsToggle } from './PlayerStatsToggle'

function NewPlayerStats({wax, borderColor, joinedOn}) {

  const [playerPosition, setPlayerPosition] = useState("#XXX")

  return (
    <div className='new-player-stats-container'>
        <div className='new-player-stats-wrapper'>
            <div className='new-player-stats-info'>
              <PlayerInfo wax={wax} borderColor={borderColor} joinedOn={joinedOn} playerPosition={playerPosition} />
              <PlayerStatsToggle wax={wax} />
            </div>
            <div className='new-player-stats-ranking'>  
              <RankingTable wax={wax} setPlayerPosition={(pos) => {setPlayerPosition(pos)}}/>
            </div>
        </div>
    </div>
  )
}

export default NewPlayerStats