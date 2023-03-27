import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import './stepCarousel.css'

function StepCarousel() {
    const responsive = {
        all: {
            breakpoint: { max: 4000, min: 600 },
            items: 1
        },
        mobile: {
            breakpoint: { max: 600, min: 0 },
            items: 1
        }
    };
    return (
        <div className='step-carousel-container'>
            <Carousel
                customRightArrow={<CustomRightArrow />}
                customLeftArrow={<CustomLeftArrow />}
                swipeable={true}
                draggable={false}
                showDots={true}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                autoPlay={false}
                autoPlaySpeed={3000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["mobile"]}
                renderButtonGroupOutside={false}
                // deviceType={this.props.deviceType}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
            >
                <div className='step-container' >
                    <img src='/images/newHome/01.jpg' alt='step' />
                </div>
                <div className='step-container' >
                    <img src='/images/newHome/02.jpg' alt='step' />
                </div>
                <div className='step-container' >
                    <img src='/images/newHome/03.gif' alt='step' />
                </div>
                <div className='step-container' >
                    <img src='/images/newHome/04.jpg' alt='step' />
                </div>
                <div className='step-container' >
                    <img src='/images/newHome/05.jpg' alt='step' />
                </div>
            </Carousel>
        </div>
    )
}

const CustomLeftArrow = ({ onClick }) => {
    const handleClick = () => {
        onClick()
    }
    return (
        <button onClick={handleClick} className="custom-left-arrow" >
            <svg xmlns="http://www.w3.org/2000/svg" width="75.312" height="111.293" viewBox="0 0 75.312 111.293">
                <defs>
                    <filter id="Icon_ionic-ios-arrow-back" x="0" y="0" width="75.312" height="111.293" filterUnits="userSpaceOnUse">
                        <feOffset dy="4" input="SourceAlpha" />
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feFlood floodOpacity="0.6" />
                        <feComposite operator="in" in2="blur" />
                        <feComposite in="SourceGraphic" />
                    </filter>
                </defs>
                <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Icon_ionic-ios-arrow-back)">
                    <path id="Icon_ionic-ios-arrow-back-2" dataName="Icon ionic-ios-arrow-back" d="M24.91,46.829,54.9,16.095a5.889,5.889,0,0,0,0-8.2,5.589,5.589,0,0,0-8.022,0L12.9,42.715a5.906,5.906,0,0,0-.165,8.01L46.853,85.792a5.6,5.6,0,0,0,8.022,0,5.889,5.889,0,0,0,0-8.2Z" transform="translate(71.56 98.49) rotate(180)" fill="#fff" />
                </g>
            </svg>
        </button>
    )
}
const CustomRightArrow = ({ onClick }) => {
    const handleClick = () => {
        onClick()
    }
    return (
        <button onClick={handleClick} className="custom-right-arrow" >
            <svg xmlns="http://www.w3.org/2000/svg" width="75.312" height="111.293" viewBox="0 0 75.312 111.293">
                <defs>
                    <filter id="Icon_ionic-ios-arrow-back" x="0" y="0" width="75.312" height="111.293" filterUnits="userSpaceOnUse">
                        <feOffset dy="4" input="SourceAlpha" />
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feFlood floodOpacity="0.6" />
                        <feComposite operator="in" in2="blur" />
                        <feComposite in="SourceGraphic" />
                    </filter>
                </defs>
                <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Icon_ionic-ios-arrow-back)">
                    <path id="Icon_ionic-ios-arrow-back-2" dataName="Icon ionic-ios-arrow-back" d="M24.91,46.829,54.9,16.095a5.889,5.889,0,0,0,0-8.2,5.589,5.589,0,0,0-8.022,0L12.9,42.715a5.906,5.906,0,0,0-.165,8.01L46.853,85.792a5.6,5.6,0,0,0,8.022,0,5.889,5.889,0,0,0,0-8.2Z" transform="translate(71.56 98.49) rotate(180)" fill="#fff" />
                </g>
            </svg>
        </button>
    )
};


export default StepCarousel