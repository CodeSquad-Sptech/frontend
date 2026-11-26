const areaEnvioArquivo = document.getElementById("areaEnvioArquivo");
const botaoEscolherArquivo = document.getElementById("botaoEscolherArquivo");
const arquivoUpload = document.getElementById("arquivoUpload");
const mensagemUpload = document.getElementById("mensagemUpload");
const listaArquivos = document.getElementById("listaArquivos");
const usuarioAdministrador =
    sessionStorage.ADMINISTRADOR == "1" ||
    sessionStorage.ADMINISTRADOR == "true";

function mostrarMensagem(mensagem, erro = false) {
    mensagemUpload.textContent = mensagem;
    mensagemUpload.dataset.erro = erro ? "true" : "false";
}

function sessaoExpirada(resposta) {
    if (resposta.status === 401) {
        window.location.href = "./login.html";
        return true;
    }

    return false;
}

function formatarData(valor) {
    if (!valor) {
        return "";
    }

    const data = new Date(valor);
    return Number.isNaN(data.getTime())
        ? String(valor)
        : data.toLocaleDateString("pt-BR");
}

function escaparHtml(valor) {
    const elemento = document.createElement("span");
    elemento.textContent = valor == null ? "" : String(valor);
    return elemento.innerHTML;
}

async function carregarArquivos() {
    try {
        const resposta = await fetch("/importacoes");
        if (sessaoExpirada(resposta)) {
            return;
        }

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os arquivos.");
        }

        const arquivos = await resposta.json();
        if (arquivos.length === 0) {
            listaArquivos.innerHTML = "<p>Nenhum arquivo enviado.</p>";
            return;
        }

        listaArquivos.innerHTML = arquivos.map(function (arquivo) {
            return `
                <div class="arquivo">
                    <div class="icone-arquivo">XLS</div>
                    <div class="informacoes">
                        <strong>${escaparHtml(arquivo.nomeArquivo)}</strong>
                        <span>${escaparHtml(formatarData(arquivo.dataImportacao))}</span>
                        <span>Enviado por ${escaparHtml(arquivo.enviadoPor)}</span>
                    </div>
                    <span class="status">Enviado</span>
                </div>
            `;
        }).join("");
    } catch (erro) {
        listaArquivos.innerHTML = "<p>Não foi possível carregar os arquivos.</p>";
        console.error(erro);
    }
}

async function enviarArquivo(arquivo) {
    if (!arquivo) {
        return;
    }

    if (!arquivo.name.toLowerCase().endsWith(".xlsx")) {
        mostrarMensagem("Selecione um arquivo XLSX.", true);
        return;
    }

    if (arquivo.size > 10 * 1024 * 1024) {
        mostrarMensagem("O arquivo passa de 10 MB.", true);
        return;
    }

    const dados = new FormData();
    dados.append("arquivo", arquivo);

    botaoEscolherArquivo.disabled = true;
    mostrarMensagem("Enviando arquivo...");

    try {
        const resposta = await fetch("/importacoes", {
            method: "POST",
            body: dados
        });

        if (sessaoExpirada(resposta)) {
            return;
        }

        const texto = await resposta.text();
        let resultado = null;
        try {
            resultado = JSON.parse(texto);
        } catch (erro) {
            resultado = null;
        }

        if (!resposta.ok) {
            throw new Error(resultado && resultado.mensagem ? resultado.mensagem : texto);
        }

        mostrarMensagem(resultado.mensagem || "Arquivo enviado.");
        await carregarArquivos();
    } catch (erro) {
        mostrarMensagem(erro.message || "Não foi possível enviar o arquivo.", true);
    } finally {
        botaoEscolherArquivo.disabled = false;
        arquivoUpload.value = "";
    }
}

if (usuarioAdministrador) {
    botaoEscolherArquivo.addEventListener("click", function () {
        arquivoUpload.click();
    });

    arquivoUpload.addEventListener("change", function () {
        enviarArquivo(arquivoUpload.files[0]);
    });

    ["dragenter", "dragover"].forEach(function (eventoNome) {
        areaEnvioArquivo.addEventListener(eventoNome, function (evento) {
            evento.preventDefault();
            areaEnvioArquivo.classList.add("arrastando");
        });
    });

    ["dragleave", "drop"].forEach(function (eventoNome) {
        areaEnvioArquivo.addEventListener(eventoNome, function (evento) {
            evento.preventDefault();
            areaEnvioArquivo.classList.remove("arrastando");
        });
    });

    areaEnvioArquivo.addEventListener("drop", function (evento) {
        enviarArquivo(evento.dataTransfer.files[0]);
    });
}

carregarArquivos();
