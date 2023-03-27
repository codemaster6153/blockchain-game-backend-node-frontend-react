import React, {Component, useState} from 'react';
import "./LeaderboardEntry.css";
import getAvatar from "../../utils/avatar";
import {Link} from 'react-router-dom'

/*
address: "xzzau.wam"
points: 2500
position: 1
timestamp: 5000
transactionId: "ded4768920691a448ea8bfcfe656538ea40f46397d8c82982cbafc7240c229ca"
 */

export default class LeaderboardEntry extends Component {
    state = {
        avatar: "",
    }

    getLastTransaction = () => {
        return this.props.player.transactionId.substr(0, 6) + "..." + this.props.player.transactionId.substr(this.props.player.transactionId.length - 6);
    }

    getTimeStr = () => {
        let seconds = this.props.player.timestamp;
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds - (hours * 3600)) / 60);
        seconds = seconds - (hours * 3600) - (minutes * 60);
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
    }

    componentDidMount() {
        console.log("mounted")
        getAvatar(this.props.player.address)
            .then(v => this.setState({avatar: v}))
    }

    componentDidUpdate() {
        console.log("this updated")
        getAvatar(this.props.player.address)
            .then(v => this.setState({avatar: v}))
    }

    render() {
        const props = this.props;
        return (
            <div className={`box leaderboard-entry me-${props.me}`}>
                <span className="avatar"><img src={this.state.avatar} alt="avatar"/></span>
                <span className="position">{props.player.position}</span>
                <span className="address">
                    <Link to={`/token-mining-game/${props.player.address}`} style={{color: 'inherit'}} >{props.player.address}</Link>
                </span><br/>
                <span className="points">Points: {props.player.points}</span>,&nbsp;
                <span className="time">Submission time: {this.getTimeStr()}</span>,&nbsp;
                <span className="tokens">Transaction:&nbsp;
                    <a href={"https://wax.bloks.io/transaction/" + props.player.transactionId} target="_blank"
                       rel="noreferrer noopener">
                    {this.getLastTransaction()}
                    </a>
                </span>
            </div>
        );
    }
};
