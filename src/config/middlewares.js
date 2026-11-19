const sessoes = require("./sessoes");

function exigirSessao(req, res, next) {
    const sessao = sessoes.buscarSessao(req);

    if (!sessao) {
        return res.status(401).send("Entre na sua conta para continuar.");
    }

    req.sessao = sessao.dados;
    next();
}

function exigirAdmin(req, res, next) {
    if (!req.sessao || !req.sessao.administrador) {
        return res.status(403).send("Apenas administradores podem fazer isso.");
    }

    next();
}

module.exports = { exigirSessao, exigirAdmin };
