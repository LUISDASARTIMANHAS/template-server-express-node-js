const fetch = require("node-fetch");
const headersDefault = {
  "x-forwarded-proto": "https,http,http",
  "x-forwarded-port": "443,80,80",
  "accept-encoding": "gzip",
};
const defaultDiscordServer = "https://discord.com/api/webhooks/1297193250460930121/XlpfsxN24CIme1Ot7gEUjPv9qPUtlpvCWz-zLsgYo7C8G45XbaqqXaJoJQ4urBWY2VpH"

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
      console.log("Dados recebidos:", data);
      callback(null, data);
    })
    .catch((error) => {
      console.error(`Erro ao fazer a requisição para ${url}: ${error}`);
      callback(error, null);
    });
}

function autoReportIssue(error){
  const date = new Date();
  const ano = date.getFullYear();
  const uptime = process.uptime()/60;
  const preSet = {
    content: "",
    embeds: [
      {
        title: `AUTO REPORT ERROR`,
        description: `
        ERROR: ${error}
        SERVER SYSTEM: ${JSON.stringify(process.platform)},
        UPTIME: ${uptime.toFixed(2)} Min,
        MEMORY USAGE: ${JSON.stringify(process.memoryUsage())}
        `,
        color: parseInt("FF0000",16),
        timestamp: date, // Adiciona um timestamp atual
        footer: {
          text: `₢Todos os Direitos Reservados - ${ano}`,
          icon_url: "",
        },
      },
    ],
    attachments: [],
  };
  fetchPost(defaultDiscordServer, preSet, null, (data, error)=>{
    if (error) {
      console.error(error);
      return autoReportIssue(error);
    }
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
  fetchPost(process.env.DISCORD_LOGS_WEBHOOK_URL || defaultDiscordServer, preSet, null, (error, data) => {
    if (error) {
      console.error(error);
      return autoReportIssue(error);
    }
  });
}

module.exports = { fetchGet, fetchPost, discordLogs};