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

INSERT INTO instituicao (idInstituicao, nome, cnpj, uf, cidade, codigo, dataCadastro)
VALUES (1, 'Evolua', '00000000000008', 'SP', 'São Paulo', 'GRUPO8', '2020-01-01');

INSERT INTO usuario (idUsuario, nome, email, senha, administrador, ativo, fkInstituicao)
VALUES (1, 'Julia Yamasaki', 'julia.a.yamasaki@sptech.school', '123', 1, 1, 1);
  
-- Importações (1 por ano)
INSERT INTO importacao (idImportacao, nomeArquivo, dataImportacao, fkUsuario) VALUES
(1, 'cursos_2021.xlsx', '2021-12-31', 1),
(2, 'cursos_2022.xlsx', '2022-12-31', 1),
(3, 'cursos_2023.xlsx', '2023-12-31', 1),
(4, 'cursos_2024.xlsx', '2024-12-31', 1);
 
-- Cursos
INSERT INTO info_curso (idInfoCurso, ano, nomeCurso, tipoGrauAcademico, tipoModalidadeEnsino, tipoNivelAcademico, fkImportacao) VALUES
(1, 2021, 'Administração', '1', '1', '1', 1),
(2, 2022, 'Administração', '1', '1', '1', 2),
(3, 2023, 'Administração', '1', '1', '1', 3),
(4, 2024, 'Administração', '1', '1', '1', 4),
(5, 2021, 'Ciências Contábeis', '1', '1', '1', 1),
(6, 2022, 'Ciências Contábeis', '1', '1', '1', 2),
(7, 2023, 'Ciências Contábeis', '1', '1', '1', 3),
(8, 2024, 'Ciências Contábeis', '1', '1', '1', 4),
(9, 2021, 'Pedagogia', '2', '1', '1', 1),
(10, 2022, 'Pedagogia', '2', '1', '1', 2),
(11, 2023, 'Pedagogia', '2', '1', '1', 3),
(12, 2024, 'Pedagogia', '2', '1', '1', 4),
(13, 2021, 'Análise e Desenvolvimento de Sistemas', '3', '2', '1', 1),
(14, 2022, 'Análise e Desenvolvimento de Sistemas', '3', '2', '1', 2),
(15, 2023, 'Análise e Desenvolvimento de Sistemas', '3', '2', '1', 3),
(16, 2024, 'Análise e Desenvolvimento de Sistemas', '3', '2', '1', 4),
(17, 2021, 'Engenharia Civil', '1', '1', '1', 1),
(18, 2022, 'Engenharia Civil', '1', '1', '1', 2),
(19, 2023, 'Engenharia Civil', '1', '1', '1', 3),
(20, 2024, 'Engenharia Civil', '1', '1', '1', 4),
(21, 2021, 'Enfermagem', '1', '1', '1', 1),
(22, 2022, 'Enfermagem', '1', '1', '1', 2),
(23, 2023, 'Enfermagem', '1', '1', '1', 3),
(24, 2024, 'Enfermagem', '1', '1', '1', 4),
(25, 2021, 'Direito', '1', '1', '1', 1),
(26, 2022, 'Direito', '1', '1', '1', 2),
(27, 2023, 'Direito', '1', '1', '1', 3),
(28, 2024, 'Direito', '1', '1', '1', 4),
(29, 2021, 'Psicologia', '1', '1', '1', 1),
(30, 2022, 'Psicologia', '1', '1', '1', 2),
(31, 2023, 'Psicologia', '1', '1', '1', 3),
(32, 2024, 'Psicologia', '1', '1', '1', 4);
 
-- Matrículas
INSERT INTO info_matriculas (idInfoMatriculas, fkInfoCurso) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15),
(16, 16),
(17, 17),
(18, 18),
(19, 19),
(20, 20),
(21, 21),
(22, 22),
(23, 23),
(24, 24),
(25, 25),
(26, 26),
(27, 27),
(28, 28),
(29, 29),
(30, 30),
(31, 31),
(32, 32);
 
-- Concluintes
INSERT INTO info_concluintes (idInfoConcluintes, fkInfoCurso) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12),
(13, 13),
(14, 14),
(15, 15),
(16, 16),
(17, 17),
(18, 18),
(19, 19),
(20, 20),
(21, 21),
(22, 22),
(23, 23),
(24, 24),
(25, 25),
(26, 26),
(27, 27),
(28, 28),
(29, 29),
(30, 30),
(31, 31),
(32, 32);
 
