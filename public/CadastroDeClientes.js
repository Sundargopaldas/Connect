document.addEventListener('DOMContentLoaded', function() {
    // Adicione esta constante no início
const API_URL = 'http://connectprint.poa.br:21058';
    const form = document.getElementById('clienteForm');
    
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            console.log('Formulário de cliente submetido');

            const idCliente = document.getElementById('idCliente').value;
            const nomeCliente = document.getElementById('nomeCliente').value;
            const logoInput = document.getElementById('logoCliente');

            // Validação básica
            if (!idCliente || !nomeCliente) {
                alert('Por favor, preencha ID e Nome do cliente');
                return;
            }

            try {
                if (logoInput.files && logoInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = async function(e) {
                        await enviarDadosCliente({
                            id: idCliente,
                            nome: nomeCliente,
                            logo: e.target.result
                        });
                    };
                    reader.readAsDataURL(logoInput.files[0]);
                } else {
                    await enviarDadosCliente({
                        id: idCliente,
                        nome: nomeCliente,
                        logo: null
                    });
                }
            } catch (error) {
                console.error('Erro ao processar formulário:', error);
                alert('Erro ao cadastrar cliente');
            }
        });
    }

    // Função modificada para usar API_URL
    async function enviarDadosCliente(dados) {
        try {
            console.log('Enviando dados do cliente:', dados);
            
            const response = await fetch(`${API_URL}/api/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao cadastrar cliente');
            }

            const data = await response.json();
            console.log('Resposta do servidor:', data);
            
            alert('Cliente cadastrado com sucesso!');
            window.location.href = 'PaginaDadosClientes.html'; // Removido a / do início
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert(error.message || 'Erro ao cadastrar cliente');
            throw error;
        }
    }
});