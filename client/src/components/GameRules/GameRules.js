import React, {Component} from 'react';
import "./GameRules.css";
import GameRulesCandy from './GameRulesCandy';
import GameRulesEndless from './GameRulesEndless';
import GameRulesRingy from './GameRulesRingy';
import GameRulesRugPool from './GameRulesRugPool';
import GameRulesTemplok from './GameRulesTemplok';

export default class GameRules extends Component {
    state = {
        game: this.props.game,
    };

    // this will update state when props change
    static getDerivedStateFromProps(props) {
        return {
            game: props.game
        };
    }

    render() {

        if (this.state.game._id === 1) {
            // return this.gameRulesEndlessSiege();
            return <GameRulesEndless />
        } else if (this.state.game._id === 2) {
            return <GameRulesCandy />
        } else if(this.state.game._id === 3) {
            return <GameRulesTemplok />
        } else if(this.state.game._id === 4) {
            return <GameRulesRingy />
            // return this.gameRulesEndlessSiege();
        }else if(this.state.game._id === 6){
            return <GameRulesRugPool />
        }
        
    }
}
