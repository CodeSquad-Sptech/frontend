const database = require("../config/config");
const crypto = require("crypto");

function gerarHashSenha(senha) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(senha, salt, 100000, 64, "sha512").toString("hex");
    return "pbkdf2$" + salt + "$" + hash;
}

function verificarSenha(senha, senhaArmazenada) {
    if (!senhaArmazenada) {
        return false;
    }

    if (!senhaArmazenada.startsWith("pbkdf2$")) {
        return senha === senhaArmazenada;
    }

    const partes = senhaArmazenada.split("$");
    if (partes.length !== 3) {
        return false;
    }

    const hashInformado = crypto.pbkdf2Sync(
        senha,
        partes[1],
        100000,
        64,
        "sha512"
    ).toString("hex");

    const hashArmazenado = Buffer.from(partes[2], "hex");
    const hashRecebido = Buffer.from(hashInformado, "hex");
    return hashArmazenado.length === hashRecebido.length &&
        crypto.timingSafeEqual(hashArmazenado, hashRecebido);
}

function autenticar(email, senha) {
    const instrucaoSql = `
        SELECT
            u.idUsuario,
            u.nome,
            u.email,
            u.senha,
            u.administrador,
            u.fkInstituicao,
            i.nome AS nomeInstituicao,
            c.fotoPerfil,
            c.tamanhoFonte,
            c.modoEscuro
        FROM usuario u
        JOIN instituicao i ON i.idInstituicao = u.fkInstituicao
        LEFT JOIN configuracao c ON c.fkUsuario = u.idUsuario
        WHERE u.email = ?;
    `;

    return database.executar(instrucaoSql, [email]).then(function (usuarios) {
        const usuario = usuarios.find(function (item) {
            return verificarSenha(senha, item.senha);
        });

        if (!usuario) {
            return [];
        }

        if (!usuario.senha.startsWith("pbkdf2$")) {
            usuario.senha = gerarHashSenha(senha);
            database.executar(
                "UPDATE usuario SET senha = ? WHERE idUsuario = ?;",
                [usuario.senha, usuario.idUsuario]
            ).catch(function (erro) {
                console.error("Não foi possível atualizar o hash da senha:", erro);
            });
        }

        delete usuario.senha;
        return [usuario];
    });
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

    return database.executar(
        instrucaoSql,
        [nome, email, gerarHashSenha(senha), idInstituicao]
    ).then(function (resultado) {
        return criarConfiguracao(resultado.insertId, "img/usuarioSemFoto.png")
            .then(function () {
                return resultado;
            });
    });
}

function criarConfiguracao(idUsuario, fotoPerfil) {
    const instrucaoSql = `
        INSERT INTO configuracao (fkUsuario, fotoPerfil)
        VALUES (?, ?);
    `;

    return database.executar(
        instrucaoSql,
        [idUsuario, fotoPerfil]
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
        SET i.nome = COALESCE(?, i.nome)
        WHERE u.idUsuario = ?;
    `;

    return database.executar(instrucaoSql, [nomeInstituicao, idUsuario])
        .then(function () {
            return database.executar(
                `INSERT INTO configuracao (fkUsuario, fotoPerfil)
                 VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE fotoPerfil = VALUES(fotoPerfil);`,
                [idUsuario, fotoPerfil]
            );
        });
}

function salvarPreferencias(idUsuario, tema, tamanhoFonte) {
    const modoEscuro = tema == "escuro" ? 1 : 0;
    const tamanhosFonte = {
        pequena: 14,
        media: 16,
        grande: 20
    };
    const instrucaoSql = `
        INSERT INTO configuracao (fkUsuario, modoEscuro, tamanhoFonte)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE modoEscuro = VALUES(modoEscuro),
                                tamanhoFonte = VALUES(tamanhoFonte);
    `;

    return database.executar(
        instrucaoSql,
        [idUsuario, modoEscuro, tamanhosFonte[tamanhoFonte]]
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
