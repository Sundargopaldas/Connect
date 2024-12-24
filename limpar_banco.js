<<<<<<< HEAD
const mysql = require('mysql2/promise');

async function clearDatabase() {
    let connection;
    
    try {
        console.log('Tentando conectar ao banco de dados...');
        
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'sundar',  // Sua senha do MySQL
            database: 'user_authentication'
        });

        console.log('Conexão estabelecida com sucesso!');

        // Verificar se as tabelas existem antes de limpar
        console.log('Verificando tabelas...');
        
        const [rows] = await connection.query(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = 'user_authentication'
        `);

        const existingTables = rows.map(row => row.TABLE_NAME.toLowerCase());
        console.log('Tabelas encontradas:', existingTables);

        // Desabilitar verificação de chaves estrangeiras
        console.log('Desabilitando verificação de chaves estrangeiras...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // Limpar cada tabela
        const tables = [
            'product_history',
            'products',
            'clients',
            'users'
        ];

        for (const table of tables) {
            if (existingTables.includes(table.toLowerCase())) {
                try {
                    console.log(`Limpando tabela ${table}...`);
                    await connection.query(`TRUNCATE TABLE ${table}`);
                    console.log(`Tabela ${table} limpa com sucesso!`);
                } catch (error) {
                    console.error(`Erro ao limpar tabela ${table}:`, error.message);
                }
            } else {
                console.warn(`Tabela ${table} não encontrada no banco de dados.`);
            }
        }

        // Reabilitar verificação de chaves estrangeiras
        console.log('Reabilitando verificação de chaves estrangeiras...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // Verificar se as tabelas estão vazias
        for (const table of tables) {
            if (existingTables.includes(table.toLowerCase())) {
                const [count] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`Registros na tabela ${table} após limpeza: ${count[0].count}`);
            }
        }

        console.log('Processo de limpeza concluído com sucesso!');

    } catch (error) {
        console.error('Erro durante o processo:', error);
        throw error;
    } finally {
        if (connection) {
            try {
                console.log('Fechando conexão com o banco...');
                await connection.end();
                console.log('Conexão fechada com sucesso!');
            } catch (error) {
                console.error('Erro ao fechar conexão:', error);
            }
        }
    }
}

// Executar o script
console.log('Iniciando script de limpeza do banco de dados...');
clearDatabase()
    .then(() => {
        console.log('Script finalizado com sucesso!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Script finalizado com erro:', error);
        process.exit(1);
=======
const mysql = require('mysql2/promise');

async function clearDatabase() {
    let connection;
    
    try {
        console.log('Tentando conectar ao banco de dados...');
        
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'sundar',  // Sua senha do MySQL
            database: 'user_authentication'
        });

        console.log('Conexão estabelecida com sucesso!');

        // Verificar se as tabelas existem antes de limpar
        console.log('Verificando tabelas...');
        
        const [rows] = await connection.query(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = 'user_authentication'
        `);

        const existingTables = rows.map(row => row.TABLE_NAME.toLowerCase());
        console.log('Tabelas encontradas:', existingTables);

        // Desabilitar verificação de chaves estrangeiras
        console.log('Desabilitando verificação de chaves estrangeiras...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        // Limpar cada tabela
        const tables = [
            'product_history',
            'products',
            'clients',
            'users'
        ];

        for (const table of tables) {
            if (existingTables.includes(table.toLowerCase())) {
                try {
                    console.log(`Limpando tabela ${table}...`);
                    await connection.query(`TRUNCATE TABLE ${table}`);
                    console.log(`Tabela ${table} limpa com sucesso!`);
                } catch (error) {
                    console.error(`Erro ao limpar tabela ${table}:`, error.message);
                }
            } else {
                console.warn(`Tabela ${table} não encontrada no banco de dados.`);
            }
        }

        // Reabilitar verificação de chaves estrangeiras
        console.log('Reabilitando verificação de chaves estrangeiras...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // Verificar se as tabelas estão vazias
        for (const table of tables) {
            if (existingTables.includes(table.toLowerCase())) {
                const [count] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`Registros na tabela ${table} após limpeza: ${count[0].count}`);
            }
        }

        console.log('Processo de limpeza concluído com sucesso!');

    } catch (error) {
        console.error('Erro durante o processo:', error);
        throw error;
    } finally {
        if (connection) {
            try {
                console.log('Fechando conexão com o banco...');
                await connection.end();
                console.log('Conexão fechada com sucesso!');
            } catch (error) {
                console.error('Erro ao fechar conexão:', error);
            }
        }
    }
}

// Executar o script
console.log('Iniciando script de limpeza do banco de dados...');
clearDatabase()
    .then(() => {
        console.log('Script finalizado com sucesso!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Script finalizado com erro:', error);
        process.exit(1);
>>>>>>> 20fda8206b51eb9ba8c85c9e33c1933aace16fde
    });