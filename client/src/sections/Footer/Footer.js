import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CoinDisplay from '../../components/CoinDisplay/CoinDisplay';
import "./Footer.css";

export default class Footer extends Component {
    render() {
        const { telegram, twitter, github, medium } = this.props;
        return (
            <>
                <section className="footer">
                    <div className="container">
                        <div className="columns legal-links">
                            <div className="column">
                                <Link to="/privacy-policy">Privacy Policy</Link>
                            </div>
                            <div className="column">
                                <Link to="/terms-and-conditions">Terms and Conditions</Link>
                            </div>
                        </div>
                        <div className="social">
                            <a href={telegram} target="_blank" rel="noopener noreferrer">
                                <span className="telegram"><img src="/images/icon-telegram.png" alt="Telegram" /></span>
                            </a>
                            <a href={twitter} target="_blank" rel="noopener noreferrer">
                                <span className="telegram"><img src="/images/awesome-twitter.png" alt="Twitter" /></span>
                            </a>
                            <a href={github} target="_blank" rel="noopener noreferrer">
                                <span className="github"><img src="/images/icon-github.png" alt="Github" /></span>
                            </a>
                            <a href="https://discord.gg/Zc7mVPyzRJ" target="_blank" rel="noopener noreferrer">
                                <span className="github"><img src="/images/icon_discord.png" alt="Discord" /></span>
                            </a>
                            <a href={medium} target="_blank" rel="noopener noreferrer">
                                <span className="medium"><img src="/images/medium_icon.png" alt="Medium" /></span>
                            </a>
                        </div>
                    </div>
                </section>
                {(typeof this.props.wax.userAccount !== "undefined") &&
                    <div className="coin-display-footer">
                        <CoinDisplay wax={this.props.wax}></CoinDisplay>
                    </div>}
            </>
        );
    }
}