-- Matrículas por idade
INSERT INTO quantidade_matriculas_idade (matriculas0a17, matriculas18a24, matriculas25a29, matriculas30a34, matriculas35a39, matriculas40a49, matriculas50a59, matriculas60Mais, fkInfoMatriculas) VALUES
(3, 168, 98, 58, 47, 29, 13, 4, 1),
(9, 169, 103, 60, 44, 25, 8, 5, 2),
(5, 167, 80, 62, 55, 38, 15, 4, 3),
(10, 168, 92, 54, 50, 33, 15, 4, 4),
(7, 105, 53, 41, 23, 21, 10, 0, 5),
(4, 105, 46, 34, 21, 27, 9, 2, 6),
(4, 95, 58, 29, 27, 22, 7, 4, 7),
(3, 89, 54, 33, 33, 24, 5, 2, 8),
(6, 152, 70, 40, 32, 30, 8, 2, 9),
(7, 120, 73, 40, 29, 24, 14, 3, 10),
(8, 112, 62, 38, 24, 28, 16, 4, 11),
(6, 116, 62, 31, 25, 23, 8, 2, 12),
(1, 131, 74, 42, 25, 19, 5, 3, 13),
(7, 125, 78, 49, 33, 27, 16, 2, 14),
(5, 145, 83, 57, 39, 29, 9, 5, 15),
(6, 168, 100, 52, 55, 28, 11, 6, 16),
(3, 87, 32, 42, 21, 16, 8, 1, 17),
(7, 77, 51, 38, 21, 14, 9, 1, 18),
(9, 86, 55, 32, 18, 17, 4, 2, 19),
(3, 80, 61, 39, 23, 20, 6, 2, 20),
(6, 99, 62, 44, 36, 20, 12, 1, 21),
(4, 120, 72, 38, 22, 24, 8, 4, 22),
(7, 124, 76, 32, 33, 25, 10, 3, 23),
(6, 138, 66, 55, 27, 22, 9, 4, 24),
(9, 167, 82, 53, 30, 21, 14, 4, 25),
(9, 137, 81, 61, 38, 35, 11, 4, 26),
(9, 137, 81, 56, 48, 30, 15, 1, 27),
(5, 168, 80, 52, 34, 26, 15, 5, 28),
(6, 83, 45, 42, 30, 20, 11, 3, 29),
(8, 106, 57, 32, 20, 21, 9, 2, 30),
(3, 119, 63, 36, 28, 26, 7, 1, 31),
(6, 112, 60, 53, 38, 22, 10, 2, 32);
 
-- Matrículas por raça
INSERT INTO quantidade_matriculas_raca (branca, preta, parda, amarela, indigena, naoDeclarada, fkInfoMatriculas) VALUES
(174, 49, 158, 15, 3, 21, 1),
(203, 43, 149, 8, 2, 18, 2),
(195, 40, 167, 6, 3, 15, 3),
(207, 39, 149, 4, 6, 21, 4),
(122, 26, 95, 4, 0, 13, 5),
(117, 24, 87, 3, 4, 13, 6),
(114, 21, 86, 7, 2, 16, 7),
(103, 28, 102, 4, 3, 3, 8),
(149, 27, 128, 15, 4, 17, 9),
(148, 32, 96, 9, 7, 18, 10),
(148, 28, 97, 3, 1, 15, 11),
(133, 21, 105, 3, 2, 9, 12),
(132, 25, 115, 10, 3, 15, 13),
(148, 32, 134, 7, 3, 13, 14),
(174, 30, 144, 4, 8, 12, 15),
(211, 42, 145, 5, 6, 17, 16),
(84, 20, 90, 7, 0, 9, 17),
(104, 30, 75, 2, 3, 4, 18),
(93, 27, 82, 4, 4, 13, 19),
(96, 29, 88, 7, 1, 13, 20),
(127, 20, 107, 8, 1, 17, 21),
(116, 29, 128, 5, 3, 11, 22),
(139, 19, 132, 7, 4, 9, 23),
(136, 33, 145, 1, 2, 10, 24),
(169, 32, 154, 7, 1, 17, 25),
(170, 42, 142, 6, 0, 16, 26),
(173, 53, 121, 5, 7, 18, 27),
(168, 34, 147, 13, 7, 16, 28),
(109, 28, 88, 3, 4, 8, 29),
(109, 27, 96, 6, 1, 16, 30),
(130, 35, 99, 7, 1, 11, 31),
(148, 21, 110, 7, 2, 15, 32);
 
