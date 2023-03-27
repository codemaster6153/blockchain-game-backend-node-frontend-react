import React, { Component } from 'react';
import "./Templok.css"
import { ClashdomeMessageServer } from '../../utils/ClashdomeMessageServer';


export default class Templok extends Component {
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
        scriptElement.src = "/templok/dist/bundle.js";
        scriptElement.async = true;
        const spineScript = document.createElement("script");
        spineScript.src = "/templok/dist/SpineWebGLPlugin.min.js";
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
            <div className='section templok'>
                <div className="game-loader templok" ref={el => this.div = el}>
                    <div id="content" />
                </div>
            </div>
        );
    }
}
