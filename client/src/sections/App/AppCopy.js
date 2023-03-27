import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Game from "../Game/Game";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer/Footer";
import Page from "../Page/Page";
import * as waxjs from "@waxio/waxjs/dist";
import Struggle from '../Struggle/Struggle';
import ClashNotification from '../../components/Notification/ClashNotification';
import { WarningModal, LowLudioModal, LuckyCardModal, LuckFactorModal } from '../../components/Modals';
import Sale from '../Sale/Sale';
import { useDispatch } from 'react-redux';
import { NewViewProfile } from '../Profile';
import { ClashdomeMessageServer } from '../../utils/ClashdomeMessageServer';
import { NftHome } from '../NFT';
import Avatar from '../Avatar/Avatar';
import { Newhome } from '../Home/NewHome';
import AOS from 'aos'
import "aos/dist/aos.css";
import AvatarAndSocialFetcher from '../../components/AvatarAndSocailFetcher/AvatarAndSocialFetcher';
import initConfig from '../../initConfig';
import CountryClaimModal from '../../components/Modals/CountryClaimModal';
import CpuRentModal from '../../components/Modals/CpuRentModal';
import { TokenomicsContainer } from '../tokenomics';
import TrialDummyClaimModal from '../../components/Modals/TrialDummyClaimModal';
import ColyseusManager from './../../colyseus/ColyseusManager';
import Exchange from '../../sections/Profile/components/Exchange/Exchange';

const GAME_ENDLESS_SIEGE = 1;
const GAME_CANDY_FIESTA = 2;
const GAME_TEMPLOK = 3;
const GAME_RINGY_DINGY = 4;
const GAME_ENDLESS_SIEGE_2 = 5;
const GAME_RUG_POOL = 6
const GAME_PAC_MAN = 7


