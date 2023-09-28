# template-server-express-node-js

Este e um template de um servidor web node.js, ele tem um sistema de hosteamento dinâmico na rota ```/host``` que salva os arquivos e o caminho do usuario na pasta ```uploads``` e no banco de dados ``` /data/host.json ```

***Ele ainda não tem o sistema de refresh ou seja toda vez que algo for alterado incluindo rotas e arquivos dinâmicos, ele deve ser reiniciado!***

# Colocando na Internet 
Ele usa a porta padrão 80 + IP da maquina, para coloca-lo na internet apenas redirecione o IP da maquina para um dominio e a porta 80 ja deveria fazer tudo, anão ser que altere a porta.

Altere a porta se outro sistema ou roteador, estiver utilizando!

Site local: http://localhost
