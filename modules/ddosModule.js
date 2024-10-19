const ddos = require("ddos");

function configureDdosMiddleware() {
    const params = {
        limit: 20,
        maxcount: 150,
        trustProxy: true,
        includeUserAgent: true,
        whitelist: [],
        testmode: false,
    };
    const limiter = new ddos(params);
    return limiter;
}

module.exports = configureDdosMiddleware;