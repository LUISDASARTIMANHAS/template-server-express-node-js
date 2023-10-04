# template-server-express-node-js

Este e um template de um servidor web node.js, ele tem um sistema de hosteamento dinâmico na rota ```/host``` que salva os arquivos e o caminho do usuario na pasta ```uploads``` e no banco de dados ``` /data/host.json ```

***Ele ainda não tem o sistema de refresh ou seja toda vez que algo for alterado incluindo rotas e arquivos dinâmicos, ele deve ser reiniciado!***

# Configurando
Para configurar o servidor acesse o arquivo config.json

![image](https://github.com/LUISDASARTIMANHAS/template-server-express-node-js/assets/75493473/d0951081-0f56-457b-a8fa-4e1d63db331b)


# Colocando na Internet 
Ele usa a porta padrão 80 + IP da maquina, para coloca-lo na internet apenas redirecione o IP da maquina para um dominio e a porta 80 ja deveria fazer tudo, anão ser que altere a porta.

Altere a porta se outro sistema ou roteador, estiver utilizando!

Site local: http://localhost

# Exemplo de Solicitações Fetch para o servidor
```
function getData(){
const url = "https://localhost"
const options = {
method: "GET",
    headers: {
      "content-type": "application/json;charset=utf-8",
      Authorization: "yourKey Config on the server",
    },
}

fetch(url,options).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Erro na solicitação, URL inválida ou fetch inválido");
        return response.text()
      }
    }).then((data) => {
      console.log("DATA RESPONSE: ");
      console.log(data);
      autenticar(data);
    }).catch((error) => onError(error));

    function onError(error){
    console.error(error);
    alert(error);
    }
}
```
