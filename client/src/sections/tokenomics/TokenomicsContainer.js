import React, { useEffect, useState } from 'react'
import CarbzTable from './components/CarbzTable'
import JigoTable from './components/JigoTable'
import LudioTable from './components/LudioTable'
import { JsonRpc } from 'eosjs';
import { fetch as nodefetch } from 'node-fetch'
import './index.css'
import initConfig from '../../initConfig';
import WaxTable from './components/WaxTable';
import GamePlayedChart from './components/GamePlayedChart';
import StakedTable from './components/StakedTable';
import StatsTable from './components/StatsTable';
import TopPlayersHistogram from './components/TopPlayersHistogram';

function TokenomicsContainer() {
    const [ludioPeriod, setLudioPeriod] = useState(15)
    const [jigoPeriod, setJigoPeriod] = useState(15)
    const [carbzPeriod, setCarbzPeriod] = useState(15)
    const [waxPeriod, setWaxPeriod] = useState(15)
    const [gamePlayedPeriod, setGamePlayedPeriod] = useState(15)
    const [earnPeriod, setEarnPeriod] = useState(30);

    const [combinedRowLudio, setCombinedRowLudio] = useState([])
    const [combinedRowCarbz, setCombinedRowCarbz] = useState([])
    const [combinedRowJigo, setCombinedRowJigo] = useState([])
    const [combinedRowWax, setCombinedRowWax] = useState([])
    const [combinedRowGames, setCombinedRowGames] = useState([])
    const [combinedRowEarn, setCombinedRowEarn] = useState([])

    const fetchTableData = async (period) => {
        const rpc = new JsonRpc(initConfig.waxUrl, { nodefetch });
        let value1 = await rpc.get_table_rows({
            json: true,
            code: "clashdomedll",
            scope: "clashdomedll",
            table: "tokenstats",
            limit: period ? period : 90,
            index_position: 1,
            key_type: "i64",
            lower_bound: null,
            upper_bound: null,
            reverse: true,
            show_payer: false,
        });
        let value2 = await rpc.get_table_rows({
            json: true,
            code: "clashdomewld",
            scope: "clashdomewld",
            table: "tokenstats",
            limit: period ? period : 90,
            index_position: 1,
            key_type: "i64",
            lower_bound: null,
            upper_bound: null,
            reverse: true,
            show_payer: false,
        });
        let value3 = await rpc.get_table_rows({
            json: true,
            code: "clashdomedst",
            scope: "clashdomedst",
            table: "tokenstats",
            limit: period ? period : 90,
            index_position: 1,
            key_type: "i64",
            lower_bound: null,
            upper_bound: null,
            reverse: true,
            show_payer: false,
        });

        let value4 = await rpc.get_table_rows({
            json: true,
            code: "clashdomedll",
            scope: "clashdomedll",
            table: "playtime",
            limit: period ? period : 90,
            index_position: 1,
            key_type: "i64",
            lower_bound: null,
            upper_bound: null,
            reverse: true,
            show_payer: false,
        });

        let value5 = await rpc.get_table_rows({
            json: true,
            code: "clashdomewld",
            scope: "clashdomewld",
            table: "earnstats",
            limit: period ? period : 90,
            index_position: 1,
            key_type: "i64",
            lower_bound: null,
            upper_bound: null,
            reverse: true,
            show_payer: false,

        })

        if (value4.rows && value4.rows.length > 0) {
            setCombinedRowGames([...value4.rows])
        }

        if (value5.rows && value5.rows.length > 0) {
            setCombinedRowEarn([...value5.rows])

        }

        let combinedRows = []
        let waxRows = []
        if (value1 && value1.rows && value1.rows.length > 0) {
            combinedRows.push(...value1.rows)
            waxRows.push(...value1.rows)
        }
        if (value2 && value2.rows && value2.rows.length > 0) {
            combinedRows.push(...value2.rows)
        }
        if (value3 && value3.rows && value3.rows.length > 0) {
            combinedRows.push(...value3.rows)
        }

        const handleSort = (a, b) => {
            let Adate = `${a.day}`

            let Bdate = `${b.day}`

            if (Adate > Bdate) {
                return -1
            }

            if (Bdate > Adate) {
                return 1
            }

            return 0
        }

        combinedRows.sort(handleSort)
        waxRows.sort(handleSort)
        setCombinedRowWax(waxRows)
        return combinedRows
    }

    const initializeCharts = async () => {
        const res = await fetchTableData()
        setCombinedRowCarbz(res)
        setCombinedRowJigo(res)
        setCombinedRowLudio(res)
    }

    useEffect(() => {
        initializeCharts();
    }, [])

    return (
        <div className='tokenomics-container'>
            <h1>TOKENOMICS</h1>
            <div className='tokenomic-chart-row'>
                <LudioTable combinedRows={combinedRowLudio} setPeriod={setLudioPeriod} period={ludioPeriod} />
                <CarbzTable combinedRows={combinedRowCarbz} setPeriod={setCarbzPeriod} period={carbzPeriod} />
                <JigoTable combinedRows={combinedRowJigo} setPeriod={setJigoPeriod} period={jigoPeriod} />
                <GamePlayedChart combinedRows={combinedRowGames} setPeriod={setGamePlayedPeriod} period={gamePlayedPeriod} />
                <StakedTable combinedRows={combinedRowEarn} setPeriod={setEarnPeriod} period={earnPeriod} />
                <WaxTable combinedRows={combinedRowWax} setPeriod={setWaxPeriod} period={waxPeriod} />
                <TopPlayersHistogram />
                <StatsTable />
            </div>
        </div>
    )
}

export default TokenomicsContainer