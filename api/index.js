const { processarRequisicao } = require('../rotas');

module.exports = (req, res) => {
    processarRequisicao(req, res);
};
