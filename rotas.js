const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const multer = require("multer");
const { exec } = require('child_process'); // executa comandos do sistema como restart

const files2 = __dirname + "/src/";
const path_pages = files2 + "pages/";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
const notFoundFilePath = path.join(path_pages, "not-found.html");
const storagePages = multer.diskStorage({
  destination: (req, file, cb) => {
    // Especifique o diretório onde os arquivos serão salvos
    const destinationPath = path.join(__dirname, "src","uploads");
    fs.mkdirSync(destinationPath, { recursive: true }); // Cria a pasta 'src/pages' se não existir
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    // Use um nome de arquivo único baseado no nome original do arquivo
    const uniqueFilename = file.originalname;
    cb(null, uniqueFilename);
  },
});

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// obter o banco de dados de arquivos hosteados automaticamente
router.get("/host=data", (req, res) => {
  console.log("SISTEMA <OBTER> <ARQUIVO>: " + req.url);
  const database = fs.readFileSync("data/host.json", "utf8");
  const host = JSON.parse(database);
  res.json(host);
});

// rota para add arquivo a hospedagem automatica
const upload = multer({
  storage: storagePages,
  limits: {
    fileSize: 1024 * 1024 * 256, // Limite de 256 megabytes (ajuste conforme necessário)
  },
});

// rota para add hospedagem
router.post("/host", upload.single("file"), (req, res) => {
  console.log("SISTEMA <ENVIAR>: " + req.url);
  console.log("SISTEMA <PAYLOAD>: " + JSON.stringify(req.body, null, 2));

  const database = fs.readFileSync("data/host.json", "utf8");
  const dataHost = JSON.parse(database);
  const payload = req.body;
  payload.file = req.file.originalname;
  const dominio = payload.path;
  const file = payload.file;
  const authPath = pesqPath(dominio);

  if (authPath !== -1) {
    try {
      // Verifique se o arquivo foi carregado com sucesso
      if (!file) {
        throw new Error("Nenhum arquivo foi enviado.");
      }

      // Se você chegou até aqui, o arquivo foi carregado com sucesso
      dataHost.push(payload);
      fs.writeFileSync("data/host.json", JSON.stringify(dataHost), "utf8");
      res.status(201);
      res.send(
        "Hospedagem de arquivo cadastrada com sucesso! <a href='" +
        dominio +
          "'>Acesse aqui</a>"
      );
      console.log("Hospedagem de arquivo cadastrada com sucesso! " + dominio)
      reiniciarServidor();
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      res.status(500);
      res.send("Ocorreu um erro ao associar o link: " + error.message);
      console.log("Ocorreu um erro ao associar o link: " + error.message)
    }
  } else {
    res.status(400);
    res.send("Já existe um Path (caminho) cadastrado.");
    console.log("Já existe um Path (caminho) cadastrado.")
  }
});


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

function conversorSimEnao(value) {
  if (value) {
    return "✔Voce foi autorizado, esta tudo correto";
  }
  return "⚠Esta faltando algo ou não foi autorizado!";
}

function forbidden(res) {
  res.status(403);
  res.sendFile(forbiddenFilePath);
}

// auto page reloader
function autoPages() {
  const hostJson = fs.readFileSync("data/host.json", "utf8");
  const hosts = JSON.parse(hostJson);
  console.log("SISTEMA <AUTO PAGE> CARREGADO! ");

  for (let i = 0; i < hosts.length; i++) {
    const host = hosts[i];
    const dominio = host.path;
    const file = host.file;
    const link = path.join(__dirname, "src", "uploads", file);
    
    console.log("SISTEMA <HOST> <PATH>: " + dominio);
    console.log("SISTEMA <HOST> <FILE>: " + link);

    router.get(dominio, (req, res) => {
      console.log("SISTEMA <OBTER> <SITE>: " + req.url);
      res.sendFile(link);
    });
  }
}
autoPages();

// Função para reiniciar o servidor
function reiniciarServidor() {
  // Encerrar o processo anterior, se existir
  if (serverProcess) {
    console.log('Finalizando o processo do servidor anterior...');
    kill(serverProcess.pid, 'SIGTERM', (err) => {
      if (err) {
        console.error(`Erro ao encerrar o processo anterior: ${err}`);
      }
      console.log('Processo anterior encerrado.');
      iniciarNovoServidor();
    });
  } else {
    iniciarNovoServidor();
  }
}

// Função para iniciar um novo servidor
function iniciarNovoServidor() {
  console.log('Iniciando um novo servidor...');
  const comando = 'npm run start'; // Substitua pelo comando correto

  serverProcess = exec(comando, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao iniciar o servidor: ${error}`);
    } else {
      console.log('Novo servidor iniciado.');
    }
  });
}

// Middleware para lidar com rotas não encontradas (404)
router.use((req, res, next) => {
  res.status(404);
  res.sendFile(notFoundFilePath);
});

module.exports = router;
