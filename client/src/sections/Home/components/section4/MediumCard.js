import React from 'react'

function MediumCard() {
  return (
    <a href='https://clashdome.medium.com' target={'_blank'}>
        <div className='social-card medium'>
            <div className='icon-container'>
                <div className='img'>
                    <img src="/images/newHome/medium.svg" />
                </div>
                <p>MEDIUM</p>
            </div>
            <div className='info-container'>
                <p>
                    🚩 Roadmaps <br/>
                    📚 Detailed Updates <br/>
                    📘 Sturdy Articles
                </p>
            </div>
        </div>
    </a>
  )
}

export default MediumCard