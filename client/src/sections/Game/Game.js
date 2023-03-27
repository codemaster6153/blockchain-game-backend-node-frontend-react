import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import EndlessSiege2 from "../../components/GameLoaders/EndlessSiege2";
import "./Game.css";
import GameRules from "../../components/GameRules/GameRules";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import CandyFiesta from '../../components/GameLoaders/CandyFiesta';
import Templok from '../../components/GameLoaders/Templok';
import { LandManagement } from '../../components/endlessSeige';
import RingyDingy from '../../components/GameLoaders/RingyDingy';
import PacManContainer from '../../components/GameLoaders/MazeContainer';
import RugPoolContainer from '../RugPool/RugPoolContainer';
import { HallManagement } from '../../components/rugPool';

export default class Game extends Component {
    state = {
        game: this.props.game,
        wax: this.props.wax,
        hasEarlyAccess: this.props.hasEarlyAccess,
        expanded: window.pageYOffset <= 0 ? true : false,
        serverType: process.env.REACT_APP_SERVER_TYPE
    }

    loginFromGame = this.props.loginFromGame;

    // this will update state when props change
    static getDerivedStateFromProps(props) {

        return {
            game: props.game,
            wax: props.wax,
            hasEarlyAccess: props.hasEarlyAccess,
            serverType: process.env.REACT_APP_SERVER_TYPE
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.listenToScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.listenToScroll)
    }

    listenToScroll = () => {
        this.setState({
            expanded: window.pageYOffset <= 0,
        })
    }

    getExpandedClassName() {
        return this.state.expanded ? "navbar-expanded" : "";
    }

    render() {
        const {game, wax, serverType} = this.state;

        var play = null;

        if (game._id === 1) {
            play = <EndlessSiege2 loginFromGame={this.loginFromGame} wax={wax} serverType={serverType}/>;
        } else if (game._id === 2) {
            play = <CandyFiesta loginFromGame={this.loginFromGame} wax={wax} serverType={serverType}/>;
        } else  if (game._id === 3){
            play = <Templok loginFromGame={this.loginFromGame} wax={wax} serverType={serverType}/>;
        } else if(game._id === 4){
            play = <RingyDingy loginFromGame={this.loginFromGame} wax={wax} serverType={serverType}/>;
        } else if (game._id === 5) {
            play = <EndlessSiege2 loginFromGame={this.loginFromGame} wax={wax} serverType={serverType}/>;
        }else if (game._id === 6) {
            play = <RugPoolContainer loginFromGame={this.loginFromGame} wax={wax} serverType={serverType}/>;
        } else if (game._id === 7) {
            play = <PacManContainer loginFromGame={this.loginFromGame} wax={wax} serverType={serverType}/>;
        }

        return (  
            (game._id === 5) ?
                <section style={wax.userAccount ? {} : {paddingTop: '85px'}} className={`section game game-${game._id} ${this.getExpandedClassName()}`}>
                    <Switch>
                        <Route path={`${game.url}/play`} exact render={() => 
                            play
                        }/>
                    </Switch>
                </section>:
                (game._id === 6) ? 
                <Switch>
                    <Route path={`${game.url}/play`} exact render={() => 
                        play
                    }/>
                    <Route path={`${game.url}`} exact render={() =>
                            <section style={wax.userAccount ? {} : {paddingTop: '85px'}} className={`section game game-${game._id} ${this.getExpandedClassName()}`}>
                                <GameRules game={game}/>
                            </section>
                        }/>
                    <Route path={`${game.url}/hall-management`} exact render={(props) => {return (
                        <section style={wax.userAccount ? {} : {paddingTop: '85px'}} className={`section game game-${game._id} ${this.getExpandedClassName()}`}>
                            <HallManagement wax={wax}/>
                        </section>
                    )} } />

                </Switch>:
                <section style={wax.userAccount ? {} : {paddingTop: '85px'}} className={`section game game-${game._id} ${this.getExpandedClassName()}`}>
                    <Switch>
                        {
                            (game._id !== 1)?
                            <Route path={`${game.url}/play`} exact render={() => 
                                play
                            }/>:
                            ""
                        }
                        {
                            (game._id === 1)?
                            <Route path={`${game.url}/play-2`} exact render={(props) => {return <EndlessSiege2 loginFromGame={this.loginFromGame} wax={wax}/>} } />:
                            ''
                        }
                        <Route path={`${game.url}/replay`} exact render={() => 
                            play
                        }/>
                        <Route path={`${game.url}/leaderboard/:filter?`} exact render={(props) =>
                            <Leaderboard tournament={game} wax={wax} {...props}/>
                        }/>
                        {
                            (game._id === 1)?
                            <Route path={`${game.url}/land-management`} exact render={(props) => {return <LandManagement wax={wax}/>} } />:
                            ''
                        }
                        <Route path={`${game.url}`} exact render={() =>
                            <React.Fragment>
                                <GameRules game={game}/>
                            </React.Fragment>
                        }/>
                    </Switch>
                </section>

        );
    }
}
