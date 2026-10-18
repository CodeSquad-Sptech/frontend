var dashboardModel = require("../models/dashboardModel");

function listarCursos(req, res) {
    dashboardModel.listarCursos().then(function (resultado) {
        res.status(200).json(resultado);
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao listar os cursos! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarEvolucao(req, res) {
    var curso = req.query.curso;

    dashboardModel.buscarEvolucao(curso).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar a evolução! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarPerfil(req, res) {
    var curso = req.query.curso;

    dashboardModel.buscarPerfil(curso).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado[0]);
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar o perfil! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    listarCursos,
    buscarEvolucao,
    buscarPerfil
};