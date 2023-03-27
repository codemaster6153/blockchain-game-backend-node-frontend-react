import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import "bulma/css/bulma.min.css"
import 'react-slidedown/lib/slidedown.css'
import "./sections/App/App.css";
import store from './store';
import { Provider } from 'react-redux';
import { UALProvider, withUAL } from 'ual-reactjs-renderer';
import { Anchor } from 'ual-anchor'         // Anchor Wallet    
import { Wax } from '@eosdacio/ual-wax';    // WAX Cloud Wallet
import { Wombat } from 'ual-wombat';        // Wombat Wallet
import AppCopy from './sections/App/AppCopy';

let myChain

if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
    myChain = {
        chainId: "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12",
        rpcEndpoints: [{
            protocol: 'https',
            host: 'waxtest.eu.eosamsterdam.net',
            port: '443'
        }]
    }
} else {
    myChain = {
        chainId: "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
        rpcEndpoints: [{
            protocol: 'https',
            host: 'wax.eu.eosamsterdam.net',
            port: '443'
        }]
    }
}

const UALApp = withUAL(AppCopy)

const wax = new Wax([myChain], { appName: "Clashdome" });         // WAX Cloud Wallet connection
const anchor = new Anchor([myChain], { appName: "Clashdome" });   // Anchor Wallet connection
const wombat = new Wombat([myChain], { appName: "Clashdome" });   // Wombat Wallet connection

let connections = [];

if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
    connections = [anchor];
} else {
    connections = [wax, anchor];

    if (process.env.NODE_ENV !== "development") {
        connections.push(wombat);
    }
}

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <UALProvider chains={[myChain]} authenticators={connections} appName={'Clashdome'}>
                    <UALApp />
                </UALProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
