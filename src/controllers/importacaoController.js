const multer = require("multer");
const { Upload } = require("@aws-sdk/lib-storage");
const s3 = require("../config/s3");
const importacaoModel = require("../models/importacaoModel");

const TAMANHO_MAXIMO = 10 * 1024 * 1024; // 10 MB
const TIPO_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const receber = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: TAMANHO_MAXIMO, files: 1 },
    fileFilter: function (req, file, callback) {
        callback(null, file.originalname.toLowerCase().endsWith(".xlsx"));
    }
}).single("arquivo");

function chaveDaImportacao(fkInstituicao, idImportacao) {
    return fkInstituicao + "/importacao-" + idImportacao + ".xlsx";
}

async function enviar(req, res) {
    const arquivo = req.file;

    if (!arquivo || arquivo.buffer.subarray(0, 2).toString() !== "PK") {
        return res.status(400).send("Envie um arquivo .xlsx de até 10 MB.");
    }

    if (!process.env.S3_BUCKET) {
        console.error("S3_BUCKET não está definido no .env");
        return res.status(500).send("Armazenamento não configurado.");
    }

    try {
        const resultado = await importacaoModel.registrar(
            arquivo.originalname.slice(0, 255),
            req.sessao.idUsuario
        );
        const idImportacao = resultado.insertId;

        try {
            await new Upload({
                client: s3,
                params: {
                    Bucket: process.env.S3_BUCKET,
                    Key: chaveDaImportacao(req.sessao.fkInstituicao, idImportacao),
                    Body: arquivo.buffer,
                    ContentType: TIPO_XLSX
                }
            }).done();
        } catch (erro) {
            await importacaoModel.remover(idImportacao);
            throw erro;
        }

        return res.status(201).json({ mensagem: "Arquivo enviado.", id: idImportacao });
    } catch (erro) {
        console.error("Erro ao enviar para o S3:", erro);
        return res.status(500).send("Não foi possível enviar o arquivo.");
    }
}

async function listar(req, res) {
    try {
        const importacoes = await importacaoModel.listarPorInstituicao(req.sessao.fkInstituicao);
        return res.json(importacoes);
    } catch (erro) {
        console.error("Erro ao listar importações:", erro);
        return res.status(500).send("Não foi possível listar os arquivos.");
    }
}

module.exports = { receber, enviar, listar, chaveDaImportacao };
