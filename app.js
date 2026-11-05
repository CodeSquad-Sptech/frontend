// const ambiente_processo = "producao";
 const ambiente_processo = "desenvolvimento";

const fs = require("fs");
const path = require("path");
const caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev";
const arquivo_env = path.resolve(
    __dirname,
    fs.existsSync(path.resolve(__dirname, caminho_env)) ? caminho_env : ".env"
);

const configuracao_env = require("dotenv").config({ path: arquivo_env });
if (configuracao_env.error) {
    throw configuracao_env.error;
}

const PORTA_APP = process.env.APP_PORT;
const HOST_APP = process.env.APP_HOST;
const variaveisAusentes = ["APP_PORT", "APP_HOST", "AMBIENTE_PROCESSO"]
    .filter(function (variavel) {
        return !process.env[variavel];
    });

if (variaveisAusentes.length > 0) {
    throw new Error("Variáveis obrigatórias ausentes: " + variaveisAusentes.join(", "));
}

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const usuarioRouter = require("./src/routes/usuarios");
const dashboardRouter = require("./src/routes/dashboard");
const logsRouter = require("./src/routes/logs.js");

app.use("/usuarios", usuarioRouter);
app.use("/dashboard", dashboardRouter); 
app.use("/logs", logsRouter);

app.listen(PORTA_APP, function () {
    console.log(`
     ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
     
    ---------------------------------------------------
     Servidor: http://${HOST_APP}:${PORTA_APP} 
     Ambiente: ${process.env.AMBIENTE_PROCESSO}
    ---------------------------------------------------
 `);
});
