const database = require("../config/config");

function CriarLog(nivel, mensagem) {
    const instrucaoSql = `
        INSERT INTO logs (empresa, funcionario, nivel, mensagem, dataHora) VALUES
        (?, ?, ?, ?, NOW());
    `;
    return database.executar(instrucaoSql, ["Evolua", "Sistema", nivel, mensagem]);
}

module.exports = {
    CriarLog
};