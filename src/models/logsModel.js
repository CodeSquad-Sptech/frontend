const database = require("../config/config");

function CriarLog(nivel, mensagem, dataHora) {
    const instrucaoSql = `
        INSERT INTO logs (empresa, funcionario, nivel, mensagem, dataHora) VALUES
        ("Evolua", "Admin", ?, ?, ?);
        `;

    return database.executar(instrucaoSql, [nivel, mensagem, dataHora]);
}

module.exports = {
    CriarLog
};