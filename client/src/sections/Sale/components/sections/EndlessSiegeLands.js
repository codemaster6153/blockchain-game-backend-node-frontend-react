import React, { useEffect, useState } from 'react'
import SiegeLandsSlider from './siegeLandsSlider'
import endlessSiegeLandsData from './siegeLandsData'
import './index.css'

const groupBy = (array, key) => {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    return result;
  }, {});
};

const groupedByRarity = groupBy(endlessSiegeLandsData, 'rarity');

function EndlessSiegeLands() {

  const stringsToSearch = ['MYTHIC', 'PACKS'];
  const slideArray = ['EPIC', 'RARE', 'COMMON', 'LEGENDARY'];
  const [counter, setCounter] = useState([]);

  const cardsArray = Object.keys(groupedByRarity).filter(function (item) {
    return stringsToSearch.indexOf(item) < 0;
  });

  const sliderArray = Object.keys(groupedByRarity).filter(function (item) {
    return slideArray.indexOf(item) < 0;
  });

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/clashdome-game/ludio-nfts-values/endless-siege", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Accept": "application/json",
        },
      });
      const result = await res.json();
      setCounter(result)
    })();
  }, []);
  return (
    <section className='assetshop-section endless-siege' id='mining-hub'>
      <h1 className='head-text'>ENDLESS SIEGE LANDS</h1>
      <div className='description'>
        <p>Each of Endless Siege's maps has an NFT counterpart so each time an orc dies on that location,
          the land owner will get some profits. Each map has a different number of co-owners depending
          on it's rarity. The total amount of orcs dead on each Duel is then split among the co-owners
          of the land. Land owners also have the prerogative of playing their on maps(AKA defending their lands) </p>
      </div>
      <div className='cards-wrapper'>
        {cardsArray.map(val => <SiegeLandsSlider key={val} counter={counter} info={groupedByRarity} val={val} cards={true} />)}
        {sliderArray.map(val => <SiegeLandsSlider key={val} counter={counter} info={groupedByRarity} val={val} cards={false} />)}
      </div>
    </section>
  )
}

export default EndlessSiegeLands