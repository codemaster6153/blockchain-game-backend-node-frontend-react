import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

function FriendRow({ index, username, avg, pos, apartment_score, wax, fetchFriends, isUser}) {

  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState('/images/dummy_avatar.png')

  const citizenAvatars = useSelector(state => state.citiz);
  const socialUsernames = useSelector(state => state.social);
  const trials = useSelector(state => state.trial)
  const roomData = useSelector((state) => state.room);

  const handleDpLoadError = (e) => { e.currentTarget.src = '/images/dummy_avatar.png' }

  const sleep = async (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms))
  }

  const notify = async (text, success) => {

    await sleep(500)

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
  
  const onClickClose = async () => {
    try {

      let result;

      let actions = [{
          account: "clashdomewld",
          name: "rmfriend",
          authorization: [{
            actor: wax.userAccount,
            permission: "active",
          }],
          data: {
            account: wax.userAccount,
            fraccount: username
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

      console.log(result);

      if (result) {
        notify("SUCCESSFUL TRANSACTION!", true);
        await sleep(1500);
        fetchFriends();
      }

    } catch (e) {
      notify(e.message.toUpperCase(), false);
      console.log(e.message);
    }
  }

  return (
      <tr className='data' style={{...(index % 2 !== 0) ? { backgroundColor: '#0080D033'} : {}, border: isUser ? '2px solid #FFFF4E' : ''}}>
          <td className='position'>
              <p className='rank-num'>{pos === -1 ? "X" : (pos + 1)}</p>
              <Link to={`/token-mining-game/${username}`}>
                <div className='player-dp'>
                    <div style={{position: 'relative'}}>
                      <img src={citizenAvatars[username] ? citizenAvatars[username] : (trials[username] ? "/images/trial_avatar.png" : "/images/dummy_avatar.png")} onError={handleDpLoadError} alt='avatar' />
                      {wax.userAccount !== username && roomData?.players[username] && roomData.players[username] === "ONLINE" && <div className='online-badge' />}
                    </div>
                </div>
              </Link>
              <Link to={`/token-mining-game/${username}`}>
                <p className='username'>{socialUsernames[`${username}`] ? socialUsernames[`${username}`] : username}</p>
              </Link>
          </td>
          <td className='score'>
              <p>{Math.round(avg * 100).toLocaleString('en-US')}</p>
          </td>
          <td className='apartment'>
                <div>
                <p>{apartment_score? apartment_score.toFixed(1) : "0"}</p>
                <img src='/images/voting-star-active.svg' />
                </div>

            </td>
          <td className='action' style={isUser ? { opacity: '0', cursor: 'default'} : {}} >
              {isUser ? "" : 
                <Link to={`/token-mining-game/${username}`}>
                    <div className='normal-btn'>
                        <img src='/images/challenge.svg' />
                        <p>CHALLENGE</p>
                    </div>
                </Link>
              }
          </td>
          <td className='close' style={isUser ? { opacity: '0', cursor: 'default'} : {}}>
              <img src="/images/btn_close.svg" height={30} width={30} alt="" onClick={isUser ? null : onClickClose} />

          </td>
      </tr>

  )
}

export default FriendRow