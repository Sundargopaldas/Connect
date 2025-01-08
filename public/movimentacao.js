document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://connectprint.poa.br:21058';
    const clienteSelect = document.getElementById('cliente');
    const produtoSelect = document.getElementById('produto');
    const produtoInfo = document.getElementById('produtoInfo');
    const form = document.getElementById('movimentacaoForm');

    // Pegar usuário do localStorage
    let username = 'Usuário não identificado';
    try {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            username = user.username || 'Usuário não identificado';
            console.log('Usuário logado:', username);
        }
    } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
    }

    // Carregar clientes da rota correta
   // Trocar apenas esta parte do código
    // Carregar clientes
    fetch(`${API_URL}/api/clients`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar clientes');
            }
            return response.json();
        })
        .then(clients => {
            console.log('Clientes recebidos:', clients); // Debug
            clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>';
            clients.forEach(client => {
                clienteSelect.innerHTML += `<option value="${client.id}">${client.name}</option>`;
            });
        })
        .catch(error => {
            console.error('Erro ao carregar clientes:', error);
            showError('Erro ao carregar lista de clientes');
        });
    // Carregar produtos quando um cliente for selecionado
    clienteSelect.addEventListener('change', function() {
        const clienteId = this.value;
        if (!clienteId) {
            produtoSelect.innerHTML = '<option value="">Selecione um produto</option>';
            produtoInfo.style.display = 'none';
            return;
        }

        fetch(`${API_URL}/api/products/client/${clienteId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar produtos');
                }
                return response.json();
            })
            .then(products => {
                console.log('Produtos recebidos:', products); // Debug
                produtoSelect.innerHTML = '<option value="">Selecione um produto</option>';
                products.forEach(product => {
                    produtoSelect.innerHTML += `<option value="${product.id}">${product.name}</option>`;
                });
            })
            .catch(error => {
                console.error('Erro ao carregar produtos:', error);
                showError('Erro ao carregar lista de produtos');
            });
    });

    // Mostrar informações do produto quando selecionado
    produtoSelect.addEventListener('change', function() {
        const productId = this.value;
        if (!productId) {
            produtoInfo.style.display = 'none';
            return;
        }

        fetch(`${API_URL}/api/products/${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar detalhes do produto');
                }
                return response.json();
            })
            .then(product => {
                produtoInfo.innerHTML = `
                    <div class="product-details">
                        <p><strong>Estoque Atual:</strong> ${product.stock}</p>
                        <p><strong>Estoque Mínimo:</strong> ${product.min_stock}</p>
                        <p><strong>Status:</strong> <span class="status ${product.status.toLowerCase()}">${product.status}</span></p>
                    </div>
                `;
                produtoInfo.style.display = 'block';
            })
            .catch(error => {
                console.error('Erro ao carregar detalhes do produto:', error);
                showError('Erro ao carregar detalhes do produto');
            });
    });

    // Envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const clienteId = clienteSelect.value;
        const productId = produtoSelect.value;
        const entrada = parseInt(document.getElementById('entrada').value) || 0;
        const saida = parseInt(document.getElementById('saida').value) || 0;
        const observacao = document.getElementById('observacao').value;

        if (!clienteId) {
            showError('Selecione um cliente');
            return;
        }

        if (!productId) {
            showError('Selecione um produto');
            return;
        }

        if (entrada === 0 && saida === 0) {
            showError('Informe uma quantidade de entrada ou saída');
            return;
        }

        const movimentacaoData = {
            client_id: clienteId,
            product_id: productId,
            entrada: entrada,
            saida: saida,
            observacao: observacao,
            usuario: username
        };

        console.log('Dados sendo enviados:', movimentacaoData);

        fetch(`${API_URL}/api/movimentacao/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movimentacaoData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao registrar movimentação');
            }
            return response.json();
        })
        .then(data => {
            showSuccess('Movimentação registrada com sucesso!');
            form.reset();
            produtoInfo.style.display = 'none';
            produtoSelect.innerHTML = '<option value="">Selecione um produto</option>';
            
            if (confirm('Movimentação registrada com sucesso! Deseja visualizar o histórico?')) {
                window.location.href = 'historicodemovimentacao.html';
            }
        })
        .catch(error => {
            console.error('Erro ao registrar movimentação:', error);
            showError('Erro ao registrar movimentação');
        });
    });
});

function showError(message) {
    const notification = createNotification(message, 'error');
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

function showSuccess(message) {
    const notification = createNotification(message, 'success');
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 4px;
        color: white;
        background-color: ${type === 'error' ? '#ff4444' : '#44aa44'};
        z-index: 1000;
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
    `;
    closeButton.onclick = () => notification.remove();
    
    notification.appendChild(closeButton);
    return notification;
}