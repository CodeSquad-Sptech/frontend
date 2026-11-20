const listaAnotacoes = document.getElementById("listaAnotacoes");
const mensagemAnotacoes = document.getElementById("mensagemAnotacoes");
const modalDetalhes = document.getElementById("modalDetalhes");
const modalFormulario = document.getElementById("modalFormulario");
const formAnotacao = document.getElementById("formAnotacao");
const campoTitulo = document.getElementById("campoTitulo");
const campoData = document.getElementById("campoData");
const campoCurso = document.getElementById("campoCurso");
const campoTexto = document.getElementById("campoTexto");
const erroFormulario = document.getElementById("erroFormulario");

let anotacoes = [];
let anotacaoSelecionada = null;
let modoEdicao = false;

function sessaoExpirada(resposta) {
    if (resposta.status === 401) {
        window.location.href = "./login.html";
        return true;
    }
    return false;
}

function formatarData(data) {
    if (!data) return "";
    const parteData = String(data).slice(0, 10).split("-");
    return parteData.length === 3 ? parteData[2] + "/" + parteData[1] + "/" + parteData[0] : data;
}

function carregarCursos() {
    fetch("/anotacoes/cursos")
        .then(function (resposta) {
            if (sessaoExpirada(resposta)) return;
            if (!resposta.ok) throw new Error("Não foi possível carregar os cursos.");
            return resposta.json();
        })
        .then(function (cursos) {
            if (!cursos) return;
            cursos.forEach(function (curso) {
                const opcao = document.createElement("option");
                opcao.value = curso.idInfoCurso;
                opcao.textContent = curso.nomeCurso;
                campoCurso.appendChild(opcao);
            });
        })
        .catch(function (erro) {
            console.error(erro);
            mensagemAnotacoes.textContent = "Não foi possível carregar os cursos relacionados.";
        });
}

function carregarAnotacoes() {
    fetch("/anotacoes")
        .then(function (resposta) {
            if (sessaoExpirada(resposta)) return;
            if (!resposta.ok) throw new Error("Não foi possível carregar as anotações.");
            return resposta.json();
        })
        .then(function (dados) {
            if (!dados) return;
            anotacoes = dados;
            renderizarAnotacoes();
        })
        .catch(function (erro) {
            console.error(erro);
            mensagemAnotacoes.textContent = "Ocorreu um erro ao carregar suas anotações.";
        });
}

function renderizarAnotacoes() {
    listaAnotacoes.innerHTML = "";
    mensagemAnotacoes.textContent = anotacoes.length === 0 ? "Você ainda não possui anotações." : "";

    anotacoes.forEach(function (anotacao) {
        const card = document.createElement("article");
        card.className = "card-anotacao";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "Abrir anotação " + anotacao.titulo);

        const titulo = document.createElement("h3");
        titulo.textContent = anotacao.titulo;
        const curso = document.createElement("p");
        curso.textContent = "Curso: " + (anotacao.nomeCurso || "Sem referência");
        const data = document.createElement("p");
        data.textContent = "Data: " + formatarData(anotacao.dataAnotacao);

        card.append(titulo, curso, data);
        card.addEventListener("click", function () { abrirDetalhes(anotacao); });
        card.addEventListener("keydown", function (evento) {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                abrirDetalhes(anotacao);
            }
        });
        listaAnotacoes.appendChild(card);
    });
}

function abrirDetalhes(anotacao) {
    anotacaoSelecionada = anotacao;
    document.getElementById("tituloDetalhe").textContent = anotacao.titulo;
    document.getElementById("cursoDetalhe").textContent = "Curso: " + (anotacao.nomeCurso || "Sem referência");
    document.getElementById("dataDetalhe").textContent = "Data: " + formatarData(anotacao.dataAnotacao);
    document.getElementById("textoDetalhe").textContent = anotacao.texto;
    modalDetalhes.hidden = false;
}

