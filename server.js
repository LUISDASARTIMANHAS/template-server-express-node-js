const express = require("express");
const ddos = require('ddos')
const app = express();
const path = require("path");
const fs = require("fs");
const { File } = require("buffer");
const wsModule = require("./modules/socket.js")
const httpsSecurityMiddleware = require("./modules/httpsSecurityMiddleware.js");
const checkHeaderMiddleware = require("./modules/checkHeaderMiddleware.js");
const {fetchGet,fetchPost} = require("./modules/fetchModule.js");
const sendMail = require("./modules/emailModule.js");

const configs = JSON.parse(fs.readFileSync("config.json", "utf8"));
const porta = configs.porta
const hostname = "localhost"
const dinamicPort = (porta || 8080);
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
app.use(wsModule)
app.use(limiter.express);

app.use(httpsSecurityMiddleware)
app.use((req,res,next) =>{checkHeaderMiddleware(req,res,next)});
app.use(pages);
app.use(emailSys);
autoPages();
//add here others files to load / adicione aqui outros arquivos para carregar

app.use(rotas);

var server = app.listen(dinamicPort, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Servidor rodando em http://%s:%s",hostname, port);
  console.log("IP Obtido: http://%s:%s",host, port);
})

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
