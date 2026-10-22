CREATE DATABASE evolua;
USE evolua;

CREATE TABLE instituicao (
    idInstituicao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    logo VARCHAR(255),
    cnpj VARCHAR(14) UNIQUE,
    uf VARCHAR(2),
    cidade VARCHAR(100),
    codigo VARCHAR(10),
    dataCadastro DATE,
    imagem VARCHAR(255)
);

CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    administrador INT,
    ativo INT,
    imagem VARCHAR(100),
    fkInstituicao INT NOT NULL,
    CONSTRAINT fkUsuarioInstituicao
        FOREIGN KEY (fkInstituicao) REFERENCES instituicao(idInstituicao)
);

CREATE TABLE importacao (
    idImportacao INT PRIMARY KEY AUTO_INCREMENT,
    nomeArquivo VARCHAR(255),
    dataImportacao DATE,
    fkUsuario INT NOT NULL,
    CONSTRAINT fkImportacaoUsuario
        FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario)
);

CREATE TABLE info_curso (
    idInfoCurso INT PRIMARY KEY AUTO_INCREMENT,
    ano INT,
    nomeCurso VARCHAR(45),
    tipoGrauAcademico VARCHAR(45),
    tipoModalidadeEnsino VARCHAR(45),
    tipoNivelAcademico VARCHAR(45),
    fkImportacao INT NOT NULL,
    CONSTRAINT fkInfoCursoImportacao
        FOREIGN KEY (fkImportacao) REFERENCES importacao(idImportacao)
);

CREATE TABLE info_matriculas (
    idInfoMatriculas INT PRIMARY KEY AUTO_INCREMENT,
    fkInfoCurso INT NOT NULL,
    CONSTRAINT fkInfoMatriculasInfoCurso
        FOREIGN KEY (fkInfoCurso) REFERENCES info_curso(idInfoCurso)
);

CREATE TABLE quantidade_matriculas_idade (
    idQuantidadeMatriculasIdade INT PRIMARY KEY AUTO_INCREMENT,
    matriculas0a17 INT,
    matriculas18a24 INT,
    matriculas25a29 INT,
    matriculas30a34 INT,
    matriculas35a39 INT,
    matriculas40a49 INT,
    matriculas50a59 INT,
    matriculas60Mais INT,
    fkInfoMatriculas INT NOT NULL,
    CONSTRAINT fkQuantidadeMatriculasIdadeInfoMatriculas
        FOREIGN KEY (fkInfoMatriculas) REFERENCES info_matriculas(idInfoMatriculas)
);

CREATE TABLE quantidade_matriculas_raca (
    idQuantidadeMatriculasRaca INT PRIMARY KEY AUTO_INCREMENT,
    branca INT,
    preta INT,
    parda INT,
    amarela INT,
    indigena INT,
    naoDeclarada INT,
    fkInfoMatriculas INT NOT NULL,
    CONSTRAINT fkQuantidadeMatriculasRacaInfoMatriculas
        FOREIGN KEY (fkInfoMatriculas) REFERENCES info_matriculas(idInfoMatriculas)
);

CREATE TABLE quantidade_matriculas_sexo (
    idQuantidadeMatriculasSexo INT PRIMARY KEY AUTO_INCREMENT,
    feminino INT,
    masculino INT,
    fkInfoMatriculas INT NOT NULL,
    CONSTRAINT fkQuantidadeMatriculasSexoInfoMatriculas
        FOREIGN KEY (fkInfoMatriculas) REFERENCES info_matriculas(idInfoMatriculas)
);

CREATE TABLE quantidade_matriculas_turno (
    idQuantidadeMatriculasTurno INT PRIMARY KEY AUTO_INCREMENT,
    diurno INT,
    noturno INT,
    fkInfoMatriculas INT NOT NULL,
    CONSTRAINT fkQuantidadeMatriculasTurnoInfoMatriculas
        FOREIGN KEY (fkInfoMatriculas) REFERENCES info_matriculas(idInfoMatriculas)
);

CREATE TABLE quantidade_matriculas_outros (
    idQuantidadeMatriculasOutros INT PRIMARY KEY AUTO_INCREMENT,
    estrangeiro INT,
    financiamento INT,
    deficiencia INT,
    alunosApoioSocial INT,
    quantidadeAlunosSituacaoTrancada INT,
    fkInfoMatriculas INT NOT NULL,
    CONSTRAINT fkQuantidadeMatriculasOutrosInfoMatriculas
        FOREIGN KEY (fkInfoMatriculas) REFERENCES info_matriculas(idInfoMatriculas)
);

