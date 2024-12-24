
document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://connectprint.poa.br:21058';
    console.log('Página carregada');
    initializeApp();

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
                throw new Error(`Resposta inválida do servidor: ${text.substring(0, 100)}...`);
            }
        }
    }

    async function carregarClientes() {
        try {
            console.log('Carregando clientes...');
            const response = await fetch(`${API_URL}/api/clients`); // URL correta do servidor
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Resposta do servidor:', errorText);
                throw new Error(`Erro ao carregar clientes: ${response.status} ${response.statusText}`);
            }
            
            const clientes = await parseJsonResponse(response);
            console.log('Clientes carregados:', clientes);
            
            if (!Array.isArray(clientes)) {
                throw new Error('Formato de resposta inválido: esperava um array de clientes');
            }
            
            const selectCliente = document.getElementById('cliente');
            if (!selectCliente) {
                throw new Error('Elemento select cliente não encontrado');
            }

            selectCliente.innerHTML = '<option value="">Selecione um cliente</option>';
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.name;
                selectCliente.appendChild(option);
            });

        } catch (error) {
            console.error('Erro detalhado:', error);
            alert('Erro ao carregar lista de clientes: ' + error.message);
        }
    }

    function setupEventListeners() {
        const form = document.getElementById('productForm');
        if (!form) {
            console.error('Formulário não encontrado');
            return;
        }
        
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            console.log('Formulário de produto submetido');

            const formElements = event.target.elements;
            
            // Validações básicas
            if (!formElements.id.value || !formElements.cliente.value || !formElements.produto.value) {
                alert('Por favor, preencha todos os campos obrigatórios');
                return;
            }

            try {
                const productData = {
                    id: formElements.id.value.trim(),
                    client_id: formElements.cliente.value.trim(),
                    name: formElements.produto.value.trim(),
                    description: formElements.descricao?.value?.trim() || '',
                    stock: parseInt(formElements.quantEstoque?.value) || 0,
                    min_stock: parseInt(formElements.estMinimo?.value) || 0,
                    status: 'Normal',
                    image: 'placeholder.png'
                };

                // Calcula o status baseado no estoque
                if (productData.stock <= productData.min_stock) {
                    productData.status = 'Baixo';
                }

                // Se houver imagem, processar
                const imageInput = formElements.imagem;
                if (imageInput?.files?.[0]) {
                    try {
                        productData.image = await convertToBase64(imageInput.files[0]);
                    } catch (imageError) {
                        console.error('Erro ao processar imagem:', imageError);
                        alert('Erro ao processar a imagem. Usando imagem padrão.');
                    }
                }

                console.log('Enviando dados:', productData);

                const response = await fetch(`${API_URL}/api/products`, { // URL correta do servidor
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(productData)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Resposta de erro do servidor:', errorText);
                    throw new Error(`Erro ao cadastrar produto: ${response.status} ${response.statusText}`);
                }

                const result = await parseJsonResponse(response);
                console.log('Produto cadastrado:', result);
                
                alert('Produto cadastrado com sucesso!');
                window.location.href = `paginadadosdeprodutos.html?clienteId=${productData.client_id}`;

            } catch (error) {
                console.error('Erro ao cadastrar produto:', error);
                alert('Erro ao cadastrar produto: ' + error.message);
            }
        });
    }

    async function initializeApp() {
        try {
            await carregarClientes();
            setupEventListeners();
            console.log('Aplicação inicializada com sucesso');
        } catch (error) {
            console.error('Erro na inicialização:', error);
            alert('Erro ao inicializar a aplicação: ' + error.message);
        }
    }

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }
});