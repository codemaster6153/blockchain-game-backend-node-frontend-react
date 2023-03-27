import React, { useState } from 'react'
import FriendSearchUser from './FriendSearchUser'

function FriendSearch({wax, fetchFriends}) {
    const [friendWallet, setFriendWallet] = useState('') 
    return (
        <div className='friend-search'> 
            <div className='header'>
                <p>ADD FRIENDOS</p>
            </div>
            <div className='search-wrapper'>
                <div>
                    <input placeholder='Type your Friendos’ Wallet' type={'text'} value={friendWallet} onChange={(e) => setFriendWallet(e.target.value)} />
                    <div>
                        <img src='/images/search.svg' alt='search' />
                    </div>
                </div>
                <FriendSearchUser data={friendWallet} wax={wax} fetchFriends={fetchFriends}/>
            </div>
        </div>
    )
}

export default FriendSearch