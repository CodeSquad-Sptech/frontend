const database = require("../database/config")

function autenticar(email, senha) {
    const instrucaoSql = `
        SELECT idUsuario, nome, email, fkInstituicao FROM usuario WHERE email = ? AND senha = ?;
    `;
    const valores = [email, senha];

    return database.executar(instrucaoSql, valores);
}

function verificarCodigoInstituicao(codigo) {
    const instrucaoSql = `
        SELECT idInstituicao FROM instituicao WHERE codigo = ?;
    `;
    const valores = [codigo];

    return database.executar(instrucaoSql, valores);
}

function cadastrar(nome, email, senha, confirmacaoSenha, codigo) {
    const instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, confirmacaoSenha, administrador, ativo, fkInstituicao) VALUES (?, ?, ?, ?, 0, 1, (SELECT idInstituicao FROM instituicao WHERE codigo = ?));
    `;
    const valores = [nome, email, senha, confirmacaoSenha, codigo];

    return database.executar(instrucaoSql, valores);
}

module.exports = {
    autenticar,
    verificarCodigoInstituicao,
    cadastrar
};