-- Matrículas por sexo
INSERT INTO quantidade_matriculas_sexo (feminino, masculino, fkInfoMatriculas) VALUES
(230, 190, 1),
(233, 190, 2),
(234, 192, 3),
(229, 197, 4),
(136, 124, 5),
(128, 120, 6),
(122, 124, 7),
(132, 111, 8),
(299, 41, 9),
(271, 39, 10),
(252, 40, 11),
(254, 19, 12),
(76, 224, 13),
(71, 266, 14),
(102, 270, 15),
(115, 311, 16),
(77, 133, 17),
(62, 156, 18),
(87, 136, 19),
(83, 151, 20),
(232, 48, 21),
(217, 75, 22),
(253, 57, 23),
(265, 62, 24),
(196, 184, 25),
(200, 176, 26),
(219, 158, 27),
(194, 191, 28),
(196, 44, 29),
(199, 56, 30),
(215, 68, 31),
(240, 63, 32);
 
-- Matrículas por turno
INSERT INTO quantidade_matriculas_turno (diurno, noturno, fkInfoMatriculas) VALUES
(122, 298, 1),
(139, 284, 2),
(131, 295, 3),
(147, 279, 4),
(56, 204, 5),
(76, 172, 6),
(60, 186, 7),
(75, 168, 8),
(138, 202, 9),
(124, 186, 10),
(99, 193, 11),
(110, 163, 12),
(128, 172, 13),
(155, 182, 14),
(188, 184, 15),
(191, 235, 16),
(108, 102, 17),
(102, 116, 18),
(104, 119, 19),
(118, 116, 20),
(136, 144, 21),
(162, 130, 22),
(160, 150, 23),
(185, 142, 24),
(134, 246, 25),
(120, 256, 26),
(121, 256, 27),
(130, 255, 28),
(140, 100, 29),
(144, 111, 30),
(165, 118, 31),
(166, 137, 32);
 
-- Matrículas - outros
INSERT INTO quantidade_matriculas_outros (estrangeiro, financiamento, deficiencia, alunosApoioSocial, quantidadeAlunosSituacaoTrancada, fkInfoMatriculas) VALUES
(2, 109, 7, 76, 15, 1),
(5, 140, 7, 120, 21, 2),
(3, 114, 9, 74, 18, 3),
(3, 128, 11, 112, 20, 4),
(3, 82, 6, 54, 14, 5),
(1, 63, 3, 48, 12, 6),
(0, 82, 7, 47, 8, 7),
(2, 80, 6, 53, 7, 8),
(0, 127, 5, 90, 16, 9),
(3, 106, 6, 85, 16, 10),
(4, 75, 7, 62, 17, 11),
(3, 104, 4, 43, 14, 12),
(0, 113, 9, 81, 12, 13),
(1, 124, 6, 81, 20, 14),
(5, 109, 9, 73, 22, 15),
(6, 139, 7, 105, 14, 16),
(0, 74, 4, 43, 11, 17),
(1, 82, 3, 35, 7, 18),
(3, 56, 7, 44, 7, 19),
(2, 88, 5, 56, 12, 20),
(1, 71, 3, 70, 9, 21),
(0, 115, 8, 48, 11, 22),
(4, 101, 4, 84, 11, 23),
(4, 91, 5, 55, 13, 24),
(5, 97, 11, 69, 19, 25),
(5, 117, 6, 105, 12, 26),
(2, 131, 7, 78, 13, 27),
(1, 121, 4, 64, 21, 28),
(2, 92, 3, 49, 9, 29),
(1, 92, 6, 39, 9, 30),
(0, 91, 8, 55, 9, 31),
(1, 120, 5, 64, 14, 32);
 
-- Matrículas por rede
INSERT INTO quantidade_matriculas_rede (redePublica, redePrivada, fkInfoMatriculas) VALUES
(55, 365, 1),
(48, 375, 2),
(63, 363, 3),
(58, 368, 4),
(28, 232, 5),
(21, 227, 6),
(30, 216, 7),
(28, 215, 8),
(85, 255, 9),
(67, 243, 10),
(76, 216, 11),
(79, 194, 12),
(28, 272, 13),
(19, 318, 14),
(38, 334, 15),
(27, 399, 16),
(57, 153, 17),
(74, 144, 18),
(55, 168, 19),
(70, 164, 20),
(87, 193, 21),
(80, 212, 22),
(98, 212, 23),
(91, 236, 24),
(61, 319, 25),
(58, 318, 26),
(53, 324, 27),
(69, 316, 28),
(36, 204, 29),
(37, 218, 30),
(45, 238, 31),
(51, 252, 32);
 
