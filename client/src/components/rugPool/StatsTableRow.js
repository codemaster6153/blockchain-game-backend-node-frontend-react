import React, { useEffect, useState } from 'react'
import './statstable.css'

export default function StatsTableRow({land, id, deadOrcs, lastPlayed, rarity}) {
    const [landColor, setLandColor] = useState()

    useEffect(() => {
        if(rarity === "Common"){
            setLandColor("#F5FFFD")
        }else if(rarity === "Rare"){
            setLandColor("#11CBF9")
        }else if(rarity === "Epic"){
            setLandColor("#BC6EFF")
        }else if(rarity === "Legendary"){
            setLandColor("#FFAB39")
        }else if(rarity === "Mythical"){
            setLandColor("#FFEE57")
        }
    }, [])
    return (
        <div className="stat-table-row">
            <div className="land">
                <span style={{width: '20px', height: '20px', marginRight: '10px', borderRadius: '20px', backgroundColor: `${landColor}`}}></span>
                <p>{land}</p>
            </div>
            <div className="id">
                <p>{id}</p>
            </div>
            <div className="dead-orcs">
                <p>{deadOrcs}</p>
            </div>
            <div className="last-played">
                <p>{lastPlayed}</p>
            </div>
        </div>
    )
}
