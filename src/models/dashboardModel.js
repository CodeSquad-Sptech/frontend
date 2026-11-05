const database = require("../config/config");

function filtroCurso(nomeCurso, alias = "c") {
    if (nomeCurso == undefined || nomeCurso == "" || nomeCurso == "todos") {
        return { sql: "", params: [] };
    }

    return { sql: `AND ${alias}.nomeCurso = ?`, params: [nomeCurso] };
}

function listarCursos(idInstituicao) {
    var instrucaoSql = `
        SELECT DISTINCT c.nomeCurso AS nome_curso
        FROM info_curso c
        JOIN importacao i ON i.idImportacao = c.fkImportacao
        JOIN usuario u ON u.idUsuario = i.fkUsuario
        WHERE u.fkInstituicao = ?
        ORDER BY c.nomeCurso;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idInstituicao]);
}

function buscarEvolucao(idInstituicao, nomeCurso) {
    var filtro = filtroCurso(nomeCurso);

    var instrucaoSql = `
        SELECT c.ano,
            COALESCE(SUM(m.matriculas), 0) AS matriculas,
            COALESCE(SUM(t.trancadas), 0) AS trancadas,
            COALESCE(SUM(k.concluintes), 0) AS concluintes
        FROM info_curso c
        JOIN importacao i ON i.idImportacao = c.fkImportacao
        JOIN usuario u ON u.idUsuario = i.fkUsuario
        LEFT JOIN (
            SELECT m.fkInfoCurso,
                SUM(COALESCE(ms.feminino, 0) + COALESCE(ms.masculino, 0)) AS matriculas
            FROM info_matriculas m
            JOIN quantidade_matriculas_sexo ms ON ms.fkInfoMatriculas = m.idInfoMatriculas
            GROUP BY m.fkInfoCurso
        ) m ON m.fkInfoCurso = c.idInfoCurso
        LEFT JOIN (
            SELECT m.fkInfoCurso,
                SUM(COALESCE(mo.quantidadeAlunosSituacaoTrancada, 0)) AS trancadas
            FROM info_matriculas m
            JOIN quantidade_matriculas_outros mo ON mo.fkInfoMatriculas = m.idInfoMatriculas
            GROUP BY m.fkInfoCurso
        ) t ON t.fkInfoCurso = c.idInfoCurso
        LEFT JOIN (
            SELECT k.fkInfoCurso,
                SUM(COALESCE(cs.feminino, 0) + COALESCE(cs.masculino, 0)) AS concluintes
            FROM info_concluintes k
            JOIN quantidade_concluintes_sexo cs ON cs.fkInfoConcluintes = k.idInfoConcluintes
            GROUP BY k.fkInfoCurso
        ) k ON k.fkInfoCurso = c.idInfoCurso
        WHERE u.fkInstituicao = ? ${filtro.sql}
        GROUP BY c.ano
        ORDER BY c.ano;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idInstituicao].concat(filtro.params));
}

