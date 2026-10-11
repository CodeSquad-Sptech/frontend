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
let fotoSelecionada = sessionStorage.FOTO_PERFIL || "img/pessoa1.png";
let arquivoFotoSelecionado = null;

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

function carregarCamposConfiguracao(configuracoes) {
    sessionStorage.NOME_EMPRESA = configuracoes.nomeInstituicao || "EVOLUA";
    sessionStorage.FOTO_PERFIL = configuracoes.fotoPerfil || "img/pessoa1.png";
    sessionStorage.TEMA = configuracoes.tema || "claro";
    sessionStorage.TAMANHO_FONTE = configuracoes.tamanhoFonte || "media";

    campoNomeEmpresa.value = sessionStorage.NOME_EMPRESA;
    campoTema.value = sessionStorage.TEMA;
    campoTamanhoFonte.value = sessionStorage.TAMANHO_FONTE;
    fotoSelecionada = sessionStorage.FOTO_PERFIL;
    mostrarFotoSelecionada(fotoSelecionada);
    aplicarPreferencias();
}

async function carregarConfiguracoes() {
    try {
        const resposta = await fetch("/usuarios/configuracoes");

        if (!resposta.ok) {
            throw new Error(await resposta.text());
        }

        carregarCamposConfiguracao(await resposta.json());
    } catch (erro) {
        console.error("Erro ao carregar configurações:", erro);
        mensagemPerfil.innerHTML = protegerTextoHTML(
            erro.message || "Não foi possível carregar as configurações."
        );
    }
}

function clicarNasOpcoesDeFoto(evento) {
    const botaoFoto = evento.target.closest("[data-foto]");

    if (botaoFoto) {
        fotoSelecionada = botaoFoto.dataset.foto;
        arquivoFotoSelecionado = null;
        campoFoto.value = "";
        mostrarFotoSelecionada(fotoSelecionada);
        mensagemPerfil.innerHTML = "Foto selecionada. Clique em Salvar para aplicar.";
    }
}

function escolherFoto() {
    const arquivo = campoFoto.files[0];
    mensagemPerfil.innerHTML = "";

    if (!arquivo) {
        return;
    }

    if (arquivo.size > 2 * 1024 * 1024) {
        mensagemPerfil.innerHTML = "A imagem deve ter no máximo 2 MB.";
        campoFoto.value = "";
        return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
        mensagemPerfil.innerHTML = "Use uma imagem JPG, PNG ou WebP.";
        campoFoto.value = "";
        return;
    }

    arquivoFotoSelecionado = arquivo;
    fotoSelecionada = null;
    mostrarFotoSelecionada("foto-enviada");
    mensagemPerfil.innerHTML = "Foto selecionada. Clique em Salvar para aplicar.";
}

async function salvarPerfilEmpresa(evento) {
    evento.preventDefault();
    botaoSalvarPerfil.disabled = true;
    mensagemPerfil.innerHTML = "";

    const dados = new FormData();
    dados.append("nomeInstituicao", campoNomeEmpresa.value.trim());

    if (arquivoFotoSelecionado) {
        dados.append("foto", arquivoFotoSelecionado);
    } else {
        dados.append("fotoPerfil", fotoSelecionada);
    }

    try {
        const resposta = await fetch("/usuarios/configuracoes/perfil", {
            method: "PUT",
            body: dados
        });

        if (!resposta.ok) {
            throw new Error(await resposta.text());
        }

        const resultado = await resposta.json();
        sessionStorage.NOME_EMPRESA = resultado.nomeInstituicao;
        sessionStorage.FOTO_PERFIL = resultado.fotoPerfil;
        fotoSelecionada = resultado.fotoPerfil;
        arquivoFotoSelecionado = null;
        campoFoto.value = "";
        mostrarFotoSelecionada(fotoSelecionada);
        aplicarPreferencias();
        mensagemPerfil.innerHTML = "Perfil e empresa salvos.";
    } catch (erro) {
        console.error("Erro ao salvar perfil e empresa:", erro);
        mensagemPerfil.innerHTML = protegerTextoHTML(
            erro.message || "Não foi possível salvar o perfil e a empresa."
        );
    } finally {
        botaoSalvarPerfil.disabled = false;
    }
}

async function salvarAparencia(evento) {
    evento.preventDefault();
    mensagemAparencia.innerHTML = "";

    try {
        const resposta = await fetch("/usuarios/configuracoes/aparencia", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tema: campoTema.value,
                tamanhoFonte: campoTamanhoFonte.value
            })
        });

        if (!resposta.ok) {
            throw new Error(await resposta.text());
        }

        const resultado = await resposta.json();
        sessionStorage.TEMA = resultado.tema;
        sessionStorage.TAMANHO_FONTE = resultado.tamanhoFonte;
        aplicarPreferencias();
        mensagemAparencia.innerHTML = "Aparência salva.";
    } catch (erro) {
        console.error("Erro ao salvar a aparência:", erro);
        mensagemAparencia.innerHTML = protegerTextoHTML(
            erro.message || "Não foi possível salvar a aparência."
        );
    }
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
        nome.innerHTML = protegerTextoHTML(administrador.nome);
        email.innerHTML = protegerTextoHTML(administrador.email);
        botaoRemover.type = "button";
        botaoRemover.className = "botao-remover";
        botaoRemover.innerHTML = "Remover";
        botaoRemover.dataset.indice = indice;
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

    const nome = campoNomeAdministrador.value.trim();
    const email = campoEmailAdministrador.value.trim().toLowerCase();
    const administradores = carregarAdministradores();

    if (emailJaCadastrado(administradores, email)) {
        mensagemAdministrador.innerHTML = "Esse e-mail já está na lista.";
        return;
    }

    administradores.push({ nome: nome, email: email });
    salvarAdministradores(administradores);
    formularioAdministrador.reset();
    mensagemAdministrador.innerHTML = "Administrador adicionado somente neste navegador.";
}

opcoesFoto.addEventListener("click", clicarNasOpcoesDeFoto);
campoFoto.addEventListener("change", escolherFoto);
formularioPerfilEmpresa.addEventListener("submit", salvarPerfilEmpresa);
formularioAparencia.addEventListener("submit", salvarAparencia);
listaAdministradores.addEventListener("click", clicarNaListaDeAdministradores);
formularioAdministrador.addEventListener("submit", adicionarAdministrador);
mostrarAdministradores();
carregarConfiguracoes();
