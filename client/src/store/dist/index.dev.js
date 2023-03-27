"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redux = require("redux");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  notification: {
    text: "",
    success: true
  },
  warningModal: {
    body: '',
    button: '',
    type: '',
    setAcceptance: function setAcceptance() {}
  },
  wax: {},
  ual: {},
  bellNotifications: [],
  citiz: {},
  social: {},
  claimAmount: 0,
  amountClaimed: false,
  boostModal: false,
  landCardId: ''
};

function reducer(state, _ref) {
  var type = _ref.type,
      payload = _ref.payload;

  switch (type) {
    case "SET_CITIZ":
      return _objectSpread({}, state, {
        citiz: payload
      });

    case "SET_AMOUNT_CLAIMED":
      return _objectSpread({}, state, {
        amountClaimed: payload
      });

    case "SET_CLAIM_AMOUNT":
      return _objectSpread({}, state, {
        claimAmount: payload
      });

    case "SET_SOCIAL":
      return _objectSpread({}, state, {
        social: payload
      });
    case "SET_VISIT":
      return _objectSpread({}, state, {
        visit: payload
      });
    case "SET_WAX":
      localStorage.setItem('username', payload.userAccount);
      return _objectSpread({}, state, {
        wax: payload
      });

    case "SET_UAL":
      return _objectSpread({}, state, {
        ual: payload
      });

    case "SET_NOTIFICATION":
      document.getElementById("notification-bar").classList.add("animate");
      document.getElementById("notification-background").classList.add("animate");
      return _objectSpread({}, state, {
        notification: payload
      });

    case "REMOVE_NOTIFICATION":
      document.getElementById("notification-bar").classList.remove("animate");
      document.getElementById("notification-background").classList.remove("animate");
      return _objectSpread({}, state, {
        notification: payload
      });

    case "SET_WARNING_MODAL":
      document.getElementById('warningModal').style.zIndex = "1000";
      document.getElementById('warningModal').style.opacity = "1";
      document.getElementsByTagName('html')[0].style.overflow = "hidden";
      return _objectSpread({}, state, {
        warningModal: {
          body: payload.body,
          button: payload.button,
          type: payload.type,
          setAcceptance: payload.setAcceptance
        }
      });

    case "REMOVE_WARNING_MODAL":
      document.getElementById('warningModal').style.zIndex = "-3";
      document.getElementById('warningModal').style.opacity = "0";
      document.getElementsByTagName('html')[0].style.overflow = "initial";
      return _objectSpread({}, state, {
        warningModal: {
          body: '',
          button: '',
          type: '',
          setAcceptance: function setAcceptance() {}
        }
      });

    case "SET_LOW_LUDIO_WARNING":
      document.getElementById('lowLudioModal').style.zIndex = "1000";
      document.getElementById('lowLudioModal').style.opacity = "1";
      document.getElementsByTagName('html')[0].style.overflow = "hidden";
      return _objectSpread({}, state);

    case "REMOVE_LOW_LUDIO_WARNING":
      document.getElementById('lowLudioModal').style.zIndex = "-3";
      document.getElementById('lowLudioModal').style.opacity = "0";
      document.getElementsByTagName('html')[0].style.overflow = "initial";
      return _objectSpread({}, state);

    case "SET_LUCKY_CARD_MODAL":
      document.getElementById('luckCardModal').style.zIndex = "1000";
      document.getElementById('luckCardModal').style.opacity = "1";
      document.getElementsByTagName('html')[0].style.overflow = "hidden";
      return _objectSpread({}, state);

    case "REMOVE_LUCKY_CARD_MODAL":
      document.getElementById('luckCardModal').style.zIndex = "-3";
      document.getElementById('luckCardModal').style.opacity = "0";
      document.getElementsByTagName('html')[0].style.overflow = "initial";
      return _objectSpread({}, state);

    case "SET_LUCK_FACTOR_MODAL":
      document.getElementById('luckFactorModal').style.zIndex = "1000";
      document.getElementById('luckFactorModal').style.opacity = "1";
      document.getElementsByTagName('html')[0].style.overflow = "hidden";
      return _objectSpread({}, state);

    case "REMOVE_LUCK_FACTOR_MODAL":
      document.getElementById('luckFactorModal').style.zIndex = "-3";
      document.getElementById('luckFactorModal').style.opacity = "0";
      document.getElementsByTagName('html')[0].style.overflow = "initial";
      return _objectSpread({}, state);

    case "SET_BELL_NOTIFICATIONS":
      return _objectSpread({}, state, {
        bellNotifications: [].concat(_toConsumableArray(state.bellNotifications), [payload])
      });

    case "SET_BOOST_MODAL":
      document.getElementById('cpuRentModal').style.zIndex = "1000";
      document.getElementById('cpuRentModal').style.opacity = "1";
      document.getElementById('cpuRentModal').style.top = "0";
      document.getElementsByTagName('html')[0].style.overflow = "hidden";
      return _objectSpread({}, state, {
        boostModal: payload
      });

    case "REMOVE_BOOST_MODAL":
      document.getElementById('cpuRentModal').style.zIndex = "-3";
      document.getElementById('cpuRentModal').style.opacity = "0";
      document.getElementsByTagName('html')[0].style.overflow = "initial";
      return _objectSpread({}, state);

    case "SET_CLAIM_DUMMY_MODAL":
      document.getElementById('trialDummyClaimModal').style.zIndex = "1000";
      document.getElementById('trialDummyClaimModal').style.opacity = "1";
      document.getElementById('trialDummyClaimModal').style.top = "0";
      document.getElementsByTagName('html')[0].style.overflow = "hidden";
      return _objectSpread({}, state, {
        landCardId: payload
      });

    case "REMOVE_CLAIM_DUMMY_MODAL":
      document.getElementById('trialDummyClaimModal').style.zIndex = "-3";
      document.getElementById('trialDummyClaimModal').style.opacity = "0";
      document.getElementsByTagName('html')[0].style.overflow = "initial";
      return _objectSpread({}, state, {
        landCardId: ''
      });

    default:
      return _objectSpread({}, state);
  }
}

var store = (0, _redux.createStore)(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
var _default = store;
exports["default"] = _default;