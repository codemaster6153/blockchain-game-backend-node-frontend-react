import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import "./top-players-histogram.css"

function TopPlayersHistogram() {
    const socialFriends = useSelector((state) => state.socialFriends)
    const citizenAvatars = useSelector(state => state.citiz);
    const trials = useSelector(state => state.trial)
    const [players, setPlayers] = useState()

    // calculating players with more friends
    useEffect(() => {
        const sortedSocialFriends = Object.keys(socialFriends)
            .filter(username => !!username)
            .map((username) => {
                const friends = socialFriends[username] ? Object.keys(socialFriends[username]) : null
                return {
                    username,
                    friends: friends,
                    friendsCount: ( friends != null && typeof friends.length != 'unefined') ? (friends.length) : 0,
                    avatar: citizenAvatars[username] ? citizenAvatars[username] : (trials[username] ? "/images/trial_avatar.png" : "/images/dummy_avatar.png")
                }
            })
            .sort((a, b) => a.friendsCount - b.friendsCount)
            .reverse()
            .slice(0, 20)

        setPlayers(sortedSocialFriends)
    }, [socialFriends, citizenAvatars, trials])

    return players && players.length ? (
        <div id="top-players-histogram">
            <div className='chart-container top-players'>
                <div className='chart-container-header'>
                    <div className='title'>
                        <p> TOP 20 PLAYERS WITH MORE FRIENDS</p>
                    </div>
                </div>
                <div className='top-players-list'>
                    {players.map((player, index) => {
                        let lineHeight = (player.friendsCount / players[0].friendsCount * 100 + 1) - 20
                        if (lineHeight <= 0) lineHeight = 1
                        return (
                            <div className='player' >
                                <span className="order">{player.friendsCount}</span>
                                <a href={`/token-mining-game/${player.username}`}>
                                    <img src={player.avatar} alt="avatar" />
                                </a>

                                <div className='line' style={{height: lineHeight + '%'}} />    
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    ) : null
}



export default TopPlayersHistogram