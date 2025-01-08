const mysql = require('mysql2');

// Criar conexão sem especificar banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sundar'  // Coloque sua senha do MySQL aqui
});

// Criar banco de dados
connection.query('CREATE DATABASE IF NOT EXISTS user_authentication', (err) => {
    if (err) {
        console.error('Erro ao criar banco:', err);
        return;
    }
    console.log('Banco de dados criado com sucesso!');

    // Criar tabela
    connection.query('USE user_authentication', (err) => {
        if (err) {
            console.error('Erro ao usar banco:', err);
            return;
        }

        const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )`;

        connection.query(sql, (err) => {
            if (err) {
                console.error('Erro ao criar tabela:', err);
                return;
            }
            console.log('Tabela users criada com sucesso!');
            connection.end();
        });
    });
});