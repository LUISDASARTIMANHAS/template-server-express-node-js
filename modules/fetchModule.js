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
        description: "SERVIDOR: " + mensagem,
        color: parseInt("FFFFFF",16),
        timestamp: date, // Adiciona um timestamp atual
        footer: {
          text: `₢Todos os Direitos Reservados - ${ano}`,
          icon_url: "",
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

function discordLogsBrasilEternity(title, mensagem) {
  const date = new Date();
  const ano = date.getFullYear();
  const preSet = {
    content: "",
    embeds: [
      {
        title: `SERVIDOR/${title}`,
        description: "SERVIDOR BRASIL ETERNITY: " + mensagem,
        color: parseInt("FF0000",16),
        timestamp: date, // Adiciona um timestamp atual
        footer: {
          text: `₢Todos os Direitos Reservados - PINGOBRAS S.A  & BRASIL ETERNITY- ${ano}`,
          icon_url: "https://cdn.discordapp.com/attachments/952004420265205810/1258422248507969546/Brasil-Eternity-image.jpg?ex=6687fc8c&is=6686ab0c&hm=842f5fca11e4b814443ca73bac9d6b35a0d309960dbdf9548405767092bf1a07&",
        },
      },
    ],
    attachments: [],
  };
  fetchPost(process.env.DISCORD_LOGS_BRASIL_ETERNITY_WEBHOOK_URL, preSet, null, (error, data) => {
    if (error) {
      console.error(error);
    }
  });
}

module.exports = { fetchGet, fetchPost, discordLogs, discordLogsBrasilEternity };