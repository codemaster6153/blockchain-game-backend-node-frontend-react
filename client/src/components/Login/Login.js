import React from 'react';
import CoinDisplay from '../CoinDisplay/CoinDisplay';
import "./Login.css";
import { Link } from 'react-router-dom'


const Login = ({wax, onLogin}) => {

    if (typeof wax.userAccount !== "undefined") {
        return (
            <>
                <div className="social-logos">
                    <a target='_blank' href='https://discord.gg/Zc7mVPyzRJ' className='discord' ></a>
                    <a target='_blank' href='https://twitter.com/clash_dome' className='twitter' ></a>
                    <a target='_blank' href='https://clashdome.medium.com/' className='medium' ></a>
                    <a target='_blank' href='https://t.me/clashdome' className='telegram' ></a>
                    <a target='_blank' href='https://github.com/ClashDome' className='github' ></a>
                </div>
            </>
        );
    } else {
        return (
            <div className="login">
                <button className="login-button" onClick={onLogin} >WAX Login</button>
            </div>
        );
    }
}

export default Login
