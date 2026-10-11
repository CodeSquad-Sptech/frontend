const usuarioModel = require("../models/usuarioModel");
const fs = require("fs");
const sessoes = require("../config/sessoes");

function removerFotoEnviada(arquivo) {
  if (arquivo) {
    fs.unlink(arquivo.path, function (erro) {
      if (erro) {
        console.error("Não foi possível remover a foto não salva:", erro);
      }
    });
  }
}

function autenticar(req, res) {
  const email = req.body.emailServer;
  const senha = req.body.senhaServer;

  if (!email || !senha) {
    return res.status(400).send("Dados inválidos.");
  }

  usuarioModel
    .autenticar(email, senha)
    .then(function (usuarios) {
      if (usuarios.length !== 1) {
        return res.status(403).send("Login inválido.");
      }

      const usuario = usuarios[0];
      const token = sessoes.criarSessao(usuario);

      res.setHeader(
        "Set-Cookie",
        "evolua_sessao=" + token + "; HttpOnly; SameSite=Lax; Path=/; Max-Age=" +
          (sessoes.DURACAO_SESSAO / 1000)
      );

      return res.json({
        id: usuario.idUsuario,
        email: usuario.email,
        nome: usuario.nome,
        administrador: usuario.administrador,
        nomeInstituicao: usuario.nomeInstituicao,
        fotoPerfil: usuario.fotoPerfil || "img/pessoa1.png",
        tema: usuario.tema || "claro",
        tamanhoFonte: usuario.tamanhoFonte || "media"
      });
    })
    .catch(function (erro) {
      console.error(erro);
      return res.status(500).send("Erro no servidor.");
    });
}

function obterConfiguracoes(req, res) {
  usuarioModel
    .obterConfiguracoes(req.sessao.idUsuario)
    .then(function (resultado) {
      if (resultado.length == 0) {
        return res.status(404).send("Usuário não encontrado.");
      }

      return res.json({
        nomeInstituicao: resultado[0].nomeInstituicao,
        fotoPerfil: resultado[0].fotoPerfil || "img/pessoa1.png",
        tema: resultado[0].tema || "claro",
        tamanhoFonte: resultado[0].tamanhoFonte || "media"
      });
    })
    .catch(function (erro) {
      console.error(erro);
      return res.status(500).send("Não foi possível carregar as configurações.");
    });
}

function salvarPreferencias(req, res) {
  const tema = req.body.tema;
  const tamanhoFonte = req.body.tamanhoFonte;
  const temasValidos = ["claro", "escuro"];
  const tamanhosValidos = ["pequena", "media", "grande"];

  if (!temasValidos.includes(tema) || !tamanhosValidos.includes(tamanhoFonte)) {
    return res.status(400).send("Escolha um tema e um tamanho de fonte válidos.");
  }

  usuarioModel
    .salvarPreferencias(req.sessao.idUsuario, tema, tamanhoFonte)
    .then(function () {
      return res.json({ tema: tema, tamanhoFonte: tamanhoFonte });
    })
    .catch(function (erro) {
      console.error(erro);
      return res.status(500).send("Não foi possível salvar as configurações.");
    });
}

function salvarPerfil(req, res) {
  const nomeInstituicao = req.body.nomeInstituicao && req.body.nomeInstituicao.trim();
  const fotoPerfil = req.file
    ? "/uploads/perfil/" + req.file.filename
    : req.body.fotoPerfil;
  const fotosDisponiveis = [
    "img/pessoa1.png",
    "img/pessoa2.png",
    "img/pessoa3.png"
  ];
  const fotoValida = fotosDisponiveis.includes(fotoPerfil) ||
    /^\/uploads\/perfil\/[a-f0-9-]+\.(jpg|png|webp)$/.test(fotoPerfil || "");

  if (!nomeInstituicao || nomeInstituicao.length > 45 || !fotoValida) {
    removerFotoEnviada(req.file);
    return res.status(400).send("Confira o nome da empresa e a foto selecionada.");
  }

  usuarioModel
    .salvarPerfil(req.sessao.idUsuario, nomeInstituicao, fotoPerfil)
    .then(function () {
      return res.json({
        nomeInstituicao: nomeInstituicao,
        fotoPerfil: fotoPerfil
      });
    })
    .catch(function (erro) {
      removerFotoEnviada(req.file);
      console.error(erro);
      return res.status(500).send("Não foi possível salvar o perfil e a empresa.");
    });
}

function sair(req, res) {
  const sessao = sessoes.buscarSessao(req);

  if (sessao) {
    sessoes.encerrarSessao(sessao.token);
  }

  res.setHeader("Set-Cookie", "evolua_sessao=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
  return res.status(204).end();
}

function cadastrar(req, res) {
  const nome = req.body.nomeServer;
  const email = req.body.emailServer;
  const senha = req.body.senhaServer;
  const confirmacaoSenha = req.body.confirmacaoSenhaServer;
  const codigo = req.body.codigoServer;

  if (!nome || !email || !senha || !confirmacaoSenha || !codigo) {
    return res.status(400).send("Dados inválidos.");
  }

  usuarioModel
    .verificarCodigoInstituicao(codigo)
    .then(function (instituicoes) {
      if (instituicoes.length == 0) {
        return res.status(400).send("Dados inválidos.");
      }

      return usuarioModel
        .cadastrar(nome, email, senha, confirmacaoSenha, codigo)
        .then(function (resultadoCadastro) {
          return usuarioModel.criarConfiguracao(resultadoCadastro.insertId);
        })
        .then(function () {
          return res.status(201).send("Cadastro criado com sucesso.");
        });
    })
    .catch(function (erro) {
      console.error(erro);
      return res.status(500).send("Erro no servidor.");
    });
}

module.exports = {
  autenticar,
  obterConfiguracoes,
  salvarPerfil,
  salvarPreferencias,
  sair,
  cadastrar
};
