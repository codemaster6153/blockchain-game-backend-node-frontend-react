import React, { Component } from 'react';
import "./CandyFiesta.css"
import { ClashdomeMessageServer } from '../../utils/ClashdomeMessageServer';

export default class CandyFiesta extends Component {
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
        scriptElement.src = "/candy-fiesta/dist/bundle.js";
        scriptElement.async = true;
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
            <div className='section candy-fiesta'>
                <div className="game-loader candy-fiesta" ref={el => this.div = el}>
                    <div id="content" />
                </div>
            </div>
        );
    }
}
