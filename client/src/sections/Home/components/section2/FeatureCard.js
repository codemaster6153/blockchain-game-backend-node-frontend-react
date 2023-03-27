import React from 'react'
import './featureCard.css'

function FeatureCard({image, header, description}) {
  return (
    <div className='feature-card-home' data-aos="fade-up">
        <div className='abs'>
            <img src={`/images/newHome/${image}`} />
            <p className='header'>{header}</p>
            <p className='description'>
                {description}
            </p>
        </div>
    </div>
  )
}

export default FeatureCard