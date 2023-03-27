import React, { useEffect, useState } from 'react';
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'
import ReactApexChart from "react-apexcharts";
import initConfig from '../../initConfig';

const ManageLandStatsNew = () => {
    
    const [series, setSeries] = useState([{
        name: 'orcs',
        data: []
    }])

    const[options, setOPtions] = useState({
        chart: {
            height: 350,
            type: 'bar',
        },
        colors: ['#11cbf9'],
        labels: ['white'],
        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
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
            enabled: true,
            formatter: function (labelValue) {
                // Nine Zeroes for Billions
                return Math.abs(Number(labelValue)) >= 1.0e+9

                ? (Math.abs(Number(labelValue)) / 1.0e+9).toLocaleString(undefined, {maximumFractionDigits:2}) + "B"
                // Six Zeroes for Millions 
                : Math.abs(Number(labelValue)) >= 1.0e+6

                ? (Math.abs(Number(labelValue)) / 1.0e+6).toLocaleString(undefined, {maximumFractionDigits:2}) + "M"
                // Three Zeroes for Thousands
                : Math.abs(Number(labelValue)) >= 1.0e+3

                ? (Math.abs(Number(labelValue)) / 1.0e+3).toLocaleString(undefined, {maximumFractionDigits:2}) + "K"

                : Math.abs(Number(labelValue));
            },
            offsetY: -20,
            style: {
              fontSize: '12px',
              colors: ["#FFFFFF"]
            }
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
                // gradientToColors: ["#11cbf9"]
                gradientToColors: ["#ff0098"]
            }
        },
        xaxis: {
            categories: [],
            position: 'top',
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
            },
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    }
                }
            },
            tooltip: {
                enabled: true,
            }
        },
        yaxis: {
            // show: true,
            // min: 0,
            // forceNiceScale: true,
            // tickAmount: 6,
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                style: {
                    colors: ["#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e", "#ffff4e"]
                }
            }
        }
    })
    
    const getTableData = async (rpc) => {
        const result = await rpc.get_table_rows({
           json: true,
           code: "clashdomedst",
           scope: "clashdomedst",
           table: "killedorcs",
           limit: 30
        });

        const data = result.rows
        let xdata = []
        let ydata = []

        // console.log(data);
        data.map((day) => {
            // console.log(day.kills.toLocaleString())

            let customday = day.day.toString().substring(6, 8) + "-" + day.day.toString().substring(4, 6);
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
                    <ReactApexChart options={options} series={series} type="bar" height={350} />
                </div>
            </div>
        </div>
    );
}

export default ManageLandStatsNew;