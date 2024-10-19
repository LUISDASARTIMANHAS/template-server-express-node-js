const fs = require("fs");
const path = require("path");
const multer = require("multer");

const storagePages = multer.diskStorage({
	destination: (req, file, cb) => {
		// Especifique o diretório onde os arquivos serão salvos
		const destinationPath = path.join(__dirname, "src", "uploads");
		fs.mkdirSync(destinationPath, { recursive: true }); // Cria a pasta 'src/uploads não existir
		cb(null, destinationPath);
	},
	filename: (req, file, cb) => {
		// Use um nome de arquivo único baseado no nome original do arquivo
		const uniqueFilename = file.originalname;
		cb(null, uniqueFilename);
	},
});

const saveFile = multer({
	storage: storagePages,
	limits: {
		fileSize: 1024 * 1024 * 256, // Limite de 256 megabytes (ajuste conforme necessário)
	},
});

function fopen(filePath) {
	const database = fs.readFileSync(filePath, "utf8");
	const data = JSON.parse(database);

	return data;
}

function fwrite(filePath, data) {
	const formatData = JSON.stringify(data, null, 2);

	fs.writeFileSync(filePath, formatData, "utf8");
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

	fs.writeFileSync(filePath, binaryString, "utf8");
	return true;
}

// Leitura e conversão de volta para JSON
function freadBin(filePath) {
	const binaryString = fs.readFileSync(filePath, "utf8");
	const jsonString = binaryString
		.split(" ")
		.map((bin) => {
			return String.fromCharCode(parseInt(bin, 2));
		})
		.join("");
	const data = JSON.parse(jsonString);

	return data;
}

module.exports = { fopen, fwrite, freadBin, fwriteBin, saveFile };
