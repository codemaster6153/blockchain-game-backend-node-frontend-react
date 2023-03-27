import React, { useEffect, useState } from 'react';
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'
import Chart from "react-apexcharts";
import initConfig from '../../initConfig';

const ManageLandStats = () => {
    
    const [series, setSeries] = useState([{
        name: 'orcs',
        data: []
    }])

    const[options, setOPtions] = useState({
        chart: {
            height: 380,
            type: "area",
        },
        colors: ['#ff0098'],
        labels: ['white'],
        stroke: {
            show: false,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 3,
            dashArray: 0,
        },
        grid: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        series: [
            {
                name: "Pot",
                data: [],
            }
        ],
        fill: {
            type: "gradient",
            gradient: {
                type: "vertical",
                shadeIntensity: 1,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100],
                gradientToColors: ["#11cbf9"]
            }
        },
        xaxis: {
            categories: [],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    colors: ["#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd", "#04d7fd"]
                }
            }
        },
        yaxis: {
            show: true,
            min: 0,
            forceNiceScale: true,
            tickAmount: 6,
            labels: {
                style: {
                    colors: ["#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e"]
                }
            }
        }
    })
    const getTableData = async (rpc) => {
        const result = await rpc.get_table_rows({
           json: true,
           code: "clashdomedst",
           scope: "clashdomedst",
           table: "killedorcs"
        });

        const data = result.rows
        let xdata = []
        let ydata = []

        // console.log(data);
        data.map((day) => {
            // console.log(day)
            let customday = new Date(day.day)
            // console.log("the custom day is :", `${customday}`.split(" "))
            let month = `${customday}`.split(" ")[1]
            let date = `${customday}`.split(" ")[2]
            customday = `${month}-${date}`
            xdata = [...xdata, customday]
            ydata = [...ydata, day.kills]
        })
        setSeries([{data: [...ydata], name: 'orcs'}])
        setOPtions({...options, xaxis: {...options.xaxis, categories: [...xdata]}})
    }


    useEffect(() => {
        const rpc = new JsonRpc(initConfig.waxUrl, { fetch });
        getTableData(rpc);
    }, [])
    return (
        <div className="stat-chart-container">
            <div className="row">
                <div className="mixed-chart">
                    <Chart 
                        options={options}
                        series={series}
                        type="area"
                        width="100%"
                    />
                </div>
            </div>
        </div>
    );
}

export default ManageLandStats;
