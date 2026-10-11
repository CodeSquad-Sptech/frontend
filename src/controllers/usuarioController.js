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

function converterTamanhoFonte(tamanhoFonte) {
  if (tamanhoFonte <= 14) {
    return "pequena";
  }

  if (tamanhoFonte <= 16) {
    return "media";
  }

  return "grande";
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
      const modoEscuro = usuario.modoEscuro == 1;

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
        modoEscuro: modoEscuro,
        tema: modoEscuro ? "escuro" : "claro",
        tamanhoFonte: converterTamanhoFonte(usuario.tamanhoFonte || 16)
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
        modoEscuro: resultado[0].modoEscuro == 1,
        tema: resultado[0].modoEscuro == 1 ? "escuro" : "claro",
        tamanhoFonte: converterTamanhoFonte(resultado[0].tamanhoFonte || 16)
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
      return res.json({
        tema: tema,
        modoEscuro: tema == "escuro",
        tamanhoFonte: tamanhoFonte
      });
    })
    .catch(function (erro) {
      console.error(erro);
      return res.status(500).send("Não foi possível salvar as configurações.");
    });
}

function salvarPerfil(req, res) {
  const nomeInstituicao = req.body.nomeInstituicao
    ? req.body.nomeInstituicao.trim() || null
    : null;
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

  if ((nomeInstituicao && nomeInstituicao.length > 45) || !fotoValida) {
    removerFotoEnviada(req.file);
    return res.status(400).send("Confira a foto selecionada e o nome da empresa.");
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
      return res.status(500).send("Não foi possível salvar a foto e o perfil.");
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

  if (senha != confirmacaoSenha) {
    return res.status(400).send("As senhas não são iguais.");
  }

  usuarioModel
    .buscarInstituicaoPorCodigo(codigo)
    .then(function (instituicoes) {
      if (instituicoes.length == 0) {
        res.status(400).send("O código de acesso fornecido é inválido.");
        return null;
      }

      return usuarioModel.cadastrar(
        nome,
        email,
        senha,
        instituicoes[0].idInstituicao
      );
    })
    .then(function (resultadoCadastro) {
      if (!resultadoCadastro) {
        return null;
      }

      return usuarioModel.criarConfiguracao(resultadoCadastro.insertId);
    })
    .then(function (resultadoConfiguracao) {
      if (!resultadoConfiguracao) {
        return;
      }

      return res.status(201).json({ mensagem: "Cadastro realizado!" });
    })
    .catch(function (erro) {
      console.error(erro);
      if (!res.headersSent) {
        return res.status(500).send("Erro no servidor.");
      }
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
