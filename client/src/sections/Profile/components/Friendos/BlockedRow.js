import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

function BlockedRow({index, username, wax, fetchFriends}) {

  const dispatch = useDispatch();

  const citizenAvatars = useSelector(state => state.citiz);
  const socialUsernames = useSelector(state => state.social)
  const trials = useSelector(state => state.trial)

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
          name: "ubaccount",
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
    <>
      <tr className='data' style={(index % 2 !== 0) ? { backgroundColor: '#0080D033' } : { backgroundColor: '#001A44'}}>
          <td className='position'>
            <p className='rank-num'>{index + 1}</p>
            <div className='player-dp'>
            <img src={citizenAvatars[username] ? citizenAvatars[username] : (trials[username] ? "/images/trial_avatar.png" : "/images/dummy_avatar.png")} onError={handleDpLoadError} alt='avatar' />
            </div>
            <p className='username'>{socialUsernames[`${username}`] ? socialUsernames[`${username}`] : username}</p>
          </td>
          <td className='score'>
          </td>
          <td className='action'>
            <div className='blocked-btn' onClick={onClickClose}>
              <p>UNBLOCK</p>
            </div>
          </td>
          <td className='score'>
          </td>
        </tr>
    </>
  )
}

export default BlockedRow;