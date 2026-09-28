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

INSERT INTO instituicao (nome, logo, cnpj, uf, cidade, codigo) VALUES
('Escola Evolua Centro', 'logo_centro.png', '12345678000199', 'SP', 'São Paulo', 'EVOLUA01'),
('Colégio Evolua Sul', 'logo_sul.png', '98765432000188', 'RJ', 'Rio de Janeiro', 'EVOLUA02');

 
CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80),
    email VARCHAR(80),
    senha VARCHAR(45),
    confirmacaoSenha VARCHAR(45),
    administrador TINYINT,
    ativo TINYINT,
    fkInstituicao INT NOT NULL,
    FOREIGN KEY (fkInstituicao) REFERENCES instituicao(idInstituicao)
);
