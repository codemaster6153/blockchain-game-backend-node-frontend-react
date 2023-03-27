import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './finalCalculation.css'

function FinalCalculation({gameAry}) {
    const [totalScore, setTotalScore] = useState(0)
    
    const calculateScore = () => {
        let total = 0
        if(gameAry && gameAry.length > 0){
            gameAry.map((game) => {
                if(game.data.Winrate){
                    total = total + (game.data.Winrate * 100)
                }
            })
        }
        total = Math.round(total).toLocaleString('en')
        setTotalScore(total)
    }

    useEffect(() => {
        calculateScore()
    }, [gameAry])

    return (
        <div className='final-calc'>
            <div className='total-score'>
                <p>TOTAL SCORE: {totalScore}</p>
                <a href='https://clashdome.medium.com/weekly-competition-ranking-1507abe28641' target={'_blank'} >
                    <img src="/images/infoCircle.svg" alt="info" />
                </a>
            </div>
        </div>
    )
}

export default FinalCalculation