const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sundar',  // Coloque sua senha do MySQL aqui
    database: 'user_authentication'
});

// Testar conexão
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar:', err);
        return;
    }
    console.log('Conectado ao banco de dados com sucesso!');
});

module.exports = connection;