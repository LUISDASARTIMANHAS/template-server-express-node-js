const xss = require("xss");
const filesServer = __dirname + "/src/";
const path_pages = filesServer + "pages/";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");

const checkHeaderMiddleware = (req, res, next) => {
    const origin = req.headers.referer || req.headers.referrer;
    const keyHeader = req.headers["authorization"];
    const blockedRoutes = configs.blockedRoutes || []
    const blockRoutesPresent = blockedRoutes.includes(req.path);
    const payload = JSON.stringify(req.body, null, 2);
    const key = configs.key;
    const key2 = configs.key2;
    const key3 = configs.keyApp;

    const validKey = keyHeader === key;
    const validKey2 = keyHeader === key2;
    const validKey3 = keyHeader === key3;
    const auth1 = blockRoutesPresent && !validKey;
    const auth2 = blockRoutesPresent && !validKey2;
    const auth3 = blockRoutesPresent && !validKey3;
    for (const key in req.body) {
        req.body[key] = xss(req.body[key]);
    }

    console.log("SISTEMA <CHAVES DE ACESSO 1>: " + key);
    console.log("SISTEMA <CHAVES DE ACESSO 2>: " + key2);
    console.log("SISTEMA <CHAVES DE ACESSO 3>: " + key3);
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

// functions basicas
function print(keyHeader, key, auth) {
    console.log("SISTEMA <VERIFICAÇÃO>: " + keyHeader + " == " + key);
    console.log("SISTEMA <AUTORIZAÇÃO>: " + conversorSimEnao(!auth));
    console.log("----------------------------");
}

export default checkHeaderMiddleware