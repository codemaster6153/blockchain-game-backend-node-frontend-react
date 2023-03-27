import React, { Component } from 'react';
import "./AvatarEditor.css"
import { ClashdomeMessageServer } from '../../utils/ClashdomeMessageServer';

export default class AvatarEditor extends Component {
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
        scriptElement.src = "/avatar-editor/dist/bundle.js";
        scriptElement.async = true;
        const spineScript = document.createElement("script");
        spineScript.src = "/avatar-editor/dist/SpineWebGLPlugin.min.js";
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
            <div className="container game-loader avatar-editor" ref={el => this.div = el}>
                <div id="content" />
            </div>
        );
    }
}
