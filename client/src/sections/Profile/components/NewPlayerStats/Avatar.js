import React from 'react'
import {useParams} from 'react-router-dom'
import TokenMiningGameLoader from '../../../../components/GameLoaders/TokenMiningGameLoader'

function Avatar({wax, loginFromGame}) {

    const params = useParams()
    
    
    return (
        <div className="avatar-container">
        {
            wax && wax.userAccount ?
            <TokenMiningGameLoader wax={wax} loginFromGame={loginFromGame} />:
            ""
        }
        </div>
    )
}

export default Avatar