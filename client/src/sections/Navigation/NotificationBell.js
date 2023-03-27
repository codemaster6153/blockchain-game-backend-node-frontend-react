import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import './notificationBell.css'
import { Link } from 'react-router-dom'

export default function NotificationBell() {

    const notifications = useSelector(state => state.bellNotifications)
    const dropdown = useRef()
    const [visible, setVisible] = useState(false)
    const wax = useSelector(state => state.wax)

    useEffect(() => {
        if(visible && dropdown.current){
            dropdown.current.style.width = "270px"
            dropdown.current.style.opacity = "1"
        }else if(!visible && dropdown.current){
            dropdown.current.style.width = "0"
            dropdown.current.style.opacity = "0"
        }
    }, [visible])

    const handleToogle = () => {
        setVisible(!visible)
    }

    return (
        <div className="notification-bell">
            {
                wax.userAccount ?
                <>
                    <div className="toogle-icon" onClick={handleToogle} >
                        <p className="notification-number">{notifications && notifications.length > 0 && notifications.length}</p>
                        <img src="/images/bell-solid.svg" alt="bell" width={20} />
                    </div>
                    <div ref={dropdown} className="notification-dropdown" onClick={handleToogle}>
                        {
                            notifications && notifications.map((notif) => {
                                return(
                                    <Link to="/candy-fiesta" >
                                        <div className="notification">
                                            <p>Claim your {notif.game} achievement</p>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </>:
                <></>
            }
        </div>
    )
}
