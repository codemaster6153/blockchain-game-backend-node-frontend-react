import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import './ludioTable.css'
import moment from 'moment'

function GamePlayedChart({combinedRows, setPeriod, period}) {

    const [ringy, setRingy] = useState([])
    const [templok, setTemplok] = useState([])
    const [candy, setCandy] = useState([])
    const [endless, setEndless] = useState([])
    const [rugPool, setRugPool] = useState([])
    const [maze, setMaze] = useState([])
    const [sum, setSum] = useState([])
    const [xAxis, setXAxis] = useState([])

    const [series, setSeries] = useState([
        {
            name: "RingyDingy",
            data: ringy
        },
        {
            name: "Endless Siege",
            data: endless
        },
        {
            name: "Candy Fiesta",
            data: candy
        },
        {
            name: "Rug Pool",
            data: rugPool
        },
        {
            name: 'Templok',
            data: templok
        },
        {
            name: 'The Maze',
            data: maze
        },
        {
            name: "Total Duels",
            data: sum
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
          width: [3, 3, 3, 3, 3, 3],
          curve: 'straight',
          dashArray: [0, 0, 0, 0, 0, 0]
        },
        colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800', '#FF8C00','#FFEB00'],
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

        let temp_endless = []
        let temp_templok = []
        let temp_rugPool = []
        let temp_candy = []
        let temp_ringy = []
        let temp_maze = []
        let temp_xAxis = []
        let temp_sum = []

        if(combinedRows && combinedRows.length > 0){
            combinedRows.map((row) => {
                let date = `${row.day}`
                let formattedDate = `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`
                let date1 = moment(formattedDate)
                let date2 = moment()
                if(date2.diff(date1, 'days') <= period){
                    temp_xAxis.push(moment(formattedDate).format('DD MMM'))
                    let endlessPushed = false
                    let ringyPushed = false
                    let rugPoolPushed = false
                    let templokPushed = false
                    let candyPushed = false
                    let mazePushed = false

                    let gameSum = 0
                    row.games.map((game) => {
                        gameSum = parseInt(game.n) + gameSum
                        if(game.id === "endless-siege-2"){
                            temp_endless.push(game.n)
                            endlessPushed = true
                        } else if(game.id === "candy-fiesta"){
                            temp_candy.push(game.n)
                            candyPushed = true
                        } else if(game.id === "rug-pool"){
                            temp_rugPool.push(game.n)
                            rugPoolPushed = true
                        } else if(game.id === "templok"){
                            temp_templok.push(game.n)
                            templokPushed = true
                        } else if(game.id === "ringy-dingy"){
                            temp_ringy.push(game.n)
                            ringyPushed = true
                        } else if(game.id === "maze"){
                            temp_maze.push(game.n)
                            mazePushed = true
                        }
                    })
                    console.log("the game sum is :", gameSum)
                    temp_sum.push(gameSum)
                    if(!endlessPushed){
                        temp_endless.push('0')
                        endlessPushed = true
                    }else if(!candyPushed){
                        temp_candy.push('0')
                        candyPushed = true
                    }else if(!rugPoolPushed){
                        temp_rugPool.push('0')
                        rugPoolPushed = true
                    }else if(!templokPushed){
                        temp_templok.push('0')
                        templokPushed = true
                    }else if(!ringyPushed){
                        temp_ringy.push('0')
                        ringyPushed = true
                    }else if(!mazePushed){
                        temp_maze.push('0')
                        mazePushed = true
                    }
                }
            })
        }

        setEndless([...temp_endless.reverse()])
        setRingy([...temp_ringy.reverse()])
        setCandy([...temp_candy.reverse()])
        setTemplok([...temp_templok.reverse()])
        setRugPool([...temp_rugPool.reverse()])
        setMaze([...temp_maze.reverse()])
        setXAxis([...temp_xAxis.reverse()])
        setSum([...temp_sum.reverse()])
    }

    useEffect(() => {
        fetchData()
    }, [combinedRows, period])

    useEffect(() => {
        setSeries([
            {name: "RingyDingy", data: ringy},
            {name: "Endless Siege", data: endless},
            {name: "Candy Fiesta", data: candy},
            {name: "Rug Pool", data: rugPool},
            {name: 'Templok', data: templok},
            {name: 'Maze', data: maze},
            {name: "Total Duels", data: sum}
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
              width: [3, 3, 3, 3, 3, 3, 3],
              curve: 'straight',
              dashArray: [0, 0, 0, 0, 0, 0, 0]
            },
            colors: ['#7F00EA', '#FF0030', '#FF47FB', '#73FD00', '#00FCF1','#FF8C00','#FFEB00'],
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
    }, [candy, templok, endless, ringy, rugPool, sum, xAxis])

    return (
      <div className='chart-column'>
        <div className='chart-container'>
            <div className='chart-container-header wax'>
                <div className='title'>
                    {/* <div className='chart-icon'>
                        <img src='/images/carbz.png' alt='credits' />
                    </div> */}
                    <p style={{marginLeft: '20px'}}>DUELS PLAYED</p>
                    {/* <div className='chart-icon'>
                        <img src='/images/icon_cdcarbz.png' alt='ludio' />
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
            <ReactApexChart options={options} series={series} type="line" height={350} />
        </div>
      </div>
    )
}

export default GamePlayedChart