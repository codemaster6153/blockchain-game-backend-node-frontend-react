import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

/* match states
 0. invitation
 1. pending
 2. accepted
 4. rejected
 5. timeout
 6. youRejected
 7. win
 8. loose
 9. pendingAccept
*/
function FriendoMatchCard({info, wax, fetchMatches}) {

    const citizenAvatars = useSelector(state => state.citiz);
    const handleDpLoadError = (e) => { e.currentTarget.src = '/images/dummy_avatar.png' }

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    const image = {
        'templok': '/images/icon_templok.jpg',
        'ringy-dingy': '/images/icon_ringy.jpg',
        'endless-siege-2': '/images/icon_endless.jpg',
        'candy-fiesta': '/images/icon_candy.jpg',
        'rug-pool': '/images/icon_rug-pool.jpg'
    }

    const game_number = {
        'templok': 2,
        'ringy-dingy': 3,
        'endless-siege-2': 4,
        'candy-fiesta': 1,
        'rug-pool': 5
    }

    const bgcolor = {
        '75': '#ec7c05',
        '30': '#f2ba0a',
        '15': '#f8e80b',
        '150': '#fff67b',
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
                  game: game_number[info.image]
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

                let res = await fetch('/api/clashdome-game/reject-duel/' + wax.userAccount + '/' + info.id + "/" + game_number[info.image]);
                let result = await res.json();

                setLoading(false);

                if (result.error) {

                    console.log(result);
                    notify(result.error.message.toUpperCase(), false);
                    
                } else {
                    fetchMatches();
                    notify("SUCCESSFUL TRANSACTION!", true);
                }
            }
        } catch (e) {
            notify(e.message.toUpperCase(), false);
            console.log(e.message);
            setLoading(false)
        }
    }

    const sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const notify = async (text, success) => {
        dispatch({ type:"SET_NOTIFICATION", payload: {
            text: text,
            success: success,
        }})

        await sleep(4800)

        dispatch({ type:"REMOVE_NOTIFICATION", payload: {
            text: text,
            success: success,
        }})
    }

    const renderInvitation = () => {
        return(
            <div className='invitation'>
                <Link className='accept' to={"/" + info.image + "/play?duel=true&private=true&duelID=" + info.id}>
                    <div className='accept'>ACCEPT</div>
                </Link>
                <div className='reject' onClick={handleReject}> {loading ? <img src={`/images/loading_icon.png`} className="loading"/> : "REJECT"}</div>
            </div>
        )
    }

    const renderPendingAccept = () => {
        return (
            <div className='pending'>
                <div className='clock-container'>
                <img src='/images/clock.svg' alt='clock' />

                </div>
                <div className='cancel-button' onClick={handleReject}> {loading ? <img src={`/images/loading_icon.png`} className="loading"/> : "CANCEL"}</div>
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
                <Link className='play-accept' to={"/" + info.image + "/play?duel=true&private=true&duelID=" + info.id}>
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
                <p>{won === true? 'VICTORY!' : 'DEFEAT'}</p>
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

    const status = {
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

    return (
        <div className='friendo-match-card'>
            <div className='header'>
                <img src={citizenAvatars[info.username] ? citizenAvatars[info.username] : "/images/dummy_avatar_2.png"} onError={handleDpLoadError} alt='dp' />
                <img src={image[`${info.image}`]} alt={info.image} />
            </div>
            <div className='dual-type' style={{backgroundColor: `${bgcolor[info.cost] || '#fff67b'}`}}>
                <p>{info.username}</p>
                <p>{info.cost}</p>
            </div>
            <div className='footer'>
                {status[`${info.status}`]}
            </div>
        </div>
    )
}

export default FriendoMatchCard