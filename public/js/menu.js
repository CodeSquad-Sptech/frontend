const botaoMenu = document.getElementById("botaoMenu");
const menuLateral = document.getElementById("menuLateral");
const fundoMenu = document.getElementById("fundoMenu");
const botaoSair = document.getElementById("botaoSair");

function fecharMenu() {
    menuLateral.hidden = true;
    fundoMenu.hidden = true;
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");
}

function alternarMenu() {
    const menuAberto = !menuLateral.hidden;

    menuLateral.hidden = menuAberto;
    fundoMenu.hidden = menuAberto;
    botaoMenu.setAttribute("aria-expanded", String(!menuAberto));
    botaoMenu.setAttribute("aria-label", menuAberto ? "Abrir menu" : "Fechar menu");
}

function fecharMenuComEscape(evento) {
    if (evento.key == "Escape") {
        fecharMenu();
    }
}

function sairDaConta() {
    fetch("/usuarios/sair", { method: "POST" })
        .catch(function (erro) {
            console.error("Erro ao encerrar sessão:", erro);
        })
        .finally(function () {
            sessionStorage.clear();
            window.location.href = "./login.html";
        });
}

botaoMenu.addEventListener("click", alternarMenu);
fundoMenu.addEventListener("click", fecharMenu);
document.addEventListener("keydown", fecharMenuComEscape);
menuLateral.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", fecharMenu);
});
botaoSair.addEventListener("click", sairDaConta);