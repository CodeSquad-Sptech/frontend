const anotacaoModel = require("../models/anotacaoModel");

function validarDados(req) {
    const { titulo, dataAnotacao, texto, fkInfoCurso } = req.body;
    if (typeof titulo !== "string" || !titulo.trim() ||
        typeof dataAnotacao !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dataAnotacao) ||
        typeof texto !== "string" || !texto.trim()) {
        return null;
    }

    let curso = null;
    if (fkInfoCurso !== null && fkInfoCurso !== undefined && fkInfoCurso !== "") {
        curso = Number(fkInfoCurso);
        if (!Number.isInteger(curso) || curso <= 0) return null;
    }

    return { titulo: titulo.trim(), dataAnotacao, texto: texto.trim(), fkInfoCurso: curso };
}

function listarCursos(req, res) {
    anotacaoModel.listarCursos(req.sessao.fkInstituicao)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error("Erro ao listar cursos para anotações:", erro);
            res.status(500).send("Não foi possível listar os cursos.");
        });
}

function listar(req, res) {
    anotacaoModel.listarPorUsuario(req.sessao.idUsuario)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.error("Erro ao listar anotações:", erro);
            res.status(500).send("Não foi possível listar as anotações.");
        });
}

async function criar(req, res) {
    const dados = validarDados(req);
    if (!dados) return res.status(400).send("Preencha título, data e texto corretamente.");

    try {
        if (dados.fkInfoCurso !== null) {
            const curso = await anotacaoModel.cursoPertenceInstituicao(
                dados.fkInfoCurso, req.sessao.fkInstituicao
            );
            if (curso.length === 0) return res.status(400).send("Curso inválido.");
        }
        const resultado = await anotacaoModel.criar(
            req.sessao.idUsuario, dados.titulo, dados.dataAnotacao,
            dados.fkInfoCurso, dados.texto
        );
        return res.status(201).json({ idAnotacao: resultado.insertId, mensagem: "Anotação criada." });
    } catch (erro) {
        console.error("Erro ao criar anotação:", erro);
        return res.status(500).send("Não foi possível criar a anotação.");
    }
}

async function atualizar(req, res) {
    const id = Number(req.params.id);
    const dados = validarDados(req);
    if (!Number.isInteger(id) || id <= 0 || !dados) {
        return res.status(400).send("Dados inválidos.");
    }

    try {
        if (dados.fkInfoCurso !== null) {
            const curso = await anotacaoModel.cursoPertenceInstituicao(
                dados.fkInfoCurso, req.sessao.fkInstituicao
            );
            if (curso.length === 0) return res.status(400).send("Curso inválido.");
        }
        const resultado = await anotacaoModel.atualizar(
            id, req.sessao.idUsuario, dados.titulo, dados.dataAnotacao,
            dados.fkInfoCurso, dados.texto
        );
        if (resultado.affectedRows === 0) return res.status(404).send("Anotação não encontrada.");
        return res.status(200).json({ mensagem: "Anotação atualizada." });
    } catch (erro) {
        console.error("Erro ao atualizar anotação:", erro);
        return res.status(500).send("Não foi possível atualizar a anotação.");
    }
}

function deletar(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).send("Identificador inválido.");

    anotacaoModel.deletar(id, req.sessao.idUsuario)
        .then(resultado => {
            if (resultado.affectedRows === 0) return res.status(404).send("Anotação não encontrada.");
            return res.status(200).json({ mensagem: "Anotação excluída." });
        })
        .catch(erro => {
            console.error("Erro ao excluir anotação:", erro);
            res.status(500).send("Não foi possível excluir a anotação.");
        });
}

module.exports = { listarCursos, listar, criar, atualizar, deletar };
