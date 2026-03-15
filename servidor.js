const http = require('http');
const { processarRequisicao } = require('./rotas');

const PORT = 3000;

const servidor = http.createServer((req, res) => {
    processarRequisicao(req, res);
});

servidor.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
