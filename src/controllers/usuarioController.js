const usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
  const email = req.body.emailServer;
  const senha = req.body.senhaServer;

  if (!email || !senha) {
    return res.status(400).send("Dados inválidos.");
  }

  usuarioModel
    .autenticar(email, senha)
    .then(function (resultadoAutenticar) {
      if (resultadoAutenticar.length !== 1) {
        return res.status(403).send("Login inválido.");
      }

      return res.json({
        id: resultadoAutenticar[0].idUsuario,
        email: resultadoAutenticar[0].email,
        nome: resultadoAutenticar[0].nome,
      });
    })
    .catch(function (erro) {
      console.error(erro);
      return res.status(500).send("Erro no servidor.");
    });
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
      if (instituicoes.length === 0) {
        return res.status(400).send("Dados inválidos.");
      }

      return usuarioModel
        .cadastrar(nome, email, senha, confirmacaoSenha, codigo)
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
  cadastrar,
};
