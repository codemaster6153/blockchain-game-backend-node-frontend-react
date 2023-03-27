import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import './ludioTable.css'
import moment from 'moment'

function LudioTable({combinedRows, setPeriod, period}) {

    const [mined, setMined] = useState([])
    const [consumed, setConsumed] = useState([])
    const [burned, setBurned] = useState([])
    const [xAxis, setXAxis] = useState([])

    const [series, setSeries] = useState([
        {
            name: "Mined",
            data: mined
        },
        {
            name: "Consumed",
            data: consumed
        },
        {
            name: 'Burned',
            data: burned
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
          width: [3, 3, 3],
          curve: 'straight',
          dashArray: [0, 0, 0]
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
            },
            {
              title: {
                formatter: function (val) {
                  return val + ""
                }
              }
            },
            {
              title: {
                formatter: function (val) {
                  return val;
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

        let temp_mined = []
        let temp_consumed = []
        let temp_burned = []
        let temp_xAxis = []

        if(combinedRows && combinedRows.length > 0){
            combinedRows.map((values) => {
              let date = `${values.day}`
              let formattedDate = `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`
              let date1 = moment(formattedDate)
              let date2 = moment()
              if(date2.diff(date1, 'days') <= period){
                if(temp_xAxis.indexOf(moment(formattedDate).format('DD MMM')) === -1){
                  let minedLudio = parseFloat(values.mined_credits.split(' ')[0]).toPrecision(3)
                  temp_mined.push(minedLudio)
                  let consumedLudio = parseFloat(values.consumed_credits.split(' ')[0]).toPrecision(3)
                  temp_consumed.push(consumedLudio)
                  let burnedLudio = parseFloat(values.burned_credits.split(' ')[0]).toPrecision(3)
                  temp_burned.push(burnedLudio)
  
                  temp_xAxis.push(moment(formattedDate).format('DD MMM'))
                }else{
                  const index = temp_xAxis.indexOf(moment(formattedDate).format('DD MMM'))
                  let minedLudio = parseFloat(values.mined_credits.split(' ')[0]).toPrecision(3)
                  temp_mined[index] = (parseFloat(temp_mined[index]) + parseFloat(minedLudio)).toPrecision(3)
                  let consumedLudio = parseFloat(values.consumed_credits.split(' ')[0]).toPrecision(3)
                  temp_consumed[index] = (parseFloat(temp_consumed[index]) + parseFloat(consumedLudio)).toPrecision(3)
                  let burnedLudio = parseFloat(values.burned_credits.split(' ')[0]).toPrecision(3)
                  temp_burned[index] = (parseFloat(temp_burned[index]) + parseFloat(burnedLudio)).toPrecision(3)
                }
              }
            })
        }
        setMined([...temp_mined.reverse()])
        setConsumed([...temp_consumed.reverse()])
        setBurned([...temp_burned.reverse()])
        setXAxis([...temp_xAxis.reverse()])

    }

    useEffect(() => {
        fetchData()
    }, [combinedRows, period])

    useEffect(() => {
        setSeries([
            {
                name: "Mined",
                data: mined
            },
            {
                name: "Consumed",
                data: consumed
            },
            {
                name: 'Burned',
                data: burned
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
              width: [3, 3, 3],
              curve: 'straight',
              dashArray: [0, 0, 0]
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
                },
                {
                  title: {
                    formatter: function (val) {
                      return val + ""
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val;
                    }
                  }
                }
              ]
            },
            grid: {
              borderColor: '#f1f1f1',
            }
        })
    }, [mined, consumed, burned, xAxis])

    return (
      <div className='chart-column'>
        <div className='chart-container'>
            <div className='chart-container-header'>
                <div className='title'>
                    <div className='chart-icon'>
                        <img src='/images/token_alcor_ludio.png' alt='credits' />
                    </div>
                    <p>LUDIO</p>
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

export default LudioTable