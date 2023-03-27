import React from 'react';
import './heroComponent.css';

export default function HeroComponent() {
    return (
        <div className="hero-component">
            <div className="hero-side-image">
                <img src="/images/char_1.png" alt="hero-boy" />
            </div>
            <div className="hero-center-image">
                <img src="/images/clash_struggle_title.png" alt="hero" />
                <div className="tournament-info">
                    <p className="start-end">10-23 JUNE</p>
                    <p className="time-remaining">10 days 20 hours 33 minutes 21 seconds</p>
                    <div className="current-score">
                        <p>YOUR CURRENT SCORE: 6,500</p>
                        <img src="/images/btn_ranking.png" alt="rankbutton" />
                    </div>
                    <div className="previous-tournament">
                        <p>PREVIOUS TOURNAMENT</p>
                    </div>
                    <div className="info">
                        <img src="/images/infoCircle.svg" />
                    </div>
                    <div className="final-prize">
                        <p>
                            PRIZE POT: 300,000 LUDIO
                            <span>
                                <img src="/images/ludio_60X60.png" alt="ludio" />
                            </span>
                        </p>
                        <div>
                            +
                            <img src="/images/card.png" width="60px" alt="card" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="hero-side-image">
                <img src="/images/char_2.png" />
            </div>
        </div>
    )
}
