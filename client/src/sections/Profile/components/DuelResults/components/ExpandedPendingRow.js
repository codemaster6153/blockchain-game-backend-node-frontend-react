import React, { useEffect, useRef, useState } from 'react';
import './expandedResult.css';
import {Link} from 'react-router-dom'

export default function ExpandedPendingRow({item, account, game}) {
    
    const [date, setDate] = useState('0-0-0')
    const [time, setTime] = useState('00:00')


    useEffect(() => {
        var date = new Date(item.date * 1000);
        setDate(`${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`)
        setTime(`${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`)
    }, [])

    return (
        <div className={`early-access-row highlight`} >
            <div className="left">
                <img src={"/images/" + item.game + "_title.png"} alt={item.game} />
            </div>
            <div className="center">
                <div className="pending-row">
                    <h2>PENDING DUEL</h2>
                    <p>waiting for rival ...</p>
                </div>
            </div>
            <div className="right">
                <p>{date}</p>
                <p>{time}</p>
                <p>ID: {item.id}</p>
            </div>
        </div>
    )
}
