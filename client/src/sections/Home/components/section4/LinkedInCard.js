import React from 'react'

function LinkedInCard() {
    return (
        <a href='https://www.linkedin.com/company/clashdome/' target={'_blank'}>
            <div className='social-card linkedin'>
                <div className='icon-container'>
                    <div className='img'>
                        <img src="/images/newHome/linkedin.svg" />
                    </div>
                    <p>LINKEDIN</p>
                </div>
                <div className='info-container'>
                    <p>
                        💼 Business plans & updates <br />
                        👁️ Mission, vision & values <br />
                        🌐 Market analysis
                    </p>
                </div>
            </div>
        </a>
    )
}

export default LinkedInCard