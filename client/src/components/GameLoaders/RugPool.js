import React, { Component } from 'react';
import "./RugPool.css"
import { ClashdomeMessageServer } from '../../utils/ClashdomeMessageServer';


export default class RugPool extends Component {
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
        scriptElement.src = "/rug-pool/dist/bundle.js";
        scriptElement.async = true;
        this.div.appendChild(scriptElement);
        scriptElement.onload = () => {
            ClashdomeMessageServer.startGame(this);
        }
        console.log(document.getElementsByClassName('game-loader rug-pool')[0])
        if(document.documentElement.clientWidth < 1044){
            document.getElementsByClassName('game-loader rug-pool')[0].classList.add('full-screen')
            document.documentElement.scrollTo(0,0)
            document.documentElement.style.overflow = 'hidden'
        }
    }
    
    componentWillUnmount() {
        if(document.documentElement.clientWidth < 1044){
            document.getElementsByClassName('game-loader rug-pool')[0].classList.remove('full-screen')
            document.documentElement.style.overflow = 'initial'
        }
        if (ClashdomeMessageServer.game) {
            ClashdomeMessageServer.disposeGame();
        }
    }

    render() {
        return (
            <div className="game-loader rug-pool" ref={el => this.div = el}>
                <div id="content" />
            </div>
        );
    }
}
