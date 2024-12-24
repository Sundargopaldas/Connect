const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
const https = require('https');
const fs = require('fs');
const app = express();

app.use(cors({
    origin: [
        'http://connectprint.poa.br:21058',
        'http://connectprint.poa.br',
        'http://localhost:3001',
        'http://localhost:21058' 
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.body) {
        console.log('Body:', req.body);
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));

const pool = mysql.createPool({
    host: 'mysql.connectprint.poa.br',
    user: 'connectprint',
    password: 'Sundar2024',
    database: 'connectprint',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro de conexão com banco:', err);
        console.error('Detalhes do erro:', err.code, err.message);
        console.error('Host:', pool.config.connectionConfig.host);
        console.error('Usuário:', pool.config.connectionConfig.user);
        console.error('Banco:', pool.config.connectionConfig.database);
        return;
    }
    console.log('Conexão com banco estabelecida com sucesso!');
    connection.release();
});

app.post('/api/login', (req, res) => {
    console.log('Tentativa de login:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const query = 'SELECT * FROM users WHERE email = ? AND username = ?';
    pool.query(query, [email, username], (error, results) => {
        if (error) {
            console.error('Erro na consulta:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        const user = results[0];
        if (user.password === password) {
            res.json({ 
                message: 'Login bem-sucedido',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } else {
            res.status(401).json({ message: 'Senha incorreta' });
        }
    });
});

app.post('/api/signup', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
    pool.query(checkQuery, [email, username], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Usuário ou email já existe' });
        }
        pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
        [username, email, password], (error, results) => {
            if (error) {
                return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
            }
            res.status(201).json({ 
                message: 'Usuário cadastrado com sucesso',
                user: { id: results.insertId, username, email }
            });
        });
    });
});

app.post('/api/clients', async (req, res) => {
    const { id, nome, logo } = req.body;
    if (!id || !nome) {
        return res.status(400).json({ message: 'ID e nome são obrigatórios' });
    }
    try {
        await pool.promise().query('INSERT INTO clients (id, name, logo) VALUES (?, ?, ?)', 
        [id, nome, logo]);
        res.status(201).json({ message: 'Cliente cadastrado com sucesso', client: { id, nome }});
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar cliente' });
    }
});

app.get('/api/clients', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM clients');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar clientes' });
    }
});

