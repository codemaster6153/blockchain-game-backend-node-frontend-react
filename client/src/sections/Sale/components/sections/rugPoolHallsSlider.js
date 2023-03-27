import React, { useState } from 'react'
import './citizenBuyCard.css'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function RugPoolHallsSlider({ info, val, cards, counter }) {

  const [indexValue, setIndexValue] = useState(0);

  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    beforeChange: (current, next) => setIndexValue(next)
  };

  const renderSlides = (data) => {
    const renderHtml = data.map((img) =>
      <div key={img?.id} className='box-citizen'>
        <div className={"image-container"}>
          <img src={img?.image} className="img-btm" alt="fadedcard" />
        </div>
      </div>
    )

    const imageDetail = () => {
      return (
        <div className='info-wrapper slider-info'>
          {val !== 'PACKS' ?
            <>
              <div className='info-line'>
                <p className='info-line-label'>NAME:</p>
                <p className='info-line-value'>{data[indexValue].name}</p>
              </div>
              <div className='info-line'>
                <p className='info-line-label'>TOTAL CO-OWNERS:</p>
                <p className='info-line-value'>{data[indexValue]?.totalCoOwner}</p>
              </div>
              <div className='info-line'>
                <p className='info-line-label'>TOTAL POCKETED BALLS:</p>
                <p className='info-line-value'>
                  {(counter?.find(value => value?.id === data[indexValue]?.id)?.counter)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </p>
              </div>
            </>
            :
            <>
              <div className='info-line'>
                <p className='info-line-label'>RUG POOL HALLS</p>
              </div>
              <div className='info-line'>
                <p className='info-line-label'>TOTAL COUNT</p>
                <p className='info-line-value'>{data[indexValue]?.totalPacks}</p>
              </div>
            </>
          }
          <hr />
          <div className='buy-wrapper'>
            <p>BUY</p>
            <div className='buttons-container'>
              <a href={data[indexValue]?.buyAtomic} target='_blank' rel="noopener">
                <img src='/images/shop/btn_buy_atomic.svg' alt='buy atomic' />
              </a>
              <a href={data[indexValue]?.buyNefty} target='_blank' rel="noopener">
                <img src='/images/shop/btn_buy_nefty.svg' alt='buy atomic' />
              </a>
              <a href={data[indexValue]?.buyNfthive} target='_blank' rel="noopener">
                <img src='/images/shop/btn_buy_nfthive.svg' alt='buy atomic' />
              </a>
            </div>
          </div>
        </div>
      )
    }
    const renderData = cards ? <>
      <Slider {...settings}> {renderHtml} </Slider>
      {imageDetail()}
    </> : <>
      {renderHtml}
      {imageDetail()}
    </>;
    return renderData;
  }

  return (
    <div className="buy-citizen-card card-box-new">
      <p className='title'>{val !== "PACKS" ? `${val} HALLS` : val}</p>
      {renderSlides(Object.values(info).flat().filter(value => value.rarity === val))}
    </div>
  )
}

export default RugPoolHallsSlider