const fetch = require("node-fetch");
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

    // Faça algo com os dados recebidos
    return response;
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

    // Faça algo com os dados recebidos
    return response;
  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);
    return {
      statusText: `Erro ao fazer a requisição: ${error}`,
      status: 400,
    };
  }
}

module.exports = {fetchGet,fetchPost}