
// const ambiente_processo = 'producao';
   const ambiente_processo = 'desenvolvimento';

    const caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev'; 

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


const cadastroRouter = require("./src/routes/cadastro_routes.js");
const codigoRouter = require("./src/routes/codigo_routes.js");
const convidadoRouter = require("./src/routes/convidado_routes.js");
const economiaRouter = require("./src/routes/economia_routes.js");
const listaRouter = require("./src/routes/lista_routes.js");
const indexRouter = require("./src/routes/login_routes.js");

app.use("/usuarios",  cadastroRouter);
app.use("/codigo",    codigoRouter);
app.use("/convidado", convidadoRouter);
app.use("/economia",  economiaRouter);
app.use("/lista",     listaRouter);
app.use("/",          indexRouter);


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
