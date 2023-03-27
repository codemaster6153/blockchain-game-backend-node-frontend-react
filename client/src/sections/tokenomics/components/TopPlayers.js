import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import "./top-players.css"

function TopPlayers() {
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
        <div className='chart-column'>
            <div className='chart-container top-players'>
                <div className='chart-container-header'>
                    <div className='title'>
                        <p> TOP 20 PLAYERS WITH MORE FRIENDS</p>
                    </div>
                </div>
                <div className='top-players-list'>
                    <div className='players-container'>
                        <div className='player-rows-container'>
                            {players.map((player, index) => {
                                if (index <= 4) {
                                    return (
                                        <div className='players-row tr'>
                                            <div className='td'>
                                                <span className="order">{player.friendsCount}</span>
                                                <a href={`https://clashdome.io/token-mining-game/${player.username}`} className='profile'>
                                                    <img src={player.avatar} alt="avatar" />
                                                    {player.username}
                                                </a>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            })}
                        </div>
                        <div className='player-rows-container'>
                            {players.map((player, index) => {
                                if (index > 4 && index <= 9) {
                                    return (
                                        <div className='players-row tr'>
                                            <div className='td'>
                                                <span className="order">{player.friendsCount}</span>
                                                <a href={`https://clashdome.io/token-mining-game/${player.username}`} className='profile'>
                                                    <img src={player.avatar} alt="avatar" />
                                                    {player.username}
                                                </a>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            })}
                        </div>
                        <div className='player-rows-container'>
                            {players.map((player, index) => {
                                if (index > 9 && index <= 14) {
                                    return (
                                        <div className='players-row tr'>
                                            <div className='td'>
                                                <span className="order">{player.friendsCount}</span>
                                                <a href={`https://clashdome.io/token-mining-game/${player.username}`} className='profile'>
                                                    <img src={player.avatar} alt="avatar" />
                                                    {player.username}
                                                </a>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            })}
                        </div>
                        <div className='player-rows-container'>
                            {players.map((player, index) => {
                                if (index > 14 && index <= 19) {
                                    return (
                                        <div className='players-row tr'>
                                            <div className='td'>
                                                <span className="order">{player.friendsCount}</span>
                                                <a href={`https://clashdome.io/token-mining-game/${player.username}`} className='profile'>
                                                    <img src={player.avatar} alt="avatar" />
                                                    {player.username}
                                                </a>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null
}

export default TopPlayers