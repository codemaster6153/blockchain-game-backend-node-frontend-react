import React from 'react'
import DiscordCard from './DiscordCard'
import './index.css'
import MediumCard from './MediumCard'
import TelegramCard from './TelegramCard'
import TwitterCard from './TwitterCard'
import LinkedInCard from './LinkedInCard'
import TikTokCard from './TikTokCard'

function SectionFour() {
  return (
    <div className='section-four'>
        <div>
            <div className='left'>
                <p className='main-text'>FOLLOW US <br/>FOR THE <br/>LATEST NEWS<br/> AND PROMOS</p>
                <p className='sub-text'>Our platform is in constant evolution. Joining our <br/> social media is the best way to keep updated.</p>
            </div>
            <div className='right'>
                <DiscordCard />
                <TelegramCard />
                <TwitterCard />
                <MediumCard />
                <LinkedInCard />
                <TikTokCard />
            </div>
        </div>
    </div>
  )
}

export default SectionFour