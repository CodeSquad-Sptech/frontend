var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");
var sessoes = require("../config/sessoes");

function exigirSessao(req, res, next) {
    var sessao = sessoes.buscarSessao(req);

    if (!sessao || sessao.dados.fkInstituicao == undefined) {
        return res.status(401).send("Entre na sua conta para continuar.");
    }

    req.sessao = sessao.dados;
    next();
}

router.get("/cursos", exigirSessao, function (req, res) {
    dashboardController.listarCursos(req, res);
});

router.get("/evolucao", exigirSessao, function (req, res) {
    dashboardController.buscarEvolucao(req, res);
});

router.get("/perfil", exigirSessao, function (req, res) {
    dashboardController.buscarPerfil(req, res);
});

module.exports = router;