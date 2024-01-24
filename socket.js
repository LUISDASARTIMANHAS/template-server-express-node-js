const express = require("express");
const expressWs = require('express-ws');
const path = require("path");
const fs = require("fs");
const app = express();
const router = express.Router();
const wsInstance = expressWs(app);

const files = __dirname + "/src/";
const path_pages = files + "pages/";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
const notFoundFilePath = path.join(path_pages, "not-found.html");


// Adicione a rota para WebSocket (HTTP)
app.ws('/ws', (ws, req) => {
    console.log('WS SERVER: Cliente conectado via WebSocket.');

    ws.on('message', (message) => {
        console.log(`Recebido: ${message}`);
        ws.send(`WS SERVER: Recebido: ${message}`);
    });

    ws.on('close', () => {
        console.log('WS SERVER: Conexão fechada.');
    });
});

module.exports = router;