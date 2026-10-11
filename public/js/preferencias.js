const configuracoes_preferenciais = {
    administradores: "evolua_administradores"
};

function aplicarPreferencias() {
    const nomeEmpresa = sessionStorage.NOME_EMPRESA || "EVOLUA";
    const fotoPerfil = sessionStorage.FOTO_PERFIL || "img/pessoa1.png";
    const tema = sessionStorage.TEMA ||
        (sessionStorage.MODO_ESCURO == "true" || sessionStorage.MODO_ESCURO == "1"
            ? "escuro"
            : "claro");
    const tamanhoFonte = sessionStorage.TAMANHO_FONTE || "media";
    const administrador =
        sessionStorage.ADMINISTRADOR == "1" ||
        sessionStorage.ADMINISTRADOR == "true";

    const nomeNaBarra = document.querySelector("[data-nome-empresa]");
    const fotoNaBarra = document.querySelector("[data-foto-perfil]");

    if (nomeNaBarra) {
        nomeNaBarra.textContent = nomeEmpresa;
    }

    if (fotoNaBarra) {
        fotoNaBarra.src = fotoPerfil;
    }

    document.body.dataset.tema = tema;
    document.body.dataset.fonte = tamanhoFonte;
    document.body.dataset.administrador = administrador ? "true" : "false";

    if (window.Chart) {
        Chart.defaults.color = tema == "escuro" ? "#D0D5DD" : "#667085";
        Chart.defaults.borderColor = tema == "escuro" ? "#475467" : "#E3E6ED";
    }
}

aplicarPreferencias();
