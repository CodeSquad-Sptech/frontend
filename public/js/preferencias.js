const configuracoes_preferenciais = {
    administradores: "evolua_administradores"
};

function atualizarIconesTema(tema) {
    const iconeMenu = document.querySelector("[data-icone-menu]");
    const iconeNotificacao = document.querySelector("[data-icone-notificacao]");

    if (iconeMenu) {
        iconeMenu.src = tema == "escuro" ? "img/menuBranco.png" : "img/menuPreto.png";
    }

    if (iconeNotificacao) {
        iconeNotificacao.src = tema == "escuro" ? "img/sinoBranco.png" : "img/sinoPreto.png";
    }
}

function aplicarPreferencias() {
    const nomeEmpresa = sessionStorage.NOME_EMPRESA || "EVOLUA";
    const fotoPerfil = sessionStorage.FOTO_PERFIL &&
        sessionStorage.FOTO_PERFIL != "perfil_padrao.png"
        ? sessionStorage.FOTO_PERFIL
        : "img/usuarioSemFoto.png";
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
    atualizarIconesTema(tema);

    if (window.Chart) {
        Chart.defaults.color = tema == "escuro" ? "#D0D5DD" : "#667085";
        Chart.defaults.borderColor = tema == "escuro" ? "#475467" : "#E3E6ED";
    }
}

aplicarPreferencias();
