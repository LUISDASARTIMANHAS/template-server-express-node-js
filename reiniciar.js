const { exec } = require('child_process');

function reiniciarServidor() {
  console.log('Reiniciando o servidor...');
  const comando = 'npm run start'; // Use o comando apropriado para iniciar o servidor

  const processo = exec(comando, (erro, stdout, stderr) => {
    if (erro) {
      console.error(`Erro ao reiniciar o servidor: ${erro}`);
    } else {
      console.log(`Servidor reiniciado: ${stdout}`);
    }
  });

  processo.on('exit', (código) => {
    console.log(`O servidor foi encerrado com código de saída ${código}. Reiniciando...`);
    reiniciarServidor(); // Reinicie o servidor quando ele encerrar
  });
}

reiniciarServidor(); // Inicie o processo de reinicialização
