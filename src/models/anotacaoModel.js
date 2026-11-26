const database = require("../config/config");

function listarCursos(fkInstituicao) {
    const sql = `
        SELECT MIN(c.idInfoCurso) AS idInfoCurso, c.nomeCurso
        FROM info_curso c
        JOIN importacao i ON i.idImportacao = c.fkImportacao
        JOIN usuario u ON u.idUsuario = i.fkUsuario
        WHERE u.fkInstituicao = ?
        GROUP BY c.nomeCurso
        ORDER BY c.nomeCurso;
    `;
    return database.executar(sql, [fkInstituicao]);
}

function listarPorUsuario(idUsuario) {
    const sql = `
        SELECT a.idAnotacao, a.titulo, a.dataAnotacao, a.texto,
               a.fkInfoCurso, c.nomeCurso
        FROM anotacao a
        LEFT JOIN info_curso c ON c.idInfoCurso = a.fkInfoCurso
        WHERE a.fkUsuario = ?
        ORDER BY a.dataAnotacao DESC, a.idAnotacao DESC;
    `;
    return database.executar(sql, [idUsuario]);
}

function criar(idUsuario, titulo, dataAnotacao, fkInfoCurso, texto) {
    const sql = `
        INSERT INTO anotacao (titulo, dataAnotacao, texto, fkInfoCurso, fkUsuario)
        VALUES (?, ?, ?, ?, ?);
    `;
    return database.executar(sql, [titulo, dataAnotacao, texto, fkInfoCurso, idUsuario]);
}

function atualizar(idAnotacao, idUsuario, titulo, dataAnotacao, fkInfoCurso, texto) {
    const sql = `
        UPDATE anotacao
        SET titulo = ?, dataAnotacao = ?, texto = ?, fkInfoCurso = ?
        WHERE idAnotacao = ? AND fkUsuario = ?;
    `;
    return database.executar(sql, [titulo, dataAnotacao, texto, fkInfoCurso, idAnotacao, idUsuario]);
}

function deletar(idAnotacao, idUsuario) {
    return database.executar(
        "DELETE FROM anotacao WHERE idAnotacao = ? AND fkUsuario = ?;",
        [idAnotacao, idUsuario]
    );
}

function cursoPertenceInstituicao(idInfoCurso, fkInstituicao) {
    const sql = `
        SELECT c.idInfoCurso
        FROM info_curso c
        JOIN importacao i ON i.idImportacao = c.fkImportacao
        JOIN usuario u ON u.idUsuario = i.fkUsuario
        WHERE c.idInfoCurso = ? AND u.fkInstituicao = ?;
    `;
    return database.executar(sql, [idInfoCurso, fkInstituicao]);
}

module.exports = { listarCursos, listarPorUsuario, criar, atualizar, deletar, cursoPertenceInstituicao };
