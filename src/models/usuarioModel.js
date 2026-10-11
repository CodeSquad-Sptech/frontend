const database = require("../config/config");

function autenticar(email, senha) {
    const instrucaoSql = `
        SELECT
            u.idUsuario,
            u.nome,
            u.email,
            u.administrador,
            u.fkInstituicao,
            i.nome AS nomeInstituicao,
            c.fotoPerfil,
            c.tamanhoFonte,
            c.modoEscuro
        FROM usuario u
        JOIN instituicao i ON i.idInstituicao = u.fkInstituicao
        LEFT JOIN configuracao c ON c.fkUsuario = u.idUsuario
        WHERE u.email = ? AND u.senha = ?;
    `;

    return database.executar(instrucaoSql, [email, senha]);
}

function buscarInstituicaoPorCodigo(codigo) {
    const instrucaoSql = `
        SELECT idInstituicao
        FROM instituicao
        WHERE codigo = ?;
    `;

    return database.executar(instrucaoSql, [codigo]);
}

function cadastrar(nome, email, senha, idInstituicao) {
    const instrucaoSql = `
        INSERT INTO usuario (
            nome,
            email,
            senha,
            administrador,
            ativo,
            fkInstituicao
        )
        VALUES (?, ?, ?, 0, 1, ?);
    `;

    return database.executar(instrucaoSql, [nome, email, senha, idInstituicao]);
}

function criarConfiguracao(idUsuario) {
    const instrucaoSql = `
        INSERT INTO configuracao (fkUsuario, fotoPerfil)
        VALUES (?, ?);
    `;

    return database.executar(
        instrucaoSql,
        [idUsuario, "img/usuarioSemFoto.png"]
    );
}

function obterConfiguracoes(idUsuario) {
    const instrucaoSql = `
        SELECT
            c.fotoPerfil,
            c.tamanhoFonte,
            c.modoEscuro,
            i.nome AS nomeInstituicao
        FROM usuario u
        JOIN instituicao i ON i.idInstituicao = u.fkInstituicao
        LEFT JOIN configuracao c ON c.fkUsuario = u.idUsuario
        WHERE u.idUsuario = ?;
    `;

    return database.executar(instrucaoSql, [idUsuario]);
}

function salvarPerfil(idUsuario, nomeInstituicao, fotoPerfil) {
    const instrucaoSql = `
        UPDATE instituicao i
        JOIN usuario u ON u.fkInstituicao = i.idInstituicao
        LEFT JOIN configuracao c ON c.fkUsuario = u.idUsuario
        SET i.nome = COALESCE(?, i.nome), c.fotoPerfil = ?
        WHERE u.idUsuario = ?;
    `;

    return database.executar(instrucaoSql, [nomeInstituicao, fotoPerfil, idUsuario]);
}

function salvarPreferencias(idUsuario, tema, tamanhoFonte) {
    const modoEscuro = tema == "escuro" ? 1 : 0;
    const tamanhosFonte = {
        pequena: 14,
        media: 16,
        grande: 20
    };
    const instrucaoSql = `
        UPDATE configuracao
        SET modoEscuro = ?, tamanhoFonte = ?
        WHERE fkUsuario = ?;
    `;

    return database.executar(
        instrucaoSql,
        [modoEscuro, tamanhosFonte[tamanhoFonte], idUsuario]
    );
}

module.exports = {
    autenticar,
    buscarInstituicaoPorCodigo,
    cadastrar,
    criarConfiguracao,
    obterConfiguracoes,
    salvarPerfil,
    salvarPreferencias
};
