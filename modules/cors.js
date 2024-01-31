const fs = require("fs");
const cors = require("cors");
const configs = JSON.parse(fs.readFileSync("config.json", "utf8"));
// Configurar o CORS para permitir origens específicas
const corsOptions = {
    origin: /^https:\/\/.+/,
    methods: configs.methods,
    optionsSuccessStatus: 204,
};

const corsModule = cors(corsOptions)

module.exports = corsModule