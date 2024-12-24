document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://connectprint.poa.br:21058';
    let produtoSelecionado = null;
    
    console.log('Página carregada');
    initializeApp();

    async function carregarClientes() {
        try {
            console.log('Carregando clientes...');
            const response = await fetch(`${API_URL}/api/clients`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const clientes = await response.json();
            console.log('Clientes carregados:', clientes);
            
            const selectCliente = document.getElementById('cliente');
            if (!selectCliente) {
                throw new Error('Elemento select cliente não encontrado');
            }

            selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.name;
                selectCliente.appendChild(option);
            });

        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            document.getElementById('clienteError').style.display = 'block';
            document.getElementById('clienteError').textContent = 'Erro ao carregar clientes: ' + error.message;
        }
    }

    async function carregarProdutos(clientId) {
        try {
            if (!clientId) return;
            
            const response = await fetch(`${API_URL}/api/products/client/${clientId}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos');
            }

            const produtos = await response.json();
            const selectProduto = document.getElementById('produto');
            selectProduto.innerHTML = '<option value="">Selecione um produto</option>';
            
            produtos.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.id;
                option.textContent = produto.name;
                selectProduto.appendChild(option);
            });

        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            document.getElementById('produtoError').textContent = 'Erro ao carregar produtos: ' + error.message;
            document.getElementById('produtoError').style.display = 'block';
        }
    }

    async function buscarProduto(produtoId) {
        try {
            if (!produtoId) {
                produtoSelecionado = null;
                document.getElementById('produtoInfo').style.display = 'none';
                return;
            }

            const response = await fetch(`${API_URL}/api/products/${produtoId}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar produto');
            }

            const produto = await response.json();
            produtoSelecionado = produto;
            mostrarInfoProduto(produto);
            document.getElementById('produtoError').style.display = 'none';

        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            document.getElementById('produtoError').textContent = 'Erro ao buscar produto: ' + error.message;
            document.getElementById('produtoError').style.display = 'block';
            produtoSelecionado = null;
        }
    }

    function mostrarInfoProduto(produto) {
        const infoDiv = document.getElementById('produtoInfo');
        infoDiv.style.display = 'block';
        infoDiv.innerHTML = `
            <strong>Estoque atual:</strong> ${produto.stock || 0}<br>
            <strong>Estoque mínimo:</strong> ${produto.min_stock || 0}<br>
            <strong>Status:</strong> ${produto.status || 'Normal'}
        `;
    }

    async function handleMovimentacao(e) {
        e.preventDefault();
        console.log('Processando movimentação...');

        try {
            const formElements = e.target.elements;
            const clienteSelect = formElements.cliente;
            const produtoSelect = formElements.produto;
            const entrada = parseInt(formElements.entrada.value) || 0;
            const saida = parseInt(formElements.saida.value) || 0;

            

            if (!clienteSelect.value) {
                document.getElementById('clienteError').style.display = 'block';
                return;
            }

            if (!produtoSelecionado) {
                document.getElementById('produtoError').style.display = 'block';
                return;
            }

            if (entrada === 0 && saida === 0) {
                document.getElementById('entradaError').textContent = 'Informe uma quantidade de entrada ou saída';
                document.getElementById('entradaError').style.display = 'block';
                return;
            }

            const estoqueAtual = produtoSelecionado.stock || 0;
            if (saida > estoqueAtual) {
                document.getElementById('saidaError').textContent = `Estoque insuficiente. Disponível: ${estoqueAtual}`;
                document.getElementById('saidaError').style.display = 'block';
                return;
            }

            const dadosMovimentacao = {
    client_id: clienteSelect.value,
    product_id: produtoSelecionado.id,
    entrada: entrada,
    saida: saida,
    action_type: saida > 0 ? 'SAIDA' : 'ENTRADA',
    old_stock: estoqueAtual,
    new_stock: estoqueAtual + entrada - saida,
    observacao: formElements.observacao.value,
    usuario: localStorage.getItem('username') // Pegar usuário do login
};

            console.log('Dados completos:', dadosMovimentacao);
console.log('Usuario:', localStorage.getItem('username'));
console.log('Dados completos:', dadosMovimentacao);
            const response = await fetch(`${API_URL}/api/movimentacao/registrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosMovimentacao)
            });

            const responseData = await response.json();
            console.log('Resposta:', responseData);
            if (!response.ok) {
                throw new Error(responseData.message || 'Erro ao registrar movimentação');
            }

            alert('Movimentação registrada com sucesso!');
            window.location.href = 'historicodemovimentacao.html';

        } catch (error) {
            console.error('Erro na movimentação:', error);
            alert('Erro ao registrar movimentação: ' + error.message);
        }
    }

    function setupEventListeners() {
        const form = document.getElementById('movimentacaoForm');
        if (!form) {
            console.error('Formulário não encontrado');
            return;
        }
        
        form.addEventListener('submit', handleMovimentacao);

        const clienteSelect = document.getElementById('cliente');
        const produtoSelect = document.getElementById('produto');
        
        if (clienteSelect) {
            clienteSelect.addEventListener('change', async () => {
                await carregarProdutos(clienteSelect.value);
            });
        }

        if (produtoSelect) {
            produtoSelect.addEventListener('change', async () => {
                await buscarProduto(produtoSelect.value);
            });
        }

        const entradaInput = document.getElementById('entrada');
        const saidaInput = document.getElementById('saida');

        if (entradaInput && saidaInput) {
            entradaInput.addEventListener('input', function() {
                if (this.value < 0) this.value = 0;
            });

            saidaInput.addEventListener('input', function() {
                if (this.value < 0) this.value = 0;
            });
        }
    }

    async function initializeApp() {
        try {
            await carregarClientes();
            setupEventListeners();
            console.log('Aplicação inicializada com sucesso');
        } catch (error) {
            console.error('Erro na inicialização:', error);
            alert('Erro ao inicializar a aplicação: ' + error.message);
        }
    }
});