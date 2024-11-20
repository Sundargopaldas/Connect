const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
const app = express();

const pool = mysql.createPool({
    host: 'srv1075.hstgr.io',
    user: 'u426792035_usuarioConnect',  // seu usuário
    password: 'Sundar2024',
    database: 'u426792035_bancoConnect',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Teste da conexão com o banco
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('Conectado ao banco de dados com sucesso!');
    connection.release();
});

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// NOVA ADIÇÃO: Configuração para servir arquivos estáticos
// NOVA ADIÇÃO: Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        }
    }
}));
    

// NOVA ADIÇÃO: Rota para servir arquivos HTML
// NOVA ADIÇÃO: Rota para servir arquivos HTML
app.get('/*.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', req.path));
});


// NOVA ADIÇÃO: Rota para a página inicial
// Rota para a página inicial - redirecionando para login
app.get('/', (req, res) => {
    res.redirect('index.html');
});


// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
// Login
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

// Signup/Cadastro
app.post('/api/signup', (req, res) => {
    console.log('Tentativa de cadastro:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Primeiro verifica se o usuário já existe
    const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
    pool.query(checkQuery, [email, username], (error, results) => {
        if (error) {
            console.error('Erro na verificação:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Usuário ou email já existe' });
        }

        // Se não existe, insere o novo usuário
        const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        pool.query(insertQuery, [username, email, password], (error, results) => {
            if (error) {
                console.error('Erro no cadastro:', error);
                return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
            }

            res.status(201).json({ 
                message: 'Usuário cadastrado com sucesso',
                user: {
                    id: results.insertId,
                    username,
                    email
                }
            });
        });
    });
});
// Login
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

// Signup/Cadastro
app.post('/api/signup', (req, res) => {
    console.log('Tentativa de cadastro:', req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Primeiro verifica se o usuário já existe
    const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
    pool.query(checkQuery, [email, username], (error, results) => {
        if (error) {
            console.error('Erro na verificação:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Usuário ou email já existe' });
        }

        // Se não existe, insere o novo usuário
        const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        pool.query(insertQuery, [username, email, password], (error, results) => {
            if (error) {
                console.error('Erro no cadastro:', error);
                return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
            }

            res.status(201).json({ 
                message: 'Usuário cadastrado com sucesso',
                user: {
                    id: results.insertId,
                    username,
                    email
                }
            });
        });
    });
});
// rota para cadastro de clientes
app.post('/api/clients', async (req, res) => {
    console.log('Recebendo dados do cliente:', req.body);
    const { id, nome, logo } = req.body;

    if (!id || !nome) {
        return res.status(400).json({ message: 'ID e nome são obrigatórios' });
    }

    try {
        const query = 'INSERT INTO clients (id, name, logo) VALUES (?, ?, ?)';
        await pool.promise().query(query, [id, nome, logo]);
        
        res.status(201).json({ 
            message: 'Cliente cadastrado com sucesso',
            client: { id, nome }
        });
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ message: 'Erro ao cadastrar cliente' });
    }
});

// Rota para listar todos os clientes
app.get('/api/clients', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM clients');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ message: 'Erro ao buscar clientes' });
    }
});

