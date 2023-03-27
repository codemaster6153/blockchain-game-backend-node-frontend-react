const initConfig = {};

console.log("SERVER TYPE v1.0: " + process.env.REACT_APP_SERVER_TYPE);

if (process.env.REACT_APP_SERVER_TYPE === "testnet") {
    initConfig.atomicUrl = "https://test.wax.api.atomicassets.io";
    initConfig.waxUrl = "https://waxtest.eu.eosamsterdam.net";
    initConfig.waxUrls = ["	https://waxtest.eu.eosamsterdam.net"];
} else {
    initConfig.atomicUrl = "https://wax.api.atomicassets.io";
    initConfig.waxUrl = "https://api.wax.alohaeos.com";
    initConfig.waxUrls = ["https://api.wax.alohaeos.com", "https://wax.pink.gg", "https://api.wax.alohaeos.com", "https://apiwax.3dkrender.com", "https://wax.eu.eosamsterdam.net", "https://api.waxsweden.org", "https://wax.blacklusion.io", "https://wax.csx.io", "https://wax.dapplica.io", "https://api-wax.eosarabia.net", "https://wax.eoseoul.io", "https://api.wax.greeneosio.com", "https://wax.hkeos.com", "https://api.wax.liquidstudios.io", "https://wax.eosn.io"];
}

export default initConfig;