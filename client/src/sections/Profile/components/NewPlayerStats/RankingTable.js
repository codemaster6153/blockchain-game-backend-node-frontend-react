import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './rankingTable.css'
import RankingTableRow from './RankingTableRow'
import fetch from 'node-fetch'
import EventEndTimer from './EventEndTimer'
import initConfig from '../../../../initConfig';
import { useSelector } from 'react-redux';


const { JsonRpc} = require("eosjs");
async function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms))
}
async function fillAptScores(wlbn, wlbp, id, apartments, wax){
    try{
    await sleep(250);
    let friends_data = await wax.rpc.get_table_rows({
        json: true,                 
        code: "clashdomewld",       
        scope: "clashdomewld",      
        table: "social",  
        limit: 1,
        index_position: 1,
        key_type: "i64",
        lower_bound: wax.userAccount,
        upper_bound: wax.userAccount,                
        reverse: false,             
        show_payer: false,    
    });
    console.log("Friends data:", friends_data);
    if ( friends_data.rows.length >0) var friends = JSON.parse(friends_data.rows[0].data).fr;
    var list = [wlbn, wlbp];
    for (let wb in list){
        for ( let i in list[wb]){
            if (apartments[list[wb][i].username] &&(typeof(apartments[list[wb][i].username]["as"]) !== 'undefined') && (typeof(apartments[list[wb][i].username]["as"]["v"]) !== 'undefined')  && (typeof(apartments[list[wb][i].username]["as"]["n"]) != 'undefined')){
                
                list[wb][i].apartment_score = apartments[list[wb][i].username]["as"]["v"] / apartments[list[wb][i].username]["as"]["n"];
            }else{
                list[wb][i].apartment_score = 0;
            }
            if ( friends_data.rows.length >0 && friends[list[wb][i].username] != undefined){
                list[wb][i].is_friend = true;
            }else{
                list[wb][i].is_friend = false;
            }
        }
    }
    return {now: list[0] , prev: list[1]}
    }catch(e){
        console.log("Error:", e);
        return {now: wlbn , prev: wlbp }
    }
}

function RankingTable({wax, setPlayerPosition}) {

    const [table, setTable] = useState([])
    const [currentWeek, setCurrentWeek] = useState(true)

    const [thisWeekData, setThisWeekData] = useState([])
    const [prevWeekData, setPrevWeekData] = useState([])
    
    const { id } = useParams()

    const visitorSelectorsData = useSelector(state => state.visit);
    
    const getTopPlayers = async (visitorSelectorsData, wax) => {
        let result1 = await fetch("/api/clashdome-game/weekly-ladeboard/now")
        result1 = await result1.json()
       
        let result2 = await fetch("/api/clashdome-game/weekly-ladeboard/previous")
        result2 = await result2.json()

        var aptres = await fillAptScores(result1 ,  result2, id , visitorSelectorsData, wax);
        
        result1 = aptres.now;
        result2 = aptres.prev;
        if (!result1.error) {
            setThisWeekData([...result1])
        }

        if (!result2.error) {
            setPrevWeekData([...result2])
        }
    }
    
    useEffect(() => {
        if (visitorSelectorsData && wax) getTopPlayers(visitorSelectorsData, wax)
     }, [visitorSelectorsData,wax])

    useEffect(() => {
        for (let i = 0; i < thisWeekData.length; i++) {
            if (thisWeekData[i].username === id) {
                setPlayerPosition("#" + (i + 1));
                break;
            }
        }
    }, [id])
    
    useEffect(() => {
        if(currentWeek){
            setTable([...thisWeekData])

            for (let i = 0; i < thisWeekData.length; i++) {
                if (thisWeekData[i].username === id) {
                    setPlayerPosition("#" + (i + 1));
                    break;
                }
            }
        }else{
            setTable([...prevWeekData])
        }
    }, [currentWeek, thisWeekData, prevWeekData])

    return (
        <div className='ranking-table'>
            <div className='ranking-table-container'>
                <div className="current-week-switch">
                    <div>
                        {
                            currentWeek &&
                            <img src="/images/arrow_white.svg" className='rotate-y' onClick={() => setCurrentWeek(false)} alt='back' />
                        }
                    </div>

                    <p>
                        {
                            currentWeek ? "CURRENT WEEK" : "LAST WEEK"
                        }
                    </p>
                    <div>
                        {
                            !currentWeek ?
                            <img src="/images/arrow_white.svg" onClick={() => setCurrentWeek(true)} alt='next' />:
                            <EventEndTimer />
                        }
                    </div>
                </div>
                <div className='ranking-table-scroll'>
                    <table>
                        <tbody>
                            <tr className="header" >
                                <th className='postion'>Position</th>
                                <th className='score'>Score</th>
                                <th className='reward'>Multiplier</th>
                                <th className='apartment'>Apartment</th>
                                <th className='challenge'></th>
                            </tr>
                            {
                                table && table.length > 0 && table.map((row, index) => {
                                    return(
                                        <RankingTableRow table={table} data={row} rank={index} length={table.length} key={index} wax={wax} />
                                     )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default RankingTable