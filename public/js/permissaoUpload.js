const paginaUpload = document.getElementById("paginaUpload");
const areaEnvioArquivo = document.getElementById("areaEnvioArquivo");
const usuarioAdministrador =
    sessionStorage.ADMINISTRADOR == "1" ||
    sessionStorage.ADMINISTRADOR == "true";

if (!sessionStorage.ID_USUARIO) {
    window.location.href = "./login.html";
} else {
    paginaUpload.hidden = false;

    if (!usuarioAdministrador) {
        document.body.dataset.administrador = "false";
        areaEnvioArquivo.classList.add("somente-leitura");
        areaEnvioArquivo.setAttribute("aria-disabled", "true");
        areaEnvioArquivo.inert = true;

        const arquivos = paginaUpload.querySelector(".arquivos");
        arquivos.classList.add("somente-leitura");
        arquivos.setAttribute("aria-disabled", "true");
        arquivos.inert = true;
    }
}
