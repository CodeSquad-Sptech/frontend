const database = require("../config/config");

const JUNCOES_BASE = `
    FROM info_curso c
    JOIN importacao i ON i.idImportacao = c.fkImportacao
    JOIN usuario u ON u.idUsuario = i.fkUsuario
    JOIN info_matriculas m ON m.fkInfoCurso = c.idInfoCurso
    JOIN info_concluintes k ON k.fkInfoCurso = c.idInfoCurso
`;


function filtroCurso(nomeCurso) {
    if (nomeCurso == undefined || nomeCurso == "" || nomeCurso == "todos") {
        return { sql: "", params: [] };
    }

    return { sql: "AND c.nomeCurso = ?", params: [nomeCurso] };
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
            SUM(ms.feminino + ms.masculino) AS matriculas,
            COALESCE(SUM(mo.quantidadeAlunosSituacaoTrancada), 0) AS trancadas,
            SUM(cs.feminino + cs.masculino) AS concluintes
        ${JUNCOES_BASE}
        JOIN quantidade_matriculas_sexo ms ON ms.fkInfoMatriculas = m.idInfoMatriculas
        JOIN quantidade_matriculas_outros mo ON mo.fkInfoMatriculas = m.idInfoMatriculas
        JOIN quantidade_concluintes_sexo cs ON cs.fkInfoConcluintes = k.idInfoConcluintes
        WHERE u.fkInstituicao = ? ${filtro.sql}
        GROUP BY c.ano
        ORDER BY c.ano;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idInstituicao].concat(filtro.params));
}



function buscarPerfil(idInstituicao, nomeCurso) {
    var filtro = filtroCurso(nomeCurso);

    var instrucaoSql = `
        SELECT
            SUM(mi.matriculas0a17 - ci.concluintes0a17) AS idade_0_17,
            SUM(mi.matriculas18a24 - ci.concluintes18a24) AS idade_18_24,
            SUM(mi.matriculas25a29 - ci.concluintes25a29) AS idade_25_29,
            SUM(mi.matriculas30a34 - ci.concluintes30a34) AS idade_30_34,
            SUM(mi.matriculas35a39 - ci.concluintes35a39) AS idade_35_39,
            SUM(mi.matriculas40a49 - ci.concluintes40a49) AS idade_40_49,
            SUM(mi.matriculas50a59 - ci.concluintes50a59) AS idade_50_59,
            SUM(mi.matriculas60Mais - ci.concluintes60Mais) AS idade_60_mais,
            SUM(mr.branca - cr.branca) AS etnia_branca,
            SUM(mr.preta - cr.preta) AS etnia_preta,
            SUM(mr.parda - cr.parda) AS etnia_parda,
            SUM(mr.amarela - cr.amarela) AS etnia_amarela,
            SUM(mr.indigena - cr.indigena) AS etnia_indigena,
            SUM(mr.naoDeclarada - cr.corNaoDeclarada) AS etnia_nao_declarada,
            SUM(ms.feminino - cs.feminino) AS sexo_feminino,
            SUM(ms.masculino - cs.masculino) AS sexo_masculino
        ${JUNCOES_BASE}
        JOIN quantidade_matriculas_idade mi ON mi.fkInfoMatriculas = m.idInfoMatriculas
        JOIN quantidade_concluintes_idade ci ON ci.fkInfoConcluintes = k.idInfoConcluintes
        JOIN quantidade_matriculas_raca mr ON mr.fkInfoMatriculas = m.idInfoMatriculas
        JOIN quantidade_concluintes_raca cr ON cr.fkInfoConcluintes = k.idInfoConcluintes
        JOIN quantidade_matriculas_sexo ms ON ms.fkInfoMatriculas = m.idInfoMatriculas
        JOIN quantidade_concluintes_sexo cs ON cs.fkInfoConcluintes = k.idInfoConcluintes
        WHERE u.fkInstituicao = ?
          AND c.ano = (
              SELECT MAX(c2.ano)
              FROM info_curso c2
              JOIN importacao i2 ON i2.idImportacao = c2.fkImportacao
              JOIN usuario u2 ON u2.idUsuario = i2.fkUsuario
              WHERE u2.fkInstituicao = ?
          )
          ${filtro.sql};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idInstituicao, idInstituicao].concat(filtro.params));
}

module.exports = {
    listarCursos,
    buscarEvolucao,
    buscarPerfil
};