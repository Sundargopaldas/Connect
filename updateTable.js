<<<<<<< HEAD
const mysql = require('mysql2/promise');

async function updateTable() {
    let connection;
    try {
        console.log('Iniciando atualização da tabela products...');

        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'sundar', // Sua senha do MySQL
            database: 'user_authentication'
        });

        console.log('Conectado ao banco de dados');

        // Verificar índices existentes
        console.log('Verificando índices existentes...');
        const [indexes] = await connection.query(`
            SHOW INDEX FROM products
            WHERE Key_name != 'PRIMARY'
        `);
        
        console.log('Índices encontrados:', indexes.length);

        // Remover índices de forma segura
        try {
            console.log('Tentando remover índices...');
            await connection.query('ALTER TABLE products DROP INDEX name');
            console.log('Índice "name" removido');
        } catch (e) {
            console.log('Índice "name" não existe ou já foi removido');
        }

        try {
            await connection.query('ALTER TABLE products DROP INDEX product_name_unique');
            console.log('Índice "product_name_unique" removido');
        } catch (e) {
            console.log('Índice "product_name_unique" não existe ou já foi removido');
        }

        try {
            await connection.query('ALTER TABLE products DROP INDEX unique_name');
            console.log('Índice "unique_name" removido');
        } catch (e) {
            console.log('Índice "unique_name" não existe ou já foi removido');
        }

        // Modificar a coluna name
        console.log('Modificando a coluna name...');
        await connection.query(`
            ALTER TABLE products 
            MODIFY COLUMN name VARCHAR(255) NOT NULL
        `);
        console.log('Coluna "name" modificada com sucesso');

        // Verificar a estrutura atual
        console.log('\nEstrutura atual da tabela products:');
        const [columns] = await connection.query('DESCRIBE products');
        console.table(columns);

        // Verificar índices após modificação
        const [finalIndexes] = await connection.query(`
            SHOW INDEX FROM products
        `);
        
        console.log('\nÍndices após modificação:');
        console.table(finalIndexes);

        console.log('Atualização concluída com sucesso!');

    } catch (error) {
        console.error('Erro durante a atualização:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('Conexão fechada');
        }
    }
}

// Executar o script
console.log('Iniciando script...');
updateTable()
    .then(() => {
        console.log('Script finalizado com sucesso');
        process.exit(0);
    })
    .catch(error => {
        console.error('Erro na execução do script:', error);
        process.exit(1);
=======
const mysql = require('mysql2/promise');

async function updateTable() {
    let connection;
    try {
        console.log('Iniciando atualização da tabela products...');

        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'sundar', // Sua senha do MySQL
            database: 'user_authentication'
        });

        console.log('Conectado ao banco de dados');

        // Verificar índices existentes
        console.log('Verificando índices existentes...');
        const [indexes] = await connection.query(`
            SHOW INDEX FROM products
            WHERE Key_name != 'PRIMARY'
        `);
        
        console.log('Índices encontrados:', indexes.length);

        // Remover índices de forma segura
        try {
            console.log('Tentando remover índices...');
            await connection.query('ALTER TABLE products DROP INDEX name');
            console.log('Índice "name" removido');
        } catch (e) {
            console.log('Índice "name" não existe ou já foi removido');
        }

        try {
            await connection.query('ALTER TABLE products DROP INDEX product_name_unique');
            console.log('Índice "product_name_unique" removido');
        } catch (e) {
            console.log('Índice "product_name_unique" não existe ou já foi removido');
        }

        try {
            await connection.query('ALTER TABLE products DROP INDEX unique_name');
            console.log('Índice "unique_name" removido');
        } catch (e) {
            console.log('Índice "unique_name" não existe ou já foi removido');
        }

        // Modificar a coluna name
        console.log('Modificando a coluna name...');
        await connection.query(`
            ALTER TABLE products 
            MODIFY COLUMN name VARCHAR(255) NOT NULL
        `);
        console.log('Coluna "name" modificada com sucesso');

        // Verificar a estrutura atual
        console.log('\nEstrutura atual da tabela products:');
        const [columns] = await connection.query('DESCRIBE products');
        console.table(columns);

        // Verificar índices após modificação
        const [finalIndexes] = await connection.query(`
            SHOW INDEX FROM products
        `);
        
        console.log('\nÍndices após modificação:');
        console.table(finalIndexes);

        console.log('Atualização concluída com sucesso!');

    } catch (error) {
        console.error('Erro durante a atualização:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('Conexão fechada');
        }
    }
}

// Executar o script
console.log('Iniciando script...');
updateTable()
    .then(() => {
        console.log('Script finalizado com sucesso');
        process.exit(0);
    })
    .catch(error => {
        console.error('Erro na execução do script:', error);
        process.exit(1);
>>>>>>> 20fda8206b51eb9ba8c85c9e33c1933aace16fde
    });