document.addEventListener('DOMContentLoaded', function() {
    carregarClientes();
    setupEventListeners();
});

function carregarClientes() {
    const selectCliente = document.getElementById('cliente');
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    
    selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = cliente.nome;
        selectCliente.appendChild(option);
    });
}

function setupEventListeners() {
    const form = document.getElementById('movimentacaoForm');
    form.addEventListener('submit', handleMovimentacao);
}

function handleMovimentacao(e) {
    e.preventDefault();
    const movimentacaoForm = document.getElementById('movimentacaoForm');

    const clienteSelect = document.getElementById('cliente');
    const produtoInput = document.getElementById('produto');
    const entrada = document.getElementById('entrada').value;
    const saida = document.getElementById('saida').value;

    if (!clienteSelect.value || !produtoInput.value.trim()) {
        alert('Por favor, selecione um cliente e digite um produto.');
        return;
    }

    // Permitir que ambos os campos estejam vazios, mas não podem ser ambos preenchidos com zero
    if ((entrada === '0' && saida === '0') || (entrada === '' && saida === '')) {
        alert('Por favor, preencha um valor válido para entrada ou saída.');
        return;
    }

    // Converter entrada e saída para números, tratando campos vazios como zero
    const entradaNum = entrada === '' ? 0 : parseInt(entrada);
    const saidaNum = saida === '' ? 0 : parseInt(saida);

    // Buscar produto pelo nome no storage ou criar um novo
    const products = JSON.parse(localStorage.getItem('products')) || [];
    let selectedProduct = products.find(p => p.produto === produtoInput.value.trim());

    // Se o produto não existe, criar um novo
    if (!selectedProduct) {
        selectedProduct = {
            id: Date.now().toString(), // Gera um ID único
            produto: produtoInput.value.trim(),
            descricao: '',
            imagem: 'https://via.placeholder.com/40',
            estoque: 0,
            estoqueMinimo: 0,
            status: 'Normal'
        };
        products.push(selectedProduct);
    }

    // Calcular novo estoque
    let estoqueAtual = parseInt(selectedProduct.estoque) || 0;
    let novoEstoque = estoqueAtual + entradaNum - saidaNum;

    // Verificar se há estoque suficiente
    if (novoEstoque < 0) {
        alert('Estoque insuficiente para esta saída.');
        return;
    }

    // Atualizar produto
    selectedProduct.estoque = novoEstoque;
    selectedProduct.status = novoEstoque <= selectedProduct.estoqueMinimo ? 'Baixo' : 'Normal';

    // Atualizar produtos no localStorage
    const productIndex = products.findIndex(p => p.produto === selectedProduct.produto);
    if (productIndex >= 0) {
        products[productIndex] = selectedProduct;
    }
    localStorage.setItem('products', JSON.stringify(products));

    // Adicionar ao histórico
    const historico = JSON.parse(localStorage.getItem('historicoMovimentacoes')) || [];
    const novaMovimentacao = {
        data: new Date().toLocaleString(),
        cliente: clienteSelect.options[clienteSelect.selectedIndex].text,
        produto: selectedProduct.produto,
        id: selectedProduct.id,
        descricao: selectedProduct.descricao,
        imagem: selectedProduct.imagem,
        entrada: entradaNum || '',
        saida: saidaNum || '',
        estoque: novoEstoque,
        status: selectedProduct.status
    };

    historico.push(novaMovimentacao);
    localStorage.setItem('historicoMovimentacoes', JSON.stringify(historico));

    alert('Movimentação registrada com sucesso!');
    window.location.href = 'historicodemovimentacao.html';
    movimentacaoForm.reset();
}