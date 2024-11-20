const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sundar',  // Sua senha do MySQL
    database: 'user_authentication'
});

const createTableSQL = `
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

connection.query(createTableSQL, (err) => {
    if (err) {
        console.error('Erro ao criar tabela clients:', err);
        return;
    }
    console.log('Tabela clients criada com sucesso!');
    connection.end();
});