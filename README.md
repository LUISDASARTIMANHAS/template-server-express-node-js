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

# Configurando o sistema de emails
para começar configure o transporte de e-mail, fornecendo as informações do servidor de e-mail que você deseja usar (como Gmail, Outlook, etc.):
 
**Não esqueça de configurar as Senhas de app no seu provedor de email!! nesse caso vamos usar o Goolge e Gmail**

**Informações da Aba de configuração**

https://support.google.com/mail/answer/185833?hl=pt-BR
```
    const transporter = nodemailer.createTransport({
        service: 'seu provedor de e-mail', // Exemplo: 'Gmail', 'Outlook', etc.
        auth: {
        user: 'seu-email@gmail.com', // Seu endereço de e-mail
        pass: 'chave conigurada no senhas de app do google e gmail', // Senhas de app
        },
});
```
# Criando o conetudo do email e enviando!
Lembre-se de substituir 'seu-email@gmail.com', 'sua-senha-de-e-mail', 'destinatario@example.com', 'Assunto do E-mail' e 'Conteúdo do E-mail' com as informações apropriadas.

Certifique-se de que a conta de e-mail utilizada permita o uso de "aplicativos menos seguros" ou, se possível, gere uma "senha de aplicativo" para a autenticação, dependendo do provedor de e-mail.

![image](https://github.com/LUISDASARTIMANHAS/template-server-express-node-js/assets/75493473/0552c85e-b284-458b-ac4b-c5a8b2b9c9e3)

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
      onSuccess(data);
    }).catch((error) => onError(error));

    function onError(error){
    console.error(error);
    alert(error);
    }

    function onSuccess(resposta){
    console.log("DATA RESPONSE: ");
    console.log(resposta);
    }
}


```
