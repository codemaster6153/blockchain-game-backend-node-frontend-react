import React, { useEffect, useState } from 'react'
import rugPoolData from './rugpoolData'
import './index.css'
import RugPoolHallsSlider from './rugPoolHallsSlider';

const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
        );
        return result;
    }, {});
};

const groupedByRarity = groupBy(rugPoolData, 'rarity');

function RugPoolHalls() {
    const [counter, setCounter] = useState([]);
    useEffect(() => {
        (async () => {
            const res = await fetch("/api/clashdome-game/ludio-nfts-values/rug-pool", {
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
    const stringsToSearch = ['MYTHIC', 'PACKS'];
    const slideArray = ['EPIC', 'RARE', 'COMMON', 'LEGENDARY'];

    const cardsArray = Object.keys(groupedByRarity).filter(function (item) {
        return stringsToSearch.indexOf(item) < 0;
    });

    const sliderArray = Object.keys(groupedByRarity).filter(function (item) {
        return slideArray.indexOf(item) < 0;
    });
    return (
        <section className='assetshop-section rug-pool-hall' id='mining-hub'>
            <h1 className='head-text'>RUG POOL HALLS</h1>
            <div className='description'>
                <p>
                    With Rug Pool Halls NFTs you can become a Pool Hall Owner and earn both active and passively. Every time a player visits your Hall, you’ll earn Ludio passively for each pocketed ball. And naturally, as a Pool Hall owner you can play at your own table, earning from pocketed balls but also from the victories you get. Pool Halls will also play a role in the future Rug Pool Tournaments.
                </p>
            </div>
            <div className='cards-wrapper'>
                {cardsArray.map(val => <RugPoolHallsSlider key={val} counter={counter} info={groupedByRarity} val={val} cards={true} />)}
                {sliderArray.map(val => <RugPoolHallsSlider key={val} counter={counter} info={groupedByRarity} val={val} cards={false} />)}
            </div>
        </section>
    )
}

export default RugPoolHalls