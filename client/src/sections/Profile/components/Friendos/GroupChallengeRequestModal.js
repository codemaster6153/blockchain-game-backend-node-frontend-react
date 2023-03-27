import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import { useDispatch} from 'react-redux'
import './GroupChallengeRequestModal.css'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'

function GroupChallengeRequestModal({ open, onCloseModal, wax, goToDuels }) {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)

    const GAME_TITLES = {
        "candy-fiesta": "Candy Fiesta",
        "templok": "Templok",
        "ringy-dingy": "Ringy Dingy", 
        "endless-siege-2": "Endless Siege 2",
        "rug-pool": "Rug Pool",
        "maze": "Maze (coming soon)"
    };

    const GAME_IDS = {
        "candy-fiesta": 1,
        "templok": 2,
        "ringy-dingy": 3,
        "endless-siege-2": 4,
        "rug-pool": 5,
        "maze": 6
    };
    
    const sleep = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const notify = async (text, success) => {
        dispatch({ type:"SET_NOTIFICATION", payload: {
            text: text,
            success: success,
        }})

        await sleep(4800)

        dispatch({ type:"REMOVE_NOTIFICATION", payload: {
            text: text,
            success: success,
        }})

    }

    const handleTierClick = async (game, tier) => {

        setIsLoading(true);

        const response = await fetch("/api/clashdome-game/check-pending-group-private-duels/" + wax.userAccount + "/" + game + "/" + tier);
        const result = await response.json();

        if (result.value) {
            notify("YOU ALREADY HAVE A PENDING DUEL. PLAY OR REJECT IT FIRST.", false);
            setIsLoading(false);
            return;
        }

        let actions;

        if (tier.indexOf("WAX") === -1) {

            actions = [{
                account: "clashdometkn",
                name: "transfer",
                authorization: [{
                    actor: wax.userAccount,
                    permission: "active",
                }],
                data: {
                    from: wax.userAccount,
                    to: "clashdomedll",
                    quantity: tier,
                    memo: GAME_TITLES[game] + " private duel setup fee"
                }
            }];

        } else {

            actions = [{
                account: "eosio.token",
                name: "transfer",
                authorization: [{
                    actor: wax.userAccount,
                    permission: "active",
                }],
                data: {
                    from: wax.userAccount,
                    to: "clashdomedll",
                    quantity: tier,
                    memo: GAME_TITLES[game] + " private duel setup fee"
                }
            }];
        }

        try {

            if (wax.type === "wcw") {
                await wax.api.transact({ actions: actions }, { blocksBehind: 3, expireSeconds: 30 });
            } else if (wax.type === "anchor") {
                await wax.signTransaction({ actions: actions }, { blocksBehind: 3, expireSeconds: 30 });
            }

            try {

                const response = await fetch("/api/clashdome-game/join-private-duel/" + wax.userAccount + "/" + GAME_IDS[game] + "/" + tier + "/0/null/null/null");
                const result = await response.json();
    
                if (result.error) {
                    notify(result.error.toUpperCase(), false);
                } else {
    
                    notify("DUEL CREATED SUCCESSFULLY!", true);
                    onCloseModal(false);
                    goToDuels();
                }
    
                setIsLoading(false);
    
            } catch (e) {
    
                notify(e.message.toUpperCase(), false);
    
                setIsLoading(false);
            }

        } catch (e) {

            notify(e.message.toUpperCase(), false);

            setIsLoading(false);
        }

        
    }

    return ReactDOM.createPortal(
        <Modal
            open={open}
            onClose={() => onCloseModal(false)}
            center
            showCloseIcon={false}
            styles={{ modal: { padding: 0, margin: 0, borderRadius: 8, background: 'transparent' } }}
            blockScroll={false}
        >
            <div id="group-challenge-modal">
                <div className="m-container">
                    <div className='close-button' onClick={() => onCloseModal(false)}>
                        ×
                    </div>
                    <div className='items-container'>
                        <span className='title'>SEND A GROUP CHALLENGE</span>
                        {!isLoading? <div className='games'>
                            {["candy-fiesta", "endless-siege-2", "ringy-dingy", "rug-pool", "templok", ""].map((game) => (
                                <div className='game'>
                                     {game && <img src={"/images/" + game + "_title.png"} alt={game} />}
                                     {game && <div className='tiers'>
                                        <div className='tier' onClick={() => handleTierClick(game, "150.0000 CDJIGO")}>150 <img className="coin" src="/images/icon_cdjigo.png" /></div>
                                        <div className='tier' onClick={() => handleTierClick(game, "10.00000000 WAX")} style={{background: '#FFC716'}}>10 <img className="coin" src="/images/icon_wax_small.png" /></div>
                                        <div className='tier' onClick={() => handleTierClick(game, "25.00000000 WAX")} style={{background: '#FF7D27'}}>25 <img className="coin" src="/images/icon_wax_small.png" /></div>
                                        <div className='tier' onClick={() => handleTierClick(game, "75.00000000 WAX")} style={{background: '#FF5A27'}}>50 <img className="coin" src="/images/icon_wax_small.png" /></div>
                                     </div>}
                                </div>
                            ))}
                        </div> : (
                            <div className='loading-container'>
                                SENDING
                                <img className="loading" src="/images/loading_icon.png" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>,
        document.getElementById("modal-root")
    )
}

export default GroupChallengeRequestModal
