<<<<<<< HEAD
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sundar'  // Coloque aqui a senha que você definiu na instalação
});

// Criando banco e tabela
connection.connect(function(err) {
    if (err) {
        console.error('❌ Erro na conexão:', err);
        return;
    }
    console.log('✅ Conectado ao MySQL!');

    // Criar banco de dados
    connection.query('CREATE DATABASE IF NOT EXISTS user_authentication', function(err) {
        if (err) {
            console.error('❌ Erro ao criar banco:', err);
            return;
        }
        console.log('✅ Banco de dados criado!');

        // Usar o banco
        connection.query('USE user_authentication', function(err) {
            if (err) {
                console.error('❌ Erro ao usar banco:', err);
                return;
            }

            // Criar tabela
            const createTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(100) NOT NULL,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL
                )`;

            connection.query(createTable, function(err) {
                if (err) {
                    console.error('❌ Erro ao criar tabela:', err);
                    return;
                }
                console.log('✅ Tabela users criada!');
                console.log('✅ Configuração concluída com sucesso!');
                connection.end();
            });
        });
    });
=======
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sundar'  // Coloque aqui a senha que você definiu na instalação
});

// Criando banco e tabela
connection.connect(function(err) {
    if (err) {
        console.error('❌ Erro na conexão:', err);
        return;
    }
    console.log('✅ Conectado ao MySQL!');

    // Criar banco de dados
    connection.query('CREATE DATABASE IF NOT EXISTS user_authentication', function(err) {
        if (err) {
            console.error('❌ Erro ao criar banco:', err);
            return;
        }
        console.log('✅ Banco de dados criado!');

        // Usar o banco
        connection.query('USE user_authentication', function(err) {
            if (err) {
                console.error('❌ Erro ao usar banco:', err);
                return;
            }

            // Criar tabela
            const createTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(100) NOT NULL,
                    email VARCHAR(100) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL
                )`;

            connection.query(createTable, function(err) {
                if (err) {
                    console.error('❌ Erro ao criar tabela:', err);
                    return;
                }
                console.log('✅ Tabela users criada!');
                console.log('✅ Configuração concluída com sucesso!');
                connection.end();
            });
        });
    });
>>>>>>> 20fda8206b51eb9ba8c85c9e33c1933aace16fde
});