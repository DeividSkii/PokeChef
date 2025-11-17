// importar o módulo express
const express = require('express');

// importar o módulo path para trabalhar com caminhos de arquivos
const path = require('path');

// inicializa o app
const app = express();

// define a porta em que o servidor vai rodar
const PORT = 3000;

// middleware para servir arquivos estáticos da raiz do projeto
app.use(express.static(__dirname));

// rota principal que devolve o index.html
app.get("/", (req, res) => {
    // envia o arquivo index.html que está na raiz
    res.sendFile(path.join(__dirname, "index.html"));
});

// inicia o servidor na porta escolhida
app.listen(PORT, () => {
    console.log(`PokeChef rodando em http://localhost:${PORT}`);
});
