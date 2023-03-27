import React from 'react'
import './index.css'
import Arrow from './arrows.svg';
import FeatureCard from './FeatureCard';

function SectionTwo() {
    return (
        <div className='section-two'>
            <div className='first-half'>
                <div className='section-title'>
                    PICK A GAME IN YOUR ARCADE AND MEET YOUR RIVALS IN…
                </div>
                <div className='fighting-girl'>
                    <object className='arrow-animation' data={Arrow} />
                    <div className='opacity-gradinet-layer'></div>
                    <div className='girl' data-aos="zoom-in">
                        <img src='/images/newHome/duels_illust.png' alt="fighting" />
                    </div>
                </div>
            </div>
            <div className='second-half'>
                <div className='second-half-container'>
                    <FeatureCard
                        image={'genres.jpg'}
                        header={'FAMILIAR GENRES'}
                        description={'Our expanding portfolio of casual games features the genres you love. Classic F2P gaming will be pointless.'}
                    />
                    <FeatureCard
                        image={'fair_players.jpg'}
                        header={'FAIR PLAYER VS PLAYER'}
                        description={'You and your rival share the same “luck” (random seed) so both of you will have the same random events.'}
                    />
                    <FeatureCard
                        image={'learn_best.jpg'}
                        header={'LEARN FROM THE BEST'}
                        description={'Checking your rival’s replays is great for transparency but also will help you improving your skills.'}
                    />
                    <FeatureCard
                        image={'advantages.jpg'}
                        header={'EMBRACE THE CITIZENSHIP!'}
                        description={'Get access to your apartment with the Citizen NFT: games, customization and mining features await you there.'}
                    />
                    <FeatureCard
                        image={'cash_out.jpg'}
                        header={'CASH OUT OR RANK UP'}
                        description={'Convert your LUDIO from day 1 or build up your resources, craft NFTs and produce secondary tokens.'}
                    />
                </div>
            </div>
        </div>
    )
}

export default SectionTwo