const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const filesServer = __dirname + "/../src/";
const path_pages = filesServer + "pages/";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
const headersDefault = {
  "Content-Type": "application/json",
  "x-forwarded-proto": "https,http,http",
  "x-forwarded-port": "443,80,80",
  "accept-encoding": "gzip",
};

async function fetchGet(url, header) {
  try {
    const newHeaders = Object.assign(headersDefault, header);
    const requestOptions = {
      method: "GET",
      headers: newHeaders,
    };
    console.log("FETCH GET", url);
    const response = await fetch(url, requestOptions);
    const data = await response;

    // Faça algo com os dados recebidos
    return data;
  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);
    return {
      statusText: `Erro ao fazer a requisição: ${error}`,
      status: 400,
    };
  }
}


async function fetchPost(url, payload, header) {
  try {
    const newHeaders = Object.assign(headersDefault, header);
    const requestOptions = {
      method: "POST",
      headers: newHeaders,
      body: JSON.stringify(payload),
    };
    console.log("FETCH POST", url);
    const response = await fetch(url, requestOptions);
    const data = await response;

    // Faça algo com os dados recebidos
    return data;
  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);
    return {
      statusText: `Erro ao fazer a requisição: ${error}`,
      status: 400,
    };
  }
}

module.exports = {fetchGet,fetchPost}