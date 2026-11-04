const campoFoto = document.getElementById("fotoPerfil");
const opcoesFoto = document.getElementById("opcoesFoto");
const opcaoEnviarFoto = document.getElementById("opcaoEnviarFoto");
const formularioPerfilEmpresa = document.getElementById("formPerfilEmpresa");
const campoNomeEmpresa = document.getElementById("nomeEmpresa");
const campoTamanhoFonte = document.getElementById("tamanhoFonte");
const campoTema = document.getElementById("tema");
const formularioAparencia = document.getElementById("formAparencia");
const formularioAdministrador = document.getElementById("formAdministrador");
const listaAdministradores = document.getElementById("listaAdministradores");
const mensagemPerfil = document.getElementById("mensagemPerfil");
const mensagemAparencia = document.getElementById("mensagemAparencia");
const mensagemAdministrador = document.getElementById("mensagemAdministrador");
const campoNomeAdministrador = document.getElementById("nomeAdministrador");
const campoEmailAdministrador = document.getElementById("emailAdministrador");
const botaoSalvarPerfil = document.getElementById("botaoSalvarPerfil");
const usuarioAdministrador =
    sessionStorage.ADMINISTRADOR == "1" ||
    sessionStorage.ADMINISTRADOR == "true";
let fotoSelecionada = sessionStorage.FOTO_PERFIL || "img/usuarioSemFoto.png";
let arquivoFotoSelecionado = null;

function mostrarMensagemConfiguracao(elemento, mensagem) {
    elemento.textContent = mensagem;
    elemento.hidden = !mensagem;
}

function configurarAcessoConfiguracoes() {
    if (usuarioAdministrador) {
        return;
    }

    const cartaoAdministradores = formularioAdministrador.closest(".cartao-configuracao");
    cartaoAdministradores.classList.add("somente-leitura");
    cartaoAdministradores.setAttribute("aria-disabled", "true");
    cartaoAdministradores.querySelectorAll("button, input, select").forEach(function (campo) {
        campo.disabled = true;
    });
}

function mostrarFotoSelecionada(foto) {
    const botoesFoto = opcoesFoto.querySelectorAll("[data-foto]");
    let fotoEncontrada = false;

    for (let indice = 0; indice < botoesFoto.length; indice++) {
        const selecionada = botoesFoto[indice].dataset.foto == foto;
        botoesFoto[indice].setAttribute("aria-pressed", selecionada);

        if (selecionada) {
            fotoEncontrada = true;
        }
    }

    opcaoEnviarFoto.classList.toggle("selecionada", foto && !fotoEncontrada);
}

function atualizarTemaSelecionado() {
    const tema = campoTema.value;

    document.body.dataset.tema = tema;
    atualizarIconesTema(tema);
}

function carregarCamposConfiguracao(configuracoes) {
    sessionStorage.NOME_EMPRESA = configuracoes.nomeInstituicao || "EVOLUA";
    sessionStorage.FOTO_PERFIL = configuracoes.fotoPerfil || "img/usuarioSemFoto.png";
    sessionStorage.TEMA = configuracoes.tema || "claro";
    sessionStorage.TAMANHO_FONTE = configuracoes.tamanhoFonte || "media";

    campoNomeEmpresa.value = sessionStorage.NOME_EMPRESA;
    campoTema.value = sessionStorage.TEMA;
    campoTamanhoFonte.value = sessionStorage.TAMANHO_FONTE;
    fotoSelecionada = sessionStorage.FOTO_PERFIL;
    mostrarFotoSelecionada(fotoSelecionada);
    aplicarPreferencias();
}

function carregarConfiguracoes() {
    fetch("/usuarios/configuracoes")
        .then(function (resposta) {
            if (!resposta.ok) {
                return resposta.text().then(function (mensagem) {
                    throw new Error(mensagem);
                });
            }

            return resposta.json();
        })
        .then(carregarCamposConfiguracao)
        .catch(function (erro) {
            console.error("Erro ao carregar configurações:", erro);
            mostrarMensagemConfiguracao(
                mensagemPerfil,
                erro.message || "Não foi possível carregar as configurações."
            );
        });
}

function clicarNasOpcoesDeFoto(evento) {
    const botaoFoto = evento.target.closest("[data-foto]");

    if (botaoFoto) {
        fotoSelecionada = botaoFoto.dataset.foto;
        arquivoFotoSelecionado = null;
        campoFoto.value = "";
        mostrarFotoSelecionada(fotoSelecionada);
        mostrarMensagemConfiguracao(mensagemPerfil, "");
    }
}

function escolherFoto() {
    const arquivo = campoFoto.files[0];
    mostrarMensagemConfiguracao(mensagemPerfil, "");

    if (!arquivo) {
        return;
    }

    if (arquivo.size > 2 * 1024 * 1024) {
        mostrarMensagemConfiguracao(mensagemPerfil, "A imagem deve ter no máximo 2 MB.");
        campoFoto.value = "";
        return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
        mostrarMensagemConfiguracao(mensagemPerfil, "Use uma imagem JPG, PNG ou WebP.");
        campoFoto.value = "";
        return;
    }

    arquivoFotoSelecionado = arquivo;
    fotoSelecionada = null;
    mostrarFotoSelecionada("foto-enviada");
}

