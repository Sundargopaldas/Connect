document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://connectprint.poa.br:21058';

    const urlParams = new URLSearchParams(window.location.search)
    const clienteId = urlParams.get('clienteId');
    let clientData = null;

    async function parseJsonResponse(response) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        } else {
            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('Resposta não é JSON válido:', text);
                throw new Error('Resposta da API não é um JSON válido');
            }
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
            const response = await fetch(`${API_URL}/api/products`);
            
            if (!response.ok) {
                throw new Error('Erro ao carregar produtos');
            }

            const allProducts = await parseJsonResponse(response);
            if (!Array.isArray(allProducts)) {
                console.error('Resposta inesperada:', allProducts);
                throw new Error('Formato de resposta inválido para produtos');
            }

            const products = allProducts.filter(product => 
                String(product.client_id) === String(clienteId) || 
                String(product.clientId) === String(clienteId)
            );
            
            console.log('Produtos carregados:', products);

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
                // Na função loadProducts, encontre a parte que gera a coluna de ações (td) e atualize para:
tr.innerHTML = `
    <img src="${product.image}" 
             alt="${product.name}"
             style="width: 40px; height: 40px; object-fit: contain; border-radius: 4px;"
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999\' stroke-width=\'2\'%3E%3Crect x=\'3\' y=\'3\' width=\'18\' height=\'18\' rx=\'2\'/%3E%3Cline x1=\'8\' y1=\'12\' x2=\'16\' y2=\'12\'/%3E%3C/svg%3E'"
        >
    <td>${escapeHtml(product.id || 'N/A')}</td>
    <td>${escapeHtml(clientData.name || 'N/A')}</td>
    <td>${escapeHtml(product.name || 'N/A')}</td>
    <td>${escapeHtml(product.description || '-')}</td>
    <td>${product.stock ?? 'N/A'}</td>
    <td>${product.min_stock ?? 'N/A'}</td>
    <td>
        <span class="status-badge ${(product.status || 'Normal').toLowerCase()}"
              style="padding: 4px 8px; border-radius: 4px; background-color: ${product.status === 'Baixo' ? '#ff4444' : '#44aa44'}; color: white;">
            ${escapeHtml(product.status || 'Normal')}
        </span>
    </td>
    <td>
        <button class="btn-blue edit-btn" 
        data-id="${product.id}"
        style="padding: 6px 12px; margin-bottom: 8px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; width: 75px;">
    Editar
</button>
         <button class="remove-btn" 
                data-id="${product.id.trim()}"  // Garante que não há espaços extras
                style="padding: 6px 12px; background-color: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Remover
        </button>
    </td>
`;
                
                tbody.appendChild(tr);
            });

            document.querySelectorAll('.remove-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    if (productId) {
                        removeProduct(productId);
                    }
                });
            });

            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    if (productId) {
                        editProduct(productId);
                    }
                });
            });

        } catch (error) {
            console.error('Erro:', error);
            showError('Erro ao carregar produtos: ' + error.message);
            const tbody = document.querySelector('#productTable tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="9" class="text-center">Erro ao carregar produtos</td></tr>';
            }
        }
    }

    async function removeProduct(productId) {
    try {
        if (!confirm('Tem certeza que deseja remover este produto?')) {
            return;
        }

        // Limpa o ID antes de fazer a requisição
        const cleanId = encodeURIComponent(productId.trim());
        
        const response = await fetch(`${API_URL}/api/products/${cleanId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao remover produto: ${errorText}`);
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
        const response = await fetch(`${API_URL}/api/products/${productId}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar dados do produto: ${response.status}`);
        }
        
        const product = await response.json();
        
        document.getElementById('editCliente').value = clientData.name || '';
        document.getElementById('editId').value = product.id || '';
        document.getElementById('editProduto').value = product.name || '';
        document.getElementById('editDescricao').value = product.description || '';
        document.getElementById('editEstoque').value = product.stock || 0;
        document.getElementById('editEstoqueMinimo').value = product.min_stock || 0;
        
        // Atualiza a imagem preview
        const imagePreview = document.getElementById('editImagemPreview');
        imagePreview.src = product.image || 'placeholder.png';
        imagePreview.onerror = () => { imagePreview.src = 'placeholder.png'; };
        
        document.getElementById('editForm').dataset.productId = productId;
        
        const modal = document.getElementById('editModal');
        modal.style.display = 'block';
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        showError('Erro ao editar produto: ' + error.message);
    }
}

  const modal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');

if (modal) {
    const span = modal.querySelector('.close');
    const btnCancel = modal.querySelector('.btn-cancel');

    if (span) {
        span.onclick = function() {
            modal.style.display = 'none';
        }
    }

    if (btnCancel) {
        btnCancel.onclick = function() {
            modal.style.display = 'none';
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}
    if (editForm) {
    editForm.onsubmit = async function(e) {
        e.preventDefault();
        
        try {
            const productId = this.dataset.productId;
            const imageInput = document.getElementById('editImagem');
            let updatedImage = document.getElementById('editImagemPreview').src;

            // Se uma nova imagem foi selecionada
            if (imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                updatedImage = await new Promise((resolve) => {
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(imageInput.files[0]);
                });
            }
            
            const updatedData = {
                client_id: clienteId,
                name: document.getElementById('editProduto').value,
                description: document.getElementById('editDescricao').value,
                stock: parseInt(document.getElementById('editEstoque').value) || 0,
                min_stock: parseInt(document.getElementById('editEstoqueMinimo').value) || 0,
                image: updatedImage
            };

            const response = await fetch(`${API_URL}/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error(`Erro ao atualizar produto: ${response.status}`);
            }
             alert("Alteração feita com sucesso");
            showSuccess('Produto atualizado com sucesso!');
            modal.style.display = 'none';
            await loadProducts();
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            showError('Erro ao atualizar produto: ' + error.message);
        }
    };
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