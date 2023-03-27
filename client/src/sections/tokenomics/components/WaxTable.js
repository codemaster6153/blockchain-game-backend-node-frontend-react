import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import './ludioTable.css'
import { JsonRpc } from 'eosjs';
import {fetch as nodefetch} from 'node-fetch'
import initConfig from '../../../initConfig';
import moment from 'moment'

function WaxTable({combinedRows, setPeriod, period}) {

    const [consumed, setConsumed] = useState([])
    const [xAxis, setXAxis] = useState([])

    const [series, setSeries] = useState([
        
        {
            name: "WAX",
            data: consumed
        }
    ])

    const [options, setOptions] = useState({
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          },
          toolbar:{
              show: false
          },
          foreColor: '#ffffff'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [3],
          curve: 'straight',
          dashArray: [0]
        },
        legend: {
          tooltipHoverFormatter: function(val, opts) {
            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
          }
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          categories: xAxis,
        },
        tooltip: {
          y: [
            {
              title: {
                formatter: function (val) {
                  return val + ""
                }
              }
            }
          ]
        },
        grid: {
          borderColor: '#f1f1f1',
        }
    })

    const fetchData = async () => {

        let temp_consumed = []
        let temp_xAxis = []

        if(combinedRows && combinedRows.length > 0){
            combinedRows.map((values) => {
              let date = `${values.day}`
              let formattedDate = `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`
              let date1 = moment(formattedDate)
              let date2 = moment()
              if(values.used_wax && date2.diff(date1, 'days') <= period){
                if(temp_xAxis.indexOf(moment(formattedDate).format('DD MMM')) === -1){
                  let consumedWax = parseFloat(values.used_wax.split(' ')[0]).toPrecision(3)
                  temp_consumed.push(consumedWax)
                  
  
                  temp_xAxis.push(moment(formattedDate).format('DD MMM'))
                }else{
                  const index = temp_xAxis.indexOf(moment(formattedDate).format('DD MMM'))
                  
                  let consumedWax = parseFloat(values.used_wax.split(' ')[0]).toPrecision(3)
                  temp_consumed[index] = (parseFloat(temp_consumed[index]) + parseFloat(consumedWax)).toPrecision(3)
                  
                }
              }
            })
        }
        setConsumed([...temp_consumed.reverse()])
        setXAxis([...temp_xAxis.reverse()])

    }

    useEffect(() => {
        fetchData()
    }, [combinedRows, period])

    useEffect(() => {
        setSeries([
            {
                name: "WAX",
                data: consumed
            }
        ])

        setOptions({
            chart: {
              height: 350,
              type: 'line',
              zoom: {
                enabled: false
              },
              toolbar:{
                  show: false
              },
              foreColor: '#ffffff'
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: [3],
              curve: 'straight',
              dashArray: [0]
            },
            legend: {
              tooltipHoverFormatter: function(val, opts) {
                return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
              }
            },
            markers: {
              size: 0,
              hover: {
                sizeOffset: 6
              }
            },
            xaxis: {
              categories: xAxis,
            },
            tooltip: {
              y: [
                {
                  title: {
                    formatter: function (val) {
                      return val + ""
                    }
                  }
                }
              ]
            },
            grid: {
              borderColor: '#f1f1f1',
            }
        })
    }, [consumed, xAxis])

    return (
      <div className='chart-column'>

        <div className='chart-container'>
            <div className='chart-container-header wax'>
                <div className='title'>
                    {/* <div className='chart-icon'>
                        <img src='/images/credits.png' alt='credits' />
                    </div> */}
                    <p style={{marginLeft: '20px'}}>WAX TURNOVER</p>
                    {/* <div className='chart-icon'>
                        <img src='/images/icon_ludio_small.png' alt='ludio' />
                    </div> */}
                </div>
                <div className='period'>
                    <p
                        className={`${period === 15 ? 'active' : ''}`}
                        onClick={() => {setPeriod(15)}}
                    >15d</p>
                    <p
                        className={`${period === 30 ? 'active' : ''}`}
                        onClick={() => {setPeriod(30)}}
                    >30d</p>
                    <p
                        className={`${period === 90 ? 'active' : ''}`}
                        onClick={() => {setPeriod(90)}}
                    >90d</p>
                </div>
            </div>
            <div style={{display: 'flex'}}>
                <div style={{flex: 1}}>
                    <ReactApexChart options={options} series={series} type="line" height={350} />
                </div>
            </div>
        </div>
      </div>
    )
}

export default WaxTable