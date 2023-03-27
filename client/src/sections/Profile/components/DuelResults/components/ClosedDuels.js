import React, { useState, useEffect } from 'react'
import './closedDuels.css'
import DuelCard from './DuelCard';

function ClosedDuels({wax}) {
    const [duals, setDuals] = useState([])
    const [loading, setLoading] = useState(true)

    const getClosedDuals = async () => {
        let res = await fetch(`/api/clashdome-game/get-player-unnotified-duels/${wax.userAccount}`);
        let result = await res.json();
        console.log("closed duels result :", result)

        setLoading(false)

        setDuals(result)
    }

    useEffect(() => {
        wax && getClosedDuals()
    }, [wax])

    if (!duals || duals.length === 0) return null

    return (
        <div className='closed-duels'>
            <div className='section-header'>
                <div className='table-title'>
                    <p>CLOSED DUELS</p>
                </div>
            </div>
            {duals && duals.map(duel => <DuelCard item={duel} key={duel.id} account={wax.userAccount} game={duel.game} showAddFriendButton={false} />)}
        </div>
    )
}

export default ClosedDuels