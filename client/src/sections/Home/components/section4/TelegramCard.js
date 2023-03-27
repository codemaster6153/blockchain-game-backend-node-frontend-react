import React from 'react'

function TelegramCard() {
  return (
    <a href='https://t.me/clashdome' target={'_blank'}>
        <div className='social-card telegram'>
            <div className='icon-container'>
                <div className='img'>
                    <img src="/images/newHome/telegram.svg" />
                </div>
                <p>TELEGRAM</p>
            </div>
            <div className='info-container'>
                <p>
                    😃 Community Gossip <br />
                    ☠️ Bug Reports & Support <br />
                    👹 Troll Marauders
                </p>
            </div>
        </div>
    </a>
  )
}

export default TelegramCard