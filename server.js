const express = require("express");
const app = express();
const xss = require("xss");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const routesDir = __dirname;
const wsModule = require("./modules/socket.js");
const postgreSQLModule = require("./modules/postgreSQLModule.js");
const httpsSecurity = require("./modules/httpsSecurity.js");
const checkHeaderMiddleware = require("./modules/checkHeaderMiddleware.js");
const ddosModule = require("./modules/ddosModule.js");
const { fetchGet, fetchPost, discordLogs } = require("./modules/fetchModule.js");
const { fopen, fwrite, freadBin, fwriteBin } = require("./modules/autoFileSysModule.js");
// const hostname = "127.0.0.1"; só local 
// const hostname = "0.0.0.0"; Bind na placa de rede
// const hostname = "::"; bind ipv4 e ipv6 pra fora
const hostname = "::";
const porta = process.env.PORTA;
const dinamicPort = (porta || 8080);

const filesServer = __dirname + "/src/";
const path_pages = filesServer + "pages/";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
const date = new Date();
const dia = date.getDate().toString().padStart(2, "0") - 1;
const dia7 = (date.getDate() - 7).toString().padStart(2, "0") - 1;
const mes = (date.getMonth() + 1).toString().padStart(2, "0");
const ano = date.getFullYear();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(wsModule);
app.use(httpsSecurity);
app.use(ddosModule().express);

// Middleware para adicionar meta tags SEO
app.use((req, res, next) => {
  res.setHeader("og-Title", "SERVER #01");
  res.setHeader("og-Description", "SERVIDOR DE GERNEIAMENTO.");
  res.setHeader("mode", "cors");
  for (const key in req.body) {
    req.body[key] = xss(req.body[key]);
  }
  next();
});
checkHeaderMiddleware(app);

// Carrega dinamicamente todos os módulos de rota
fs.readdirSync(routesDir).forEach(file => {
  const filePath = path.join(routesDir, file);
    if (file.endsWith('.js') && file !== 'server.js') {
        const route = require(filePath);
        app.use(route);
      console.log(`Carregando arquivo ${file} automaticamente!`)
      discordLogs("FILE LOAD",`Carregando arquivo ${file} automaticamente!`);
    }
});
var server = app.listen(dinamicPort, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Servidor rodando em http://%s:%s",hostname, port);
  console.log("IP Obtido: http://%s:%s",host, port);
  discordLogs("START",`Servidor rodando em http://${hostname}:${port}`)
})

function conversorSimEnao(value) {
  if (value) {
    return "✔Voce foi autorizado, esta tudo correto";
  }
  return "⚠Esta faltando algo ou não foi autorizado!";
}
function autoPages() {
  const hostJson = fs.readFileSync("data/host.json", "utf8");
  const hosts = JSON.parse(hostJson);
  console.log("SISTEMA <AUTO PAGE> CARREGADO! ");

  for (let i = 0; i < hosts.length; i++) {
    const host = hosts[i];
    const dominio = host.path;
    const file = host.file;
    const link = path.join(__dirname, "src", "pages", file);
    console.log("SISTEMA <HOST> <PATH>: " + dominio);
    console.log("SISTEMA <HOST> <FILE>: " + link);

    app.get(dominio, (req, res) => {
      console.log("SISTEMA <OBTER> <SITE>: " + req.url);
      res.sendFile(link);
    });
  }
}