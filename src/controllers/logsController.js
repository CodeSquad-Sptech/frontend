var logsModel = require("../models/logsModel");

function CriarLog(req, res) {
    const nivel = req.body.nivelServer;
    const mensagem = req.body.mensagemServer;

    if (!nivel || !mensagem) {
        return res.status(400).send("Informe o nível e a mensagem do log.");
    }

    if (mensagem.length > 100) {
        return res.status(400).send("ERRO AO REGISTRAR LOG: Mensagem muito grande.");
    }

    logsModel.CriarLog(nivel, mensagem).then(function () {
        return res.status(201).json({ mensagem: "Log registrado." });
    }).catch(function(erro) {
        console.error("Erro ao registrar log:", erro);
        return res.status(500).send("Não foi possível registrar o log.");
    });
}

module.exports = {
    CriarLog
};