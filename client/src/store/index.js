import {
    createStore
} from "redux";

let initialState = {
    notification: {
        text: "",
        success: true,
    },
    warningModal: {
        body: '',
        button: '',
        type: '',
        setAcceptance: () => {},
    },
    wax: {},
    ual: {},
    bellNotifications: [],
    citiz: {},
    trial: {},
    social: {},
    socialFriends: {},
    claimAmount: 0,
    amountClaimed: false,
    boostModal: false,
    landCardId: ''
}

function reducer(state, {
    type,
    payload
}) {
    switch (type) {
        case "SET_CITIZ":
            return{
                ...state,
                citiz: payload
            };
        case "SET_AMOUNT_CLAIMED":
            return{
                ...state,
                amountClaimed: payload
            };
        case "SET_CLAIM_AMOUNT":
            return{
                ...state,
                claimAmount: payload
            };
        case "SET_SOCIAL":
            return{
                ...state,
                social: payload
            };

        case "SET_SOCIAL_FRIENDS":
            return {
                ...state,
                socialFriends: payload
            }
        case "SET_VISIT":
            return{
                ...state,
                visit: payload
            };
        case "SET_TRIAL":
            return{
                ...state,
                trial: payload
            };
        case "SET_WAX":
            localStorage.setItem('username', payload.userAccount)
            return {
                ...state,
                wax: payload
            };
        case "SET_UAL":
            return {
                ...state,
                ual: payload,
            }
        case "SET_ROOM":
            return {
                ...state,
                room: payload,
            }
        case "SET_NOTIFICATION":
            document.getElementById("notification-bar").classList.add("animate")
            document.getElementById("notification-background").classList.add("animate")
            return {
                ...state,
                notification: payload
            };
        case "REMOVE_NOTIFICATION":
            document.getElementById("notification-bar").classList.remove("animate")
            document.getElementById("notification-background").classList.remove("animate")
            return {
                ...state,
                notification: payload
            };
        case "SET_WARNING_MODAL":
            document.getElementById('warningModal').style.zIndex = "1000"
            document.getElementById('warningModal').style.opacity = "1"
            document.getElementsByTagName('html')[0].style.overflow = "hidden"
            return {
                ...state,
                warningModal: {
                    body: payload.body,
                    button: payload.button,
                    type: payload.type,
                    setAcceptance: payload.setAcceptance,
                }
            };
        case "REMOVE_WARNING_MODAL":
            document.getElementById('warningModal').style.zIndex = "-3"
            document.getElementById('warningModal').style.opacity = "0"
            document.getElementsByTagName('html')[0].style.overflow = "initial"
            return {
                ...state,
                warningModal: {
                    body: '',
                    button: '',
                    type: '',
                    setAcceptance: () => {},
                }
            };
        case "SET_LOW_LUDIO_WARNING":
            document.getElementById('lowLudioModal').style.zIndex = "1000"
            document.getElementById('lowLudioModal').style.opacity = "1"
            document.getElementsByTagName('html')[0].style.overflow = "hidden"
            return {
                ...state,
            };
        case "REMOVE_LOW_LUDIO_WARNING":
            document.getElementById('lowLudioModal').style.zIndex = "-3"
            document.getElementById('lowLudioModal').style.opacity = "0"
            document.getElementsByTagName('html')[0].style.overflow = "initial"
            return {
                ...state,
            };
        case "SET_LUCKY_CARD_MODAL":
            document.getElementById('luckCardModal').style.zIndex = "1000"
            document.getElementById('luckCardModal').style.opacity = "1"
            document.getElementsByTagName('html')[0].style.overflow = "hidden"
            return {
                ...state,
            };
        case "REMOVE_LUCKY_CARD_MODAL":
            document.getElementById('luckCardModal').style.zIndex = "-3"
            document.getElementById('luckCardModal').style.opacity = "0"
            document.getElementsByTagName('html')[0].style.overflow = "initial"
            return {
                ...state,
            };
        case "SET_LUCK_FACTOR_MODAL":
            document.getElementById('luckFactorModal').style.zIndex = "1000"
            document.getElementById('luckFactorModal').style.opacity = "1"
            document.getElementsByTagName('html')[0].style.overflow = "hidden"
            return {
                ...state,
            };
        case "REMOVE_LUCK_FACTOR_MODAL":
            document.getElementById('luckFactorModal').style.zIndex = "-3"
            document.getElementById('luckFactorModal').style.opacity = "0"
            document.getElementsByTagName('html')[0].style.overflow = "initial"
            return {
                ...state,
            };
        case "SET_BELL_NOTIFICATIONS":
            return{
                ...state,
                bellNotifications: [...state.bellNotifications, payload]
            }

        case "SET_BOOST_MODAL":
            document.getElementById('cpuRentModal').style.zIndex = "1000"
            document.getElementById('cpuRentModal').style.opacity = "1"
            document.getElementById('cpuRentModal').style.top = "0"
            document.getElementsByTagName('html')[0].style.overflow = "hidden"
            return{
                ...state,
                boostModal: payload
            }
        case "REMOVE_BOOST_MODAL":
            document.getElementById('cpuRentModal').style.zIndex = "-3"
            document.getElementById('cpuRentModal').style.opacity = "0"
            document.getElementsByTagName('html')[0].style.overflow = "initial"
            return{
                ...state
            }
        case "SET_CLAIM_DUMMY_MODAL":
            document.getElementById('trialDummyClaimModal').style.zIndex = "1000"
            document.getElementById('trialDummyClaimModal').style.opacity = "1"
            document.getElementById('trialDummyClaimModal').style.top = "0"
            document.getElementsByTagName('html')[0].style.overflow = "hidden"
            
            return{
                ...state,
                landCardId: payload
            }
        case "REMOVE_CLAIM_DUMMY_MODAL":
            document.getElementById('trialDummyClaimModal').style.zIndex = "-3"
            document.getElementById('trialDummyClaimModal').style.opacity = "0"
            document.getElementsByTagName('html')[0].style.overflow = "initial"
            return{
                ...state,
                landCardId: ''
            }
        default:
            return {
                ...state,
            };
    }
}


const store = createStore(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;