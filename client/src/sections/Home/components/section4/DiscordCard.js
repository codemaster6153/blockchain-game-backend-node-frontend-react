import React from 'react'

function DiscordCard() {
  return (
    <a href='https://discord.gg/GT46WYVqrK' target={'_blank'}>
        <div className='social-card discord'>
            <div className='icon-container'>
                <div className='img'>
                    <img src="/images/newHome/discord.svg" />
                </div>
                <p>DISCORD</p>
            </div>
            <div className='info-container'>
                <p>
                    😃 Community Gossip <br/>
                    🤓 Player’s Tips <br/>
                    🚨 News & Updates <br/>
                    ☠️ Bug Reports & Support
                </p>
            </div>
        </div>
    </a>
  )
}

export default DiscordCard