-- Concluintes por idade
INSERT INTO quantidade_concluintes_idade (concluintes0a17, concluintes18a24, concluintes25a29, concluintes30a34, concluintes35a39, concluintes40a49, concluintes50a59, concluintes60Mais, fkInfoConcluintes) VALUES
(0, 43, 20, 7, 3, 2, 0, 0, 1),
(0, 48, 26, 10, 3, 1, 0, 0, 2),
(0, 51, 16, 12, 8, 3, 1, 0, 3),
(0, 33, 20, 6, 7, 4, 0, 0, 4),
(0, 23, 13, 7, 2, 2, 0, 0, 5),
(0, 19, 8, 5, 1, 0, 0, 0, 6),
(1, 24, 16, 5, 2, 1, 0, 0, 7),
(0, 28, 12, 6, 3, 2, 0, 0, 8),
(0, 34, 14, 8, 3, 3, 0, 0, 9),
(0, 37, 14, 11, 3, 1, 1, 0, 10),
(0, 28, 18, 5, 5, 3, 0, 0, 11),
(0, 23, 14, 5, 3, 2, 0, 0, 12),
(0, 32, 20, 9, 1, 2, 0, 0, 13),
(0, 15, 15, 11, 4, 0, 0, 0, 14),
(0, 23, 16, 8, 1, 1, 0, 0, 15),
(0, 29, 17, 9, 3, 4, 0, 0, 16),
(0, 23, 5, 7, 3, 1, 0, 0, 17),
(0, 20, 8, 7, 2, 0, 0, 0, 18),
(0, 21, 12, 7, 1, 2, 0, 0, 19),
(0, 19, 17, 7, 5, 2, 1, 0, 20),
(0, 12, 12, 8, 8, 2, 1, 0, 21),
(0, 22, 16, 3, 0, 0, 2, 0, 22),
(0, 32, 12, 5, 2, 0, 0, 0, 23),
(1, 24, 10, 7, 0, 1, 1, 0, 24),
(0, 44, 19, 11, 0, 0, 1, 0, 25),
(0, 28, 13, 16, 4, 5, 0, 0, 26),
(0, 31, 14, 4, 3, 5, 1, 0, 27),
(0, 37, 20, 7, 9, 2, 0, 0, 28),
(0, 18, 12, 9, 4, 1, 0, 0, 29),
(0, 30, 15, 5, 0, 2, 0, 0, 30),
(0, 29, 16, 4, 3, 1, 0, 0, 31),
(0, 19, 16, 11, 3, 0, 0, 0, 32);
 
-- Concluintes por raça
INSERT INTO quantidade_concluintes_raca (branca, preta, parda, amarela, indigena, corNaoDeclarada, fkInfoConcluintes) VALUES
(42, 4, 26, 0, 0, 3, 1),
(51, 4, 31, 0, 0, 2, 2),
(51, 3, 35, 0, 0, 2, 3),
(44, 3, 23, 0, 0, 0, 4),
(30, 1, 16, 0, 0, 0, 5),
(20, 1, 12, 0, 0, 0, 6),
(28, 3, 18, 0, 0, 0, 7),
(25, 1, 24, 1, 0, 0, 8),
(36, 0, 23, 2, 0, 1, 9),
(47, 1, 18, 0, 0, 1, 10),
(37, 0, 21, 0, 0, 1, 11),
(23, 1, 23, 0, 0, 0, 12),
(37, 1, 25, 0, 0, 1, 13),
(27, 0, 18, 0, 0, 0, 14),
(27, 1, 21, 0, 0, 0, 15),
(46, 0, 16, 0, 0, 0, 16),
(17, 2, 20, 0, 0, 0, 17),
(21, 3, 13, 0, 0, 0, 18),
(22, 2, 19, 0, 0, 0, 19),
(26, 1, 23, 0, 0, 1, 20),
(27, 0, 15, 0, 0, 1, 21),
(23, 1, 19, 0, 0, 0, 22),
(29, 0, 22, 0, 0, 0, 23),
(25, 2, 16, 0, 0, 1, 24),
(42, 1, 32, 0, 0, 0, 25),
(38, 3, 25, 0, 0, 0, 26),
(36, 1, 21, 0, 0, 0, 27),
(39, 1, 35, 0, 0, 0, 28),
(26, 0, 18, 0, 0, 0, 29),
(33, 1, 18, 0, 0, 0, 30),
(30, 2, 21, 0, 0, 0, 31),
(27, 0, 22, 0, 0, 0, 32);
 
