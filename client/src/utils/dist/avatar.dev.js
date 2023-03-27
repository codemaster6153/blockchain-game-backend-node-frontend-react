"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getAvatar;

var _eosjs = require("eosjs");
const { default: initConfig } = require("../../initConfig");

function getAvatar(username) {
  var rpc, value;
  return regeneratorRuntime.async(function getAvatar$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          rpc = new _eosjs.JsonRpc(initConfig.waxUrl, {
            fetch: fetch
          });
          _context.next = 4;
          return regeneratorRuntime.awrap(rpc.get_table_rows({
            json: true,
            code: "wax.gg",
            scope: "wax.gg",
            table: "photos",
            lower_bound: username,
            upper_bound: username
          }));

        case 4:
          value = _context.sent;

          if (!(value.rows.length > 0)) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", "https://cloudflare-ipfs.com/ipfs/" + value.rows[0]["photo_hash"]);

        case 9:
          return _context.abrupt("return", "/images/token-small.png");

        case 10:
          _context.next = 14;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
}