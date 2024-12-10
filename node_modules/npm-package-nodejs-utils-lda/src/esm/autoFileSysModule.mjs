import { readFileSync, writeFileSync } from "fs";


function fopen(filePath) {
  const database = readFileSync(filePath, "utf8");
  const data = JSON.parse(database);

  return data;
}

function fwrite(filePath, data) {
  const formatData = JSON.stringify(data, null, 2);

  writeFileSync(filePath, formatData, "utf8");
  return true;
}

// Função para converter uma string em uma representação binária
function stringToBinary(str) {
  return str
    .split("")
    .map((char) => {
      return char.charCodeAt(0).toString(2).padStart(8, "0");
    })
    .join(" ");
}

// Função para salvar dados JSON como binário
function fwriteBin(filePath, data) {
  const jsonString = JSON.stringify(data);
  const binaryString = stringToBinary(jsonString);

  writeFileSync(filePath, binaryString, "utf8");
  return true;
}

// Leitura e conversão de volta para JSON
function freadBin(filePath) {
  const binaryString = readFileSync(filePath, "utf8");
  const jsonString = binaryString
    .split(" ")
    .map((bin) => {
      return String.fromCharCode(parseInt(bin, 2));
    })
    .join("");
  const data = JSON.parse(jsonString);

  return data;
}

export default { fopen, fwrite, freadBin, fwriteBin};