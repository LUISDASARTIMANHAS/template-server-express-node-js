const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const configs = JSON.parse(fs.readFileSync("config.json", "utf8"));
const porta = configs.porta
const dinamicPort = (porta || configs.portaAlt);

const filesServer = __dirname + "/src/";
const path_pages = filesServer + "pages/";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
const rotas = require("./rotas");
const pages = require("./pages");
const { File } = require("buffer");

// Configurar o CORS para permitir origens específicas
const corsOptions = {
  origin: /^https:\/\/.+/,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};
const checkHeaderMiddleware = (req, res, next) => {
  const origin = req.headers.referer || req.headers.referrer;
  const keyHeader = req.headers["authorization"];
  const blockedRoutes = [
    "/my-private-route",
  ];
  const blockRoutesPresent = blockedRoutes.includes(req.path);
  const payload = JSON.stringify(req.body, null, 2);
  const key = configs.key1;
  const key2 = configs.key2;
  const key3 = configs.keyApp;

  const validKey = keyHeader === key;
  const validKey2 = keyHeader === key2;
  const validKey3 = keyHeader === key3;
  const auth1 = blockRoutesPresent && !validKey;
  const auth2 = blockRoutesPresent && !validKey2;
  const auth3 = blockRoutesPresent && !validKey3;
  autoPages()

  console.log("-------------------------");
  console.log("SISTEMA <CHECK> <OBTER>: " + req.url);
  console.log("SISTEMA <ORIGEM>: " + origin);
  console.log("SISTEMA <PAYLOAD>: " + payload);
  if (auth1 && auth2 && auth3) {
    // Se estiver solicitando das rotas bloqueadas E não conter key, bloquea a solicitação
    print(keyHeader, key, key2, key3, auth1, auth2, auth3);
    forbidden(res);
  } else {
    // Cabeçalho "solicitador" presente ou rota não bloqueada, permite o acesso
    print(keyHeader, key, key2, key3, auth1, auth2, auth3);
    next();
  }
};

app.use(cors(corsOptions));
app.use(checkHeaderMiddleware);
app.use(pages);

//add here others files to load / adicione aqui outros arquivos para carregar

app.use(rotas);

app.listen(dinamicPort, (key,key1,key2) => {
  console.log("SISTEMA <CHAVES DE ACESSO 1>: " + key);
  console.log("SISTEMA <CHAVES DE ACESSO 2>: " + key1);
  console.log("SISTEMA <CHAVES DE ACESSO 3>: " + key2);
  console.log("Servidor rodando em http://localhost:" + dinamicPort);
});
// functions basicas
function print(keyHeader, key, key2, key3, auth1, auth2, auth3) {
  console.log("SISTEMA <VERIFICAÇÃO 1>: " + keyHeader + " == " + key);
  console.log("SISTEMA <VERIFICAÇÃO 2>: " + keyHeader + " == " + key2);
  console.log("SISTEMA <VERIFICAÇÃO 2>: " + keyHeader + " == " + key3);
  console.log("SISTEMA <AUTORIZAÇÃO 1>: " + conversorSimEnao(!auth1));
  console.log("SISTEMA <AUTORIZAÇÃO 2>: " + conversorSimEnao(!auth2));
  console.log("SISTEMA <AUTORIZAÇÃO 3>: " + conversorSimEnao(!auth3));
  console.log("----------------------------");
}

function forbidden(res) {
  res.status(403);
  res.sendFile(forbiddenFilePath);
}
function conversorSimEnao(value) {
  if (value) {
    return "✔Voce foi autorizado, esta tudo correto";
  }
  return "⚠Esta faltando algo ou não foi autorizado!";
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
    const link = path.join(__dirname, "src","uploads")+"/"+file;
    console.log("SISTEMA <HOST> <PATH>: " + dominio);
    console.log("SISTEMA <HOST> <FILE>: " + link);

    app.get(dominio, (req, res) => {
      console.log("SISTEMA <OBTER> <SITE>: " + req.url);
      res.sendFile(link);
    });
  }
}
