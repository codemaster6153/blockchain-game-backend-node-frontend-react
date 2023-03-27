import React, { Component } from 'react';
import "./RingyDingy.css"
import { ClashdomeMessageServer } from '../../utils/ClashdomeMessageServer';


export default class RingyDingy extends Component {
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
        scriptElement.src = "/ringy-dingy/dist/bundle.js";
        scriptElement.async = true;
        const spineScript = document.createElement("script");
        spineScript.src = "/ringy-dingy/dist/SpineWebGLPlugin.min.js";
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
            <div className='section ringy-dingy'>
                <div className="game-loader ringy-dingy" ref={el => this.div = el}>
                    <div id="content" />
                </div>
            </div>
        );
    }
}