function fecharDetalhes() {
    modalDetalhes.hidden = true;
}

function abrirFormulario(anotacao) {
    modoEdicao = Boolean(anotacao);
    document.getElementById("tituloFormulario").textContent = modoEdicao ? "Editar anotação" : "Nova anotação";
    document.getElementById("botaoSalvar").textContent = modoEdicao ? "Salvar alterações" : "Salvar anotação";
    campoTitulo.value = anotacao ? anotacao.titulo : "";
    const hoje = new Date();
    const dataLocal = hoje.getFullYear() + "-" +
        String(hoje.getMonth() + 1).padStart(2, "0") + "-" +
        String(hoje.getDate()).padStart(2, "0");
    campoData.value = anotacao ? String(anotacao.dataAnotacao).slice(0, 10) : dataLocal;
    campoCurso.value = anotacao && anotacao.fkInfoCurso ? String(anotacao.fkInfoCurso) : "";
    campoTexto.value = anotacao ? anotacao.texto : "";
    erroFormulario.textContent = "";
    modalFormulario.hidden = false;
    campoTitulo.focus();
}

function fecharFormulario() {
    modalFormulario.hidden = true;
    formAnotacao.reset();
    erroFormulario.textContent = "";
}

function enviarFormulario(evento) {
    evento.preventDefault();
    const dados = {
        titulo: campoTitulo.value,
        dataAnotacao: campoData.value,
        fkInfoCurso: campoCurso.value || null,
        texto: campoTexto.value
    };
    const url = modoEdicao ? "/anotacoes/" + anotacaoSelecionada.idAnotacao : "/anotacoes";
    const metodo = modoEdicao ? "PUT" : "POST";

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    })
        .then(function (resposta) {
            if (sessaoExpirada(resposta)) return null;
            if (!resposta.ok) {
                return resposta.text().then(function (mensagem) { throw new Error(mensagem); });
            }
            return resposta.json();
        })
        .then(function (resultado) {
            if (!resultado) return;
            fecharFormulario();
            fecharDetalhes();
            carregarAnotacoes();
        })
        .catch(function (erro) {
            erroFormulario.textContent = erro.message || "Não foi possível salvar a anotação.";
        });
}

function deletarAnotacao() {
    if (!anotacaoSelecionada || !window.confirm("Deseja realmente excluir esta anotação?")) return;

    fetch("/anotacoes/" + anotacaoSelecionada.idAnotacao, { method: "DELETE" })
        .then(function (resposta) {
            if (sessaoExpirada(resposta)) return null;
            if (!resposta.ok) {
                return resposta.text().then(function (mensagem) { throw new Error(mensagem); });
            }
            return resposta.json();
        })
        .then(function (resultado) {
            if (!resultado) return;
            fecharDetalhes();
            anotacaoSelecionada = null;
            carregarAnotacoes();
        })
        .catch(function (erro) {
            window.alert(erro.message || "Não foi possível excluir a anotação.");
        });
}

document.getElementById("botaoNovaAnotacao").addEventListener("click", function () { abrirFormulario(null); });
document.getElementById("fecharDetalhes").addEventListener("click", fecharDetalhes);
document.getElementById("botaoEditar").addEventListener("click", function () {
    const anotacao = anotacaoSelecionada;
    fecharDetalhes();
    abrirFormulario(anotacao);
});
document.getElementById("botaoDeletar").addEventListener("click", deletarAnotacao);
document.getElementById("fecharFormulario").addEventListener("click", fecharFormulario);
document.getElementById("cancelarFormulario").addEventListener("click", fecharFormulario);
formAnotacao.addEventListener("submit", enviarFormulario);

[modalDetalhes, modalFormulario].forEach(function (modal) {
    modal.addEventListener("click", function (evento) {
        if (evento.target === modal) modal.hidden = true;
    });
});
document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
        fecharDetalhes();
        fecharFormulario();
    }
});

carregarCursos();
carregarAnotacoes();
