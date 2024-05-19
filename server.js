const express = require("express");
const ddos = require('ddos')
const app = express();
const path = require("path");
const fs = require("fs");
const { File } = require("buffer");
const wsModule = require("./modules/socket.js")
const httpsSecurityMiddleware = require("./modules/httpsSecurityMiddleware.js");
const checkHeaderMiddleware = require("./modules/checkHeaderMiddleware.js");
const { fetchGet, fetchPost } = require("./modules/fetchModule.js");
const ddosModule = require("./modules/ddosModule.js");
const sendMail = require("./modules/emailModule.js");

const configs = JSON.parse(fs.readFileSync("config.json", "utf8"));
const routesDir = __dirname;
const porta = configs.porta
const autoporta = configs.autoporta;
const hostname = "localhost"
const dinamicPort = (porta || 8080);

app.use(wsModule);
app.use(httpsSecurityMiddleware);
app.use(ddosModule().express);
app.use((req, res, next) => {
  checkHeaderMiddleware(req, res, next);
});
autoPages();

// Carrega dinamicamente todos os módulos de rota
fs.readdirSync(routesDir).forEach(file => {
  const filePath = path.join(routesDir, file);
    if (file.endsWith('.js') && file !== 'server.js') {
        const route = require(filePath);
        app.use(route);
      console.log(`Carregando arquivo ${file} automaticamente!`)
    }
});
if (autoporta) {
  var server = app.listen(() => {
    getServerAddress();
  });
} else {
  var server = app.listen(dinamicPort, () => {
    getServerAddress();
  });
}

function getServerAddress() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Servidor rodando em http://%s:%s", hostname, port);
  console.log("IP Obtido: http://%s:%s", host, port);
}

//auto page loader
function autoPages() {
  const hostJson = fs.readFileSync("data/host.json", "utf8");
  const hosts = JSON.parse(hostJson);
  console.log("SISTEMA <AUTO PAGE> CARREGADO! ");

  for (let i = 0; i < hosts.length; i++) {
    const host = hosts[i];
    const dominio = host.path;
    const file = host.file;
    const link = path.join(__dirname, "src", "uploads") + "/" + file;
    console.log("SISTEMA <HOST> <PATH>: " + dominio);
    console.log("SISTEMA <HOST> <FILE>: " + link);

    app.get(dominio, (req, res) => {
      console.log("SISTEMA <OBTER> <SITE>: " + req.url);
      res.sendFile(link);
    });
  }
}
