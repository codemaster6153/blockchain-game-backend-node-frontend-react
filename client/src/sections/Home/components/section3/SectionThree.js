import React from 'react'
// import CardFour from './CardFour'
// import CardOne from './CardOne'
// import CardThree from './CardThree'
// import CardTwo from './CardTwo'
import './index.css'
import StepCarousel from './StepCarousel'

function SectionThree({login}) {
  return (
    <div className='section-three'>
        <div className='bg-overlay'></div>
        <div className='content-wrapper'>
            <h1>EASY GUIDE TO JOIN CLASHDOME</h1>
            <div className='mobile-view'>
                {/* <CardOne /> */}
                {/* <CardTwo login={login} /> */}
                {/* <CardThree /> */}
                {/* <CardFour /> */}
                <StepCarousel />
            </div>
        </div>
    </div>
  )
}

export default SectionThree