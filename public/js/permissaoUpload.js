const paginaUpload = document.getElementById("paginaUpload");
const avisoAcessoNegado = document.getElementById("acessoNegado");
const areaEnvioArquivo = document.getElementById("areaEnvioArquivo");

if (!sessionStorage.ID_USUARIO) {
    window.location.href = "./login.html";
} else {
    paginaUpload.hidden = false;

    if (sessionStorage.ADMINISTRADOR != "1") {
        areaEnvioArquivo.hidden = true;
        avisoAcessoNegado.hidden = false;
    }
}
