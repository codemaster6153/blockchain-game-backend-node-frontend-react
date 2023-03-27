import React from 'react'
import './newHome.css'
import { SectionOne } from './components/section1'
import { SectionTwo } from './components/section2'
import { SectionThree } from './components/section3'
import { SectionFour } from './components/section4'
import SectionFive from './components/section5/SectionFive'

export function Newhome({ login }) {
    return (
        <div className='new-home-container'>
            <SectionOne />
            <SectionThree login={login} />
            <SectionTwo />
            <SectionFive />
            <SectionFour />
        </div>
    )
}
