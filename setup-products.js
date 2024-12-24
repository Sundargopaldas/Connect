<<<<<<< HEAD
const mysql = require('mysql2');

// Criar conexão
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // seu usuário MySQL
    password: 'sundar',         // sua senha MySQL
    database: 'user_authentication'
});

// Testar conexão
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar:', err);
        return;
    }
    console.log('✅ Conectado ao banco com sucesso!');
    
    // Criar tabela de produtos
    const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        client_id VARCHAR(100),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        stock INT DEFAULT 0,
        min_stock INT DEFAULT 0,
        status VARCHAR(50),
        image LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    )`;

    connection.query(createProductsTable, (err) => {
        if (err) {
            console.error('Erro ao criar tabela products:', err);
            return;
        }
        console.log('✅ Tabela products criada com sucesso!');

        // Criar tabela de histórico
        const createHistoryTable = `
        CREATE TABLE IF NOT EXISTS product_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id VARCHAR(100),
            client_id VARCHAR(100),
            action_type VARCHAR(50),
            old_stock INT,
            new_stock INT,
            action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        )`;

        connection.query(createHistoryTable, (err) => {
            if (err) {
                console.error('Erro ao criar tabela product_history:', err);
                return;
            }
            console.log('✅ Tabela product_history criada com sucesso!');
            connection.end(() => {
                console.log('✅ Configuração concluída!');
            });
        });
    });
=======
const mysql = require('mysql2');

// Criar conexão
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // seu usuário MySQL
    password: 'sundar',         // sua senha MySQL
    database: 'user_authentication'
});

// Testar conexão
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar:', err);
        return;
    }
    console.log('✅ Conectado ao banco com sucesso!');
    
    // Criar tabela de produtos
    const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        client_id VARCHAR(100),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        stock INT DEFAULT 0,
        min_stock INT DEFAULT 0,
        status VARCHAR(50),
        image LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    )`;

    connection.query(createProductsTable, (err) => {
        if (err) {
            console.error('Erro ao criar tabela products:', err);
            return;
        }
        console.log('✅ Tabela products criada com sucesso!');

        // Criar tabela de histórico
        const createHistoryTable = `
        CREATE TABLE IF NOT EXISTS product_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id VARCHAR(100),
            client_id VARCHAR(100),
            action_type VARCHAR(50),
            old_stock INT,
            new_stock INT,
            action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        )`;

        connection.query(createHistoryTable, (err) => {
            if (err) {
                console.error('Erro ao criar tabela product_history:', err);
                return;
            }
            console.log('✅ Tabela product_history criada com sucesso!');
            connection.end(() => {
                console.log('✅ Configuração concluída!');
            });
        });
    });
>>>>>>> 20fda8206b51eb9ba8c85c9e33c1933aace16fde
});