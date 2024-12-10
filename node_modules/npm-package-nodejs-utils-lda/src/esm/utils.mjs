import { join } from "path";
import { fopen, fwrite, freadBin, fwriteBin } from "./autoFileSysModule.mjs";
const routesDir = __dirname;
const files2 = __dirname + "/src/";
const path_pages = files2 + "pages/";
const forbiddenFilePath = join(path_pages, "forbidden.html");

// Função para ordenar bases por usuario
function ordenarUsuario(file) {
  const data = freadBin(file);

  // Ordena o array de usuarios com base no usuario, do maior para o menor
  data.sort((a, b) => b.usuario - a.usuario);

  // Salva o array ordenado de volta no arquivo
  fwriteBin(file, data);
}


function pesqUsuarioByEmail(file,email) {
  const data = freadBin(file);
  let pos = 0;

  for (pos = 0; pos < data.length; pos++) {
    var currentDB = data[pos];
    const currentEmail = currentDB.email;

    // Verifica se e o email
    const authEmail = currentEmail == email;

    console.log("-----SISTEMA----");
    console.log("TAMANHO: " + data.length);
    console.log("POSIÇÃO: " + pos);
    console.log("Pesquisando...");
    console.log("e-mail : " + email + " == " + currentEmail);

    // Verifica se o nome,usuário e email são verdadeiros
    if (authEmail) {
      return pos;
    }
  }
  return -1; // Retorna -1 se não foram encontrados usuarios no vetor
}

function pesqUsuario(file,username) {
  const data = freadBin(file);
  let pos = 0;

  for (pos = 0; pos < data.length; pos++) {
    var currentDB = data[pos];
    const currentUser = currentDB.usuario;

    // Verifica se e o usuario
    const authNome = currentUser == username;

    console.log("-----SISTEMA----");
    console.log("TAMANHO: " + data.length);
    console.log("POSIÇÃO: " + pos);
    console.log("Pesquisando...");
    console.log("User: " + username + " == " + currentUser);

    // Verifica se o nome,usuário e email são verdadeiros
    if (authNome) {
      return pos;
    }
  }
  return -1; // Retorna -1 se não foram encontrados usuarios no vetor
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomBin(max) {
  return Math.floor(Math.random() * max).toString(2);
}

function getRandomHex(max) {
  return Math.floor(Math.random() * max).toString(16);
}

function generateToken() {
  let token = '';
  const maxLength = 32; // Precisamos de exatamente 32 caracteres

  while (token.length < maxLength) {
    let hex = getRandomHex(256); // Gera um valor hexadecimal
    token += hex; // Adiciona o valor ao token
  }

  return token.substring(0, maxLength); // Garante que o token tenha exatamente 32 caracteres
}

function formatDate(dateString) {
  const options = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: false 
  };
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', options);
}

function validadeApiKey(req,res,key){
  const keyHeader = req.headers["authorization"];
  const authApi = keyHeader == key;
  
  if(!authApi){
    forbidden(res);
  }
}

function conversorSimEnao(value) {
  if (value) {
    return "✔Voce foi autorizado, esta tudo correto";
  }
  return "⚠Esta faltando algo ou não foi autorizado!";
}


function forbidden(res) {
  console.error(403);
  res.status(403);
  res.sendFile(forbiddenFilePath);
}

function unauthorized(res) {
  console.error(401);
  res.status(401);
  res.sendStatus(401);
}

export default {
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
};
