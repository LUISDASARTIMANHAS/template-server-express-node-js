const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");

const files2 = __dirname + "/src/";
const path_pages = files2 + "pages/";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
const notFoundFilePath = path.join(path_pages, "not-found.html");

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
router.post("/host", async (req, res) => {
   console.log("SISTEMA <ENVIAR>: " + req.url);
  console.log("SISTEMA <PAYLOAD>: " + JSON.stringify(req.body, null, 2));
  
  const database = fs.readFileSync("data/host.json", "utf8");
  const dataHost = JSON.parse(database);
  const payload = req.body;
  const dominio = payload.path;
  const fileLink = payload.fileLink;
  const authPath = pesqPath(dominio);
  const pastaDeArmazenamento = path.join(__dirname, "src", "pages");
  const caminhoArquivo = path.join(pastaDeArmazenamento, dominio + ".html");

  if (authPath !== -1) {
    try {
      // Verifique se a pasta de armazenamento existe, senão crie-a
      await fs.promises.mkdir(pastaDeArmazenamento, { recursive: true });

      // Realiza a solicitação HTTP com o Axios para baixar o arquivo
      const response = await axios.get(fileLink, { responseType: "stream" });
      console.log("Iniciando o download...");

      // Cria um fluxo de gravação para o arquivo
      const writer = fs.createWriteStream(caminhoArquivo);

      // Evento que é disparado quando os dados estão sendo escritos
      response.data.on("data", (chunk) => {
        console.log(`Baixando ${chunk.length} bytes...`);
      });

      // Evento que é disparado quando o download é concluído
      response.data.on("end", () => {
        console.log("Download concluído!");
        console.log("Arquivo salvo em: " + caminhoArquivo);
      });

      // Conecta o fluxo de dados de resposta ao fluxo de gravação
      response.data.pipe(writer);

      dataHost.push(payload);
      fs.writeFileSync("data/host.json", JSON.stringify(dataHost), "utf8");
      res.status(201);
      res.send(
        "Hosteamento de Arquivo cadastrado com sucesso! \n" +
          "<a href='" +
          dominio +
          "'>Acesse ele clicando aqui!<a>"
      );
    } catch (error) {
      console.error("Erro ao baixar/salvar o arquivo:", error);
      res.status(500);
      res.send("Ocorreu um erro ao associar o link.");
    }
  } else {
    res.status(400);
    res.send("Já existe um Path (caminho) cadastrado.");
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
    const link = path.join(__dirname, "src", "pages", dominio) + ".html";
    const fileLink = host.fileLink;
    console.log("SISTEMA <HOST> <PATH>: " + dominio);
    console.log("SISTEMA <HOST> <FILE>: " + link);
    console.log("SISTEMA <HOST> <ONLINE FILE>: " + fileLink);

    router.get(dominio, (req, res) => {
      console.log("SISTEMA <OBTER> <SITE>: " + req.url);
      res.sendFile(link);
    });
  }
}
autoPages();

// Middleware para lidar com rotas não encontradas (404)
router.use((req, res, next) => {
  res.status(404);
  res.sendFile(notFoundFilePath);
});

module.exports = router;
