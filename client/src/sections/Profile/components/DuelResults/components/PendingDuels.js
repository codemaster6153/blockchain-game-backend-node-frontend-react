import React, { useState, useEffect } from 'react'
import './pendingDuels.css'
import DuelCard from './DuelCard';

function PendingDuels({wax}) {
    const [duals, setDuals] = useState([])
    const [loading, setLoading] = useState(true)

    const getPendingDuals = async () => {
        let res1 = await fetch("/api/clashdome-game/get-player-pending-duels/" + wax.userAccount);
        let private_duels = await res1.json();
        console.log("pending duels result:", private_duels)
        setLoading(false)

        setDuals(private_duels)
    }

    useEffect(() => {
        wax && getPendingDuals()
    }, [wax])

    if (!duals || duals.length === 0) return null

    return (
        <div className='closed-duels'>
            <div className='section-header'>
                <div className='table-title'>
                    <p>PENDING DUELS</p>
                </div>
            </div>
            {duals && duals.map(duel => <DuelCard item={duel} key={duel.id} account={wax.userAccount} game={duel.game} showAddFriendButton={false} fetchPendingDuels={getPendingDuals} />)}
        </div>
    )
}

export default PendingDuels