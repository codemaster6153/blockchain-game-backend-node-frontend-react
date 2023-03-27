import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./Navigation.css";
import Login from "../../components/Login/Login";
import NavGames from './NavGames';
import TopRibbon from './TopRibbon';
import { DropDown, NavLink } from '../../components';

export default class Navigation extends Component {

    onTokenMiningTransaction;

    state = {
        games: this.props.games,
        wax: this.props.wax,
        waxAvatar: this.props.waxAvatar,
        expanded: window.pageYOffset <= 0 ? true : false,
        belowBreakpoint: window.innerWidth < 1300,
        sideMenuVisible: false,
        navState: 0,
        spannedAccordion: false,
        waxp: 0,
        carbz: 0,
        jigo: 0,
        ludio: 0,
        areBalancesLoading: false
    };

    static getDerivedStateFromProps(props) {
        return {
            games: props.games,
            wax: props.wax,
            waxAvatar: props.waxAvatar
        };
    }

    sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    componentDidMount() {
        window.addEventListener('resize', this.listenToResize);
        window.addEventListener('scroll', this.listenToScroll);

        this.onTokenMiningTransaction=(e)=>{

            const isTransaction = e?.data?.payload?.type==="transaction";
            if(isTransaction){

                (async () => {
                    await this.sleep(1000);
                    this.getPlayerValues();
                })();
            }
        }
        window.addEventListener('clashdome-client-event', this.onTokenMiningTransaction);

        this.getPlayerValues();
    }

