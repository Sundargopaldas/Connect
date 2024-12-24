document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://connectprint.poa.br:21058';
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const clientId = urlParams.get('clientId');

    async function loadProductData() {
        try {
            const response = await fetch(`${API_URL}/api/products/${productId}`);
            if (!response.ok) {
                throw new Error('Erro ao carregar dados do produto');
            }

            const product = await response.json();
            
            // Preenche o formulário com os dados do produto
            document.getElementById('id').value = product.id;
            document.getElementById('name').value = product.name;
            document.getElementById('description').value = product.description || '';
            document.getElementById('stock').value = product.stock;
            document.getElementById('min_stock').value = product.min_stock;
            document.getElementById('image').value = product.image || '';

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao carregar dados do produto: ' + error.message);
        }
    }

    const form = document.getElementById('editProductForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                id: document.getElementById('id').value,
                name: document.getElementById('name').value,
                description: document.getElementById('description').value,
                stock: parseInt(document.getElementById('stock').value),
                min_stock: parseInt(document.getElementById('min_stock').value),
                image: document.getElementById('image').value,
                client_id: clientId
            };

            try {
                const response = await fetch(`${API_URL}/api/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Erro ao atualizar produto');
                }

                alert('Produto atualizado com sucesso!');
                window.location.href = `paginadadosdeprodutos.html?clientId=${clientId}`;

            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao atualizar produto: ' + error.message);
            }
        });
    }

    if (productId) {
        loadProductData();
    }
});