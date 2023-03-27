import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './statstable.css'
import { JsonRpc } from 'eosjs'
import StatsTableRow from './StatsTableRow'
import landData from './landinfo.json'
import initConfig from '../../initConfig'

export default function StatsTable() {
    const [tableData, setTableData] = useState([])

    const getTableData = async () => {
        const rpc = new JsonRpc(initConfig.waxUrl, { fetch });
        const result = await rpc.get_table_rows({
            json: true,
            code: "clashdomedst",
            scope: "clashdomedst",
            table: "landactivity",
            limit: 50
        });        
        console.log("the result is :", result)
        setTableData([...result.rows.reverse()])
    }

    useEffect(() => {
        getTableData()
        console.log("land data is :", landData)
        console.log("result")
    }, [])
    return (
        <div className="stats-table-container">
            <div className="stats-table-header">
                <div className="border-right">
                    <p>Land Name</p>
                </div>
                <div className="border-right">
                    <p>ID</p>
                </div>
                <div className="border-right">
                    <p>Total Dead Orcs</p>
                </div>
                <div>
                    <p>Last Time Played</p>
                </div>
            </div>
            {
                tableData.length > 0 && tableData.map((row) => {
                    let date = new Date(row.timestamp * 1000)
                    let id = row.land_id
                    const killed = row.partial_orcs
                    const rarity = landData[`${id}`].rarity
                    const land = landData[`${id}`].name
                    let time = `${date}`.split(" ")[4].slice(0,5)
                    date = `${date}`.split(" ")
                    let timestamp = `${time} ${date[1]}-${date[2]}-${date[3]}`

                    console.log("row is :", timestamp)
                    return <StatsTableRow id={id} land={land} deadOrcs={killed.toLocaleString()} lastPlayed={timestamp} rarity={rarity} />
                })
            }
        </div>
    )
}
