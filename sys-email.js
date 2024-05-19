const express = require("express");
const router = express.Router();
const { fopen, fwrite } = require("./modules/autoFileSysModule.js");
const path = require("path");
const sendMail = require("./modules/emailModule.js");

const files2 = __dirname + "/src/";
const path_pages = files2 + "pages/";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
const notFoundFilePath = path.join(path_pages, "not-found.html");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Rota para recuperar senha perdida
router.post("/recuperar=senha", (req, res) => {
  console.log("SERVIDOR: SISTEMA <ENVIAR>: " + req.url);
  const payload = req.body;
  const email = payload.email;
  const novaSenha = payload.senha;
  const status = recuperarSenha(email, novaSenha);

  if (status != -1) {
    res.status(201);
    res.send("SERVIDOR: Redefinição de senha concluída!");
  } else {
    res.status(401);
    res.send("SERVIDOR: Credenciais inválidas");
    console.log("SERVIDOR: Credenciais inválidas!");
  }
});

// Rota para restaurar conta perdida
router.post("/restaurar=conta", (req, res) => {
  console.log("SERVIDOR: SISTEMA <ENVIAR>: " + req.url);
  const payload = req.body;
  const email = payload.email;
  const status = restaurarConta(email);

  if (status != -1) {
    res.status(201);
    res.send("SERVIDOR: Restauração de conta concluída!");
  } else {
    res.status(401);
    res.send("SERVIDOR: Credenciais inválidas");
    console.log("SERVIDOR: Credenciais inválidas!");
  }
});

function recuperarSenha(email, novaSenha) {
  const database = fs.readFileSync("data/users.json", "utf8");
  const data = JSON.parse(database);

  for (let i = 0; i < data.length; i++) {
    const currentDB = data[i];
    const currentEmail = currentDB.emailCad;
    const currentSenha = currentDB.senhaCad;
    const authUser = currentEmail == email;

    console.log("-----SISTEMA----");
    console.log("TAMANHO: " + data.length);
    console.log("POSIÇÃO: " + i);
    console.log("Pesquisando...");
    console.log("NOVA SENHA: " + novaSenha);
    console.log("EMAIL: " + email + " == " + currentEmail);

    // Verifica se o usuário e senha correspondem aos valores no vetor
    if (authUser) {
      const text = `Olá!
          \n
          Você solicitou a recuperação de senha para sua conta." +
          \n
          Sua nova senha é: ${novaSenha}
          \n
          \n
          Se você solicitou a recuperação de senha, nenhuma ação é necessária.
          \n
          \n
          \n
          Atenciosamente, Equipe Administrativa.`

      sendMail(email, "SISTEMA: RECUPERAR SENHA", text, (error, info) => {
        if (error) {
          console.log("SERVIDOR: Erro ao enviar o e-mail:", error);
        } else {
          console.log("SERVIDOR: E-mail enviado:", info.response);
          currentDB.senhaCad = novaSenha;
          fs.writeFileSync(
            "data/users.json",
            JSON.stringify(data, null, 2),
            "utf8"
          );
        }
      });
      console.log(currentDB);
      return 1;
    }
  }
  return -1; // Retorna -1 se o usuário e senha não foram encontrados no vetor
}

function restaurarConta(email) {
  const database = fs.readFileSync("data/users.json", "utf8");
  const data = JSON.parse(database);

  for (let i = 0; i < data.length; i++) {
    const currentDB = data[i];
    const currentEmail = currentDB.emailCad;
    const mudar = "@MUD4R";
    const authUser = currentEmail == email;

    console.log("-----SISTEMA----");
    console.log("TAMANHO: " + data.length);
    console.log("POSIÇÃO: " + i);
    console.log("Pesquisando...");
    console.log("EMAIL: " + email + " == DATA-EMAIL: " + currentEmail);

    // Verifica se o usuário e senha correspondem aos valores no vetor
    if (authUser) {
      const text =
          `Olá!
          \n
          Você solicitou a restauração para sua conta.
          \n
          "Seu novo usuário é: ${mudar}
          \n
          Sua nova senha é: ${mudar}
          \n
          \n
          Se você solicitou a restauração, nenhuma ação é necessária.
          \n
          \n
          \n
          Atenciosamente, Equipe Administrativa.`

      sendMail(email, "SISTEMA: RESTAURAR CONTA", text, (error, info) => {
        if (error) {
          console.log("SERVIDOR: Erro ao enviar o e-mail:", error);
        } else {
          console.log("SERVIDOR: E-mail enviado:", info.response);
          currentDB.senhaCad = mudar;
          currentDB.userCad = mudar;
          fs.writeFileSync(
            "data/users.json",
            JSON.stringify(data, null, 2),
            "utf8"
          );
        }
      });
      console.log(currentDB);
      return 1;
    }
  }
  return -1; // Retorna -1 se o usuário e senha não foram encontrados no vetor
}

module.exports = router;
