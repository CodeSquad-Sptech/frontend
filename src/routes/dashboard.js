var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/cursos", function (req, res) {
    dashboardController.listarCursos(req, res);
});

router.get("/evolucao", function (req, res) {
    dashboardController.buscarEvolucao(req, res);
});

router.get("/perfil", function (req, res) {
    dashboardController.buscarPerfil(req, res);
});

module.exports = router;