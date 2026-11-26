const express = require("express");
const router = express.Router();
const { exigirSessao } = require("../config/middlewares");
const anotacaoController = require("../controllers/anotacaoController");

router.get("/cursos", exigirSessao, anotacaoController.listarCursos);
router.get("/", exigirSessao, anotacaoController.listar);
router.post("/", exigirSessao, anotacaoController.criar);
router.put("/:id", exigirSessao, anotacaoController.atualizar);
router.delete("/:id", exigirSessao, anotacaoController.deletar);

module.exports = router;
