var logsdModel = require("../models/logsModel");

function CriarLog(req, res) {
    const nivel = req.body.nivelServer;
    const mensagem = req.body.mensagemServer;
    const constData = new Date();
    const dataHora = `${constData.getFullYear}-${String(constData.getMonth() + 1).padStart(2, '0')}-${String(constData.getDate()).padStart(2, '0')} ${constData.getHours}:${constData.getMinutes}:${constData.getSeconds}`

   
    if (mensagem.length > 100) {
        console.log("ERRO AO REGISTRAR LOG: Mensagem muito grande.")
        return;
    }

    logsdModel.CriarLog(nivel, mensagem, dataHora)
    .then(function() {
        res.status(200)
    })
    .catch(function(erro) {
        res.status(500)
    })
}

module.exports = {
    CriarLog
};