const express = require("express");
const router = express.Router();

const { exigirSessao, exigirAdmin } = require("../config/middlewares");
const importacaoController = require("../controllers/importacaoController");

router.get("/", exigirSessao, importacaoController.listar);

router.post("/", exigirSessao, exigirAdmin, function (req, res) {
    importacaoController.receber(req, res, function (erro) {
        if (erro) {
            const mensagem = erro.code === "LIMIT_FILE_SIZE"
                ? "O arquivo passa de 10 MB."
                : "Arquivo inválido.";
            return res.status(400).send(mensagem);
        }

       importacaoController.enviar(req, res);
    });
});

module.exports = router;