// Rota para deletar um cliente
app.delete('/api/clients/:id', async (req, res) => {
    const clientId = req.params.id;

    try {
        // Primeiro, verifica se existem produtos relacionados
        const [products] = await pool.promise().query(
            'SELECT * FROM products WHERE client_id = ?',
            [clientId]
        );

        if (products.length > 0) {
            return res.status(400).json({ 
                message: 'Não é possível deletar o cliente pois existem produtos vinculados' 
            });
        }

        // Se não houver produtos, deleta o cliente
        const [result] = await pool.promise().query(
            'DELETE FROM clients WHERE id = ?',
            [clientId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        res.json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        res.status(500).json({ message: 'Erro ao deletar cliente' });
    }
});
// Rotas para Produtos
app.post('/api/products', async (req, res) => {
    console.log('Recebendo dados do produto:', req.body);
    const { id, client_id, name, description, stock, min_stock, status, image } = req.body;

    if (!id || !client_id || !name) {
        return res.status(400).json({ message: 'ID, client_id e name são obrigatórios' });
    }

    try {
        // Verifica se o cliente existe
        const [client] = await pool.promise().query(
            'SELECT id FROM clients WHERE id = ?',
            [client_id]
        );

        if (client.length === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        const query = `
            INSERT INTO products 
            (id, client_id, name, description, stock, min_stock, status, image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.promise().query(query, [
            id,
            client_id,
            name,
            description,
            stock || 0,
            min_stock || 0,
            status || 'Normal',
            image || 'placeholder.png'
        ]);

        // Registra no histórico
        await pool.promise().query(
            'INSERT INTO product_history (product_id, client_id, action_type, old_stock, new_stock) VALUES (?, ?, ?, ?, ?)',
            [id, client_id, 'CRIADO', 0, stock || 0]
        );
        
        res.status(201).json({ 
            message: 'Produto cadastrado com sucesso',
            product: { id, client_id, name, description, stock, min_stock, status }
        });
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        res.status(500).json({ message: 'Erro ao cadastrar produto: ' + error.message });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const query = `
            SELECT p.*, c.name as client_name 
            FROM products p 
            LEFT JOIN clients c ON p.client_id = c.id
            ORDER BY p.created_at DESC
        `;
        
        const [products] = await pool.promise().query(query);
        res.json(products);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
});
// Remover produto
app.delete('/api/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // Primeiro, registra no histórico
        const [product] = await pool.promise().query(
            'SELECT * FROM products WHERE id = ?',
            [productId]
        );

        if (product.length === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        // Registra a remoção no histórico
        await pool.promise().query(
            'INSERT INTO product_history (product_id, client_id, action_type, old_stock, new_stock) VALUES (?, ?, ?, ?, ?)',
            [productId, product[0].client_id, 'REMOVIDO', product[0].stock, 0]
        );

        // Remove o produto
        await pool.promise().query(
            'DELETE FROM products WHERE id = ?',
            [productId]
        );

        res.json({ message: 'Produto removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover produto:', error);
        res.status(500).json({ message: 'Erro ao remover produto' });
    }
});

// Buscar produtos por cliente
app.get('/api/products/client/:clientId', async (req, res) => {
    try {
        const [produtos] = await pool.promise().query(
            'SELECT * FROM products WHERE client_id = ?',
            [req.params.clientId]
        );
        res.json(produtos);
    } catch (error) {
        console.error('Erro ao buscar produtos do cliente:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos do cliente' });
    }
});

// Rotas para Movimentação
// Buscar histórico de movimentações
app.get('/api/movimentacao/historico', async (req, res) => {
    try {
        const query = `
            SELECT 
                ph.*,
                p.name as product_name,
                p.description,
                p.image,
                p.status,
                c.name as client_name
            FROM product_history ph
            LEFT JOIN products p ON ph.product_id = p.id
            LEFT JOIN clients c ON ph.client_id = c.id
            ORDER BY ph.action_date DESC
        `;
        
        const [historico] = await pool.promise().query(query);
        res.json(historico);
    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        res.status(500).json({ message: 'Erro ao buscar histórico de movimentações' });
    }
});
// Registrar movimentação
app.post('/api/movimentacao/registrar', async (req, res) => {
    console.log('Recebendo movimentação:', req.body);
    const { client_id, product_id, entrada, saida } = req.body;

    if (!client_id || !product_id || (entrada === 0 && saida === 0)) {
        return res.status(400).json({ 
            message: 'Cliente, produto e quantidade são obrigatórios' 
        });
    }

    try {
        // Busca produto atual
        const [produto] = await pool.promise().query(
            'SELECT * FROM products WHERE id = ? AND client_id = ?',
            [product_id, client_id]
        );

        if (produto.length === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        const estoqueAtual = produto[0].stock;
        const novoEstoque = estoqueAtual + entrada - saida;

        if (novoEstoque < 0) {
            return res.status(400).json({ 
                message: 'Estoque insuficiente para esta movimentação' 
            });
        }

        // Atualiza o estoque do produto
        await pool.promise().query(
            'UPDATE products SET stock = ?, status = ? WHERE id = ?',
            [
                novoEstoque,
                novoEstoque <= produto[0].min_stock ? 'Baixo' : 'Normal',
                product_id
            ]
        );

        // Registra no histórico
        const tipoAcao = entrada > 0 ? 'ENTRADA' : 'SAIDA';
        await pool.promise().query(
            'INSERT INTO product_history (product_id, client_id, action_type, old_stock, new_stock) VALUES (?, ?, ?, ?, ?)',
            [product_id, client_id, tipoAcao, estoqueAtual, novoEstoque]
        );

        res.json({ 
            message: 'Movimentação registrada com sucesso',
            novoEstoque
        });
    } catch (error) {
        console.error('Erro ao registrar movimentação:', error);
        res.status(500).json({ message: 'Erro ao registrar movimentação' });
    }
});
// Remover item do histórico
app.delete('/api/movimentacao/historico/:id', async (req, res) => {
    const historicoId = req.params.id;

    try {
        const [result] = await pool.promise().query(
            'DELETE FROM product_history WHERE id = ?',
            [historicoId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro não encontrado' });
        }

        res.json({ message: 'Registro removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover registro:', error);
        res.status(500).json({ message: 'Erro ao remover registro do histórico' });
    }
});

// Inicialização do servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Tratamento para encerramento limpo
process.on('SIGINT', () => {
    pool.end(err => {
        console.log('Pool de conexões do banco de dados encerrado');
        process.exit(err ? 1 : 0);
    });
});