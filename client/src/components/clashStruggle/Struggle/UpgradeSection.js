import React, { useEffect, useState } from 'react'
import DesktopUpgrade from './DesktopUpgrade'
import MobileUpgrade from './MobileUpgrade'
import './upgradeSection.css'

export default function UpgradeSection() {

    const [bodyWidth, setBodyWidth] = useState(document.body.clientWidth)

    const updateWindowWidth = () => {
        setBodyWidth(document.body.clientWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', updateWindowWidth)

        return () => window.removeEventListener('resize', updateWindowWidth);
    }, [bodyWidth])


    

    return (
        <div className="upgrade-section">
            {
                (bodyWidth >= 1024) ? <DesktopUpgrade /> : <MobileUpgrade />
            }
            
        </div>
    )
}
