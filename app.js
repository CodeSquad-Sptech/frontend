// const ambiente_processo = "producao";
 const ambiente_processo = "desenvolvimento";

const caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev";

require("dotenv").config({ path: caminho_env });

const PORTA_APP = process.env.APP_PORT;
const HOST_APP = process.env.APP_HOST;

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const usuarioRouter = require("./src/routes/usuarios");
const dashboardRouter = require("./src/routes/dashboard");

app.use("/usuarios", usuarioRouter);
app.use("/dashboard", dashboardRouter); 

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
