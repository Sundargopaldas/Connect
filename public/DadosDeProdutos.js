document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://connectprint.poa.br:21058';
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('clienteId');
    let clientData = null;

    // Configuração do Modal
    const modal = document.getElementById('editModal');
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const editForm = document.getElementById('editForm');

    // Função para fechar o modal
    function closeModal() {
        modal.style.display = 'none';
        // Limpar o formulário
        if (editForm) {
            editForm.reset();
            const previewImage = document.getElementById('previewImage');
            if (previewImage) {
                previewImage.src = 'placeholder.png';
            }
        }
    }

    // Event listeners do modal
    if (closeBtn) {
        closeBtn.onclick = closeModal;
    }

    if (cancelBtn) {
        cancelBtn.onclick = closeModal;
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    // Configuração do formulário
    if (editForm) {
        editForm.onsubmit = async function(e) {
            e.preventDefault();
            
            try {
                const productId = this.dataset.productId;
                
                // Campos do formulário
                const editProduto = document.getElementById('editProduto');
                const editDescricao = document.getElementById('editDescricao');
                const editEstoque = document.getElementById('editEstoque');
                const editEstoqueMinimo = document.getElementById('editEstoqueMinimo');
                const editImagem = document.getElementById('editImagem');

                // Verificar campos obrigatórios
                if (!editProduto || !editDescricao || !editEstoque || !editEstoqueMinimo) {
                    throw new Error('Campos do formulário não encontrados');
                }

                // Preparar dados do produto
                const updatedData = {
                    client_id: clienteId,
                    name: editProduto.value,
                    description: editDescricao.value,
                    stock: parseInt(editEstoque.value) || 0,
                    min_stock: parseInt(editEstoqueMinimo.value) || 0
                };

                // Adicionar imagem se foi selecionada
                if (editImagem && editImagem.files[0]) {
                    const reader = new FileReader();
                    reader.readAsDataURL(editImagem.files[0]);
                    await new Promise((resolve, reject) => {
                        reader.onload = () => {
                            updatedData.image = reader.result;
                            resolve();
                        };
                        reader.onerror = reject;
                    });
                }

                const response = await fetch(`${API_URL}/api/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });

                if (!response.ok) {
                    throw new Error(`Erro ao atualizar produto: ${response.status}`);
                }

                showSuccess('Produto atualizado com sucesso!');
                closeModal();
                await loadProducts();
            } catch (error) {
                console.error('Erro ao atualizar:', error);
                showError('Erro ao atualizar produto: ' + error.message);
            }
        };
    }

    async function parseJsonResponse(response) {
        try {
            return await response.json();
        } catch (e) {
            console.error('Resposta não é JSON válido:', e);
            throw new Error('Resposta da API não é um JSON válido');
        }
    }

    async function loadClientData() {
        try {
            if (!clienteId) {
                throw new Error('ID do cliente não fornecido');
            }

            const response = await fetch(`${API_URL}/api/clients`);
            if (!response.ok) {
                throw new Error('Erro ao carregar dados dos clientes');
            }

            const clients = await parseJsonResponse(response);
            if (!Array.isArray(clients)) {
                console.error('Resposta inesperada:', clients);
                throw new Error('Formato de resposta inválido para clientes');
            }

            clientData = clients.find(client => String(client.id) === String(clienteId));
            
            if (!clientData) {
                throw new Error('Cliente não encontrado');
            }

            const clientHeader = document.createElement('div');
            clientHeader.className = 'client-header';
            clientHeader.innerHTML = `
                <div class="client-info">
                    <img src="${clientData.logo || 'placeholder.png'}" 
                         alt="Logo do cliente"
                         style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"
                         onerror="this.src='placeholder.png'">
                    <h2>${escapeHtml(clientData.name)}</h2>
                </div>
            `;
            
            const table = document.querySelector('#productTable');
            if (table) {
                table.parentNode.insertBefore(clientHeader, table);
            }

            await loadProducts();
        } catch (error) {
            console.error('Erro:', error);
            showError('Erro ao carregar dados do cliente: ' + error.message);
        }
    }

    async function loadProducts() {
        try {
            console.log('Iniciando carregamento dos produtos');
            const response = await fetch(`${API_URL}/api/products`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Erro ao carregar produtos do servidor');
            }

            const allProducts = await parseJsonResponse(response);
            const products = allProducts.filter(product => 
                String(product.client_id) === String(clienteId) || 
                String(product.clientId) === String(clienteId)
            );
            
            const tbody = document.querySelector('#productTable tbody');
            if (!tbody) {
                throw new Error('Elemento tbody não encontrado');
            }

            tbody.innerHTML = '';

            if (products.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="text-center">Nenhum produto encontrado para este cliente</td></tr>';
                return;
            }

            products.forEach(product => {
                const tr = document.createElement('tr');
                tr.style.height = '60px';
                tr.innerHTML = `
                    <td style="width: 60px; text-align: center;">
                        <img src="${product.image || 'placeholder.png'}" 
                             alt="Imagem do produto"
                             style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; vertical-align: middle;"
                             onerror="this.src='placeholder.png'">
                    </td>
                    <td style="width: 100px;">${escapeHtml(product.id || 'N/A')}</td>
                    <td style="width: 150px;">${escapeHtml(clientData.name || 'N/A')}</td>
                    <td style="width: 150px;">${escapeHtml(product.name || 'N/A')}</td>
                    <td style="width: 200px;">${escapeHtml(product.description || '-')}</td>
                    <td style="width: 100px; text-align: center;">${product.stock ?? 'N/A'}</td>
                    <td style="width: 100px; text-align: center;">${product.min_stock ?? 'N/A'}</td>
                    <td style="width: 100px; text-align: center;">
                        <span class="status-badge ${(product.status || 'Normal').toLowerCase()}"
                              style="padding: 4px 8px; border-radius: 4px; background-color: ${product.status === 'Baixo' ? '#ff4444' : '#44aa44'}; color: white;">
                            ${escapeHtml(product.status || 'Normal')}
                        </span>
                    </td>
                    <td style="width: 200px; text-align: center; padding: 10px 0;">
                        <div style="display: flex; justify-content: center; gap: 15px;">
                            <button class="btn-blue edit-btn" data-id="${product.id}" 
                                    style="padding: 6px 12px; background-color: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer; width: 80px;">
                                Editar
                            </button>
                            <button class="remove-btn" data-id="${product.id}"
                                    style="padding: 6px 12px; background-color: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer; width: 80px;">
                                Remover
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            document.querySelectorAll('.edit-btn, .remove-btn').forEach(button => {
                const productId = button.getAttribute('data-id');
                if (productId) {
                    if (button.classList.contains('edit-btn')) {
                        button.onclick = () => editProduct(productId);
                    } else {
                        button.onclick = () => removeProduct(productId);
                    }
                }
            });

        } catch (error) {
            console.error('Erro:', error);
            const tbody = document.querySelector('#productTable tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="9" class="text-center">Erro ao carregar produtos: ' + error.message + '</td></tr>';
            }
            showError('Erro ao carregar produtos: ' + error.message);
        }
    }

    async function removeProduct(productId) {
        try {
            if (!confirm('Tem certeza que deseja remover este produto?')) {
                return;
            }

            const response = await fetch(`${API_URL}/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao remover produto');
            }

            await loadProducts();
            showSuccess('Produto removido com sucesso!');

        } catch (error) {
            console.error('Erro ao remover produto:', error);
            showError(error.message);
        }
    }

    async function editProduct(productId) {
        try {
            console.log('Editando produto:', productId);
            
            const response = await fetch(`${API_URL}/api/products/${productId}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados do produto: ${response.status}`);
            }
            
            const product = await response.json();
            console.log('Dados do produto:', product);

            // Elementos do formulário
            const editCliente = document.getElementById('editCliente');
            const editId = document.getElementById('editId');
            const editProduto = document.getElementById('editProduto');
            const editDescricao = document.getElementById('editDescricao');
            const editEstoque = document.getElementById('editEstoque');
            const editEstoqueMinimo = document.getElementById('editEstoqueMinimo');
            const previewImage = document.getElementById('previewImage');

            // Preencher os campos
            if (editCliente) editCliente.value = clientData?.name || '';
            if (editId) editId.value = product.id || '';
            if (editProduto) editProduto.value = product.name || '';
            if (editDescricao) editDescricao.value = product.description || '';
            if (editEstoque) editEstoque.value = product.stock || 0;
            if (editEstoqueMinimo) editEstoqueMinimo.value = product.min_stock || 0;
            if (previewImage) previewImage.src = product.image || 'placeholder.png';
            
            if (editForm) {
                editForm.dataset.productId = productId;
            }

            // Preview da imagem
            const editImagem = document.getElementById('editImagem');
            if (editImagem) {
                editImagem.onchange = function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            previewImage.src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                };
            }
            
            if (modal) {
                modal.style.display = 'block';
            } else {
                throw new Error('Modal não encontrado');
            }
        } catch (error) {
            console.error('Erro ao editar produto:', error);
            showError('Erro ao editar produto: ' + error.message);
        }
    }

    loadClientData();

    window.loadProducts = loadProducts;
    window.removeProduct = removeProduct;
    window.editProduct = editProduct;
});

function escapeHtml(unsafe) {
    if (unsafe == null) return '';
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showError(message) {
    console.error('Erro:', message);
    showNotification(message, 'error');
}

function showSuccess(message) {
    console.log('Sucesso:', message);
    showNotification(message, 'success');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
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
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}