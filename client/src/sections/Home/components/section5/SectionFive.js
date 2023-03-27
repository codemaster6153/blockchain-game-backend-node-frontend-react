import React from 'react';
import './index.css';

function SectionFive() {
    return (
        <div className='section-five'>
            <h1>NON-GAMERS CAN PARTICIPATE TOO</h1>
            <div className='content-wrapper'>
                <div className='social-card'>
                    <div className='image-box'><img src="/images/newHome/illust_chest.svg" alt='program' /></div>
                    <h2>EARN PROGRAM</h2>
                    <p className='main-text'>
                        {"Stake your ClashDome tokens (Ludio, Carbz and Jigowatts) in HUB> EXCHANGE to earn periodic rewards."}
                    </p>
                </div>
                <div className='social-card'>
                    <div className='image-box'>
                        <img src="/images/newHome/illust_liquidity.svg" alt='program' />
                    </div>
                    <h2>LIQUIDITY POOL</h2>
                    <p className='main-text'>
                        Participate in the rewarded Taco’s Liquidity Pools to get daily earnings and exclusive perks for the top providers.
                    </p>
                </div>
                <div className='social-card'>
                    <div className='image-box'>
                        <img src="/images/newHome/illust_lands.svg" alt='program' />
                    </div>
                    <h2>LANDS & HALLS</h2>
                    <p className='main-text'>
                        Owning an Endless Siege Land or Rug Pool Hall rewards you from the games’ activity and offers a special motivation for you to play.
                    </p>
                </div>
            </div>
        </div >
    )
}

export default SectionFive