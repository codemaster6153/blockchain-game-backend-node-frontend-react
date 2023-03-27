import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

function PendingRow({ index, username, id, status, wax, fetchFriends, fetchFriendRequests}) {

  const dispatch = useDispatch();
  const citizenAvatars = useSelector(state => state.citiz);
  const trials = useSelector(state => state.trial)
  const socialUsernames = useSelector(state => state.social)
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

  const onClickConfirm = async () => {

    try {
      let result;

      let actions = [{
        account: "clashdometkn",
        name: "transfer",
        authorization: [{
          actor: wax.userAccount,
          permission: "active",
        }],
        data: {
          from: wax.userAccount,
          to: "clashdomewld",
          quantity: "100.0000 CDJIGO",
          memo: "accept_friend_request:" + username
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
        fetchFriendRequests()
      }

    } catch (e) {
      notify(e.message.toUpperCase(), false);
      console.log(e.message);
    }
  }

  const onClickClose = async () => {
    try {

      let result;

      let actions = [{
          account: "clashdomewld",
          name: "declinefreq",
          authorization: [{
            actor: wax.userAccount,
            permission: "active",
          }],
          data: {
            account: wax.userAccount,
            from: username
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
        fetchFriendRequests()
      }

    } catch (e) {
      notify(e.message.toUpperCase(), false);
      console.log(e.message);
    }
  }

  const onClickCancel = async () => {
    let result;
    let actions = [{
      account: "clashdomewld",
      name: "cancelfreq",
      authorization: [{
        actor: wax.userAccount,
        permission: "active",
      }],
      data: {
        account: wax.userAccount, 
        id: id
        }
      }];

    try {
        if (wax.type === "wcw") {
          result = await wax.api.transact({ actions: actions }, { blocksBehind: 3, expireSeconds: 30 });
        } else if (wax.type === "anchor") {
          result = await wax.signTransaction({ actions: actions }, { blocksBehind: 3, expireSeconds: 30 });
        }

        if (result) {
          notify("SUCCESSFUL TRANSACTION!", true);
          await sleep(1500);
          fetchFriends();
          fetchFriendRequests()
        }

    } catch (e) {
  
        notify(e.message.toUpperCase(), false);

    }
  }

  return (
    <>
      <tr className='data' style={(index % 2 !== 0) ? { backgroundColor: '#0080D033' } : { backgroundColor: '#001A44'}}>
        <td className='position'>
          <p className='rank-num'>{index + 1}</p>
          <Link to={`/token-mining-game/${username}`}>
            <div className='player-dp'>
              <div style={{position: 'relative'}}>
                <img src={citizenAvatars[username] ? citizenAvatars[username] : (trials[username] ? "/images/trial_avatar.png" : "/images/dummy_avatar.png")} onError={handleDpLoadError} alt='avatar' />
                {wax?.userAccount !== username && roomData?.players[username] && roomData?.players[username] === "ONLINE" && <div className='online-badge' />}
              </div>
            </div>  
          </Link>

          <Link to={`/token-mining-game/${username}`}>
            <p className='username'>{socialUsernames[`${username}`] ? socialUsernames[`${username}`] : username}</p>
          </Link>
        </td>
        <td className='score'>
        </td>
        <td className='action'>
          <div className={status === 'confirm' ? 'confirm-btn' : null} onClick={status === 'confirm' ? onClickConfirm : null}>
            <p>{status === 'confirm' ? 'CONFIRM - 100' :
              <img src="/images/icon-open-clock.svg" className='clock-icon' height={30} width={30} alt="" />
            }</p>
            {status === 'confirm' && <img src='/images/icon_cdjigo.png' alt=""  height={20} width={20} />}
          </div>
        </td>
        <td className='close'>
        {status === 'confirm'&& <img src="/images/btn_close.svg" height={30} width={30} alt="" onClick={onClickClose}/>}
        {status === 'pending'&& <img src="/images/btn_close.svg" height={30} width={30} alt="" onClick={onClickCancel}/>}
        </td>
      </tr>
    </>
  )
}

export default PendingRow;