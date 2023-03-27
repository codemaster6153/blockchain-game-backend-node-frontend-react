
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import FriendoRequestModal from '../../../../../components/Modals/FriendoRequestModal'
import './duelCard.css'

const DuelCard = ({ item, showAddFriendButton = true, fetchPendingDuels }) => {
    const socialUsernames = useSelector(state => state.social)
    const citizenAvatars = useSelector(state => state.citiz)
    const trials = useSelector(state => state.trial);
    const wax = useSelector(state => state.wax)
    const [friendoRequestModal, setFriendoRequestModal] = useState({ open: false, account: '' })
    const [loading, setLoading] = useState(false)
    const friends = useSelector(state => state.socialFriends)
    const dispatch = useDispatch()
    const roomData = useSelector((state) => state.room);
    let game_name = item.game;
    if (item.game === "endless-siege-2") {
        game_name = "endless-siege";
    }

    const tierColor = {
        '150': '#FFFF00',
        '10': '#FFC716',
        '25': '#FF7D27',
        '50': '#FF5A27',
        '0': '#FFFF89' // free
    }

    let winner
    if (parseInt(item.player1Score) > parseInt(item.player2Score)) {
        winner = item.player1Account
    } else if (parseInt(item.player1Score) < parseInt(item.player2Score)) {
        winner = item.player2Account
    } else {
        if (parseInt(item.player1Duration) < parseInt(item.player2Duration)) {
            winner = item.player1Account
        } else {
            winner = item.player2Account
        }
    }

    const d = new Date(item.date * 1000)
    const date = `${("0" + d.getDate()).slice(-2)}-${("0" + (d.getMonth() + 1)).slice(-2)}-${d.getFullYear()}`
    const time = `${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}`


    let status = 'pending';

    if (item.is_private) {
        if (wax.userAccount === item.player1Account && item.state === -1) {
            status = 'rejected';
        } else if (wax.userAccount === item.player2Account && item.state === -1) {
            status = 'youRejected';
        } else if (item.whitelist?.includes(wax.userAccount) && item.state === 0) {
            status = 'invitation';
        } else if (wax.userAccount === item.player1Account && item.state === 0) {
            status = 'pendingAccept';
        } else if (item.state < 3 && ((wax.userAccount === item.player1Account && item.player1Score) || (wax.userAccount === item.player2Account && item.player2Score))) {
            status = 'pending';
        } else if ((item.state === 2 && !item.player1Score) || (item.state === 1 && wax.userAccount === item.player1Account)) {
            status = 'accepted';
        } else if (item.state < 3 && wax.userAccount === item.player2Account && !item.player2Score) {
            status = 'accepted';
        } else if (item.player1Score != null && item.player2Score != null) {
            if (item.player1Score > item.player2Score) {
                status = wax.userAccount === item.player1Account ? "win" : "loose";
            } else if (item.player1Score < item.player2Score) {
                status = wax.userAccount === item.player2Account ? "win" : "loose";
            } else {
                if (item.player1Duration < item.player2Duration) {
                    status = wax.userAccount === item.player1Account ? "win" : "loose";
                } else {
                    status = wax.userAccount === item.player2Account ? "win" : "loose";
                }
            }
        }
    } else {
        if (item.state === 0) {
            status === "pending"
        } if (item.player1Score != null && item.player2Score != null) {
            if (item.player1Score > item.player2Score) {
                status = wax.userAccount === item.player1Account ? "win" : "loose";
            } else if (item.player1Score < item.player2Score) {
                status = wax.userAccount === item.player2Account ? "win" : "loose";
            } else {
                if (item.player1Duration < item.player2Duration) {
                    status = wax.userAccount === item.player1Account ? "win" : "loose";
                } else {
                    status = wax.userAccount === item.player2Account ? "win" : "loose";
                }
            }
        }
    }

    const sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const notify = async (text, success) => {
        dispatch({
            type: "SET_NOTIFICATION", payload: {
                text: text,
                success: success,
            }
        })

        await sleep(4800)

        dispatch({
            type: "REMOVE_NOTIFICATION", payload: {
                text: text,
                success: success,
            }
        })
    }

    const game_number = {
        'templok': 2,
        'ringy-dingy': 3,
        'endless-siege-2': 4,
        'candy-fiesta': 1,
        'rug-pool': 5
    }

    const handleReject = async () => {

        try {
            setLoading(true)
            let result;

            let actions = [{
                account: "clashdomedll",
                name: "startsession",
                authorization: [{
                    actor: wax.userAccount,
                    permission: "active",
                }],
                data: {
                    account: wax.userAccount,
                    game: game_number[item.game]
                },
            }];

            if (wax.type === "wcw") {
                result = await wax.api.transact({
                    actions: actions
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
            } else if (wax.type === "anchor") {
                result = await wax.signTransaction({
                    actions: actions
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                });
            }

            if (result) {

                let res = await fetch('/api/clashdome-game/reject-duel/' + wax.userAccount + '/' + item.id + "/" + game_number[item.game]);
                let result = await res.json();

                setLoading(false);

                if (result.error) {

                    console.log(result);
                    notify(result.error.message ? result.error.message.toUpperCase() : result.error.toUpperCase(), false);

                } else {
                    fetchPendingDuels()
                    notify("SUCCESSFUL TRANSACTION!", true);
                }
            }
        } catch (e) {
            notify(e.message.toUpperCase(), false);
            console.log(e.message);
            setLoading(false)
        }
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const renderInvitation = () => {
        return (
            <div className='invitation'>
                <Link className='accept' to={"/" + item.game + "/play?duel=true&private=true&duelID=" + item.id}>
                    <div className='accept'>ACCEPT</div>
                </Link>
                <div className='reject' onClick={handleReject}> {loading ? <img src={`/images/loading_icon.png`} className="loading" /> : "DECLINE"}</div>
            </div>
        )
    }

    const renderPendingAccept = () => {
        return (
            <div className='pending'>
                <div className='clock-container'>
                    <img src='/images/clock.svg' alt='clock' />

                </div>
                <div className='cancel-button' onClick={handleReject}> {loading ? <img src={`/images/loading_icon.png`} className="loading" /> : "CANCEL"}</div>
            </div>
        )
    }

    const renderPending = () => {
        return (
            <div className='pending'>
                <div className='clock-container'>
                    <img src='/images/clock.svg' alt='clock' />
                </div>
            </div>
        )
    }

    const renderAccepted = () => {
        return (
            <div className='status accept'>
                <p>ACCEPTED</p>
                <Link className='play-accept' to={"/" + item.game + "/play?duel=true&private=true&duelID=" + item.id}>
                    <div className='play-accept'>
                        PLAY
                        <span className='triangle' />
                    </div>
                </Link>
            </div>
        )
    }
    const renderRejected = () => {
        return (
            <div className='status reject'>
                <p>DECLINED</p>
            </div>
        )
    }

    const renderWin = (won) => {
        return (
            <div className={`status ${won === 'pending' ? 'timeout' : won ? 'accept' : 'reject'}`}>
                <p>{won === true ? 'VICTORY!' : 'DEFEAT'}</p>
                {/* <div>
                    CLAIM
                </div>             */}
            </div>
        )
    }

    const renderYouRejected = () => {
        return (
            <div className='status reject'>
                <p>YOU DECLINED</p>
            </div>
        )
    }

    const renderTimeout = () => {
        return (
            <div className='status timeout'>
                <p>TIMED OUT!</p>
                <div>
                    CLAIM
                </div>
            </div>
        )
    }

    const renderStatusMap = {
        'invitation': renderInvitation(),
        'pending': renderPending(),
        'pendingAccept': renderPendingAccept(),
        'accepted': renderAccepted(),
        'rejected': renderRejected(),
        'timeout': renderTimeout(),
        'youRejected': renderYouRejected(),
        'win': renderWin(true),
        'loose': renderWin(false),
        'inprogress': renderWin('pending'),
    }


    const renderStatus = () => {
        let adversary = wax.userAccount === item.player1Account ? item.player2Account : item.player1Account;
        const whitelist = item.whitelist ? JSON.parse(item.whitelist) : null

        if (item.is_private === 0) {
            adversary = "PENDING RIVAL"
        }

        if (!adversary) {
            if (whitelist) {
                if (whitelist.length === 1) {
                    adversary = whitelist[0]
                } else {
                    adversary = "GROUP CHALLENGE"
                }
            }
        }

        return (
            <>
                <div className='center'>
                    <div className='player' style={{ gap: 20 }}>
                        <div style={{ position: 'relative', minHeight: 65 }}>
                            {adversary === "GROUP CHALLENGE" ? (
                                <div>
                                    {Array.from({ length: 3 }).map((acc, i) => (
                                        <img
                                            src={"/images/dummy_avatar.png"}
                                            onError={e => e.currentTarget.src = '/images/dummy_avatar.png'}
                                            alt='avatar'
                                            className='avatar'
                                            style={{ position: 'relative', marginLeft: i > 0 ? -55 : 0, top: 0, zIndex: 100 - i, opacity: 1 - (i / 3) }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={citizenAvatars[adversary] ? citizenAvatars[adversary] : (trials[adversary] ? "/images/trial_avatar.png" : "/images/dummy_avatar.png")}
                                        onError={e => e.currentTarget.src = '/images/dummy_avatar.png'}
                                        alt='avatar'
                                        className='avatar'
                                    />
                                    {roomData?.players[adversary] && roomData.players[adversary] === "ONLINE" && <div className='online-badge' />}
                                </div>
                            )}


                            <img src="/images/vs.png" alt="vs" className='vs' style={{ width: 32, position: 'absolute', left: -10, bottom: 0, zIndex: 101 }} />
                        </div>

                        <div className='status-map-holder'>
                            <span className='username-holder' style={{ color: 'white' }}>{socialUsernames[`${adversary}`] ? socialUsernames[`${adversary}`] : adversary}</span>
                            {renderStatusMap[status]}
                            {/* <span>{status} {item.state}</span>
                            <span>ID: {item.id}</span>
                            <span>private: {item.is_private.toString()}</span> */}
                        </div>

                    </div>
                </div>
                <div className='right'>
                    <span>{date}</span>
                    <span>{time}</span>
                    <span>ID: {item.id}</span>
                </div>
            </>
        )
    }

    const coins = {
        'CDJIGO': "/images/icon_cdjigo.png",
        'CDCARBZ': "/images/icon_cdcarbz.png",
        'LUDIO': "/images/icon_ludio_small.png",
        'WAX': "/images/icon_wax_small.png"

    }

    const renderDuel = () => (
        <>
            <div className='center'>
                <div className='player'>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className='friend-btn' onClick={() => setFriendoRequestModal({ open: true, account: item.player1Account })} style={{ visibility: !showAddFriendButton || !(wax.userAccount !== item.player1Account && friends && friends[wax.userAccount] && !friends[wax.userAccount][item.player1Account]) ? 'hidden' : 'visible' }}>
                                <img src="/images/send-request.svg" alt='send-friend-request' style={{ transform: 'scale(1.3)' }} />
                            </div>
                            <Link to={`/token-mining-game/${item.player1Account}`} style={{ color: 'inherit' }} >
                                <div className={`username ${winner === item.player1Account ? "username-green" : "username-red"} ${item.player1Account === wax.userAccount ? 'my' : ''}`}>{socialUsernames[`${item.player1Account}`] ? socialUsernames[`${item.player1Account}`] : item.player1Account}</div>
                            </Link>
                        </div>

                        <div className='score' >
                            <Link to={"/" + item.game + "/play?replay=true&duel=true&player=1&id=" + item.id}>
                                <img src="/images/btn_replay_duel2.png" alt={item.player1Account} />
                            </Link>
                            <span>{numberWithCommas(item.player1Score)}</span>
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <img
                            src={citizenAvatars[item.player1Account] ? citizenAvatars[item.player1Account] : (trials[item.player1Account] ? "/images/trial_avatar.png" : "/images/dummy_avatar.png")}
                            onError={e => e.currentTarget.src = '/images/dummy_avatar.png'}
                            alt='avatar'
                            className='avatar'
                        />
                        {wax.userAccount !== item.player1Account && roomData?.players[item.player1Account] && roomData.players[item.player1Account] === "ONLINE" && <div className='online-badge' />}
                    </div>

                </div>
                <img src="/images/vs.png" alt="vs" className='vs' />
                <div className='player'>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={citizenAvatars[item.player2Account] ? citizenAvatars[item.player2Account] : (trials[item.player2Account] ? "/images/trial_avatar.png" : "/images/dummy_avatar.png")}
                            onError={e => e.currentTarget.src = '/images/dummy_avatar.png'}
                            alt='avatar'
                            className='avatar'
                        />
                        {wax.userAccount !== item.player2Account && roomData?.players[item.player2Account] && roomData.players[item.player2Account] === "ONLINE" && <div className='online-badge' />}
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Link to={`/token-mining-game/${item.player2Account}`} style={{ color: 'inherit' }} >
                                <div className={`username ${winner === item.player2Account ? "username-green" : "username-red"} ${item.player2Account === wax.userAccount ? 'my' : ''}`}>{socialUsernames[`${item.player2Account}`] ? socialUsernames[`${item.player2Account}`] : item.player2Account}</div>
                            </Link>
                            <div className='friend-btn' onClick={() => setFriendoRequestModal({ open: true, account: item.player2Account })} style={{ visibility: !showAddFriendButton || !(wax.userAccount !== item.player2Account && friends && friends[wax.userAccount] && !friends[wax.userAccount][item.player2Account]) ? 'hidden' : 'visible' }}>
                                <img src="/images/send-request.svg" alt='send-friend-request' style={{ transform: 'scale(1.3)' }} />
                            </div>
                        </div>

                        <div className='score' style={{ flexDirection: 'row-reverse' }}>
                            <Link to={"/" + item.game + "/play?replay=true&duel=true&player=2&id=" + item.id}>
                                <img src="/images/btn_replay_duel2.png" alt={item.player2Account} />
                            </Link>
                            <span>{numberWithCommas(item.player2Score)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='right'>
                <span>{date}</span>
                <span>{time}</span>
                <span>ID: {item.id}</span>
            </div>
        </>
    )

    return (
        <div className="duel-card">
            <div className='left'>
                <img src={"/images/" + game_name + "_title.png"} alt={game_name} />
                <div className='fee' style={{ backgroundColor: `${tierColor[item.fee.split('.')[0]] ?? '#FFFF89'}` }} >
                    <p>{item.fee.split('.')[0] === '0' ? 'FREE' : (<span> {item.fee.split('.')[0]} <img className="coin" src={coins[item.fee.split('.')[1].split(" ")[1]]} /></span>)}</p>
                </div>
            </div>
            {status === "win" || status === "loose" ? renderDuel() : renderStatus()}
            <FriendoRequestModal open={friendoRequestModal.open} account={friendoRequestModal.account} onCloseModal={() => setFriendoRequestModal({ open: false, account: '' })} wax={wax} />

        </div>
    )
}

export default DuelCard