// Função para carregar o histórico de movimentações
function carregarHistoricoMovimentacoes() {
    const tableBody = document.getElementById('historicoTableBody');
    if (!tableBody) return;

    const historico = JSON.parse(localStorage.getItem('historicoMovimentacoes')) || [];
    
    // Limpa a tabela
    tableBody.innerHTML = '';
    
    historico.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // Combina data e cliente em uma única coluna
        const dataClienteFormatado = `${item.data || ''}<br>${item.cliente || ''}`;
        
        // Cria o conteúdo da linha
        row.innerHTML = `
            <td class="data-cliente">${dataClienteFormatado}</td>
            <td class="col-produto">${item.produto || ''}</td>
            <td class="col-id">${item.id || ''}</td>
            <td class="col-descricao">${item.descricao || ''}</td>
            <td class="col-img">
                <img src="${item.imagem || 'https://via.placeholder.com/40'}" 
                     alt="Imagem do produto"
                     onerror="this.src='https://via.placeholder.com/40'">
            </td>
            <td class="col-numero">${item.entrada || ''}</td>
            <td class="col-numero">${item.saida || ''}</td>
            <td class="col-numero">${item.estoque || ''}</td>
            <td class="col-status">${item.status || ''}</td>
            <td class="col-acao">
                <button class="btn-red" onclick="removerItemHistorico(${index})">
                    Remover
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Função para remover um item do histórico
function removerItemHistorico(index) {
    if (!confirm('Tem certeza que deseja remover este item?')) return;
    
    let historico = JSON.parse(localStorage.getItem('historicoMovimentacoes')) || [];
    historico.splice(index, 1);
    localStorage.setItem('historicoMovimentacoes', JSON.stringify(historico));
    carregarHistoricoMovimentacoes();
}

// Carrega o histórico quando a página carregar
document.addEventListener('DOMContentLoaded', carregarHistoricoMovimentacoes);

// Recarrega a cada 5 segundos
setInterval(carregarHistoricoMovimentacoes, 5000);