import React, { Component } from 'react';
import "./Maze.css"
import { ClashdomeMessageServer } from '../../utils/ClashdomeMessageServer';


export default class Maze extends Component {
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
        scriptElement.src = "/maze/dist/bundle.js";
        scriptElement.async = true;
        this.div.appendChild(scriptElement);
        scriptElement.onload = () => {
            ClashdomeMessageServer.startGame(this);
        }
        console.log(document.getElementsByClassName('game-loader maze')[0])
        if(document.documentElement.clientWidth < 1044){
            document.getElementsByClassName('game-loader maze')[0].classList.add('full-screen')
            document.documentElement.scrollTo(0,0)
            document.documentElement.style.overflow = 'hidden'
        }
    }
    
    componentWillUnmount() {
        if(document.documentElement.clientWidth < 1044){
            document.getElementsByClassName('game-loader maze')[0].classList.remove('full-screen')
            document.documentElement.style.overflow = 'initial'
        }
        if (ClashdomeMessageServer.game) {
            ClashdomeMessageServer.disposeGame();
        }
    }

    render() {
        return (
            <div className="game-loader maze" ref={el => this.div = el}>
                <div id="content" />
            </div>
        );
    }
}