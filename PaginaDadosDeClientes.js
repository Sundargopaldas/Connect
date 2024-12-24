document.addEventListener("DOMContentLoaded", function() {
    carregarDadosClientes();
});

function carregarDadosClientes() {
    const dadosClientes = document.getElementById("dadosClientes");
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    dadosClientes.innerHTML = "";

    clientes.forEach((cliente, index) => {
        const clienteItem = document.createElement("div");
        clienteItem.className = "cliente-item";

        const img = document.createElement("img");
        img.src = cliente.logo || 'placeholder.png';
        img.alt = `Logo de ${cliente.nome}`;
        clienteItem.appendChild(img);

        const infoCliente = document.createElement("span");
        infoCliente.className = "cliente-info";
        
        // Criando o link para a página de produtos do cliente
        const linkProdutos = document.createElement("a");
        linkProdutos.href = `paginadadosdeprodutos.html?clienteId=${cliente.id}`;
        linkProdutos.textContent = cliente.nome;
        
        infoCliente.appendChild(document.createTextNode(`ID: ${cliente.id}, Nome: `));
        infoCliente.appendChild(linkProdutos);
        
        clienteItem.appendChild(infoCliente);

        const btnDelete = document.createElement("button");
        btnDelete.className = "btn-delete";
        btnDelete.textContent = "Deletar";
        btnDelete.onclick = () => deletarCliente(index);
        clienteItem.appendChild(btnDelete);

        dadosClientes.appendChild(clienteItem);
    });
}

function deletarCliente(index) {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    
    if (confirm("Tem certeza que deseja deletar este cliente?")) {
        clientes.splice(index, 1);
        localStorage.setItem("clientes", JSON.stringify(clientes));
        carregarDadosClientes(); // Atualiza a exibição após deletar
    }
}