CREATE TABLE quantidade_matriculas_rede (
    idQuantidadeMatriculasRede INT PRIMARY KEY AUTO_INCREMENT,
    redePublica INT,
    redePrivada INT,
    fkInfoMatriculas INT NOT NULL,
    CONSTRAINT fkQuantidadeMatriculasRedeInfoMatriculas
        FOREIGN KEY (fkInfoMatriculas) REFERENCES info_matriculas(idInfoMatriculas)
);

CREATE TABLE info_concluintes (
    idInfoConcluintes INT PRIMARY KEY AUTO_INCREMENT,
    fkInfoCurso INT NOT NULL,
    CONSTRAINT fkInfoConcluintesInfoCurso
        FOREIGN KEY (fkInfoCurso) REFERENCES info_curso(idInfoCurso)
);

CREATE TABLE quantidade_concluintes_idade (
    idQuantidadeConcluintesIdade INT PRIMARY KEY AUTO_INCREMENT,
    concluintes0a17 INT,
    concluintes18a24 INT,
    concluintes25a29 INT,
    concluintes30a34 INT,
    concluintes35a39 INT,
    concluintes40a49 INT,
    concluintes50a59 INT,
    concluintes60Mais INT,
    fkInfoConcluintes INT NOT NULL,
    CONSTRAINT fkQuantidadeConcluintesIdadeInfoConcluintes
        FOREIGN KEY (fkInfoConcluintes) REFERENCES info_concluintes(idInfoConcluintes)
);

CREATE TABLE quantidade_concluintes_outros (
    idQuantidadeConcluintesOutros INT PRIMARY KEY AUTO_INCREMENT,
    estrangeiro INT,
    financiamento INT,
    deficiencia INT,
    fkInfoConcluintes INT NOT NULL,
    CONSTRAINT fkQuantidadeConcluintesOutrosInfoConcluintes
        FOREIGN KEY (fkInfoConcluintes) REFERENCES info_concluintes(idInfoConcluintes)
);

CREATE TABLE quantidade_concluintes_raca (
    idQuantidadeConcluintesRaca INT PRIMARY KEY AUTO_INCREMENT,
    branca INT,
    preta INT,
    parda INT,
    amarela INT,
    indigena INT,
    corNaoDeclarada INT,
    fkInfoConcluintes INT NOT NULL,
    CONSTRAINT fkQuantidadeConcluintesRacaInfoConcluintes
        FOREIGN KEY (fkInfoConcluintes) REFERENCES info_concluintes(idInfoConcluintes)
);

CREATE TABLE quantidade_concluintes_sexo (
    idQuantidadeConcluintesSexo INT PRIMARY KEY AUTO_INCREMENT,
    feminino INT,
    masculino INT,
    fkInfoConcluintes INT NOT NULL,
    CONSTRAINT fkQuantidadeConcluintesSexoInfoConcluintes
        FOREIGN KEY (fkInfoConcluintes) REFERENCES info_concluintes(idInfoConcluintes)
);

CREATE TABLE quantidade_concluintes_turno (
    idQuantidadeConcluintesTurno INT PRIMARY KEY AUTO_INCREMENT,
    diurno INT,
    noturno INT,
    fkInfoConcluintes INT NOT NULL,
    CONSTRAINT fkQuantidadeConcluintesTurnoInfoConcluintes
        FOREIGN KEY (fkInfoConcluintes) REFERENCES info_concluintes(idInfoConcluintes)
);

CREATE TABLE quantidade_concluintes_rede (
    idQuantidadeConcluintesRede INT PRIMARY KEY AUTO_INCREMENT,
    redePublica INT,
    redePrivada INT,
    fkInfoConcluintes INT NOT NULL,
    CONSTRAINT fkQuantidadeConcluintesRedeInfoConcluintes
        FOREIGN KEY (fkInfoConcluintes) REFERENCES info_concluintes(idInfoConcluintes)
);

CREATE TABLE logs (
    idLogs INT PRIMARY KEY AUTO_INCREMENT,
    empresa VARCHAR(45),
    funcionario VARCHAR(45),
    nivel VARCHAR(7),
    mensagem VARCHAR(100),
    dataHora DATE
);