function buscarPerfil(idInstituicao, nomeCurso) {
    var filtro = filtroCurso(nomeCurso);
    var filtroAno = filtroCurso(nomeCurso, "c2");

    var instrucaoSql = `
        SELECT
            SUM(COALESCE(mi.matriculas0a17, 0)) AS idade_0_17,
            SUM(COALESCE(mi.matriculas18a24, 0)) AS idade_18_24,
            SUM(COALESCE(mi.matriculas25a29, 0)) AS idade_25_29,
            SUM(COALESCE(mi.matriculas30a34, 0)) AS idade_30_34,
            SUM(COALESCE(mi.matriculas35a39, 0)) AS idade_35_39,
            SUM(COALESCE(mi.matriculas40a49, 0)) AS idade_40_49,
            SUM(COALESCE(mi.matriculas50a59, 0)) AS idade_50_59,
            SUM(COALESCE(mi.matriculas60Mais, 0)) AS idade_60_mais,
            SUM(COALESCE(mr.branca, 0)) AS etnia_branca,
            SUM(COALESCE(mr.preta, 0)) AS etnia_preta,
            SUM(COALESCE(mr.parda, 0)) AS etnia_parda,
            SUM(COALESCE(mr.amarela, 0)) AS etnia_amarela,
            SUM(COALESCE(mr.indigena, 0)) AS etnia_indigena,
            SUM(COALESCE(mr.naoDeclarada, 0)) AS etnia_nao_declarada,
            SUM(COALESCE(ms.feminino, 0)) AS sexo_feminino,
            SUM(COALESCE(ms.masculino, 0)) AS sexo_masculino,
            SUM(COALESCE(mo.alunosApoioSocial, 0)) AS apoio_com,
            SUM(COALESCE(ms.totalMatriculas, 0) - COALESCE(mo.alunosApoioSocial, 0)) AS apoio_sem,
            SUM(COALESCE(mrd.redePublica, 0)) AS rede_publica,
            SUM(COALESCE(mrd.redePrivada, 0)) AS rede_privada
        FROM info_curso c
        JOIN importacao i ON i.idImportacao = c.fkImportacao
        JOIN usuario u ON u.idUsuario = i.fkUsuario
        LEFT JOIN (
            SELECT m.fkInfoCurso,
                SUM(COALESCE(mi.matriculas0a17, 0)) AS matriculas0a17,
                SUM(COALESCE(mi.matriculas18a24, 0)) AS matriculas18a24,
                SUM(COALESCE(mi.matriculas25a29, 0)) AS matriculas25a29,
                SUM(COALESCE(mi.matriculas30a34, 0)) AS matriculas30a34,
                SUM(COALESCE(mi.matriculas35a39, 0)) AS matriculas35a39,
                SUM(COALESCE(mi.matriculas40a49, 0)) AS matriculas40a49,
                SUM(COALESCE(mi.matriculas50a59, 0)) AS matriculas50a59,
                SUM(COALESCE(mi.matriculas60Mais, 0)) AS matriculas60Mais
            FROM info_matriculas m
            JOIN quantidade_matriculas_idade mi ON mi.fkInfoMatriculas = m.idInfoMatriculas
            GROUP BY m.fkInfoCurso
        ) mi ON mi.fkInfoCurso = c.idInfoCurso
        LEFT JOIN (
            SELECT m.fkInfoCurso,
                SUM(COALESCE(mr.branca, 0)) AS branca,
                SUM(COALESCE(mr.preta, 0)) AS preta,
                SUM(COALESCE(mr.parda, 0)) AS parda,
                SUM(COALESCE(mr.amarela, 0)) AS amarela,
                SUM(COALESCE(mr.indigena, 0)) AS indigena,
                SUM(COALESCE(mr.naoDeclarada, 0)) AS naoDeclarada
            FROM info_matriculas m
            JOIN quantidade_matriculas_raca mr ON mr.fkInfoMatriculas = m.idInfoMatriculas
            GROUP BY m.fkInfoCurso
        ) mr ON mr.fkInfoCurso = c.idInfoCurso
        LEFT JOIN (
            SELECT m.fkInfoCurso,
                SUM(COALESCE(ms.feminino, 0)) AS feminino,
                SUM(COALESCE(ms.masculino, 0)) AS masculino,
                SUM(COALESCE(ms.feminino, 0) + COALESCE(ms.masculino, 0)) AS totalMatriculas
            FROM info_matriculas m
            JOIN quantidade_matriculas_sexo ms ON ms.fkInfoMatriculas = m.idInfoMatriculas
            GROUP BY m.fkInfoCurso
        ) ms ON ms.fkInfoCurso = c.idInfoCurso
        LEFT JOIN (
            SELECT m.fkInfoCurso,
                SUM(COALESCE(mo.alunosApoioSocial, 0)) AS alunosApoioSocial
            FROM info_matriculas m
            JOIN quantidade_matriculas_outros mo ON mo.fkInfoMatriculas = m.idInfoMatriculas
            GROUP BY m.fkInfoCurso
        ) mo ON mo.fkInfoCurso = c.idInfoCurso
        LEFT JOIN (
            SELECT m.fkInfoCurso,
                SUM(COALESCE(mrd.redePublica, 0)) AS redePublica,
                SUM(COALESCE(mrd.redePrivada, 0)) AS redePrivada
            FROM info_matriculas m
            JOIN quantidade_matriculas_rede mrd ON mrd.fkInfoMatriculas = m.idInfoMatriculas
            GROUP BY m.fkInfoCurso
        ) mrd ON mrd.fkInfoCurso = c.idInfoCurso
        WHERE u.fkInstituicao = ?
          AND c.ano = (
              SELECT MAX(c2.ano)
              FROM info_curso c2
              JOIN importacao i2 ON i2.idImportacao = c2.fkImportacao
              JOIN usuario u2 ON u2.idUsuario = i2.fkUsuario
              WHERE u2.fkInstituicao = ? ${filtroAno.sql}
          )
          ${filtro.sql};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(
        instrucaoSql,
        [idInstituicao, idInstituicao].concat(filtroAno.params, filtro.params)
    );
}

module.exports = {
    listarCursos,
    buscarEvolucao,
    buscarPerfil
};