-- Concluintes por sexo
INSERT INTO quantidade_concluintes_sexo (feminino, masculino, fkInfoConcluintes) VALUES
(45, 30, 1),
(59, 29, 2),
(55, 36, 3),
(41, 29, 4),
(28, 19, 5),
(16, 17, 6),
(27, 22, 7),
(26, 25, 8),
(61, 1, 9),
(64, 3, 10),
(58, 1, 11),
(47, 0, 12),
(10, 54, 13),
(3, 42, 14),
(1, 48, 15),
(7, 55, 16),
(12, 27, 17),
(9, 28, 18),
(13, 30, 19),
(10, 41, 20),
(40, 3, 21),
(38, 5, 22),
(48, 3, 23),
(41, 3, 24),
(42, 33, 25),
(36, 30, 26),
(37, 21, 27),
(32, 43, 28),
(39, 5, 29),
(46, 6, 30),
(52, 1, 31),
(44, 5, 32);
 
-- Concluintes por turno
INSERT INTO quantidade_concluintes_turno (diurno, noturno, fkInfoConcluintes) VALUES
(15, 60, 1),
(20, 68, 2),
(17, 74, 3),
(13, 57, 4),
(1, 46, 5),
(5, 28, 6),
(4, 45, 7),
(8, 43, 8),
(19, 43, 9),
(20, 47, 10),
(14, 45, 11),
(14, 33, 12),
(25, 39, 13),
(23, 22, 14),
(29, 20, 15),
(24, 38, 16),
(19, 20, 17),
(22, 15, 18),
(23, 20, 19),
(33, 18, 20),
(25, 18, 21),
(25, 18, 22),
(29, 22, 23),
(28, 16, 24),
(14, 61, 25),
(16, 50, 26),
(18, 40, 27),
(16, 59, 28),
(31, 13, 29),
(35, 17, 30),
(37, 16, 31),
(28, 21, 32);
 
-- Concluintes - outros
INSERT INTO quantidade_concluintes_outros (estrangeiro, financiamento, deficiencia, fkInfoConcluintes) VALUES
(2, 23, 3, 1),
(5, 29, 3, 2),
(3, 30, 4, 3),
(3, 22, 5, 4),
(3, 12, 3, 5),
(1, 11, 1, 6),
(0, 11, 3, 7),
(2, 11, 3, 8),
(0, 20, 2, 9),
(3, 23, 3, 10),
(4, 16, 3, 11),
(3, 13, 2, 12),
(0, 15, 4, 13),
(1, 15, 3, 14),
(5, 14, 4, 15),
(6, 15, 3, 16),
(0, 14, 2, 17),
(1, 10, 1, 18),
(3, 14, 3, 19),
(2, 13, 2, 20),
(1, 13, 1, 21),
(0, 11, 4, 22),
(4, 12, 2, 23),
(4, 14, 2, 24),
(5, 20, 5, 25),
(5, 19, 3, 26),
(2, 17, 3, 27),
(1, 23, 2, 28),
(2, 10, 1, 29),
(1, 14, 3, 30),
(0, 16, 4, 31),
(1, 10, 2, 32);
 
-- Concluintes por rede
INSERT INTO quantidade_concluintes_rede (redePublica, redePrivada, fkInfoConcluintes) VALUES
(0, 75, 1),
(1, 87, 2),
(4, 87, 3),
(0, 70, 4),
(0, 47, 5),
(1, 32, 6),
(0, 49, 7),
(0, 51, 8),
(5, 57, 9),
(5, 62, 10),
(5, 54, 11),
(7, 40, 12),
(0, 64, 13),
(0, 45, 14),
(1, 48, 15),
(0, 62, 16),
(10, 29, 17),
(7, 30, 18),
(8, 35, 19),
(6, 45, 20),
(3, 40, 21),
(10, 33, 22),
(13, 38, 23),
(5, 39, 24),
(7, 68, 25),
(3, 63, 26),
(5, 53, 27),
(5, 70, 28),
(2, 42, 29),
(2, 50, 30),
(3, 50, 31),
(3, 46, 32);