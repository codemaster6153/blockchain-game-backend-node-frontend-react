import React, { Component } from 'react';
import "./CoinDisplay.css";

export default class CoinDisplay extends Component {
    state = {
        wax: this.props.wax,
        waxBalance: 0,
        ludioBalance: 0,
        intervalId: null,
        waxp: 0,
        carbz: 0,
        jigo: 0,
        ludio: 0,
    }

    // this will update state when props change
    static getDerivedStateFromProps(props) {
        return {
            wax: props.wax,
        };
    }

    componentDidMount() {
        this.state.intervalId = setInterval(() => { this.updateCoins() }, 60000);
        this.updateCoins();
    }
    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    async updateCoins() {
        if (this.state.wax && this.state.wax.userAccount) {
            const waxBalance = await this.state.wax.rpc.get_currency_balance("eosio.token", this.state.wax.userAccount, "WAX");
            const ludioBalance = await this.state.wax.rpc.get_currency_balance("clashdometkn", this.state.wax.userAccount, "LUDIO");
            this.setState({
                ...this.state,
                waxBalance: this.formatCurrency(waxBalance),
                ludioBalance: (ludioBalance && (ludioBalance.length > 0)) ? this.formatCurrency(ludioBalance) : 0
            });
            const carbz = await this.state.wax.rpc.get_currency_balance("clashdometkn", this.state.wax.userAccount, "CDCARBZ");
            const jigo = await this.state.wax.rpc.get_currency_balance("clashdometkn", this.state.wax.userAccount, "CDJIGO");
            this.setState({
                ...this.state,
                waxp: waxBalance[0] ? parseFloat(waxBalance[0].split(' ')[0]).toFixed(2) : 0,
                ludio: ludioBalance[0] ? parseFloat(ludioBalance[0].split(' ')[0]).toFixed(2) : 0,
                carbz: carbz[0] ? parseFloat(carbz[0].split(' ')[0]).toFixed(2) : 0,
                jigo: jigo[0] ? parseFloat(jigo[0].split(' ')[0]).toFixed(2) : 0,
            })
        }
    }

    formatCurrency(input) {
        input = parseFloat(input);
        input = this.decimalAdjust("floor", input, -1);
        return input.toLocaleString("en-US", { maximumFractionDigits: 1 });
    }

    decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    render() {
        return (
            <div className="coin-display text-primary">
                <div className='carbz-jigo'>
                    <div className='pair'>
                        <span>{parseFloat(this.state.waxp).toLocaleString('en')}</span>
                        <img className="mr-1" src="/images/icon_wax_small.png" />
                    </div>
                    <div className='pair'>
                        <span>{parseFloat(this.state.carbz).toLocaleString('en')}</span>
                        <img className="mr-1" src="/images/icon_cdcarbz.png" />
                    </div>
                    <div className='pair'>
                        <span>{parseFloat(this.state.ludio).toLocaleString('en')}</span>
                        <img className="mr-1" src="/images/icon_ludio_small.png" />
                    </div>
                    <div className='pair'>
                        <span>{parseFloat(this.state.jigo).toLocaleString('en')}</span>
                        <img className="mr-1" src="/images/icon_cdjigo.png" />
                    </div>
                </div>
            </div>
        )
    }
}