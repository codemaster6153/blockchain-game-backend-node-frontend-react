import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import BlockedRow from './BlockedRow'
import FriendoMatchScroll from './FriendoMatchScroll'
import FriendRow from './FriendRow'
import FriendSearch from './FriendSearch'
import GroupChallengeRequestModal from './GroupChallengeRequestModal'
import './index.css'
import PendingRow from './PendingRow'

const data = [{
  rank: 1,
  username: 'holatodoelmu',
  status: 'confirm',
}, {
  rank: 32,
  username: 'crthj.wam',
  status: 'pending',
}]

function Friendos({ wax, frequests, fetchFriendRequests, goToDuels }) {
  const [friendsList, setFriendsList] = useState([])
  const [blocksList, setBlocksList] = useState([])
  const visitorSelectorsData = useSelector(state => state.visit);
  const [groupChallengeRequestModal, setGroupChallengeRequestModal] = useState(false)

  const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const fetchFriends = async () => {

    let leaderboard = await fetch("/api/clashdome-game/weekly-ladeboard/now")
    leaderboard = await leaderboard.json()

    const resp = await wax.rpc.get_table_rows({
      json: true,
      code: "clashdomewld",
      scope: "clashdomewld",
      table: "social",
      limit: 1,
      lower_bound: wax.userAccount,
      upper_bound: wax.userAccount,
      show_payer: false,
    });

    if (resp.rows.length) {
      if (JSON.parse(resp.rows[0].data).fr) {

        let friends = JSON.parse(resp.rows[0].data).fr;

        let ldb_row_user = leaderboard.find(row => row.username === wax.userAccount);
        let ldb_row_index = leaderboard.findIndex(row => row.username === wax.userAccount);
        let friendsListAux = [{ username: wax.userAccount, avg: ldb_row_user ? ldb_row_user.avg_wr : 0, pos: ldb_row_index }];
        for (const [key, value] of Object.entries(friends)) {

          let row = { username: key, avg: 0, apartment_score: 0 };
          let ldb_row = leaderboard.find(row => row.username === key);
          row.pos = leaderboard.findIndex(row => row.username === key);
          if (ldb_row) {
            row.avg = ldb_row.avg_wr;
          }
          

          if (visitorSelectorsData[key] &&(typeof(visitorSelectorsData[key]["as"]) !== 'undefined') && (typeof(visitorSelectorsData[key]["as"]["v"]) !== 'undefined')  && (typeof(visitorSelectorsData[key]["as"]["n"]) != 'undefined')){
                
            row.apartment_score = visitorSelectorsData[key]["as"]["v"] / visitorSelectorsData[key]["as"]["n"];
          }else{
            row.apartment_score = 0;
          }
          friendsListAux.push(row);
        }

        let playeridx = friendsListAux.findIndex(row => row.username === wax.userAccount);
        if (visitorSelectorsData[wax.userAccount] &&(typeof(visitorSelectorsData[wax.userAccount]["as"]) !== 'undefined') && (typeof(visitorSelectorsData[wax.userAccount]["as"]["v"]) !== 'undefined')  && (typeof(visitorSelectorsData[wax.userAccount]["as"]["n"]) != 'undefined')){
                
          friendsListAux[playeridx].apartment_score = visitorSelectorsData[wax.userAccount]["as"]["v"] / visitorSelectorsData[wax.userAccount]["as"]["n"];
        }else{
          friendsListAux[playeridx].apartment_score = 0;
        }
        friendsListAux = friendsListAux.sort((a, b) => b.pos - a.pos).sort((a, b) => b.avg - a.avg);
        setFriendsList(friendsListAux);
      }
      if (JSON.parse(resp.rows[0].data).bl) {
        setBlocksList(JSON.parse(resp.rows[0].data).bl);
      }
    }
  }

  useEffect(() => {
    fetchFriends();
  }, [wax])

  return (
    <div className='friendos-table'>
      <div className='friendos-table-wrapper'>
        <div className='friendos-table-container'>
          <FriendSearch wax={wax} fetchFriends={fetchFriends}/>
        </div>
        <div className='friendos-table-container'>

          <div className='friends-list'>
            <div className='header'>
              <p>FRIENDO LIST RANKING</p>
            </div>
            <div className='table-responsive'>
              <table>
                <tbody>
                  <tr className="header" >
                    <th className='postion'>FRIENDO</th>
                    <th className='score'>SCORE</th>
                    <th className='score'>APARTMENT</th>
                    <th className='action'></th>
                    <th className='action'></th>
                  </tr>
                  <tr>
                    <td colspan="5">
                      <div  className='group-challenge-button' onClick={() => setGroupChallengeRequestModal(true)}>
                        <img src='/images/challenge.svg' />
                        <p>GROUP CHALLENGE</p>
                      </div>
                    </td>
                  </tr>


                  {
                    friendsList.map((row, index) => (
                      <FriendRow key={index} index={index} username={row.username} avg={row.avg} pos={row.pos} apartment_score={row.apartment_score} wax={wax} fetchFriends={fetchFriends} isUser={row.username === wax.userAccount} />
                    ))
                  }
                </tbody>
              </table>
            </div>


            
            {
              frequests.length > 0 ?
                <div>
                  <div className='header'>
                    <p>PENDING REQUESTS</p>
                  </div>
                  <div className='table-responsive'>
                    <table>
                      <tbody>
                        {
                          frequests.map((row, index) => (
                            <PendingRow key={index} index={index} username={row.username} id={row.id} status={row.status} wax={wax} fetchFriends={fetchFriends} fetchFriendRequests={fetchFriendRequests} />
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
                :
                ""
            }
            {Object.keys(blocksList).length > 0 ?
              <div>
                <div className='header'>
                  <p>BLOCKED</p>
                </div>
                <div className='table-responsive'>
                  <table>
                    <tbody>
                      {
                        Object.keys(blocksList).map((key, index) => (
                          <BlockedRow key={index} index={index} username={key} wax={wax} fetchFriends={fetchFriends} />
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              :
              ""}

          </div>
        </div>
      </div>
      <GroupChallengeRequestModal open={groupChallengeRequestModal} onCloseModal={setGroupChallengeRequestModal} wax={wax} goToDuels={goToDuels}/>
    </div>
  )
}

export default Friendos