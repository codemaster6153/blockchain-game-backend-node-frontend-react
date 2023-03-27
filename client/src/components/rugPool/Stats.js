import React from 'react'
import ManageLandStats from '../MyChart/ManageLandStats'
import ManageLandStatsNew from '../MyChart/ManageLandStatsNew'
import './stats.css';
import StatsTable from './StatsTable';

export default function Stats() {
    return (
        <div className="stats-container">
            <h1>Daily amount of dead orcs</h1>
            {/* <ManageLandStats /> */}
            <ManageLandStatsNew />
            <StatsTable />
        </div>
    )
}
