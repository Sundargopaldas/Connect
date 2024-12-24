// Definir variável global para a API
const API_URL = 'http://connectprint.poa.br:21058';

// Definir função no escopo global
window.carregarHistoricoMovimentacoes = async function() {
    const tableBody = document.getElementById('historicoTableBody');
    if (!tableBody) {
        console.error('Tabela não encontrada');
        return;
    }

    try {
        console.log('Buscando histórico do servidor...');
        const response = await fetch(`${API_URL}/api/movimentacao/historico`);
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar histórico: ${response.status}`);
        }

        const historico = await response.json();
        console.log('Dados do histórico:', historico);
        tableBody.innerHTML = '';

        if (!historico || historico.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="11" class="text-center">Nenhum registro encontrado</td></tr>';
            return;
        }

        historico.forEach(item => {
            const row = document.createElement('tr');
            
            const data = new Date(item.action_date).toLocaleString('pt-BR');
            const dataClienteFormatado = `${data}<br>${item.client_name || ''}`;

            const quantidade = Math.abs(item.new_stock - item.old_stock);
            const entrada = item.action_type === 'ENTRADA' ? quantidade : '';
            const saida = item.action_type === 'SAIDA' ? quantidade : '';

            row.innerHTML = `
                <td class="data-cliente">${dataClienteFormatado}</td>
                <td class="col-produto">${item.product_name || ''}</td>
                <td class="col-id">${item.product_id || ''}</td>
                <td class="col-numero">${entrada}</td>
                <td class="col-numero">${saida}</td>
                <td class="col-numero">${item.new_stock}</td>
                <td class="col-status">
                    <span class="status-badge ${(item.status || 'Normal').toLowerCase()}">
                        ${item.status || 'Normal'}
                    </span>
                </td>
                <td class="col-observacao">${item.observacao || ''}</td>
                <td class="col-usuario">${item.usuario || ''}</td>
                <td class="col-acao">
                    <button class="btn-red" onclick="removerItemHistorico('${item.id}')">
                        Remover
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        alert('Erro ao carregar histórico de movimentações: ' + error.message);
    }
};

// Definir função de remoção no escopo global
window.removerItemHistorico = async function(id) {
    if (!confirm('Tem certeza que deseja remover este item do histórico?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/movimentacao/historico/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao remover item');
        }

        alert('Item removido com sucesso!');
        await carregarHistoricoMovimentacoes();
    } catch (error) {
        console.error('Erro ao remover item:', error);
        alert('Erro ao remover item do histórico: ' + error.message);
    }
};

// Quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de histórico carregada');
    // Carregar dados inicialmente
    carregarHistoricoMovimentacoes();
    // Atualizar a cada 5 segundos
    setInterval(carregarHistoricoMovimentacoes, 5000);
});