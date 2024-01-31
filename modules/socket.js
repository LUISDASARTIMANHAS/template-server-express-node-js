const express = require("express");
const expressWs = require('express-ws');
const path = require("path");
const fs = require("fs");
const app = express();
const router = express.Router();
const wsInstance = expressWs(app);
const configs = JSON.parse(fs.readFileSync("config.json", "utf8"));
const wsConfig = configs.wsSystem;

const port = wsConfig.portWS || 2255;
const files = __dirname + "/src/";
const path_pages = files + "pages/";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
const notFoundFilePath = path.join(path_pages, "not-found.html");

if (wsConfig.enabled) {
    // Adicione a rota para WebSocket (HTTP)
    const wsModule = app.ws('/ws', (ws, req) => {
        console.log('WS SERVER: Cliente conectado via WebSocket.');

        ws.on('message', (message) => {
            console.log(`Recebido: ${message}`);
            ws.send(`WS SERVER: Recebido: ${message}`);
        });

        ws.on('close', () => {
            console.log('WS SERVER: Conexão fechada.');
        });
    });

    app.listen(port, () => {
        console.log(`Servidor Websocket(Ws) rodando na porta: ${port}`);
    });

    module.exports = wsModule;
}

module.exports = router