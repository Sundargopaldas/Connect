// Função para manipular o envio do formulário de login
document.getElementById("loginForm")?.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Verifica se o usuário existe no localStorage
    const storedUser = JSON.parse(localStorage.getItem(email));

    if (storedUser) {
        if (storedUser.password === password && storedUser.username === username) {
            alert("Login bem-sucedido!");
            window.location.href = "PaginaDadosClientes.html";
        } else {
            alert("Usuário ou senha incorretos.");
        }
    } else {
        alert("Usuário não encontrado. Por favor, cadastre-se.");
    }
});

// Função para manipular o envio do formulário de cadastro
document.getElementById("signupForm")?.addEventListener("submit", function (event) {
    event.preventDefault();

    const newUsername = document.getElementById("newUsername").value;
    const newEmail = document.getElementById("newEmail").value;
    const newPassword = document.getElementById("newPassword").value;

    // Cria um objeto com os dados do usuário
    const userData = {
        username: newUsername,
        email: newEmail,
        password: newPassword
    };

    // Armazena os dados no localStorage com a chave sendo o email
    localStorage.setItem(newEmail, JSON.stringify(userData));

    alert("Cadastro realizado com sucesso!");

    // Redireciona para a página de login após o cadastro
    window.location.href = "index.html";
});

// Redirecionar para a página de cadastro
document.getElementById("createAccountLink")?.addEventListener("click", function () {
    window.location.href = "signup.html";
});