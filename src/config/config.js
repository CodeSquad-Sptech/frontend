const mysql = require("mysql2");

// CONEXÃO DO BANCO MYSQL SERVER
var mySqlConfig = {
    host:     process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port:     process.env.DB_PORT
};

function executar(instrucao, parametros = []) {
    if (
        process.env.AMBIENTE_PROCESSO !== "producao" &&
        process.env.AMBIENTE_PROCESSO !== "desenvolvimento"
    ) {
        return Promise.reject(new Error("AMBIENTE NÃO CONFIGURADO EM .env"));
    }

    return new Promise(function (resolve, reject) {
        const conexao = mysql.createConnection(mySqlConfig);

        conexao.query(instrucao, parametros, function (erro, resultados) {
            conexao.end();

            if (erro) {
                return reject(erro);
            }

            resolve(resultados);
        });
    });
}

module.exports = {
    executar
};