function salvarPerfilEmpresa(evento) {
    evento.preventDefault();

    botaoSalvarPerfil.disabled = true;
    mostrarMensagemConfiguracao(mensagemPerfil, "");

    const dados = new FormData();
    dados.append("nomeInstituicao", campoNomeEmpresa.value.trim());

    if (arquivoFotoSelecionado) {
        dados.append("foto", arquivoFotoSelecionado);
    } else {
        dados.append("fotoPerfil", fotoSelecionada);
    }

    fetch("/usuarios/configuracoes/perfil", {
            method: "PUT",
            body: dados
        })
        .then(function (resposta) {
            if (!resposta.ok) {
                return resposta.text().then(function (mensagem) {
                    throw new Error(mensagem);
                });
            }

            return resposta.json();
        })
        .then(function (resultado) {
            if (resultado.nomeInstituicao) {
                sessionStorage.NOME_EMPRESA = resultado.nomeInstituicao;
            }

            sessionStorage.FOTO_PERFIL = resultado.fotoPerfil;
            fotoSelecionada = resultado.fotoPerfil;
            arquivoFotoSelecionado = null;

            campoFoto.value = "";
            mostrarFotoSelecionada(fotoSelecionada);
            campoNomeEmpresa.value = sessionStorage.NOME_EMPRESA || "";
            aplicarPreferencias();
            mostrarMensagemConfiguracao(mensagemPerfil, "Foto salva.");
        })
        .catch(function (erro) {
            console.error("Erro ao salvar perfil e empresa:", erro);
            mostrarMensagemConfiguracao(
                mensagemPerfil,
                erro.message || "Não foi possível salvar o perfil e a empresa."
            );
        })
        .finally(function () {
            botaoSalvarPerfil.disabled = false;
        });
}

function salvarAparencia(evento) {
    evento.preventDefault();

    mostrarMensagemConfiguracao(mensagemAparencia, "");

    fetch("/usuarios/configuracoes/aparencia", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tema: campoTema.value,
                tamanhoFonte: campoTamanhoFonte.value
            })
        })
        .then(function (resposta) {
            if (!resposta.ok) {
                return resposta.text().then(function (mensagem) {
                    throw new Error(mensagem);
                });
            }

            return resposta.json();
        })
        .then(function (resultado) {
            sessionStorage.TEMA = resultado.tema;
            sessionStorage.MODO_ESCURO = resultado.modoEscuro;
            sessionStorage.TAMANHO_FONTE = resultado.tamanhoFonte;
            aplicarPreferencias();
            mostrarMensagemConfiguracao(mensagemAparencia, "Aparência salva.");
        })
        .catch(function (erro) {
            console.error("Erro ao salvar a aparência:", erro);
            mostrarMensagemConfiguracao(
                mensagemAparencia,
                erro.message || "Não foi possível salvar a aparência."
            );
        });
}

function carregarAdministradores() {
    const dados = localStorage.getItem(configuracoes_preferenciais.administradores);
    return dados ? JSON.parse(dados) : [];
}

function salvarAdministradores(administradores) {
    localStorage.setItem(
        configuracoes_preferenciais.administradores,
        JSON.stringify(administradores)
    );
    mostrarAdministradores();
}

function mostrarAdministradores() {
    listaAdministradores.innerHTML = "";
    const administradores = carregarAdministradores();

    for (let indice = 0; indice < administradores.length; indice++) {
        const administrador = administradores[indice];
        const item = document.createElement("li");
        const nome = document.createElement("strong");
        const email = document.createElement("span");
        const botaoRemover = document.createElement("button");

        item.className = "administrador-item";
        nome.textContent = administrador.nome;
        email.textContent = administrador.email;
        botaoRemover.type = "button";
        botaoRemover.className = "botao-remover";
        botaoRemover.textContent = "Remover";
        botaoRemover.dataset.indice = indice;
        botaoRemover.disabled = !usuarioAdministrador;
        item.append(nome, email, botaoRemover);
        listaAdministradores.appendChild(item);
    }
}

function clicarNaListaDeAdministradores(evento) {
    const botao = evento.target.closest(".botao-remover");

    if (botao) {
        const administradores = carregarAdministradores();
        administradores.splice(Number(botao.dataset.indice), 1);
        salvarAdministradores(administradores);
    }
}

function emailJaCadastrado(administradores, email) {
    for (let indice = 0; indice < administradores.length; indice++) {
        if (administradores[indice].email == email) {
            return true;
        }
    }

    return false;
}

function adicionarAdministrador(evento) {
    evento.preventDefault();

    if (!usuarioAdministrador) {
        return;
    }

    const nome = campoNomeAdministrador.value.trim();
    const email = campoEmailAdministrador.value.trim().toLowerCase();
    const administradores = carregarAdministradores();

    if (emailJaCadastrado(administradores, email)) {
        mostrarMensagemConfiguracao(mensagemAdministrador, "Esse e-mail já está na lista.");
        return;
    }

    administradores.push({ nome: nome, email: email });
    salvarAdministradores(administradores);
    formularioAdministrador.reset();
    mostrarMensagemConfiguracao(
        mensagemAdministrador,
        "Administrador adicionado somente neste navegador."
    );
}

opcoesFoto.addEventListener("click", clicarNasOpcoesDeFoto);
campoFoto.addEventListener("change", escolherFoto);
campoTema.addEventListener("change", atualizarTemaSelecionado);
formularioPerfilEmpresa.addEventListener("submit", salvarPerfilEmpresa);
formularioAparencia.addEventListener("submit", salvarAparencia);
listaAdministradores.addEventListener("click", clicarNaListaDeAdministradores);
formularioAdministrador.addEventListener("submit", adicionarAdministrador);
configurarAcessoConfiguracoes();
mostrarAdministradores();
carregarConfiguracoes();
