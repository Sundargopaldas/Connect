<<<<<<< HEAD
const mysql = require('mysql2');

// Criar conexão
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sundar',  // Coloque sua senha aqui
    database: 'user_authentication'
});

// Testar conexão
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar:', err);
        return;
    }
    console.log('✅ Conectado ao banco com sucesso!');

    // Criar tabela de clientes se não existir
    const createTable = `
    CREATE TABLE IF NOT EXISTS clients (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    connection.query(createTable, (err) => {
        if (err) {
            console.error('Erro ao criar tabela:', err);
            return;
        }
        console.log('✅ Tabela clients verificada/criada!');

        // Testar inserção
        const testClient = {
            id: 'teste123',
            name: 'Cliente Teste',
            logo: null
        };

        connection.query('INSERT INTO clients (id, name, logo) VALUES (?, ?, ?)', 
            [testClient.id, testClient.name, testClient.logo], 
            (err) => {
                if (err) {
                    console.error('Erro ao inserir cliente teste:', err);
                } else {
                    console.log('✅ Cliente teste inserido com sucesso!');
                }
                connection.end();
            }
        );
    });
=======
const mysql = require('mysql2');

// Criar conexão
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sundar',  // Coloque sua senha aqui
    database: 'user_authentication'
});

// Testar conexão
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar:', err);
        return;
    }
    console.log('✅ Conectado ao banco com sucesso!');

    // Criar tabela de clientes se não existir
    const createTable = `
    CREATE TABLE IF NOT EXISTS clients (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    connection.query(createTable, (err) => {
        if (err) {
            console.error('Erro ao criar tabela:', err);
            return;
        }
        console.log('✅ Tabela clients verificada/criada!');

        // Testar inserção
        const testClient = {
            id: 'teste123',
            name: 'Cliente Teste',
            logo: null
        };

        connection.query('INSERT INTO clients (id, name, logo) VALUES (?, ?, ?)', 
            [testClient.id, testClient.name, testClient.logo], 
            (err) => {
                if (err) {
                    console.error('Erro ao inserir cliente teste:', err);
                } else {
                    console.log('✅ Cliente teste inserido com sucesso!');
                }
                connection.end();
            }
        );
    });
>>>>>>> 20fda8206b51eb9ba8c85c9e33c1933aace16fde
});