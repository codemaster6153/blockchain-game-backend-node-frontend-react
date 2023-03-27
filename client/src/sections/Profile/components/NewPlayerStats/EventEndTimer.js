import React, { useEffect, useState } from 'react'
import moment from 'moment'
import './eventEndTimer.css'

function EventEndTimer() {
    const [eventEnds, setEventEnds] = useState('')

    const timer = () => {
        const today = moment().utc()
        let endDate;

        if(today.day() === 0){
            endDate = moment().utc().endOf('day');
        }else{
            endDate = moment().utc().add(1, 'weeks').startOf('week').endOf("day")
        }
        let days = endDate.diff(today, 'days')
        let hours = endDate.diff(today, 'hours') % 24
        let minutes = endDate.diff(today, 'minutes') % 60
        let seconds = endDate.diff(today, 'seconds') % 60

        let timeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`
        setEventEnds(timeStr)
    }

    useEffect(() => {
        setInterval(timer, 1000)
    }, [])
    return (
        <div className='comp-timer'>
            <p>Competition ends in {eventEnds}</p>
        </div>
    )
}

export default EventEndTimer