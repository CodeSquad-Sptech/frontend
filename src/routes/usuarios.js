var express = require("express");
var router = express.Router();
var multer = require("multer");
var path = require("path");
var crypto = require("crypto");
var fs = require("fs");

var usuarioController = require("../controllers/usuarioController");
var sessoes = require("../config/sessoes");
var pastaFotos = path.join(__dirname, "../../public/uploads/perfil");
var extensoesFoto = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
};

fs.mkdirSync(pastaFotos, { recursive: true });

var enviarFoto = multer({
    storage: multer.diskStorage({
        destination: pastaFotos,
        filename: function (req, file, callback) {
            callback(null, crypto.randomUUID() + extensoesFoto[file.mimetype]);
        }
    }),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: function (req, file, callback) {
        if (!extensoesFoto[file.mimetype]) {
            callback(new Error("Use uma imagem JPG, PNG ou WebP."));
            return;
        }

        callback(null, true);
    }
});

function exigirSessao(req, res, next) {
    var sessao = sessoes.buscarSessao(req);

    if (!sessao) {
        return res.status(401).send("Entre na sua conta para continuar.");
    }

    req.sessao = sessao.dados;
    next();
}

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/sair", usuarioController.sair);
router.get("/configuracoes", exigirSessao, usuarioController.obterConfiguracoes);
router.put(
    "/configuracoes/perfil",
    exigirSessao,
    enviarFoto.single("foto"),
    usuarioController.salvarPerfil
);
router.put("/configuracoes/aparencia", exigirSessao, usuarioController.salvarPreferencias);

router.use(function (erro, req, res, next) {
    if (erro instanceof multer.MulterError && erro.code == "LIMIT_FILE_SIZE") {
        return res.status(400).send("A imagem deve ter no máximo 2 MB.");
    }

    if (erro.message == "Use uma imagem JPG, PNG ou WebP.") {
        return res.status(400).send(erro.message);
    }

    console.error(erro);
    return res.status(500).send("Não foi possível processar a imagem.");
});

module.exports = router;