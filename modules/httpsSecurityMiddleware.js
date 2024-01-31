const cors = require("cors");
const helmet = require("helmet");

const httpsSecurityMiddleware = (req, res, next) => {
  const corsOptions = {
    origin: [/^https:\/\/.+/, /^http:\/\/.+/],
    methods: "GET,PUT,POST,DELETE",
    optionsSuccessStatus: 204,
  };

  cors(corsOptions)(req, res, () => {}); // Executa o middleware cors
  helmet.hsts({
    maxAge: 365 * 24 * 60 * 60,
    includeSubDomains: true,
    preload: true,
  })(req, res, next); // Executa o middleware helmet
};

module.exports = httpsSecurityMiddleware;