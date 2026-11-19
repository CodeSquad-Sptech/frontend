const database = require("../config/config");

function registrar(nomeArquivo, idUsuario) {
    const instrucaoSql = `
        INSERT INTO importacao (nomeArquivo, dataImportacao, fkUsuario)
        VALUES (?, CURDATE(), ?);
    `;
    return database.executar(instrucaoSql, [nomeArquivo, idUsuario]);
}

function remover(idImportacao) {
    const instrucaoSql = `DELETE FROM importacao WHERE idImportacao = ?;`;
    return database.executar(instrucaoSql, [idImportacao]);
}

function listarPorInstituicao(fkInstituicao) {
    const instrucaoSql = `
        SELECT i.idImportacao, i.nomeArquivo, i.dataImportacao, u.nome AS enviadoPor
        FROM importacao i
        JOIN usuario u ON u.idUsuario = i.fkUsuario
        WHERE u.fkInstituicao = ?
        ORDER BY i.idImportacao DESC
        LIMIT 20;
    `;
    return database.executar(instrucaoSql, [fkInstituicao]);
}

module.exports = { registrar, remover, listarPorInstituicao };