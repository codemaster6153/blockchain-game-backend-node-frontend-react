import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import FriendoRequestModal from '../../../../components/Modals/FriendoRequestModal';

function FriendSearchUser({ wax, data, fetchFriends }) {

  const citizenAvatars = useSelector(state => state.citiz);
  const trials = useSelector(state => state.trial)
  const dispatch = useDispatch();
  const handleDpLoadError = (e) => { e.currentTarget.src = '/images/dummy_avatar.png' }
  const [friendoRequestModal, setFriendoRequestModal] = React.useState({open: false, account: ''})

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

  const sendRequest = async () => {

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
          memo: "send_friend_request:" + data
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
      {
        data &&
        <>
          <div className='user-info'>
          <img src={citizenAvatars[data] ? citizenAvatars[data] : (trials[wax.userAccount] ? "/images/trial_avatar.png" : "/images/dummy_avatar.png")} onError={handleDpLoadError} alt='dp' />
          <div className='username'>
            <p>{data}</p>
          </div>
          </div>
          <div className='user-result'>
            <div className='send-req' onClick={() => setFriendoRequestModal({open: true, account: data})}>
              <img src='/images/icon_add_friendo.svg' alt="" height={35} width={35} />
              <p>SEND REQUEST - 100 <img src='/images/icon_cdjigo.png' alt="" height={18} width={18} /></p>
            </div>
          </div>
        </>
      }
      <FriendoRequestModal open={friendoRequestModal.open} account={friendoRequestModal.account} onCloseModal={setFriendoRequestModal} wax={wax} />
    </>

  )
}

export default FriendSearchUser