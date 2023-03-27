import React from 'react'
import { useSelector } from 'react-redux'

export default function ClashNotification() {
    const notification = useSelector(state => state.notification);

    return (
        <div className="notification-bar" id="notification-bar" style={{zIndex: 99999, backgroundColor: notification.success ? "#00D96D80" : "#FF004E80"}} >
            <div id="notification-background" style={{backgroundColor: notification.success ? "#00D96D" : "#FF004E" }}>
            </div>
            <p style={{color: notification.success ? "#001A44" : "#FFFFFF" }}>{notification.text}</p>
        </div>
    )
}
