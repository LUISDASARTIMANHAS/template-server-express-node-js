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

  console.log("FETCH GET:", url);
  fetch(url, requestOptions)
    .then((response) => {
      console.log("Status da resposta:", response.status, response.statusText);
      const contentType = response.headers.get("content-type");
      console.log("Tipo de conteúdo:", contentType);

      // Verifica se houve erro na resposta
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(`Erro na resposta do servidor: ${JSON.stringify(errorData, null, 2)}`);
        });
      }

      // Verifica o tipo de conteúdo retornado
      if (contentType && contentType.includes("application/json")) {
        // Se for JSON, retorna o JSON
        return response.text();
      } else {
        // Se não for JSON, retorna o conteúdo como texto
        return response.text();
      }
    })
    .then((data) => {
      console.log("FETCH GET RECEBIDO! OK 200");
      console.log("Dados recebidos:", data);
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
  newHeaders = Object.assign(headersDefault, header || defaultContentType);
  const requestOptions = {
    method: "POST",
    headers: newHeaders,
    body: payload,
  };

  if (newHeaders["content-type"] == "application/json; charset=UTF-8") {
    console.log("Convertendo payload para JSON!");
    requestOptions.body = JSON.stringify(payload);
  }

  console.log("FETCH POST", url);
  fetch(url, requestOptions)
    .then((response) => {
      console.log("Status da resposta:", response.status, response.statusText);
      const contentType = response.headers.get("content-type");
      console.log("Tipo de conteúdo:", contentType);

      // Verifica se houve erro na resposta
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(JSON.stringify(errorData, null, 2));
        });
      }

      // // Verifica o tipo de conteúdo retornado
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
      console.log("Dados recebidos:", data);
      callback(null, data);
    })
    .catch((error) => {
      console.error(`Erro ao fazer a requisição para ${url}: ${error}`);
      callback(error, null);
    });
}

function discordLogs(title, mensagem) {
  const date = new Date();
  const ano = date.getFullYear();
  const preSet = {
    content: "",
    embeds: [
      {
        title: `SERVIDOR/${title}`,
        description: "SERVIDOR #01: " + mensagem,
        color: parseInt("FF00FF",16),
        timestamp: date, // Adiciona um timestamp atual
        footer: {
          text: `₢Todos os Direitos Reservados - PINGOBRAS S.A - ${ano}`,
          icon_url: "https://cdn.discordapp.com/attachments/952004420265205810/1188643212378787940/pingobras-logo-fundo.png?ex=6682a481&is=66815301&hm=cc9c387ac2aad7fa8040738f47ae0ab43e2b77027d188e272a147b1829e3a53f&",
        },
      },
    ],
    attachments: [],
  };
  fetchPost(process.env.DISCORD_LOGS_WEBHOOK_URL, preSet, null, (error, data) => {
    if (error) {
      console.error(error);
    }
  });
}

module.exports = { fetchGet, fetchPost, discordLogs };