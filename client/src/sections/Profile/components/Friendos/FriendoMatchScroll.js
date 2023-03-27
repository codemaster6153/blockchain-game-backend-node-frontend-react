import React, { useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import FriendoMatchCard from './FriendoMatchCard';
import './friendoMatchScroll.css';

const CustomLeftArrow = ({ onClick, setScroll, scroll }) => {
    const handleClick = () => {
        onClick() 
        if(scroll){
            setScroll(false)
        }
    }
    return(
        <button onClick={handleClick} className="custom-left-arrow-result rotate-left" >
            <img src="/images/arrow_white.svg" />
        </button>
    )
}
const CustomRightArrow = ({ onClick, setScroll, scroll }) => {
    const handleClick = () => {
        onClick() 
        if(scroll){
            setScroll(false)
        }
    }
    return( 
    <button onClick={handleClick} className="custom-right-arrow-result" >
        <img src="/images/arrow_white.svg" />
    </button>
    )
};

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1345 },
        items: 6,
        slidesToSlide: 5 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1345, min: 1010 },
        items: 5,
        slidesToSlide: 4 // optional, default to 1.
    },
    tablet2: {
        breakpoint: { max: 1010, min: 730 },
        items: 4,
        slidesToSlide: 3 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 730, min: 600 },
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    },
    // mobile2: {
    //     breakpoint: { max: 600, min: 470 },
    //     items: 4,
    //     slidesToSlide: 3
    // },
    // mobile1: {
    //     breakpoint: { max: 470, min: 350 },
    //     items: 3,
    //     slidesToSlide: 2
    // },
    // mobile6: {
    //     breakpoint: { max: 350, min: 0 },
    //     items: 2,
    //     slidesToSlide: 1
    // }
};

