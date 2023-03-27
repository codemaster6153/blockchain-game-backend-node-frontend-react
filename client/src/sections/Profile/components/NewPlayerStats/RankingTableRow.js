import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import FriendoRequestModal from '../../../../components/Modals/FriendoRequestModal';
import { sendFR } from '../../../Finance/ApartmentVoting'

function RankingTableRow({table, data, rank, length, wax}) {
    const[avatar, setAvatar] = useState('/images/dummy_avatar.png')
    const citizenAvatars = useSelector(state => state.citiz)
    const trials = useSelector(state => state.trial)
    const socialUsernames = useSelector(state => state.social)
    const userLength = (data?.username?.length || socialUsernames[`${data.username}`]?.length) > 20;
    const [friendoRequestModal, setFriendoRequestModal] = useState({open: false, account: ''})
    const roomData = useSelector((state) => state.room);

    const handleDpLoadError = (e) => {e.currentTarget.src = '/images/dummy_avatar.png'}


    const handleGetAvatar = async () => {
        if(citizenAvatars[`${data.username}`]){
            setAvatar(citizenAvatars[`${data.username}`]);
        }else if (trials && trials[data.username]) {
            setAvatar("/images/trial_avatar.png");
        } else{
            setAvatar("/images/dummy_avatar.png");
        }
    }

    const scrollTop = () => {
        if(window){
            window.scrollTo(0,0)
        }
    }

    useEffect(() => {
        handleGetAvatar()
    }, [citizenAvatars, trials, data])

    function getLengthWithoutNulls(lb){
        
        var counter=lb.length-1;
        while(counter !== -1 && lb[counter].avg_wr==0){
            counter --;
        }
        counter++;
        return counter
    }


    return (
        <tr className='data' style={{...(rank%2 !== 0 ) ? {backgroundColor: '#0080D033'}: {}, border: data.username === wax.userAccount ? '2px solid #FFEE57' : '' }}>
            <td className='position'>
                <p className='rank-num'>{rank + 1}</p>
                <Link to={`/token-mining-game/${data.username}`}>
                    <div onClick={scrollTop} className='player-dp'>
                        <div style={{position: 'relative'}}>
                            <img src={avatar} onError={handleDpLoadError} alt='avatar' />
                            {wax?.userAccount !== data.username && roomData?.players[data.username] && roomData?.players[data.username] === "ONLINE" && <div className='online-badge' />}
                        </div>
                        
                    </div>
                </Link>
                <Link to={`/token-mining-game/${data.username}`}>
                    <p onClick={scrollTop} className='username' style={{ width: userLength && '112px', textOverflow: userLength && 'ellipsis' }}>
                      {socialUsernames[`${data.username}`] ? socialUsernames[`${data.username}`] : data.username}
                      </p>
                </Link>
                {!data.is_friend && <div className='add-friend-btn' onClick={() => setFriendoRequestModal({open: true, account: data.username})} style={{height: 30, width: 50}}>
                    <img src="/images/send-request.svg" alt='send-friend-request' style={{transform: 'scale(1.3)'}}  />
                </div>}
            </td>
            <td className='score'>
                <p>{Math.round(data.avg_wr * 100).toLocaleString('en-US')}</p>
            </td>
            <td className='reward'>
                <p className='rev-num' style={{opacity: data.Entry_fee_flag ? 1 : 0.5}}>{'x' + getMultipier(rank, getLengthWithoutNulls(table))}</p>
            </td>
            <td className='apartment'>
                <div>
                <p>{data.apartment_score ? data.apartment_score.toFixed(1) : "0"}</p>
                <img src='/images/voting-star-active.svg' />
                </div>

            </td>
            <td className='actions'>
                {wax.userAccount !== data.username && (
                    <div>
                      <Link to={`/token-mining-game/${data.username}`}>
                            <div className='action-button' style={{background: '#fbf142'}}>
                                <img src='/images/challenge.svg' />
                                <span style={{color: '#4d2008'}}>CHALLENGE</span>
                            </div>
                        </Link>
                    </div>
                )}

            </td>
            <FriendoRequestModal open={friendoRequestModal.open} account={friendoRequestModal.account} onCloseModal={setFriendoRequestModal} wax={wax} />
        </tr>
    )
}

function getMultipier(player_position, ladeboard_length) {
    var increment = 0.025;
    var group_number = 5;
    var minimum_multiplier = 1;
    var starting_multiplier=1+increment;
    // last group of players get minimum multiplier
    var displacement=ladeboard_length-(group_number+Math.floor((ladeboard_length-group_number)/group_number)*group_number);
    //first game of the week multiplier for each player will be the minimum (last in ladeboard)
    if (player_position<0){return minimum_multiplier}
    if(player_position<displacement){
        var number_of_groups = Math.floor(ladeboard_length / group_number);
        return +(Math.round((starting_multiplier + (increment * (number_of_groups))) + "e+3") + "e-3");
    }else if(player_position>=ladeboard_length){
        return minimum_multiplier
    }
    else{
    var number_of_groups = Math.floor(ladeboard_length / group_number);
    var player_group = Math.floor((player_position+(group_number-displacement)) / group_number);
    var player_multiplier = starting_multiplier + (increment * (number_of_groups - player_group));
    return +(Math.round(player_multiplier + "e+3") + "e-3");}
}

export default RankingTableRow