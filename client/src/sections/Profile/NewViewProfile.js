import React, {useEffect, useState} from 'react'
import './newViewProfile.css'
import { useParams, useHistory } from 'react-router-dom'

import UserProfileNavbar from './components/UserProfileNavbar'
import Stake from './components/Stake'
import DuelResults from './components/DuelResults'
import { useDispatch, useSelector} from 'react-redux'
import { ClashdomeMessageServer } from '../../utils/ClashdomeMessageServer';
import { NewPlayerStats } from './components/NewPlayerStats'
import initConfig from '../../initConfig'
import Avatar from './components/NewPlayerStats/Avatar'
import { Friendos } from './components/Friendos'
import VotingEventAlert from './components/ApartmentVoting/EventAlert';
import VotingBar from './components/ApartmentVoting/VotingBar'
import { disablenot, endMission, getApartmentNotification, initMission } from '../Finance/ApartmentVoting'
const { JsonRpc} = require("eosjs");


function NewViewProfile({loginFromGame, wax, hasEarlyAccess}) {
    const { id, action } = useParams()
    const [candy, setCandy] = useState({})
    const [endless, setEndless] = useState({})
    const [templok, setTemplok] = useState({})
    const [ringy, setRingy] = useState({})
    const [ludioBal, setLudioBal] = useState('')
    const [waxBal, setWaxBal] = useState('')
    const history = useHistory()
    const [navState, setNavState] = useState(0)
    const [borderColor, setBorderColor] = useState(2)
    const dispatch = useDispatch()
    const [joiningDate, setJoiningDate] = useState('')
    const visitorSelectorsData = useSelector(state => state.visit);
    const [showEventAlert, setShowEventAlert] = useState(false);
    const [showVotingBar, setShowVotingBar] = useState(false);
    const [showVotingBarCapsule, setShowVotingBarCapsule] = useState(false);
    const [votingApartmentList, setVotingApartmentList] = useState({})
    const [votingApartmentVotes, setVotingApartmentVotes] = useState({})
    const [lockVotingBar, setLockVotingBar] = useState(false)
    const [submitedVote, setSubmitedVote] = useState(null)
    const [submitedVoteReceiver, setSubmitedVoteReceiver] = useState(null)
    const [showSuccessVotePopup, setShowSuccessVotePopup] = useState(false)
    
    const [frequests, setFrequests] = useState([])
    const [pendingDuels, setPendingDuels] = useState([])

    const onMessageFromGame = (result, visitorsData) => {

        if (result.type === "transaction") {
            if (result.data.error) {
                notify(result.data.message, false);
            } else {
                notify("SUCCESSFUL TRANSACTION!", true);
            }
        } else if (result.type === "scroll") {
            window.scrollTo(0, 550);
            setTimeout(() => {
                setNavState(1);
            }, 500)
            
        } else if (result.type === "scroll-craft") {
            window.scrollTo(0, 550);
            setTimeout(() => {
                setNavState(2);
            }, 500)
            
        } else if (result.type === "launch-game") {
            history.push(result.data);
        } else if (result.type === "fetch-visitors") {
            ClashdomeMessageServer.dispatchMessageToGame({id: "token-mining-game", payload: {type: "visitors_data", data: visitorsData}});
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

    useEffect(() => {
        // If there is 'view' query in URL, switch the view to that
        if(history.location?.search) {
            const url = new URL(window.location.href)
            const params = new URLSearchParams(url.search)
            const view = params.get("view")

            if(view){
                // using setTimeout to make sure all states
                // are rendered before switching the view
                let timeout = setTimeout(() => {
                    setNavState(Number(view))
                    clearTimeout(timeout)
                }, 300)
            }
        }
    }, [history])

    useEffect(() => {

        ClashdomeMessageServer.removeCustomEventListener("token-mining-game", null, this);

        ClashdomeMessageServer.addCustomEventListener("token-mining-game", (data) => {
            onMessageFromGame(data, visitorSelectorsData);
        }, this);

    }, [visitorSelectorsData])

    useEffect(() => {

        ClashdomeMessageServer.removeCustomEventListener("token-mining-game", null, this);

        ClashdomeMessageServer.addCustomEventListener("token-mining-game", (data) => {
            onMessageFromGame(data, visitorSelectorsData);
        }, this);
    }, [])


    const getFriendRequests = async (wax) => {
        const resp3 = await wax.rpc.get_table_rows({
            json: true,
            code: "clashdomewld",
            scope: "clashdomewld",
            table: "frequests",
            limit: 500,
            index_position: 3,
            key_type: "i64",
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,
            show_payer: false,
        });
        
        const resp2 = await wax.rpc.get_table_rows({
            json: true,
            code: "clashdomewld",
            scope: "clashdomewld",
            table: "frequests",
            limit: 500,
            index_position: 2,
            key_type: "i64",
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,
            show_payer: false,
        });
        
        let pedList = [];
        
        for (let i = 0; i < resp3.rows.length; i++) {
            pedList.push({ username: resp3.rows[i].from, status: 'confirm' })
        }
        
        for (let i = 0; i < resp2.rows.length; i++) {
            pedList.push({ username: resp2.rows[i].to, status: 'pending', id: resp2.rows[i].id })
        }

        setFrequests(pedList)
    }

    const getPendingDuels = async (wax) => {

        let result = await fetch(`/api/clashdome-game/get-private-duels-pending/${wax.userAccount}`);
        result = await result.json()

        setPendingDuels(result.duels);
    }

    const getProfileData = async () => {
        const rpc = new JsonRpc(initConfig.waxUrl, { fetch });
        let data = [];
        if(rpc !== undefined){
            let value = await rpc.get_table_rows({
                json: true,                 
                code: "clashdomedll",       
                scope: "clashdomedll",      
                table: "players2",  
                limit: 1,
                index_position: 1,
                key_type: "i64",
                lower_bound: id,
                upper_bound: id,                
                reverse: true,             
                show_payer: false,    
            });

            if (value.rows[0]) {
                const tempJoinDate = value.rows[0].first_log_timestamp * 24 * 60 * 60 * 1000
                setJoiningDate(tempJoinDate)
    
                if(value.rows && value.rows[0] && value.rows[0].games_data){
                    value.rows[0].games_data.map((unparsed_game) => {
                        let game = JSON.parse(unparsed_game)
                        const payload = {
                            wins: parseInt(game.wf) + parseInt(game.wp),
                            total_duels: parseInt(game.tf) + parseInt(game.tp),
                            win_streak: parseInt(game.lf) > parseInt(game.lp) ? parseInt(game.lf) : parseInt(game.lp)
                        }
                        if(game.id === 'endless-siege-2'){
                            setEndless(payload)
                        }else if(game.id === "candy-fiesta"){
                            setCandy(payload)
                        }else if(game.id === "templok"){
                            setTemplok(payload)
                        } else if (game.id === "ringy-dingy") {
                            setRingy(payload)
                        }
                    })
                } else{
                    setCandy({})
                    setEndless({})
                    setTemplok({})
                    setRingy({})
                }
            } else{
                setCandy({})
                setEndless({})
                setTemplok({})
                setRingy({})
            }    

            let waxbal = await rpc.get_currency_balance("eosio.token", id, "WAX")

            if (waxBal) {
                setWaxBal(parseFloat(waxbal[0].split(' ')[0]).toLocaleString('en-GB'))
            }

            let ludiobal = await rpc.get_currency_balance("clashdometkn", id, "LUDIO")

            if (ludioBal) {
                setLudioBal(parseFloat(ludiobal[0].split(' ')[0]).toLocaleString('en-GB'))
            }
            
        }
    }


    useEffect(() => {
        setNavState(0)
        setCandy({})
        setEndless({})
        setTemplok({})
        getProfileData()
    }, [id])


    useEffect(() => {
        if(
            (templok.total_duels && templok.total_duels > 50) ||
            (candy.total_duels && candy.total_duels > 50) ||
            (ringy.total_duels && ringy.total_duels > 50) ||
            (endless.total_duels && endless.total_duels > 50)
        ){
            if(
                (templok.MMR && templok.MMR > 1100) ||
                (candy.MMR && candy.MMR > 1100) ||
                (ringy.MMR && ringy.MMR > 1100) ||
                (endless.MMR && endless.MMR > 1100)
            ){
                setBorderColor(0)
            }else if(
                (templok.MMR && templok.MMR > 1000) ||
                (candy.MMR && candy.MMR > 1000) ||
                (ringy.MMR && ringy.MMR > 1000) ||
                (endless.MMR && endless.MMR > 1000)
            ){
                setBorderColor(1)
            }else{
                setBorderColor(2)
            }
        }else if(
            (templok.total_duels && templok.total_duels > 30) ||
            (candy.total_duels && candy.total_duels > 30) ||
            (ringy.total_duels && ringy.total_duels > 30) ||
            (endless.total_duels && endless.total_duels > 30)
        ){
            if(
                (templok.MMR && templok.MMR > 1000) ||
                (candy.MMR && candy.MMR > 1000) ||
                (ringy.MMR && ringy.MMR > 1000) ||
                (endless.MMR && endless.MMR > 1000)
            ){
                setBorderColor(1)
            }else{
                setBorderColor(2)
            }
        } else{
            setBorderColor(2)
        }
    }, [templok, candy, ringy, endless])


    useEffect(() => {
        if (wax.rpc) {
            setTimeout(() => {
                shouldShowEventAlert()
            }, [2000])
            getFriendRequests(wax)
            getPendingDuels(wax)
        }
    }, [wax])

    const shouldShowEventAlert = async () => {
        let showEventAlert = await getApartmentNotification(wax)
 
        if (showEventAlert === true)
            setShowEventAlert(true)
    }

    const handleVotePlay = async () => {
        let result = await initMission(wax)
        if(result.error) {
            notify(result.error.toUpperCase(), false);
        } else {
            notify("SUCCESSFUL TRANSACTION!", true);
            setVotingApartmentList(result)
            setShowEventAlert(false)
            setShowVotingBar(true)
            setShowVotingBarCapsule(true)
            // Go to the first apartment
            history.push("/token-mining-game/" + Object.keys(result)[0])
        }
    }

    const toggleVotePopup = (vote) => {
        if(vote > 1){
            setSubmitedVote(`${vote}`)
            setSubmitedVoteReceiver(id)
            setShowSuccessVotePopup(true)

            // closing the popup
            let timer = setTimeout(() => {
                setShowSuccessVotePopup(false)

                clearTimeout(timer)
            }, 1500)

            let timer2 = setTimeout(() => {
                setSubmitedVote(null)
                setSubmitedVoteReceiver(null)

                clearTimeout(timer2)
            }, 2000)
        }
    }

    const handleVoteSelect = async (vote) => {
        let updatedVotes = {...votingApartmentVotes, [id]: vote}
        setVotingApartmentVotes(updatedVotes)

        toggleVotePopup(vote)

        if (Object.keys(updatedVotes).length === Object.keys(votingApartmentList).length) {
            // Finish voting and send votes.
            let result = await endMission(wax, updatedVotes);
            if(result.error) {
                notify(result.error.toUpperCase(), false);
            } else {
                notify("SUCCESSFUL TRANSACTION!", true);
                setShowVotingBar(false)
                history.push("/token-mining-game/" + wax.userAccount);
                ClashdomeMessageServer.dispatchMessageToGame({id: "token-mining-game", payload: {type: "voting_data", data: "10.0000 CREDTIS"}});
            }
        } else {
            // Go to next apartment.
            let apartments = Object.keys(votingApartmentList)
            let current = apartments.indexOf(id)
            let next = apartments[current + 1]

            setShowVotingBarCapsule(false)
            setLockVotingBar(true)
            history.push("/token-mining-game/" + next)
            setTimeout(() => {
                setShowVotingBarCapsule(true)
                setLockVotingBar(false)
            }, 2000)
        }
    }
    
    const handleVotingCancel = async () => {
        let result = await disablenot(wax)
        if(result.error) {
            notify(result.error.toUpperCase(), false);
        } else {
            notify("SUCCESSFUL TRANSACTION!", true);
            setShowVotingBar(false)
            history.push("/token-mining-game/" + wax.userAccount)
        }
    }

    // Called when event alert notification is dismissed.
    const handleVotingNotifcationCancel = async () => {
        let result = await disablenot(wax)
        if(result.error) {
            notify(result.error.toUpperCase(), false);
        } else {
            notify("SUCCESSFUL TRANSACTION!", true);
            setShowEventAlert(false)
        }

    }

    return (
        <div className="profile-container">
            <div className="wrapper">
                <Avatar wax={wax} loginFromGame={loginFromGame} />
                {!showVotingBar && <UserProfileNavbar pendingDuels={pendingDuels} wax={wax} navState={navState} setNavState={setNavState} frequests={frequests.filter(r => r.status === "confirm")} />}
                {showVotingBar && (
                    <VotingBar 
                        showCapsule={showVotingBarCapsule} 
                        onVote={handleVoteSelect} 
                        currentApartment={Object.keys(votingApartmentList).indexOf(id) + 1}
                        totalApartments={Object.keys(votingApartmentList).length}
                        lock={lockVotingBar}
                        onRequestClose={handleVotingCancel}
                        showSuccessVotePopup={showSuccessVotePopup}
                        submitedVote={submitedVote}
                        submitedVoteReceiver={submitedVoteReceiver}
                    />
                )}
                {
                    navState === 0 ?
                    <NewPlayerStats borderColor={borderColor} wax={wax} joinedOn={joiningDate} />:
                    navState === 1 ?
                    <Stake setNavState={setNavState} wax={wax} />:
                    navState === 3 ?
                    <DuelResults wax={wax} />:
                    navState === 4 && frequests ?
                    <Friendos wax={wax} frequests={frequests} fetchFriendRequests={() => getFriendRequests(wax)} goToDuels={() => setNavState(3)}/>:
                    <h1>Unable to find view</h1>
                }
            </div>
            <VotingEventAlert 
                show={showEventAlert}
                onRequestClose={handleVotingNotifcationCancel} 
                onPlayClick={() => handleVotePlay()} 
            />
        </div>
    )
}

export default NewViewProfile

