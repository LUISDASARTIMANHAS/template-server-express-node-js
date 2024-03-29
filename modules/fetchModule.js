const fetch = require("node-fetch");
const headersDefault = {
  "Content-Type": "application/json",
  "x-forwarded-proto": "https,http,http",
  "x-forwarded-port": "443,80,80",
  "accept-encoding": "gzip",
};

async function fetchGet(url, header, callback) {
  try {
    const newHeaders = Object.assign(headersDefault, header);
    const requestOptions = {
      method: "GET",
      headers: newHeaders,
    };
    console.log("FETCH GET", url);
    const response = await fetch(url, requestOptions);
    const contentType = response.headers.get("content-type");
    
    // Verifica se houve erro na resposta
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    // Verifica o tipo de conteúdo retornado
    if (contentType && contentType.includes("application/json")) {
      // Se for JSON, retorna o JSON
      const jsonData = await response.json();
      callback(null, jsonData);
    } else {
      // Se não for JSON, retorna o conteúdo como texto
      const textData = await response.text();
      callback(null, textData);
    }
  } catch (error) {
    console.error("Erro ao fazer a requisição: ", error);
    callback(error, null);
  }
}


async function fetchPost(url, payload, header, callback) {
  try {
    const newHeaders = Object.assign(headersDefault, header);
    const requestOptions = {
      method: "POST",
      headers: newHeaders,
      body: JSON.stringify(payload),
    };
    console.log("FETCH POST", url);
    const response = await fetch(url, requestOptions);
    const contentType = response.headers.get("content-type");
    
    // Verifica se houve erro na resposta
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    // Verifica o tipo de conteúdo retornado
    if (contentType && contentType.includes("application/json")) {
      // Se for JSON, retorna o JSON
      const jsonData = await response.json();
      callback(null, jsonData);
    } else {
      // Se não for JSON, retorna o conteúdo como texto
      const textData = await response.text();
      callback(null, textData);
    }
  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);
    callback(error, null);
  }
}

module.exports = {fetchGet,fetchPost}