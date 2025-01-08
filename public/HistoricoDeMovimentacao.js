document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://connectprint.poa.br:21058';
    const urlParams = new URLSearchParams(window.location.search);
    const clienteId = urlParams.get('clienteId');

    // Função auxiliar para escapar HTML (ADICIONADA AQUI)
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

    async function loadHistorico() {
        try {
            const response = await fetch(`${API_URL}/api/movimentacao/historico`);
            if (!response.ok) {
                throw new Error('Erro ao carregar histórico');
            }

            const data = await response.json();
            console.log('Dados recebidos:', data); // Para debug

            const tbody = document.getElementById('historicoTableBody');
            let newContent = '';

            if (data.length === 0) {
                newContent = '<tr><td colspan="11" class="text-center">Nenhum registro encontrado</td></tr>';
            } else {
                data.forEach(item => {
    const data = new Date(item.action_date).toLocaleString('pt-BR');
    
    newContent += `
        <tr>
            <td>${data}</td>
            <td>${escapeHtml(item.product_id || '')}</td>
            <td>${escapeHtml(item.client_name || '')}</td>
            <td>${escapeHtml(item.product_name || '')}</td>
            <td>${escapeHtml(item.action_type || '')}</td>
            <td>${item.old_stock || 0}</td>
            <td>${item.new_stock || 0}</td>
            <td>
                <span class="status-badge ${(item.status || 'Normal').toLowerCase()}"
                    style="padding: 4px 8px; border-radius: 4px; background-color: ${getStatusColor(item.status)}; color: white;">
                    ${escapeHtml(item.status || 'Normal')}
                </span>
            </td>
            <td>${escapeHtml(item.observation || item.observacao || '-')}</td>
            <td>${escapeHtml(item.user || item.usuario || '-')}</td>
            <td>
    
    <button class="btn-remove" onclick="removeMovimentacao('${item.id}')" 
        style="padding: 6px 12px; background-color: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer; width: 80px;">
        Remover
    </button>
</td>
    `;
});
            }

            tbody.innerHTML = newContent;

        } catch (error) {
            console.error('Erro:', error);
            const tbody = document.getElementById('historicoTableBody');
            tbody.innerHTML = '<tr><td colspan="11" class="text-center">Erro ao carregar histórico: ' + error.message + '</td></tr>';
            showError('Erro ao carregar histórico: ' + error.message);
        }
    }

    function editMovimentacao(id) {
    console.log('ID recebido:', id); // Debug

    fetch(`${API_URL}/api/movimentacao/historico/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(item => {
            console.log('Dados recebidos:', item); // Debug
            
            // Preenche os campos do formulário
            document.getElementById('editData').value = formatDateTimeForInput(item.action_date);
            document.getElementById('editCliente').value = item.client_name || '';
            document.getElementById('editProduto').value = item.product_name || '';
            document.getElementById('editId').value = item.product_id || '';
            document.getElementById('editMovimentacao').value = item.action_type || 'ENTRADA';
            document.getElementById('editEstoque').value = item.new_stock || 0;
            document.getElementById('editStatus').value = item.status || 'Normal';

            // Guarda o ID no formulário para uso posterior
            document.getElementById('editForm').dataset.historyId = id;

            // Exibe o modal
            const modal = document.getElementById('editModal');
            modal.style.display = 'block';
        })
        .catch(error => {
            console.error('Erro:', error);
            showError('Erro ao carregar dados da movimentação: ' + error.message);
        });
}

// Função auxiliar para formatar a data
function formatDateTimeForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
}
    async function removeMovimentacao(id) {
        if (!confirm('Tem certeza que deseja remover esta movimentação?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/movimentacao/historico/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao remover movimentação');
            }

            showSuccess('Movimentação removida com sucesso');
            loadHistorico();
        } catch (error) {
            console.error('Erro:', error);
            showError('Erro ao remover movimentação: ' + error.message);
        }
    }

    function formatDateTimeForInput(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    }

    function getStatusColor(status) {
        switch (status?.toLowerCase()) {
            case 'crítico':
            case 'critico':
                return '#ff0000';
            case 'baixo':
                return '#ff4444';
            default:
                return '#44aa44';
        }
    }

    function showNotification(message, type) {
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
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    function showError(message) {
        showNotification(message, 'error');
    }

    function showSuccess(message) {
        showNotification(message, 'success');
    }

    // Setup modal handlers
    const modal = document.getElementById('editModal');
    if (modal) {
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.btn-cancel');
        const editForm = document.getElementById('editForm');

        if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
        if (cancelBtn) cancelBtn.onclick = () => modal.style.display = 'none';
        
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        if (editForm) {
            editForm.onsubmit = async function(e) {
                e.preventDefault();
                
                const formData = {
                    action_date: document.getElementById('editData').value,
                    action_type: document.getElementById('editMovimentacao').value,
                    new_stock: parseInt(document.getElementById('editEstoque').value),
                    product_id: document.getElementById('editId').value,
                    status: document.getElementById('editStatus').value
                };

                try {
                    const response = await fetch(`${API_URL}/api/movimentacao/historico/${formData.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao atualizar movimentação');
                    }

                    showSuccess('Movimentação atualizada com sucesso');
                    modal.style.display = 'none';
                    loadHistorico();
                } catch (error) {
                    console.error('Erro:', error);
                    showError('Erro ao atualizar movimentação: ' + error.message);
                }
            };
        }
    }

    // Inicializar
    loadHistorico();

    // Expor funções necessárias globalmente
    window.editMovimentacao = editMovimentacao;
    window.removeMovimentacao = removeMovimentacao;
});