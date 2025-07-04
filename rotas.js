const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const { fetchGet, fetchPost } = require("npm-package-nodejs-utils-lda");
const {
  getRandomInt,
  getRandomBin,
  getRandomHex,
  generateToken,
  ordenarUsuario,
  pesqUsuario,
  validadeApiKey,
  unauthorized,
  forbidden,
  formatDate,
  conversorSimEnao,
} = require("npm-package-nodejs-utils-lda");

function pesqUserRepetido(nome, user, email) {
  const database = fs.readFileSync("data/users.json", "utf8");
  const data = JSON.parse(database);

  for (let i = 0; i < data.length; i++) {
    var currentDB = data[i];
    const currentNome = currentDB.nomeCad;
    const currentUser = currentDB.userCad;
    const currentEmail = currentDB.emailCad;

    // Verifica se o nome,usuário e email não estão duplicados
    const authNome = currentNome == nome;
    const authUser = currentUser == user;
    const authEmail = currentEmail == email;

    console.log("-----SISTEMA----");
    console.log("TAMANHO: " + data.length);
    console.log("POSIÇÃO: " + i);
    console.log("Pesquisando...");
    console.log("User: " + user + " == " + currentUser);
    console.log("nome: " + nome + " == " + currentNome);
    console.log("email: " + email + " == " + currentEmail);

    // Verifica se o nome,usuário e email são verdadeiros
    if (authNome || authUser || authEmail) {
      return -1; // Retorna -1 se foram encontrados usuarios repetidos no vetor
    }
  }
  console.log(currentDB);
  return currentDB;
}

function pesqPath(path) {
  const database = fs.readFileSync("data/host.json", "utf8");
  const data = JSON.parse(database);

  for (let i = 0; i < data.length; i++) {
    var currentDB = data[i];
    const currentPath = currentDB.path;

    console.log("-----SISTEMA----");
    console.log("TAMANHO: " + data.length);
    console.log("POSIÇÃO: " + i);
    console.log("Pesquisando...");
    console.log("User: " + path + " == " + currentPath);

    // Verifica se o path não estão duplicados e se são verdadeiros
    if (currentPath == path) {
      return -1; // Retorna -1 se foram encontrados usuarios repetidos no vetor
    }
  }
  console.log(currentDB);
  return currentDB;
}

// Configurar rate limiter: máximo de 100 requisições por 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de 100 requisições por janela
  message: "Muitas requisições feitas a partir deste IP. Por favor, tente novamente mais tarde.",
});

// Aplicar rate limiter a todas as rotas
router.use(limiter);

// Middleware para lidar com rotas não encontradas (404)
router.use((req, res, next) => {
  res.status(404);
  res.sendFile(notFoundFilePath);
});

module.exports = router;
