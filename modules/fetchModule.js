const fetch = require("node-fetch");
const headersDefault = {
  "x-forwarded-proto": "https,http,http",
  "x-forwarded-port": "443,80,80",
  "accept-encoding": "gzip",
};

function fetchGet(url, header, callback) {
  const newHeaders = Object.assign(headersDefault, header);
  const requestOptions = {
    method: "GET",
    headers: newHeaders,
  };
  console.log("FETCH GET", url);
  fetch(url, requestOptions)
    .then((response) => {
      const contentType = response.headers.get("content-type");
      // Verifica se houve erro na resposta
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      // Verifica o tipo de conteúdo retornado
      if (contentType && contentType.includes("application/json")) {
        // Se for JSON, retorna o JSON
        return response.json();
      } else {
        // Se não for JSON, retorna o conteúdo como texto
        return response.text();
      }
    })
    .then((data) => {
      console.log("FETCH GET RECEBIDO! OK 200");
      callback(null, data);
    })
    .catch((error) => {
      console.error(`Erro ao fazer a requisição para ${url}: ${error}`);
      callback(error, null);
    });
}

function fetchPost(url, payload, header, callback) {
  const defaultContentType = {
    "content-type": `application/json; charset=UTF-8`,
  };
  var newHeaders = headersDefault;
  newHeaders = Object.assign(headersDefault,header || defaultContentType);
  const requestOptions = {
    method: "POST",
    headers: newHeaders,
    body: payload,
  };
  
  if(newHeaders['content-type'] == "application/json; charset=UTF-8"){
        console.log("Convertendo payload para json!");
        payload = JSON.stringify(payload);
    }
  
  console.log("FETCH POST", url);
  fetch(url, requestOptions)
    .then((response) => {
      const contentType = response.headers.get("content-type");
      // Verifica se houve erro na resposta
      if (!response.ok) {
        console.error(response);
        throw new Error(`${response.status} ${response.statusText}`);
      }
      // Verifica o tipo de conteúdo retornado
      if (contentType && contentType.includes("application/json")) {
        // Se for JSON, retorna o JSON
        return response.json();
      } else {
        // Se não for JSON, retorna o conteúdo como texto
        return response.text();
      }
    })
    .then((data) => {
      console.log("FETCH POST ENVIADO! OK 200");
      callback(null, data);
    })
    .catch((error) => {
      console.error(`Erro ao fazer a requisição para ${url}: ${error}`);
      callback(error, null);
    });
}

module.exports = { fetchGet, fetchPost };