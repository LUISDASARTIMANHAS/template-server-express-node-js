const {
  getRandomInt,
  getRandomBin,
  getRandomHex,
  validadeApiKey,
  unauthorized,
  forbidden,
  formatDate,
  conversorSimEnao,
} = require("./utils.js");
const {
  fopen,
  fwrite,
  freadBin,
  fwriteBin,
} = require("./autoFileSysModule.js");
const configs = fopen("config.json");
const xss = require("xss");

function checkHeaderMiddleware(app) {
  // Middleware para configurar o tipo de conteúdo como JSON
  app.all("/api/*name", (req, res, next) => {
    if (!req.headers["authorization"]) {
      forbidden(res);
    }
    res.set("Content-Type", "application/json");
    next();
  });

  app.all("/*name", (req, res, next) => {
    const origin = req.headers.referer || req.headers.referrer;
    const keyHeader = req.headers["authorization"];
    const blockedRoutes = configs.blockedRoutes || [];
    const blockRoutesPresent = blockedRoutes.some((route) => {
      // Trata rotas com curingas
      const regex = new RegExp(`^${route.replace(/\*/g, ".*")}$`);
      return regex.test(req.path);
    });
    const payload = JSON.stringify(req.body, null, 2);
    const keys = [
      "snve072509ç$",
      "snve072509Ã§$",
      "snve072509&Aplication",
      "ROOT:keyBypass",
    ];
    const validKey = keys.some((key) => keyHeader === key);
    const auth = blockRoutesPresent && !validKey;

    console.log("-------------------------");
    console.log("SISTEMA <CHECK> <OBTER>: " + req.url);
    console.log("SISTEMA <ORIGEM>: " + origin);
    console.log("SISTEMA <PAYLOAD>: " + payload);
    keys.forEach((key) => {
      const auth = keyHeader === key;
      print(keyHeader, key, auth);
    });
    for (const key in req.body) {
      req.body[key] = xss(req.body[key]);
    }
    if (auth) {
      // Se estiver solicitando das rotas bloqueadas E não conter key, bloquea a solicitação
      forbidden(res);
    } else {
      // Cabeçalho "solicitador" presente ou rota não bloqueada, permite o acesso
      next();
    }
  });
}

// functions basicas
function print(keyHeader, key, auth) {
  console.log("SISTEMA <VERIFICAÇÃO>: " + keyHeader + " == " + key);
  console.log("SISTEMA <AUTORIZAÇÃO>: " + conversorSimEnao(!auth));
  console.log("----------------------------");
}

module.exports = checkHeaderMiddleware;
