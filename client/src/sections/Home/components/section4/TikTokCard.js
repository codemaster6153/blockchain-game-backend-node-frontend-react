import React from 'react'

function TikTokCard() {
    return (
        <a href='https://www.tiktok.com/@clashdome' target={'_blank'}>
            <div className='social-card tiktok'>
                <div className='icon-container'>
                    <div className='img'>
                        <img src="/images/newHome/tiktok.svg" />
                    </div>
                    <p>TikTok</p>
                </div>
                <div className='info-container'>
                    <p>
                    🚨 News & Updates <br />
                    🎮 Gameplays <br />
                    🤓 Player’s tips
                    </p>
                </div>
            </div>
        </a>
    )
}

export default TikTokCard