function FriendoMatchScroll({wax}) {
    const [autoscroll, setAutoscroll] = useState(false)
    const [matches, setMatches] = useState([])
    const [claimAmount, setClaimAmount] = useState(0)
    const [claimTokensAmount, setClaimTokensAmount] = useState([])
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        fetchMatches();
        getUnclaimedVictoriesData();
    }, [wax])

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const getUnclaimedVictoriesData = async () => {

        if (wax.userAccount) {
            let value = await wax.rpc.get_table_rows({
                json: true,                 
                code: "clashdomedll",       
                scope: "clashdomedll",      
                table: "players2",  
                limit: 1,
                index_position: 1,
                key_type: "i64",               
                lower_bound: wax.userAccount,
                upper_bound: wax.userAccount,                
                reverse: true,             
                show_payer: false,    
            });

            if (value.rows.length) {
                setClaimAmount(value.rows[0].claimable)
            }
            
            
            dispatch({
                type: "SET_CLAIM_AMOUNT",
                payload: value.rows[0].claimable,
            })

            await sleep(250);

            value = await wax.rpc.get_table_rows({
                json: true,                 
                code: "clashdomedll",       
                scope: "clashdomedll",      
                table: "claims",  
                limit: 1,
                index_position: 1,
                key_type: "i64",               
                lower_bound: wax.userAccount,
                upper_bound: wax.userAccount,                
                reverse: true,             
                show_payer: false,    
            });

            if (value.rows.length) {
                setClaimTokensAmount(value.rows[0].claimable)
            }
        }
    }

    const handleOpenCountrySelectModal = () => {
        // window.scrollTo(0,0)
        document.getElementById('countryClaimModal').style.zIndex = "9"
        document.getElementById('countryClaimModal').style.opacity = "1"
        document.getElementsByTagName('html')[0].style.overflow = "hidden"
    }

    const countrySelected = async () => {
        // setLoading(true)

        let value = await wax.rpc.get_table_rows({
            json: true,                 
            code: "clashdomedll",       
            scope: "clashdomedll",      
            table: "countries",  
            limit: 1,
            index_position: 1,
            key_type: "i64",               
            lower_bound: wax.userAccount,
            upper_bound: wax.userAccount,                
            reverse: true,             
            show_payer: false,    
        });
        if(value.rows.length > 0){
            handleClaim()
        }else{
            handleOpenCountrySelectModal()
        }
    }

    const handleClaim = async () => {
        if(!loading){
            setLoading(true)
            try{
                if (wax.type === "wcw") {
                    const res = await wax.api.transact({
                        actions: [{
                            account: "clashdomedll",
                            name: "claim",
                            authorization: [{
                                actor: wax.userAccount,
                                permission: "active",
                            }],
                            data: {
                                account: wax.userAccount
                            }
                        }]
                    }, {
                        blocksBehind: 3,
                        expireSeconds: 30
                    }) 
                }else if(wax.type === "anchor"){
                    const res = await wax.signTransaction({
                        actions: [{
                            account: "clashdomedll",
                            name: "claim",
                            authorization: [{
                                actor: wax.userAccount,
                                permission: "active",
                            }],
                            data: {
                                account: wax.userAccount
                            }
                        }]
                    }, {
                        blocksBehind: 3,
                        expireSeconds: 30
                    })
                }

                setLoading(false)
                //getUnclaimedVictoriesData()
                setClaimAmount(0);
                setClaimTokensAmount([]);
                await sleep(1000)
                dispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                        text: "SUCCESSFUL TRANSACTION!",
                        success: true
                    }
                })
                await sleep(4800)
                dispatch({
                    type: "REMOVE_NOTIFICATION",
                    payload: {
                        text: "",
                        success: false
                    }
                })
            }catch(err){
                //console.log("setting loading false")
                setLoading(false)
                dispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                        text: err.message.toUpperCase(),
                        success: false
                    }
                })
    
                await sleep(4800)
    
                dispatch({
                    type: "REMOVE_NOTIFICATION",
                    payload: {
                        text: "",
                        success: false
                    }
                })
            }
        }
    }

    const fetchMatches = async () => {
        if (wax.userAccount) {
            let rows = await fetch("/api/clashdome-game/private-duels/" + wax.userAccount)
            rows = await rows.json();
            
            for(let i = 0; i < rows.length; i++) {
                
                let username = wax.userAccount === rows[i].player1Account ? rows[i].player2Account : rows[i].player1Account;

                let status = 'pending';

                if (wax.userAccount === rows[i].player1Account && rows[i].state === -1) {
                    status = 'rejected';
                } else if (wax.userAccount === rows[i].player2Account && rows[i].state === -1) {
                    status = 'youRejected';
                } else if (wax.userAccount === rows[i].player2Account && rows[i].state === 0) {
                    status = 'invitation';
                } else if (wax.userAccount === rows[i].player1Account && rows[i].state === 0) {
                    status = 'pendingAccept';
                } else if (rows[i].state < 3 && ((wax.userAccount === rows[i].player1Account && rows[i].player1Score) || (wax.userAccount === rows[i].player2Account && rows[i].player2Score))) {
                    status = 'pending';
                } else if ((rows[i].state === 2 && !rows[i].player1Score) || (rows[i].state === 1 && wax.userAccount === rows[i].player1Account)) {
                    status = 'accepted';
                } else if (rows[i].state < 3 && wax.userAccount === rows[i].player2Account && !rows[i].player2Score) {
                    status = 'accepted';
                } else if (rows[i].player1Score && rows[i].player2Score){
                    if (rows[i].player1Score > rows[i].player2Score) {
                        status = wax.userAccount === rows[i].player1Account ? "win" : "loose";
                    } else if (rows[i].player1Score < rows[i].player2Score) {
                        status = wax.userAccount === rows[i].player2Account ? "win" : "loose";
                    } else {
                        if (rows[i].player1Duration < rows[i].player2Duration) {
                            status = wax.userAccount === rows[i].player1Account ? "win" : "loose";
                        } else {
                            status = wax.userAccount === rows[i].player2Account ? "win" : "loose";
                        }
                    }
                }
                
                rows[i] = {id: rows[i].id, image: rows[i].game, username: username, cost: parseFloat(rows[i].fee), status: status}
            };
    
            setMatches(rows);
        }
        
    }
    
    return (
        matches.length > 0 ? 
        <div className='frinedos-recent-match-scroll'>
            <div className='section-header'>
                <p>MY LAST MATCHES</p>
            </div>
            <Carousel
                itemClass="image-item"
                responsive={responsive}
                showDots={false}
                customRightArrow={<CustomRightArrow setScroll={setAutoscroll} scroll={autoscroll} />}
                customLeftArrow={<CustomLeftArrow setScroll={setAutoscroll} scroll={autoscroll} />}
                autoPlay={autoscroll}
                autoPlaySpeed={3000}
                infinite={false}
                renderButtonGroupOutside={true}
                // renderArrowsWhenDisabled={true}
            >
                {
                    matches.map((row, index) => (
                        <FriendoMatchCard key={index} info={row} wax={wax} fetchMatches={fetchMatches}/>
                    ))
                }
            </Carousel>
            {
                ((claimAmount !== 0 && claimAmount !== "0.00000000 WAX") || claimTokensAmount.length > 0) && <div className='claim-all-btn' onClick={countrySelected}>
                    {
                        loading ?
                        <img className="loading" src="/images/loading_icon.png" style={{height: '36px'}} />:
                        <p>CLAIM ALL: <span>{parseFloat(claimAmount).toPrecision(6)} <img src='/images/icon_wax_small.png' alt='wax' /></span> <span>{parseFloat(claimTokensAmount[0] || 0).toPrecision(6)} <img src='/images/icon_cdjigo.png' alt='wax' /></span></p>
                    }
                </div>
            }
        </div>
        : ""
    )
}

export default FriendoMatchScroll