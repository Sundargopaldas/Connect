document.addEventListener("DOMContentLoaded", function() {
    const API_URL = 'http://connectprint.poa.br:21058';
    
       carregarDadosClientes();

    async function carregarDadosClientes() {
        try {
            const response = await fetch(`${API_URL}/api/clients`);
            if (!response.ok) {
                throw new Error('Erro ao carregar clientes');
            }

            const clientes = await response.json();
            const dadosClientes = document.getElementById("dadosClientes");
            
            dadosClientes.innerHTML = "";

            clientes.forEach((cliente) => {
                const clienteItem = document.createElement("div");
                clienteItem.className = "cliente-item";

                const img = document.createElement("img");
                img.src = cliente.logo || 'placeholder.png';
                img.alt = `Logo de ${cliente.name}`;
                clienteItem.appendChild(img);

                const infoCliente = document.createElement("span");
                infoCliente.className = "cliente-info";
                
                const linkProdutos = document.createElement("a");
                linkProdutos.href = `paginadadosdeprodutos.html?clienteId=${cliente.id}`;
                linkProdutos.textContent = cliente.name;
                
                infoCliente.appendChild(document.createTextNode(`ID: ${cliente.id}, Nome: `));
                infoCliente.appendChild(linkProdutos);
                
                clienteItem.appendChild(infoCliente);

                const btnDelete = document.createElement("button");
                btnDelete.className = "btn-delete";
                btnDelete.textContent = "Deletar";
                btnDelete.onclick = () => deletarCliente(cliente.id);
                clienteItem.appendChild(btnDelete);

                dadosClientes.appendChild(clienteItem);
            });
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            alert('Erro ao carregar lista de clientes');
        }
    }

    async function deletarCliente(clienteId) {
        if (confirm(`Tem certeza que deseja deletar o cliente com ID: ${clienteId}?`)) {
            try {
                const response = await fetch(`${API_URL}/api/clients/${clienteId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Erro ao deletar cliente');
                }

                alert('Cliente deletado com sucesso!');
                await carregarDadosClientes(); // Recarrega a lista após deletar
            } catch (error) {
                console.error('Erro ao deletar cliente:', error);
                alert(error.message || 'Erro ao deletar cliente');
            }
        }
    }

    // Expor funções necessárias globalmente
    window.carregarDadosClientes = carregarDadosClientes;
    window.deletarCliente = deletarCliente;
});