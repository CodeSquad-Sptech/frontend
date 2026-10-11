const ambiente_processo = "producao";
// const ambiente_processo = "desenvolvimento";

const caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev";
require("dotenv").config({ path: caminho_env });

const express = require("express");
const cors = require("cors");
const path = require("path");

const usuarioRouter = require("./src/routes/usuarios");

const app = express();
const PORTA_APP = process.env.APP_PORT;
const HOST_APP = process.env.APP_HOST;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


app.use("/usuarios", usuarioRouter);

app.listen(PORTA_APP, function () {
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    ---------------------------------------------------
     Servidor: http://${HOST_APP}:${PORTA_APP} 
     Ambiente: ${process.env.AMBIENTE_PROCESSO}
    ---------------------------------------------------
 `);
});
