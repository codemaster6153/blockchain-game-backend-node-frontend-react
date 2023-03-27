import React, {Component} from 'react';
import "./Leaderboard.css";
import Pagination from "../Pagination/Pagination";
import {paginate} from "../../utils/paginet";
import LeaderboardEntry from "../LeaderboardEntry/LeaderboardEntry";
import ListGroup from "../ListGroup/ListGroup";
import _ from 'lodash';
import initConfig from '../../initConfig';

const FILTER_ALL = 1
const FILTER_ME = 2

export default class Leaderboard extends Component {
    state = {
        lastTournament: {},
        pageSize: 8,
        currentPage: 1,
        filter: FILTER_ALL,
        wax: this.props.wax
    }

    componentDidMount() {

        fetch('/api/tournament/previous/' + this.props.tournament.name_id)
            .then(res => res.json())
            .then(t => {

                var currentDate = new Date();
                currentDate.setUTCHours(currentDate.getUTCHours() - 3);
                currentDate.setUTCDate(currentDate.getUTCDate() - 1);

                let id = this.getID(this.props.tournament.name_id, currentDate);

                this.getRows("clashdomerwd", "rewards", id, 0, (value) => {

                    let jackpot = parseFloat(value.value.rows[0].quantity.slice(0, -4));
                    let percetages = [33, 20, 10, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1];
    
                    t.jackpot = jackpot.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    t.prizes = [];
                    for(let i = 0; i < percetages.length; i++) {
                        t.prizes.push(jackpot * (percetages[i] / 100));
                    }

                    console.log(t);

                    this.setState({lastTournament: t})

                });
                
            });
        
        if (this.props.match.params.filter === "me") {
            this.setState({filter: FILTER_ME});
        }

    }

    componentWillReceiveProps(nextProps) {

        fetch('/api/tournament/previous/' + nextProps.tournament.name_id)
            .then(res => res.json())
            .then(t => {
                var currentDate = new Date();
                currentDate.setUTCHours(currentDate.getUTCHours() - 3);
                currentDate.setUTCDate(currentDate.getUTCDate() - 1);

                let id = this.getID(nextProps.tournament.name_id, currentDate);

                this.getRows("clashdomerwd", "rewards", id, 0, (value) => {

                    let jackpot = parseFloat(value.value.rows[0].quantity.slice(0, -4));
                    let percetages = [33, 20, 10, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1];
    
                    t.jackpot = jackpot.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    t.prizes = [];
                    for(let i = 0; i < percetages.length; i++) {
                        t.prizes.push(jackpot * (percetages[i] / 100));
                    }

                    console.log(t);

                    this.setState({lastTournament: t})

                });
            });
    
        if (nextProps.match.params.filter === "me") {
            this.setState({filter: FILTER_ME});
        }
    }

    handlePageChange = page => {
        this.setState({currentPage: page});
    }

    handleFilterChange = filter => {
        if (filter === FILTER_ME) {
            this.props.history.push('/' + this.props.tournament.name_id + '/leaderboard/me');
        } else {
            this.props.history.push('/' + this.props.tournament.name_id + '/leaderboard');
        }
        this.setState({filter: filter, currentPage: 1})
    }

