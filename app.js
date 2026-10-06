 var ambiente_processo = 'producao';
//var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var usuarioRouter = require("./src/routes/usuarios");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

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
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});



// // const ambiente_processo = 'producao';
//    const ambiente_processo = 'desenvolvimento';

//     const caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev'; 

//     require("dotenv").config({ path: caminho_env });

//     const PORTA_APP = process.env.APP_PORT;
//     const HOST_APP = process.env.APP_HOST;

//     const express = require("express");
//     const cors = require("cors");
//     const path = require("path");
//     const app = express();

//     app.use(express.json());
//     app.use(express.urlencoded({ extended: false }));
//     app.use(express.static(path.join(__dirname, "public")));
//     app.use(cors());


// const cadastroRouter = require("./src/routes/cadastro_routes.js");
// const codigoRouter = require("./src/routes/codigo_routes.js");
// const convidadoRouter = require("./src/routes/convidado_routes.js");
// const economiaRouter = require("./src/routes/economia_routes.js");
// const listaRouter = require("./src/routes/lista_routes.js");
// const indexRouter = require("./src/routes/login_routes.js");

// app.use("/usuarios",  cadastroRouter);
// app.use("/codigo",    codigoRouter);
// app.use("/convidado", convidadoRouter);
// app.use("/economia",  economiaRouter);
// app.use("/lista",     listaRouter);
// app.use("/",          indexRouter);


// app.listen(PORTA_APP, function () {
//     console.log(`
//      ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
//     ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
//     ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
//     ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
//     #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
//     ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
//     ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    
//     ---------------------------------------------------
//     Servidor: http://${HOST_APP}:${PORTA_APP} 
//     Ambiente: ${process.env.AMBIENTE_PROCESSO}
//     ---------------------------------------------------
//     `);
// });