const AppCopy = ({ual}) => {
    const [app, setApp] = useState([])
    const [games, setGames] = useState([])
    const [hasEarlyAccess, setHasEarlyAccess] = useState()
    const [wax, setWax] = useState({})
    const [waxAvatar, setWaxAvatar] = useState()
    const dispatch = useDispatch()

    const [fromGame, setFromGame] = useState(false)
    const [game, setGame] = useState()

    const getAppElement = (element) => {
        let r = app.filter(e => e.label === element);
        if (r.length === 1) {
            return r[0].value;
        }
        return "";
    }

    const getWax = () => {
        return new waxjs.WaxJS('https://api.wax.alohaeos.com', null, null, false);
    }

    const getWaxAvatar = () => {
        return localStorage.getItem("clashdome_wax_avatar");
    }

    const getGame = (gameId) => {

        if(gameId === 6){
            let gameObj = {
                _id: 6,
                name: 'RugPool',
                url: '/rug-pool',
                name_id: 'rug-pool'
            }

            return gameObj

        }

        let currentGame = games.filter(g => g._id === gameId);
        if (currentGame.length > 0) {
            return currentGame[0];
        }
        return {};
    }

    const handleClickLogin = () => {

        if(ual.activeUser){
            ual.logout()
            setWax({})
            dispatch({
                type: "SET_WAX",
                payload: {}
            })
            dispatch({
                type: "SET_UAL",
                payload: ual
            })
        }else{
            ual.showModal()
            setFromGame(false);
        }
    }

    const checkEarlyAccess = async (username) => {

        if (username) {

            console.log("MY INIT OBJECT");
            console.log(initConfig.url);

            const {ExplorerApi} = require("atomicassets");
            let api  = new ExplorerApi(initConfig.atomicUrl, "atomicassets", {fetch});
        
            let assets = await api.getAssets({owner: username, collection_name: "clashdomenft", schema_name: "vip", template_id: 230544});

            let hasEarlyAccess = assets.length > 0;
            setHasEarlyAccess(hasEarlyAccess)
        } else {
            setHasEarlyAccess(false)
        }
    }

    const loginFromGame = (game) => {

        if(ual.activeUser){
            ual.logout()
            setWax({})
            dispatch({
                type: "SET_WAX",
                payload: {}
            })
            dispatch({
                type: "SET_UAL",
                payload: ual
            })
        }else{
            ual.showModal()
            setFromGame(true);
            setGame(game);
        }
    }

    const logedFromGame = (game) => {

        ClashdomeMessageServer.loginSuccess();
    }

    useEffect(() => {

        fetch('/api/app')
            .then(res => res.json())
            .then(k => setApp(k));
        fetch('/api/game')
            .then(res => res.json())
            .then(g => setGames(g));
        setWaxAvatar("/images/token-small.png")

    }, [])

    useEffect(() => {
        AOS.init({
            // initialise with other settings
            duration : 1000,
            anchorPlacement: 'top-center',
            startEvent: 'load',
          });
        AOS.refresh();
    }, []);

    useEffect(() => {

        const colyseus = new ColyseusManager();

        if(ual.activeUser && ual.activeUser !== null && ual.activeUser.wax !== undefined){
            ual.activeUser.wax.type = "wcw";
            setWax(ual.activeUser.wax);
            checkEarlyAccess(ual.activeUser.wax.userAccount);
            dispatch({
                type: "SET_WAX",
                payload: ual.activeUser.wax
            })
            dispatch({
                type: "SET_UAL",
                payload: {...ual}
            })

            if (fromGame) {
                logedFromGame(game);
            } else {
                if (ClashdomeMessageServer.game && ClashdomeMessageServer.game.name === "token-mining-game") {
                    ClashdomeMessageServer.loginSuccess();
                }
            }

            if (ual.activeUser.wax.userAccount) {
                colyseus.enterConnectionRoom(ual.activeUser.wax.userAccount);
            }

        } else if(ual.activeUser && ual.activeUser !== null && ual.activeUser.scatter !== undefined){

            let wax = ual.activeUser;
            wax.type = "anchor";
            wax.userAccount = wax.accountName;
            delete wax.accountName;
            setWax(wax)
            checkEarlyAccess(wax.userAccount);
            dispatch({
                type: "SET_WAX",
                payload: wax
            })
            dispatch({
                type: "SET_UAL",
                payload: {...ual}
            })
            
            if (fromGame) {
                logedFromGame(game);
            } else {
                if (ClashdomeMessageServer.game && ClashdomeMessageServer.game.name === "token-mining-game") {
                    ClashdomeMessageServer.loginSuccess();
                }
            }

            if (wax.userAccount) {
                colyseus.enterConnectionRoom(wax.userAccount);
            }

        } else if(ual.activeUser && ual.activeUser !== null && ual.activeUser.wax === undefined){

            let wax = ual.activeUser;
            wax.type = "anchor";
            wax.userAccount = wax.accountName;
            delete wax.accountName;
            wax.api = wax.client;
            delete wax.client;
            setWax(wax)
            checkEarlyAccess(wax.userAccount);
            dispatch({
                type: "SET_WAX",
                payload: wax
            })
            dispatch({
                type: "SET_UAL",
                payload: {...ual}
            })
            
            if (fromGame) {
                logedFromGame(game);
            } else {
                if (ClashdomeMessageServer.game && ClashdomeMessageServer.game.name === "token-mining-game") {
                    ClashdomeMessageServer.loginSuccess();
                }
            }

            if (wax.userAccount) {
                colyseus.enterConnectionRoom(wax.userAccount);
            }

        } else if (!ual.activeUser){
            ual.logout();
        }

    }, [ual.activeUser])

    useEffect(() => {
        
        (async () => {
            if (wax.rpc) {
            
                try {
        
                    let result = await wax.rpc.get_table_rows({
                        json: true,
                        code: "wax.gg",
                        scope: "wax.gg",
                        table: "photos",
                        lower_bound: wax.userAccount,
                        upper_bound: wax.userAccount
                    });

                    let url = result.rows.length > 0 ? "https://cloudflare-ipfs.com/ipfs/" + result.rows[0]["photo_hash"] : "/images/token-small.png";
                    console.log(url);
                    setWaxAvatar(url);
                } catch (e) {
                    console.log(e);
                }
            }
        })();

    }, [wax])

    return (
        <React.Fragment>
            <Navigation
                games={games}
                onLogin={handleClickLogin}
                wax={wax}
                waxAvatar={waxAvatar} />
            <CountryClaimModal wax={wax} />
            <Switch>
                <Route path="/home" render={(props) =>
                    <Newhome login={handleClickLogin} />
                } />
                <Route path="/struggle" render={(props) =>
                    <Struggle wax={wax} {...props}/>
                }/>
                <Route path="/endless-siege" render={(props) =>
                    <Game game={getGame(GAME_ENDLESS_SIEGE)} loginFromGame={loginFromGame} wax={wax} hasEarlyAccess={hasEarlyAccess} {...props} />
                } />
                <Route path="/tokenomics" render={(props) => <TokenomicsContainer />} />
                <Route path="/candy-fiesta" render={(props) =>
                    <Game game={getGame(GAME_CANDY_FIESTA)} loginFromGame={loginFromGame} wax={wax} hasEarlyAccess={hasEarlyAccess} {...props} />
                } />
                <Route path="/templok" render={(props) =>
                    <Game game={getGame(GAME_TEMPLOK)} loginFromGame={loginFromGame} wax={wax} hasEarlyAccess={hasEarlyAccess} {...props} />
                } />
                <Route path="/rug-pool" render={(props) => <Game game={getGame(GAME_RUG_POOL)} loginFromGame={loginFromGame} wax={wax} hasEarlyAccess={hasEarlyAccess} {...props} />} />
                <Route path="/maze" render={(props) => <Game game={getGame(GAME_PAC_MAN)} loginFromGame={loginFromGame} wax={wax} hasEarlyAccess={hasEarlyAccess} {...props} />} />
                <Route path="/endless-siege-2" render={(props) =>
                    <Game game={getGame(GAME_ENDLESS_SIEGE_2)} loginFromGame={loginFromGame} wax={wax} hasEarlyAccess={hasEarlyAccess} {...props} />
                } />
                <Route path="/ringy-dingy" render={(props) =>
                    <Game game={getGame(GAME_RINGY_DINGY)} loginFromGame={loginFromGame} wax={wax} hasEarlyAccess={hasEarlyAccess} {...props} />
                } />
                <Route path="/privacy-policy" render={(props) =>
                    <Page content={getAppElement("privacy_policy")} {...props} />
                } />
                <Route path="/cookies-terms" render={(props) =>
                    <Page content={getAppElement("cookies_terms")} {...props} />
                } />
                <Route path="/terms-and-conditions" render={(props) =>
                    <Page content={getAppElement("terms_and_conditions")} {...props} />
                } />
                <Route path="/token-mining-game/:id/" render={() => <NewViewProfile loginFromGame={loginFromGame} wax={wax} hasEarlyAccess={hasEarlyAccess} /> } />
                <Route path="/shop" render={() => <Sale wax={wax}/>} />
                <Route path="/exchange" render={() => <Exchange wax={wax}/>} />
                <Route path="/nfts/:tab" render={() => <NftHome />} />
                <Route path="/avatar-editor" render={() => <Avatar wax={wax}/>} />
                <Redirect exact from='/nfts' to='/nfts/your-nfts' />
                <Redirect exact from='/profile/:id' to='/token-mining-game/:id' />
                <Redirect exact from='/token-mining-game' to={`/token-mining-game/${localStorage.getItem('username')}`} />
                <Redirect from="/" to="/home" />
            </Switch>
            <Footer
                wax={wax}
                github={getAppElement("social_github")}
                twitter={getAppElement("social_twitter")}
                telegram={getAppElement("social_telegram")}
                medium={getAppElement("social_medium")}
            />
            <ClashNotification/>
            <WarningModal />
            <LowLudioModal />
            <LuckyCardModal />
            <LuckFactorModal />
            <AvatarAndSocialFetcher />
            <CpuRentModal />
            <TrialDummyClaimModal />
        </React.Fragment>
    );
}

export default AppCopy;
