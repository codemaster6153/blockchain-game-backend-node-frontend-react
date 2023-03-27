import React, { Component } from 'react';
import "./TokenMiningGameLoader.css"
import { ClashdomeMessageServer } from '../../utils/ClashdomeMessageServer';

export default class TokenMiningGameLoader extends Component {
    state = {
        wax: this.props.wax,
        serverType: process.env.REACT_APP_SERVER_TYPE
    }

    // this will update state when props change
    static getDerivedStateFromProps(props) {
        return {
            wax: props.wax,
            serverType: process.env.REACT_APP_SERVER_TYPE
        };
    }

    componentDidMount() {

        const scriptElement = document.createElement("script");
        scriptElement.src = "/token-mining-game/dist/bundle.js";
        scriptElement.async = true;
        const spineScript = document.createElement("script");
        spineScript.src = "/token-mining-game/dist/SpineWebGLPlugin.min.js";
        spineScript.async = true;
        this.div.appendChild(spineScript);
        this.div.appendChild(scriptElement);
        scriptElement.onload = () => {
            ClashdomeMessageServer.startGame(this);
        }
    }

    componentDidUpdate() {
        console.log("component updated :")
        ClashdomeMessageServer.dispatchMessageToGame({id: "token-mining-game", payload: "RELOAD"});
    }

    componentWillUnmount() {

        if (ClashdomeMessageServer.game) {
            ClashdomeMessageServer.disposeGame();
        }
    }

    render() {
        return (
            <div className='section token-mining'>
                <div className="token-mining-game-loader" ref={el => this.div = el}>
                    <div id="content" />
                </div>
            </div>
        );
    }
}
