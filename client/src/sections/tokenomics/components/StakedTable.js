import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import './ludioTable.css'
import moment from 'moment'

function StakedTable({ combinedRows, setPeriod, period }) {
  const [ludio, setLudio] = useState([])
  const [jigowatts, setJigowatts] = useState([])
  const [carbz, setCarbz] = useState([])
  const [xAxis, setXAxis] = useState([])

  const [series, setSeries] = useState([
    {
      name: "Ludio",
      data: ludio
    },
    {
      name: 'Jigowatts',
      data: jigowatts
    },
    {
      name: "Carbz",
      data: carbz
    },
  ])

  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
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
      tooltipHoverFormatter: function (val, opts) {
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

    let temp_ludio = []
    let temp_jigo = []
    let temp_carbz = []
    let temp_xAxis = []

    if (combinedRows && combinedRows.length > 0) {
      combinedRows.map((values) => {
        let date = `${values.key}`
        let formattedDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
        let date1 = moment(formattedDate)
        let date2 = moment()
        if (date2.diff(date1, 'days') <= period) {
          if (temp_xAxis.indexOf(moment(formattedDate).format('DD MMM')) === -1) {
            let stakedLudio = parseFloat(values?.staked_ludio?.split(' ')[0]).toPrecision(3)
            temp_ludio.push(stakedLudio)
            let stakedJigo = parseFloat(values?.staked_jigo?.split(' ')[0]).toPrecision(3)
            temp_jigo.push(stakedJigo)
            let stakedCarbz = parseFloat(values?.staked_carbz?.split(' ')[0]).toPrecision(3)
            temp_carbz.push(stakedCarbz)

            temp_xAxis.push(moment(formattedDate).format('DD MMM'))
          } else {
            const index = temp_xAxis.indexOf(moment(formattedDate).format('DD MMM'))
            let stakedLudio = parseFloat(values.staked_ludio.split(' ')[0]).toPrecision(3)
            temp_ludio[index] = (parseFloat(temp_ludio[index]) + parseFloat(stakedLudio)).toPrecision(3)
            let stakedJigo = parseFloat(values.staked_jigo.split(' ')[0]).toPrecision(3)
            temp_jigo[index] = (parseFloat(temp_jigo[index]) + parseFloat(stakedJigo)).toPrecision(3)
            let stakedCarbz = parseFloat(values.staked_carbz.split(' ')[0]).toPrecision(3)
            temp_carbz[index] = (parseFloat(temp_carbz[index]) + parseFloat(stakedCarbz)).toPrecision(3)
          }
        }
      })
    }
    setLudio([...temp_ludio.reverse()])
    setCarbz([...temp_carbz.reverse()])
    setJigowatts([...temp_jigo.reverse()])
    setXAxis([...temp_xAxis.reverse()])

  }

  useEffect(() => {
    fetchData()
  }, [combinedRows, period])

  useEffect(() => {
    setSeries([
      {
        name: "Ludio",
        data: ludio
      },
      {
        name: 'Jigowatts',
        data: jigowatts
      },
      {
        name: "Carbz",
        data: carbz
      },
    ])

    setOptions({
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
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
      colors: ['#FFEE57', '#11CBF9', '#00E34F'],
      legend: {
        tooltipHoverFormatter: function (val, opts) {
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
  }, [ludio, carbz, jigowatts, xAxis])

  return (
    <div className='chart-column'>
      <div className='chart-container'>
        <div className='chart-container-header earn'>
          <div className='title'>
            <p>STAKED IN EARN</p>
          </div>
          <div className='period'>
            <p
              className={`${period === 30 ? 'active' : ''}`}
              onClick={() => { setPeriod(30) }}
            >30d</p>
            <p
              className={`${period === 60 ? 'active' : ''}`}
              onClick={() => { setPeriod(60) }}
            >60d</p>
            <p
              className={`${period === 90 ? 'active' : ''}`}
              onClick={() => { setPeriod(90) }}
            >90d</p>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <ReactApexChart options={options} series={series} type="line" height={350} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StakedTable