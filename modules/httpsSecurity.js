const cors = require("cors");
const helmet = require("helmet");

function httpsSecurityMiddleware(req, res, next) {
  console.log("executando https security");
  const corsOptions = {
    origin: [
      /^https:\/\/.+/,
      /^http:\/\/.+/,
      "https://discord.com"
    ],
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: ["Content-Type", "authorization", "id", "key"],
    optionsSuccessStatus: 204,
  };
  const hstsOptions = {
    maxAge: 365 * 24 * 60 * 60,
    includeSubDomains: true,
    preload: true,
  };

  // Chamando o middleware cors
  cors(corsOptions)(req, res, () => {
    // Configurar cabeçalhos de resposta para OPTIONS
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", corsOptions.origin);
      res.set("Access-Control-Allow-Methods", corsOptions.methods);
      res.set("Access-Control-Allow-Headers", corsOptions.allowedHeaders);
    }

    // Chamando o middleware helmet
    helmet.hsts(hstsOptions)(req, res, next);
  });
}

module.exports = httpsSecurityMiddleware;