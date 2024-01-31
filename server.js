const express = require("express");
const ddos = require('ddos')
const helmet = require('helmet');
const app = express();
const path = require("path");
const fs = require("fs");

import "./modules/socket.js"
import corsModule from "./modules/cors.js";
import checkHeaderMiddleware from "./modules/checkHeaderMiddleware.js";

const configs = JSON.parse(fs.readFileSync("config.json", "utf8"));
const porta = configs.porta
const dinamicPort = (porta || 80);
const params = {
  limit: 100,
  maxcount: 200,
  trustProxy: true,
  includeUserAgent: true,
  whitelist: [],
  testmode: false
};
const limiter = new ddos(params)
const rotas = require("./rotas");
const pages = require("./pages");
const emailSys = require("./sys-email");
const { File } = require("buffer");

app.use(limiter.express);
app.use(socket);
// Adicione o middleware Helmet para configurar o HSTS
app.use(
  helmet.hsts({
    maxAge: 365 * 24 * 60 * 60,
    includeSubDomains: true, // incluir subdomínios
    preload: true, // habilitar preload (opcional)
  })
);

app.use(corsModule);
app.use(checkHeaderMiddleware);
app.use(pages);
app.use(emailSys);
autoPages();
//add here others files to load / adicione aqui outros arquivos para carregar

app.use(rotas);

app.listen(dinamicPort, () => {
  console.log("Servidor rodando em http://localhost:" + dinamicPort);
});

//auto page loader
function autoPages() {
  const hostJson = fs.readFileSync("data/host.json", "utf8");
  const hosts = JSON.parse(hostJson);
  console.log("SISTEMA <AUTO PAGE> CARREGADO! ");

  for (let i = 0; i < hosts.length; i++) {
    const host = hosts[i];
    const dominio = host.path;
    const file = host.file;
    const link = path.join(__dirname, "src","uploads")+"/"+file;
    console.log("SISTEMA <HOST> <PATH>: " + dominio);
    console.log("SISTEMA <HOST> <FILE>: " + link);

    app.get(dominio, (req, res) => {
      console.log("SISTEMA <OBTER> <SITE>: " + req.url);
      res.sendFile(link);
    });
  }
}
