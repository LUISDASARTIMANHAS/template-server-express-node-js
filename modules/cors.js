const cors = require("cors");
// Configurar o CORS para permitir origens específicas
const corsOptions = {
    origin: /^https:\/\/.+/,
    methods: configs.methods,
    optionsSuccessStatus: 204,
};

const corsModule = cors(corsOptions)

export default corsModule