const crypto = require("crypto");

const sessoes = new Map();
const DURACAO_SESSAO = 8 * 60 * 60 * 1000;

function criarSessao(usuario) {
    const token = crypto.randomBytes(32).toString("hex");
    sessoes.set(token, {
        idUsuario: usuario.idUsuario,
        fkInstituicao: usuario.fkInstituicao,
        administrador: usuario.administrador == 1,
        expiraEm: Date.now() + DURACAO_SESSAO
    });
    return token;
}

function buscarSessao(req) {
    const cookies = req.headers.cookie || "";

    for (const cookie of cookies.split("; ")) {
        if (cookie.startsWith("evolua_sessao=")) {
            const token = cookie.substring("evolua_sessao=".length);
            const sessao = sessoes.get(token);

            if (sessao && sessao.expiraEm > Date.now()) {
                return { token: token, dados: sessao };
            }

            sessoes.delete(token);
            return null;
        }
    }

    return null;
}

function encerrarSessao(token) {
    sessoes.delete(token);
}

module.exports = {
    criarSessao,
    buscarSessao,
    encerrarSessao,
    DURACAO_SESSAO
};