const database = require("../config/config");


function filtroCurso(nomeCurso) {
    if (nomeCurso == undefined || nomeCurso == "" || nomeCurso == "todos") {
        return "";
    }
   
    return `AND nome_curso = '${nomeCurso.replace(/'/g, "''")}'`;
}


function listarCursos() {
    var instrucaoSql = `
        SELECT DISTINCT nome_curso FROM curso ORDER BY nome_curso;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function buscarEvolucao(nomeCurso) {
    var instrucaoSql = `
        SELECT ano,
            SUM(quantidade_matriculas_feminino + quantidade_matriculas_masculino) AS matriculas,
            SUM(quantidade_alunos_situacao_trancada) AS trancadas,
            SUM(quantidade_concluintes_feminino + quantidade_concluintes_masculino) AS concluintes
        FROM curso
        WHERE 1 = 1 ${filtroCurso(nomeCurso)}
        GROUP BY ano
        ORDER BY ano;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function buscarPerfil(nomeCurso) {
    var instrucaoSql = `
        SELECT
            SUM(quantidade_matriculas_0_17 - quantidade_concluintes_0_17) AS idade_0_17,
            SUM(quantidade_matriculas_18_24 - quantidade_concluintes_18_24) AS idade_18_24,
            SUM(quantidade_matriculas_25_29 - quantidade_concluintes_25_29) AS idade_25_29,
            SUM(quantidade_matriculas_30_34 - quantidade_concluintes_30_34) AS idade_30_34,
            SUM(quantidade_matriculas_35_39 - quantidade_concluintes_35_39) AS idade_35_39,
            SUM(quantidade_matriculas_40_49 - quantidade_concluintes_40_49) AS idade_40_49,
            SUM(quantidade_matriculas_50_59 - quantidade_concluintes_50_59) AS idade_50_59,
            SUM(quantidade_matriculas_60_mais - quantidade_concluintes_60_mais) AS idade_60_mais,
            SUM(quantidade_matriculas_branca - quantidade_concluintes_branca) AS etnia_branca,
            SUM(quantidade_matriculas_preta - quantidade_concluintes_preta) AS etnia_preta,
            SUM(quantidade_matriculas_parda - quantidade_concluintes_parda) AS etnia_parda,
            SUM(quantidade_matriculas_amarela - quantidade_concluintes_amarela) AS etnia_amarela,
            SUM(quantidade_matriculas_indigena - quantidade_concluintes_indigena) AS etnia_indigena,
            SUM(quantidade_matriculas_cor_nao_declarada - quantidade_concluintes_cor_nao_declarada) AS etnia_nao_declarada,
            SUM(quantidade_matriculas_feminino - quantidade_concluintes_feminino) AS sexo_feminino,
            SUM(quantidade_matriculas_masculino - quantidade_concluintes_masculino) AS sexo_masculino
        FROM curso
        WHERE ano = (SELECT MAX(ano) FROM curso) ${filtroCurso(nomeCurso)};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarCursos,
    buscarEvolucao,
    buscarPerfil
};