import React from 'react'

function TwitterCard() {
  return (
    <a href='https://twitter.com/clash_dome' target={'_blank'}>
        <div className='social-card twitter'>
            <div className='icon-container'>
                <div className='img'>
                    <img src="/images/newHome/twitter.svg" />
                </div>
                <p>TWITTER</p>
            </div>
            <div className='info-container'>
                <p>
                    🤓 Promos & Giveaways <br/>
                    🚨 News & Updates <br/>
                    👀 Teasers
                </p>
            </div>
        </div>
    </a>
  )
}

export default TwitterCard