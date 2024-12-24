document.addEventListener("DOMContentLoaded", function() {
    const clienteForm = document.getElementById("clienteForm");

    clienteForm?.addEventListener("submit", function(event) {
        event.preventDefault();

        const logoCliente = document.getElementById("logoCliente").files[0];
        const idCliente = document.getElementById("idCliente").value;
        const nomeCliente = document.getElementById("nomeCliente").value;

        const reader = new FileReader();
        reader.onload = function(e) {
            // Criamos um objeto com os dados do cliente
            const cliente = {
                logo: e.target.result,  // Imagem convertida para base64
                id: idCliente,
                nome: nomeCliente
            };

            // Salvamos os dados no localStorage
            let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
            clientes.push(cliente);
            localStorage.setItem("clientes", JSON.stringify(clientes));

            // Redirecionamos o usuário para a página PaginaDadosClientes.html
            window.location.href = "PaginaDadosClientes.html";
        };

        if (logoCliente) {
            reader.readAsDataURL(logoCliente);
        } else {
            // Se não houver imagem, ainda envia o resto dos dados
            const cliente = {
                logo: null,  // Sem imagem
                id: idCliente,
                nome: nomeCliente
            };

            let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
            clientes.push(cliente);
            localStorage.setItem("clientes", JSON.stringify(clientes));
            window.location.href = "PaginaDadosClientes.html";
        }
    });
});