    handleAccordionSpan = () => {
        this.setState({
            spannedAccordion: !this.state.spannedAccordion
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.listenToResize);
        window.removeEventListener('scroll', this.listenToScroll)
        window.removeEventListener('clashdome-client-event', this.onTokenMiningTransaction);
    }

    listenToScroll = () => {
        this.setState({
            expanded: window.pageYOffset <= 5,
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.wax !== prevState.wax){
            this.getPlayerValues()
        }
    }

    getPlayerValues = async () => {

        if(this.state.wax && this.state.wax.rpc && this.props.wax.type && !this.state.areBalancesLoading){

            this.setState({areBalancesLoading: true});

            const waxBalance = await this.state.wax.rpc.get_currency_balance("eosio.token", this.state.wax.userAccount, "WAX");
            await this.sleep(250);
            const ludioBalance = await this.state.wax.rpc.get_currency_balance("clashdometkn", this.state.wax.userAccount, "LUDIO");
            await this.sleep(250);
            const carbz = await this.state.wax.rpc.get_currency_balance("clashdometkn", this.state.wax.userAccount, "CDCARBZ");
            await this.sleep(250);
            const jigo = await this.state.wax.rpc.get_currency_balance("clashdometkn", this.state.wax.userAccount, "CDJIGO");
            await this.sleep(250);

            this.setState({
                ...this.state,
                waxp: waxBalance[0] ? parseFloat(waxBalance[0].split(' ')[0]).toFixed(2) : 0,
                ludio: ludioBalance[0] ? parseFloat(ludioBalance[0].split(' ')[0]).toFixed(2) : 0,
                carbz: carbz[0] ? parseFloat(carbz[0].split(' ')[0]).toFixed(2) : 0,
                jigo: jigo[0] ? parseFloat(jigo[0].split(' ')[0]).toFixed(2) : 0,
                areBalancesLoading: false
            })
        }

    }

    listenToResize = () => {
        this.setState({
            belowBreakpoint: window.innerWidth < 1300,
        })
    }

    getExpandedClassName() {
        return this.state.expanded ? "navbar-expanded" : "";
    }

    getNavMenu() {
        return this.state.belowBreakpoint ? null : <>
            {/* { this.state.games.map(game => <NavLink to={game.url} key={game._id} className="navbar-item menu-item">{game.name}</NavLink>)} */}
            {
                this.props.wax && (this.props.wax.type) ?
                <NavLink
                    to={`/token-mining-game/${this.props.wax.userAccount}`}
                    className={`active-hub navbar-item menu-item`}
                    text="HUB"
                >
                    <p className='hub'/>
                </NavLink>:
                <NavLink
                    to={`#`}
                    onClick={this.props.onLogin}
                    className={`active-hub navbar-item menu-item`}
                    text="HUB"
                >
                    <p className='hub'/>
                </NavLink>
            }
            <NavLink
                to={"/shop"}
                className={`navbar-item menu-item`}
                text="Shop"
                icon="shop"
            />
            <DropDown text="Games Info">
                <NavGames />
            </DropDown>
            <NavLink
                to={"/tokenomics"}
                className={`navbar-item menu-item`}
                text="TOKENOMICS"
                icon="tokenomic"
            />
            <NavLink
                to={"/exchange"}
                className={`navbar-item menu-item`}
                text="Exchange"
                icon="exchange"
            />
        </>
    }

    toggleSideMenu() {
        this.setState({
            sideMenuVisible: !this.state.sideMenuVisible
        })
    }

    render() {
        return (
            <>
                {
                    this.state.wax.userAccount &&
                    <TopRibbon 
                        onLogin={this.props.onLogin} 
                        wax={this.state.wax} 
                        waxAvatar={this.state.waxAvatar}
                        waxp={this.state.waxp}    
                        ludio={this.state.ludio}    
                        carbz={this.state.carbz}    
                        jigo={this.state.jigo}    
                    />   
                }
                <nav style={this.state.wax.userAccount ? {} : {top: 0}} className={'navbar is-fixed-top is-flex is-align-items-center ' + this.getExpandedClassName()} role="navigation" aria-label="main navigation">
                    <div className="navbar-brand">
                        <a href="#!" onClick={() => this.toggleSideMenu()} role="button" className="navbar-burger navbar-burger-button ml-0" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                            {/* <img src="/images/menu_idle.svg" alt="" /> */}
                        </a>
                    </div>
                    <div className="navbar-start is-flex is-align-items-center is-flex-grow-1 is-justify-content-center">
                        <Link to={"/home"} className="navbar-item site-logo is-flex is-align-items-center"><img className="logo" src="/images/clashdome_logo.png" alt="logo" /></Link>
                    </div>
                    <div className="navbar-menu-items is-flex is-align-items-center is-justify-content-center">{this.getNavMenu()}</div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <Login onLogin={this.props.onLogin} wax={this.state.wax}
                                waxAvatar={this.state.waxAvatar} />
                        </div>
                    </div>
                </nav>

                {this.state.belowBreakpoint &&
                    <>
                        {this.state.sideMenuVisible && <div onClick={() => this.toggleSideMenu()} className="side-menu-underlay"></div>}
                        <div className={'navbar-menu side-menu is-block mx-0 my-0 px-0 py-0 ' + (this.state.sideMenuVisible ? "open" : "")}>
                            <div className="navbar-start">
                                {
                                    this.props.wax && (this.props.wax.type) ?
                                    <div className='profile-info-container'>
                                        <div className='profile-pic'>
                                            <img src={this.state.waxAvatar} alt='profile-pic' />
                                            <p>{this.props.wax.userAccount}</p>
                                        </div>
                                        <div className='carbz-jigo'>
                                            <div className='pair'>
                                                <img className="mr-1" src="/images/icon_wax_small.png" />
                                                <span>{parseFloat(this.state.waxp).toLocaleString('en')}</span>
                                            </div>
                                            <div className='pair'>
                                                <img className="mr-1" src="/images/icon_ludio_small.png" />
                                                <span>{parseFloat(this.state.ludio).toLocaleString('en')}</span>
                                            </div>
                                            <div className='pair'>
                                                <img className="mr-1" src="/images/icon_cdcarbz.png" />
                                                <span>{parseFloat(this.state.carbz).toLocaleString('en')}</span>
                                            </div>
                                            <div className='pair'>
                                                <img className="mr-1" src="/images/icon_cdjigo.png" />
                                                <span>{parseFloat(this.state.jigo).toLocaleString('en')}</span>
                                            </div>
                                        </div>
                                    </div>:
                                    ''
                                }
                                <a onClick={() => this.toggleSideMenu()} className="navbar-item close-btn" href="#!"></a>
                            </div>
                            <div className="navbar-end">
                                {/* {this.state.games.map(game => <NavLink onClick={() => this.toggleSideMenu()} to={game.url} key={game._id} className="navbar-item menu-item">{game.name}</NavLink>)} */}
                                <hr style={{marginTop: '0px', marginBottom: '8px', backgroundColor: '#C7D2D9', height: '1px'}} />
                                {
                                    this.props.wax && (this.props.wax.type) ?
                                    <NavLink
                                        style={{maxWidth: 'fit-content'}}
                                        to={`/token-mining-game/${(this.props.wax.type || this.props.wax.user ) ? this.props.wax.userAccount : ''}`}
                                        className={`active-hub navbar-item menu-item side-nav-margin-top`}
                                        text="HUB"
                                    >
                                        <p className='hub'></p>
                                    </NavLink>:
                                    <NavLink
                                        to={`#`}
                                        onClick={this.props.onLogin}
                                        style={{maxWidth: 'fit-content'}}
                                        className={`active-hub navbar-item menu-item side-nav-margin-top`}
                                        text="HUB"
                                    >
                                        <p className='hub'></p>
                                    </NavLink>
                                }
                                <hr style={{marginBottom: '0px', marginTop: '8px', backgroundColor: '#C7D2D9', height: '1px'}} />
                                <div className='accordion-container side-nav-margin-top'>
                                    <div className='accordion-head' onClick={() => {this.handleAccordionSpan()}}>
                                        <p>Games</p>
                                    </div>
                                    <div className='accordion-body' style={this.state.spannedAccordion ? {} : {height: '0px', opacity: 0, overflow: 'hidden'}} >
                                        <NavLink onClick={() => {
                                            // this.setState({navState: 0})
                                            this.toggleSideMenu()}
                                            } to={"/endless-siege"} className="navbar-item menu-item side-nav-margin-top">{"Endless Siege"}</NavLink>
                                        <NavLink onClick={() => {
                                            // this.setState({navState: 1})
                                            this.toggleSideMenu()}
                                            } to={"/candy-fiesta"} className="navbar-item menu-item side-nav-margin-top">{"Candy Fiesta"}</NavLink>
                                        <NavLink onClick={() => {
                                            // this.setState({navState: 2})
                                            this.toggleSideMenu()}
                                            } to={"/templok"} className="navbar-item menu-item side-nav-margin-top">{"Templok"}</NavLink>
                                        <NavLink onClick={() => {
                                            // this.setState({navState: 2})
                                            this.toggleSideMenu()}
                                            } to={"/ringy-dingy"} className="navbar-item menu-item side-nav-margin-top">{"RingyDingy"}</NavLink>
                                        <NavLink onClick={() => {
                                            // this.setState({navState: 2})
                                            this.toggleSideMenu()}
                                            } to={"/rug-pool"} className="navbar-item menu-item side-nav-margin-top">{"Rug Pool"}</NavLink>
                                        
                                    </div>
                                </div>
                                <NavLink onClick={() => {
                                    // this.setState({navState: 4})
                                    this.toggleSideMenu()}
                                    } to={"/nfts"} className="navbar-item menu-item side-nav-margin-top">{"NFTS"}</NavLink>
                                <NavLink onClick={() => {
                                    // this.setState({navState: 4})
                                    this.toggleSideMenu()}
                                    } to={"/shop"} className="navbar-item menu-item side-nav-margin-top">{"SHOP"}</NavLink>
                                <NavLink onClick={() => {
                                    // this.setState({navState: 4})
                                    this.toggleSideMenu()}
                                    } to={"/tokenomics"} className="navbar-item menu-item side-nav-margin-top">{"TOKENOMICS"}</NavLink>
                                {/* <NavLink onClick={() => {
                                    // this.setState({navState: 3})
                                    this.toggleSideMenu()}
                                    } to={"/duels"} className="navbar-item menu-item text-danger side-nav-margin-top">{"Duels"}</NavLink> */}
                                {
                                    this.props.wax && (this.props.wax.type) ?
                                    <div className='sidenav-logout menu-item' onClick={this.props.onLogin}>
                                        <p>{this.props.wax.userAccount}</p>
                                        <button className="logout-button">&nbsp;</button>
                                    </div>:
                                    ''
                                }
                            </div>
                        </div>
                    </>
                }
            </>
        );
    }
}