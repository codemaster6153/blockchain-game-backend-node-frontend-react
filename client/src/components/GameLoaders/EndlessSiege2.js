import React, { Component } from 'react';
import "./EndlessSiege2.css"
import { ClashdomeMessageServer } from '../../utils/ClashdomeMessageServer';


export default class EndlessSiege2 extends Component {
    state = {
        wax: this.props.wax,
        serverType: this.props.serverType
    }

    loginFromGame = this.props.loginFromGame;

    // this will update state when props change
    static getDerivedStateFromProps(props) {
        return {
            wax: props.wax,
            serverType: props.serverType
        };
    }

    componentDidMount() {

        const scriptElement = document.createElement("script");
        scriptElement.src = "/endless-siege-2/dist/bundle.js";
        scriptElement.async = true;
        const spineScript = document.createElement("script");
        spineScript.src = "/endless-siege-2/dist/SpineWebGLPlugin.min.js";
        spineScript.async = true;
        this.div.appendChild(spineScript);
        this.div.appendChild(scriptElement);
        scriptElement.onload = () => {
            ClashdomeMessageServer.startGame(this);
        }
    }

    componentWillUnmount() {

        if (ClashdomeMessageServer.game) {
            ClashdomeMessageServer.disposeGame();
        }
    }

    render() {
        return (
            <div className='section endless-siege'>
                <div className="game-loader endless-siege" ref={el => this.div = el}>
                    <div id="content" />
                </div>
            </div>
        );
    }
}