    getTournamentDate = () => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const m = new Date(this.state.lastTournament.end_date);
        return m.getUTCDate()+" "+monthNames[m.getMonth()]+" "+m.getUTCFullYear()
    }

    render() {
        const {pageSize, currentPage, filter} = this.state;
        let players = this.state.lastTournament.players;
        if (typeof players === "undefined") return null;
        if (filter === FILTER_ME) players = players.filter(p => p.address.toLowerCase() === this.state.wax.userAccount);
        players = _.orderBy(players, ['position', 'desc'])
        let playersLength = players.length;
        // for enable pagination change last param to pageSize
        players = paginate(players, currentPage, this.state.lastTournament.players.length);
        return (
            <div className="container">
                <div className="leaderboard">
                    <h2>Leaderboard</h2>
                    <p className="tournament-date">Date: {this.getTournamentDate()}</p>
                    <ListGroup
                        items={[{id: 1, name: 'All'}, {id: 2, name: 'Me'}]}
                        textProperty={'name'}
                        valueProperty={'id'}
                        selectedItem={filter}
                        onItemSelect={this.handleFilterChange}/>
                    <p className="entries-amount">Showing {playersLength} entries.</p>
                    {
                        players.length !== 0
                            ? players.map(p => <LeaderboardEntry key={p._id} player={p} me={this.state.wax.userAccount === p.address.toLowerCase()}/>)
                            : <div className="no-results">There are no entries with your filter criteria.</div>
                    }
                    
                    {/* <Pagination itemsCount={playersLength}
                                pageSize={pageSize}
                                currentPage={currentPage}
                                onPageChange={this.handlePageChange}/> */}
                    
                </div>
            </div>
        );
    }

    devLastTournament() {

        return {
            _id: 1,
            game: 1,
            status: 1,
            currency: 'WAX',
            entry: 25,
            jackpot: 1000,
            prizes: [33, 20, 10, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1],
            end_date: "T02:00:00.000Z",
            players: [
                {
                    id: 1,
                    position: 1,
                    timestamp: 10000,
                    address: "cvrtt.wam",
                    points: 100000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc"
                },
                {
                    id: 2,
                    position: 2,
                    timestamp: 10000,
                    address: "xxxxx.wam",
                    points: 50000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 3,
                    position: 3,
                    timestamp: 10000,
                    address: "aaaaa.wam",
                    points: 25000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 4,
                    position: 4,
                    timestamp: 10000,
                    address: "bbbbb.wam",
                    points: 14000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 5,
                    position: 5,
                    timestamp: 10000,
                    address: "ccccc.wam",
                    points: 13000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 6,
                    position: 6,
                    timestamp: 10000,
                    address: "ddddd.wam",
                    points: 12000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 7,
                    position: 7,
                    timestamp: 10000,
                    address: "cdecc.wam",
                    points: 11000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 8,
                    position: 8,
                    timestamp: 10000,
                    address: "urhcc.wam",
                    points: 10000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 9,
                    position: 9,
                    timestamp: 10000,
                    address: "wedcc.wam",
                    points: 9000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 10,
                    position: 10,
                    timestamp: 10000,
                    address: "oiuyt.wam",
                    points: 8000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 11,
                    position: 11,
                    timestamp: 10000,
                    address: "gbfrt.wam",
                    points: 7000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 12,
                    position: 12,
                    timestamp: 10000,
                    address: "asxxx.wam",
                    points: 6000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 13,
                    position: 13,
                    timestamp: 10000,
                    address: "zsdww.wam",
                    points: 5000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 14,
                    position: 14,
                    timestamp: 10000,
                    address: "anduk.wam",
                    points: 4000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 15,
                    position: 15,
                    timestamp: 10000,
                    address: "leyff.wam",
                    points: 3000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 16,
                    position: 16,
                    timestamp: 10000,
                    address: "qbbbb.wam",
                    points: 2000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 17,
                    position: 17,
                    timestamp: 10000,
                    address: "asccc.wam",
                    points: 1000,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 18,
                    position: 18,
                    timestamp: 10000,
                    address: "qppjk.wam",
                    points: 500,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                },
                {
                    id: 19,
                    position: 19,
                    timestamp: 10000,
                    address: "dccrf.wam",
                    points: 100,
                    transactionId: "ee7292802ffba70748d120fd136a1a900b803a40a5bc7d533ed0e3a57e35e6bc",
                    url: null
                }
            ]
        };
    }

    getRows(contract, table, id, count, callback) {

        const { JsonRpc } = require("eosjs");
        const fetch = require('node-fetch');

        const rpc = new JsonRpc(initConfig.waxUrls[count], { fetch });

        try {
            rpc.get_table_rows({
                json: true,
                code: contract,
                scope: contract,
                table: table,
                lower_bound: id,
                limit: 1,
                reverse: false,
                show_payer: false
            })
                .then((value) => {
                    console.log("OK " + initConfig.waxUrls[count]);
                    callback({ "value": value });
                })
                .catch(err => {
                    if (count === initConfig.waxUrls.length - 1) {
                        callback({ "error": err });
                    } else {
                        console.log("error " + initConfig.waxUrls[count]);
                        this.getRows(contract, table, id, count + 1, callback)
                    }
                });
        } catch {
            if (count === initConfig.waxUrls.length - 1) {
                callback({ "error": err });
            } else {
                console.log("error " + initConfig.waxUrls[count]);
                this.getRows(contract, table, id, count + 1, callback)
            }
        }
    }

    getID(game, d) {

        let day = (d.getUTCDate() < 10 ? "0" : "") + d.getUTCDate();
        let month = ((d.getUTCMonth() + 1) < 10 ? "0" : "") + (d.getUTCMonth() + 1);

        let gameIDs = {
            "endless-siege": "00",
            "candy-fiesta": "01",
            "templok": "02"
        };

        return d.getUTCFullYear() + month + day + gameIDs[game];
    }
}
