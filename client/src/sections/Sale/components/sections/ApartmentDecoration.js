import React, { useEffect, useState, useMemo } from 'react'
import { data } from './ApartmentData';
import './index.css'
import { useShop } from '../../context/shop-context';
import ApartmentDecorationCard from './ApartmentDecorationCard';

function ApartmentDecoration({ wax }) {

  const shopData = useShop();

  const shop = useMemo(() =>
    shopData?.map(data => {
      const newData = { ...data }
      if (newData?.img) {
        newData.img = 'https://ipfs.io/ipfs/' + newData?.img
      }
      else if (newData?.video) {
        newData.video = 'https://ipfs.io/ipfs/' + newData?.video
      }
      return newData
    })
    , [shopData])


  return (
    <section className='assetshop-section' id='mining-hub'>
      <h1 className='head-text'>APARTMENT DECORATION</h1>
      <div className='description'>
        <p>Bored of the same predesigned color? It's renovation time! Give your apartment a cool and fancy look with the Apartment Customization NFT. Once staked, you'll be able to change both floor and walls color and finally your apartment will be as colorful as your Citizen. (We're not liable for people's bad taste in decorating their apartments.) </p>
      </div>
      <div className='cards-wrapper'>
        {shop?.map((val) => (
          <ApartmentDecorationCard key={val?.item_name} data={val} hasCraft wax={wax} />
        ))}

        {data && data.map((val) => (
          <ApartmentDecorationCard key={val?.name} data={val} hasCraft={false} wax={wax} />
        ))}
      </div>
    </section>
  )
}

export default ApartmentDecoration