app.delete('/api/clients/:id', async (req, res) => {
    try {
        const [products] = await pool.promise().query(
            'SELECT * FROM products WHERE client_id = ?', [req.params.id]
        );
        if (products.length > 0) {
            return res.status(400).json({ 
                message: 'Não é possível deletar o cliente pois existem produtos vinculados' 
            });
        }
        const [result] = await pool.promise().query(
            'DELETE FROM clients WHERE id = ?', [req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        res.json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar cliente' });
    }
});
app.post('/api/products', async (req, res) => {
    const { id, client_id, name, description, stock, min_stock, status, image } = req.body;
    if (!id || !client_id || !name) {
        return res.status(400).json({ message: 'ID, client_id e name são obrigatórios' });
    }
    try {
        const [client] = await pool.promise().query('SELECT id FROM clients WHERE id = ?', [client_id]);
        if (client.length === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        await pool.promise().query(
            'INSERT INTO products (id, client_id, name, description, stock, min_stock, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, client_id, name, description, stock || 0, min_stock || 0, status || 'Normal', image || 'placeholder.png']
        );
        await pool.promise().query(
            'INSERT INTO product_history (product_id, client_id, action_type, old_stock, new_stock) VALUES (?, ?, ?, ?, ?)',
            [id, client_id, 'CRIADO', 0, stock || 0]
        );
        res.status(201).json({ message: 'Produto cadastrado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar produto: ' + error.message });
    }
});
app.get('/api/products', async (req, res) => {
    try {
        const [products] = await pool.promise().query(`
            SELECT p.*, c.name as client_name 
            FROM products p 
            LEFT JOIN clients c ON p.client_id = c.id
            ORDER BY p.created_at DESC
        `);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
});

app.get('/api/products/client/:clientId', async (req, res) => {
    try {
        const [produtos] = await pool.promise().query(
            'SELECT * FROM products WHERE client_id = ?',
            [req.params.clientId]
        );
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produtos do cliente' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const [produto] = await pool.promise().query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (produto.length === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(produto[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produto' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    const connection = await pool.promise().getConnection();
    try {
        await connection.beginTransaction();
        const [product] = await connection.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (product.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        await connection.query('DELETE FROM product_history WHERE product_id = ?', [req.params.id]);
        await connection.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        await connection.commit();
        res.json({ message: 'Produto removido com sucesso' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Erro ao remover produto' });
    } finally {
        connection.release();
    }
});
app.put('/api/products/:id', async (req, res) => {
   const { name, description, stock, min_stock, image } = req.body;
   try {
       const [product] = await pool.promise().query('SELECT * FROM products WHERE id = ?', [req.params.id]);
       if (product.length === 0) {
           return res.status(404).json({ message: 'Produto não encontrado' });
       }
       await pool.promise().query(
           'UPDATE products SET name = ?, description = ?, stock = ?, min_stock = ?, image = ?, status = ? WHERE id = ?',
           [name, description, stock, min_stock, image, stock <= min_stock ? 'Baixo' : 'Normal', req.params.id]
       );
       res.json({ message: 'Produto atualizado com sucesso' });
   } catch (error) {
       res.status(500).json({ message: 'Erro ao atualizar produto' });
   }
});
app.post('/api/movimentacao/registrar', async (req, res) => {
    const { client_id, product_id, entrada, saida, observacao, usuario } = req.body;
    try {
        const [produto] = await pool.promise().query(
            'SELECT * FROM products WHERE id = ? AND client_id = ?',
            [product_id, client_id]
        );
        if (produto.length === 0) return res.status(404).json({ message: 'Produto não encontrado' });

        const estoqueAtual = produto[0].stock;
        const novoEstoque = estoqueAtual + entrada - saida;
        
        await pool.promise().query(
            'INSERT INTO product_history (product_id, client_id, action_type, old_stock, new_stock, observacao, usuario) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [product_id, client_id, entrada > 0 ? 'ENTRADA' : 'SAIDA', estoqueAtual, novoEstoque, observacao, usuario]
        );

        await pool.promise().query(
            'UPDATE products SET stock = ?, status = ? WHERE id = ?',
            [novoEstoque, novoEstoque <= produto[0].min_stock ? 'Baixo' : 'Normal', product_id]
        );

        res.json({ message: 'Movimentação registrada com sucesso', novoEstoque });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar movimentação: ' + error.message });
    }
});

app.get('/api/movimentacao/historico', async (req, res) => {
    try {
        const [historico] = await pool.promise().query(`
            SELECT ph.*, p.name as product_name, p.status, c.name as client_name
            FROM product_history ph
            LEFT JOIN products p ON ph.product_id = p.id
            LEFT JOIN clients c ON ph.client_id = c.id
            ORDER BY ph.action_date DESC
        `);
        res.json(historico);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar histórico' });
    }
});

app.get('/api/movimentacao/historico/:id', async (req, res) => {
    try {
        const [historico] = await pool.promise().query(`
            SELECT ph.*, p.name as product_name, p.status, c.name as client_name
            FROM product_history ph
            LEFT JOIN products p ON ph.product_id = p.id
            LEFT JOIN clients c ON ph.client_id = c.id
            WHERE ph.id = ?
        `, [req.params.id]);
        if (historico.length === 0) return res.status(404).json({ message: 'Histórico não encontrado' });
        res.json(historico[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar histórico' });
    }
});
app.delete('/api/movimentacao/historico/:id', async (req, res) => {
    try {
        const [result] = await pool.promise().query('DELETE FROM product_history WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Registro não encontrado' });
        res.json({ message: 'Registro removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover registro' });
    }
});

app.get('/*.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', req.path));
});

app.get('/', (req, res) => {
    res.redirect('index.html');
});

app.get('/api/client-list', async (req, res) => {
    try {
        const [clients] = await pool.promise().query('SELECT * FROM client_list');
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar clientes' });
    }
});

app.listen(21058, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${21058}`);
});

process.on('SIGINT', () => {
    pool.end(err => {
        console.log('Pool de conexões encerrado');
        process.exit(err ? 1 : 0);
    });
});