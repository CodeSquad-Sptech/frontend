CREATE DATABASE Evolua;
USE Evolua;

CREATE TABLE instituicao (
    idInstituicao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    logo VARCHAR(200),
    cnpj CHAR(14),
    uf CHAR(2),
    cidade VARCHAR(45),
    codigo CHAR(10)
);

CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80),
    email VARCHAR(80),
    senha VARCHAR(45),
    administrador TINYINT,
    ativo TINYINT,
    fkInstituicao INT NOT NULL,
    FOREIGN KEY (fkInstituicao) REFERENCES instituicao(idInstituicao)
);

CREATE TABLE configuracao (
    idConfiguracao INT PRIMARY KEY AUTO_INCREMENT,
    fkUsuario INT NOT NULL UNIQUE,
    fotoPerfil VARCHAR(200) DEFAULT 'perfil_padrao.png',
    tamanhoFonte TINYINT DEFAULT 16,
    modoEscuro TINYINT DEFAULT 0,
    FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario)
);

INSERT INTO instituicao (nome, logo, cnpj, uf, cidade, codigo) VALUES
('Escola Evolua Centro', 'logo_centro.png', '12345678000199', 'SP', 'São Paulo', 'EVOLUA01'),
('Colégio Evolua Sul', 'logo_sul.png', '98765432000188', 'RJ', 'Rio de Janeiro', 'EVOLUA02');

INSERT INTO usuario (nome, email, senha, administrador, ativo, fkInstituicao) VALUES
('Teste 0', 'test0@e.com', '123', 0, 1, 1),
('Teste 1', 'test1@e.com', '123', 1, 1, 1),
('Teste 2', 'test2@e.com', '123', 1, 1, 1);

INSERT INTO configuracao (fkUsuario, fotoPerfil, tamanhoFonte, modoEscuro) VALUES
(1, 'perfil_padrao.png', 16, 0),
(2, 'foto_admin1.png', 18, 1),
(3, 'foto_admin2.png', 20, 0);