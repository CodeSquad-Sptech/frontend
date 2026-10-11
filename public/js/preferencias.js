const configuracoes_preferenciais = {
    administradores: "evolua_administradores"
};

function protegerTextoHTML(texto) {
    const elementoTemporario = document.createElement("div");

    elementoTemporario.innerText = texto;

    return elementoTemporario.innerHTML;
}

function aplicarPreferencias() {
    const nomeEmpresa = sessionStorage.NOME_EMPRESA || "EVOLUA";
    const fotoPerfil = sessionStorage.FOTO_PERFIL || "img/pessoa1.png";
    const tema = sessionStorage.TEMA || "claro";
    const tamanhoFonte = sessionStorage.TAMANHO_FONTE || "media";

    const nomeNaBarra = document.querySelector("[data-nome-empresa]");
    const fotoNaBarra = document.querySelector("[data-foto-perfil]");

    if (nomeNaBarra) {
        nomeNaBarra.innerHTML = protegerTextoHTML(nomeEmpresa);
    }

    if (fotoNaBarra) {
        fotoNaBarra.src = fotoPerfil;
    }

    document.body.dataset.tema = tema;
    document.body.dataset.fonte = tamanhoFonte;
}

aplicarPreferencias();
