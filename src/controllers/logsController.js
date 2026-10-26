var logsModel = require("../models/logsModel");

function CriarLog(req, res) {
    console.log("bateu no controller")
    const nivel = req.body.nivelServer;
    const mensagem = req.body.mensagemServer;
    
    console.log(nivel + " ------- " + mensagem)

    if (mensagem.length > 100) {
        console.log("ERRO AO REGISTRAR LOG: Mensagem muito grande.")
        return;
    }

    logsModel.CriarLog(nivel, mensagem).then(function() {
        console.log("passou do then controller")
        res.ok
        return;
    }).catch(function(erro) {
        console.log("deu ruim no then controller / " + erro)
        res.status(500)
        return;
    })
}

module.exports = {
    CriarLog
};