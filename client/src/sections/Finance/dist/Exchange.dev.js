"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAction = createAction;
exports.getSwap = getSwap;

var _require = require("eosjs"),
    Api = _require.Api,
    JsonRpc = _require.JsonRpc;

var _require2 = require("eosjs/dist/eosjs-jssig"),
    JsSignatureProvider = _require2.JsSignatureProvider;

var fetch = require('node-fetch');

var signatureProvider = new JsSignatureProvider(["5JeGYfLjmj2im6Zuz48D5Vt4sj92zGQTh7ymqV4ShEhtqtWZfdK"]); // const rpc = new JsonRpc("https://testnet.waxsweden.org", {fetch});

var rpc = new JsonRpc("https://wax.pink.gg", {
  fetch: fetch
});
var api = new Api({
  rpc: rpc,
  signatureProvider: signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder()
});
var pairs;

(function _callee() {
  var i, Pair_data, asset1, asset2;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          pairs = [{
            name: "LUDCDC",
            index: 1149,
            LUD: 0,
            CDC: 0
          }, //{name:"LUDWAX",index: 155, LUD: 0, WAX: 0},
          {
            name: "LUDCDJ",
            index: 1195,
            LUD: 0,
            CDJ: 0
          }, //{name:"WAXCDC",index: 1092, WAX: 0, CDC: 0},
          {
            name: "CDJCDC",
            index: 1193,
            CDJ: 0,
            CDC: 0
          }]; //{name:"WAXCDJ",index: 1093, WAX: 0, CDJ: 0},];

          _context.t0 = regeneratorRuntime.keys(pairs);

        case 2:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 14;
            break;
          }

          i = _context.t1.value;
          _context.next = 6;
          return regeneratorRuntime.awrap(rpc.get_table_rows({
            json: true,
            code: "alcorammswap",
            scope: "alcorammswap",
            table: "pairs",
            limit: 1,
            index_position: 1,
            key_type: "i64",
            lower_bound: pairs[i].index,
            upper_bound: pairs[i].index,
            reverse: false,
            show_payer: false
          }));

        case 6:
          Pair_data = _context.sent;
          asset1 = pairs[i].name.slice(0, 3);
          asset2 = pairs[i].name.slice(3, 6);
          pairs[i][asset1] = parseFloat(Pair_data.rows[0].pool1.quantity.split(' ')[0]);
          pairs[i][asset2] = parseFloat(Pair_data.rows[0].pool2.quantity.split(' ')[0]); //console.log("pair info", pairs[i].name, "   ", pairs[i]);

          sleep(250);
          _context.next = 2;
          break;

        case 14:
        case "end":
          return _context.stop();
      }
    }
  });
})(); 


function createAction(amount, assetIn, assetOut, user) {
  var nameDict = {
    LUD: "LUDIO",
    WAX: "WAX",
    CDC: "CDCARBZ",
    CDJ: "CDJIGO"
  };
  var receiving = getSwap(amount, assetIn, assetOut, pairs) + " " + nameDict[assetOut];
  var sending;
  var account;
  var action;

  if (assetIn == "WAX") {
    sending = amount.toFixed(8) + " " + nameDict[assetIn];
    account = "eosio.token";
    action = "transfer";
  } else {
    sending = amount.toFixed(4) + " " + nameDict[assetIn];
    account = "clashdometkn";
    action = "transfer;";
  }

  var wax = {
    type: "wcw",
    userAccount: user
  };
  console.log("taking action", user);
  takeAction(wax.userAccount, wax.userAccount, action, {
    from: wax.userAccount,
    to: "alcorammswap",
    quantities: sending,
    memo: receiving + "@eosio.token"
  }); // const buyAsset = async () => {
  //     try {
  //       let result;
  //         console.log("web");
  //         let actions = [{
  //             account: account,
  //             name: action,
  //             authorization: [{
  //               actor: wax.userAccount,
  //               permission: "active",
  //             }],
  //             data: {
  //               from: wax.userAccount,
  //               to: "alcorammswap",
  //               quantities: sending,
  //               memo: receiving +"@eosio.token"
  //             },
  //         }];
  //         if (wax.type === "wcw") {
  //             result = await wax.api.transact({
  //                 actions: actions
  //             }, {
  //                 blocksBehind: 3,
  //                 expireSeconds: 30,
  //             });
  //         } else if (wax.type === "anchor") {
  //             result = await wax.signTransaction({
  //                 actions: actions
  //             }, {
  //                 blocksBehind: 3,
  //                 expireSeconds: 30,
  //             });
  //         }
  //         if (result) {
  //             notify("SUCCESSFUL TRANSACTION!", true);
  //             setTimeout(() => {
  //                 getShopData();
  //             }, 1000)
  //         }
  //     } catch (e) {
  //         notify(e.message.toUpperCase(), false);
  //         console.log(e.message);
  //     }  
  // }
}

function getPtr(assetIn, assetOut) {
  var pair = assetIn + assetOut;
  var invPair = assetOut + assetIn;

  for (var i = 0; i < pairs.length; ++i) {
    if (pair == pairs[i].name || invPair == pairs[i].name) return i;
  }
}

function getSwap(amount, assetIn, assetOut) {
  var ptr = getPtr(assetIn, assetOut);
  var pool_in = pairs[ptr][assetIn];
  var pool_out = pairs[ptr][assetOut];
  var result = getAmountOut(amount, pool_in, pool_out, 30);
  result = assetOut == "WAX" ? result.toFixed(8) : result.toFixed(4);
  return result;
} //calculate 


function getAmountOut(amount, pool_in, pool_out) {
  var amount_fee = amount * (10000 - 30);
  var numerator = amount_fee * pool_out;
  var denominator = pool_in * 10000 + amount_fee;
  var div = numerator / denominator;
  return div;
}

function sleep(ms) {
  return regeneratorRuntime.async(function sleep$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise(function (resolve) {
            return setTimeout(resolve, ms);
          }));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function delay(time) {
  return regeneratorRuntime.async(function delay$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", new Promise(function (resolve, reject) {
            setTimeout(resolve, time);
          }).then(function () {
            return;
          }));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function getTableRows(contract, table, limit, index_position, key_type, lower_bound, upper_bound) {
  var value;
  return regeneratorRuntime.async(function getTableRows$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(rpc.get_table_rows({
            json: true,
            code: contract,
            scope: contract,
            table: table,
            limit: limit,
            index_position: index_position,
            key_type: key_type,
            lower_bound: lower_bound,
            upper_bound: upper_bound,
            reverse: true,
            show_payer: false
          }));

        case 3:
          value = _context4.sent;
          return _context4.abrupt("return", value);

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", {
            "error": _context4.t0
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

function takeAction(auth, name, action, dataValue) {
  var value;
  return regeneratorRuntime.async(function takeAction$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(api.transact({
            actions: [{
              account: name,
              name: action,
              authorization: [{
                actor: auth,
                permission: "active"
              }],
              data: dataValue
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30
          }));

        case 3:
          value = _context5.sent;
          return _context5.abrupt("return", value);

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          return _context5.abrupt("return", {
            "error": _context5.t0
          });

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
}