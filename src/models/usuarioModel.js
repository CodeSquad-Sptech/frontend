const database = require("../config/config")

function autenticar(email, senha) {
    const instrucaoSql = `
        SELECT usuario.idUsuario, usuario.nome, usuario.email, usuario.administrador,
            usuario.fkInstituicao, configuracao.fotoPerfil, configuracao.tema,
            configuracao.tamanhoFonte, instituicao.nome AS nomeInstituicao
        FROM usuario
        INNER JOIN instituicao ON instituicao.idInstituicao = usuario.fkInstituicao
        LEFT JOIN configuracao ON configuracao.idUsuario = usuario.idUsuario
        WHERE usuario.email = ? AND usuario.senha = ?;
    `;
    const valores = [email, senha];

    return database.executar(instrucaoSql, valores);
}

function obterConfiguracoes(idUsuario) {
    const instrucaoSql = `
        SELECT configuracao.fotoPerfil, configuracao.tema, configuracao.tamanhoFonte,
            instituicao.nome AS nomeInstituicao
        FROM usuario
        INNER JOIN instituicao ON instituicao.idInstituicao = usuario.fkInstituicao
        LEFT JOIN configuracao ON configuracao.idUsuario = usuario.idUsuario
        WHERE usuario.idUsuario = ?;
    `;

    return database.executar(instrucaoSql, [idUsuario]);
}

function salvarPerfil(idUsuario, nomeInstituicao, fotoPerfil) {
    const instrucaoSql = `
        UPDATE instituicao
        INNER JOIN usuario ON usuario.fkInstituicao = instituicao.idInstituicao
        INNER JOIN configuracao ON configuracao.idUsuario = usuario.idUsuario
        SET instituicao.nome = ?, configuracao.fotoPerfil = ?
        WHERE usuario.idUsuario = ?;
    `;

    return database.executar(instrucaoSql, [nomeInstituicao, fotoPerfil, idUsuario]);
}

function salvarPreferencias(idUsuario, tema, tamanhoFonte) {
    const instrucaoSql = `
        INSERT INTO configuracao (idUsuario, tema, tamanhoFonte)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
            tema = VALUES(tema),
            tamanhoFonte = VALUES(tamanhoFonte);
    `;

    return database.executar(instrucaoSql, [idUsuario, tema, tamanhoFonte]);
}

function criarConfiguracao(idUsuario) {
    const instrucaoSql = `
        INSERT IGNORE INTO configuracao (idUsuario)
        VALUES (?);
    `;

    return database.executar(instrucaoSql, [idUsuario]);
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
    obterConfiguracoes,
    salvarPerfil,
    salvarPreferencias,
    criarConfiguracao,
    verificarCodigoInstituicao,
    cadastrar
};