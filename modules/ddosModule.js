const ddos = require("ddos");

function configureDdosMiddleware() {
    const params = {
        limit: 15,
        maxcount: 100,
        trustProxy: false,
        includeUserAgent: true,
        whitelist: [],
        testmode: false,
    };
    const limiter = new ddos(params);
    return limiter;
}

module.exports = configureDdosMiddleware;