const database = require("../config/config");

function CriarLog(nivel, mensagem) {
    console.log("bateu no model")
    const instrucaoSql = `
        INSERT INTO logs (empresa, funcionario, nivel, mensagem, dataHora) VALUES
        ("Evolua", "Sistema", ?, ?, Now());
        `;
    console.log("fez a instrução")
    database.executar(instrucaoSql, [nivel, mensagem])
    .then(function() {
        console.log("deu certo???")
    })
    .catch(function(erro) {
        console.log("deu ruim = " + erro)
    })

    return;
}

module.exports = {
    CriarLog
};