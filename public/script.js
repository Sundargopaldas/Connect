document.addEventListener('DOMContentLoaded', function() {
   // Define a URL base
 const API_URL = 'http://connectprint.poa.br:21058';
   const signupForm = document.getElementById('signupForm');
   
   if (signupForm) {
       signupForm.addEventListener('submit', async function(event) {
           event.preventDefault();
           console.log('Formulário de cadastro submetido');
           console.log('Tentando conectar em:', `${API_URL}/api/signup`);

           const newUsername = document.getElementById('newUsername').value;
           const newEmail = document.getElementById('newEmail').value;
           const newPassword = document.getElementById('newPassword').value;

           try {
               const response = await fetch(`${API_URL}/api/signup`, {
                   method: 'POST',
                   credentials: 'include',
                   headers: {
                       'Content-Type': 'application/json',
                       'Accept': 'application/json'
                   },
                   body: JSON.stringify({ 
                       username: newUsername,
                       email: newEmail,
                       password: newPassword 
                   })
               });

               console.log('Resposta recebida:', response);
               const data = await response.json();
               console.log('Resposta do servidor:', data);
if (response.ok) {
    localStorage.setItem('username', data.username);
    alert('Cadastro realizado com sucesso!');
    window.location.href = 'index.html';
} else {
    alert(data.message || 'Erro ao realizar cadastro');
}
               
               
           } catch (error) {
               console.error('Erro detalhado:', error);
               alert('Erro ao conectar com o servidor');
           }
       });
   }

   const loginForm = document.getElementById('loginForm');
   
   if (loginForm) {
       loginForm.addEventListener('submit', async function(event) {
           event.preventDefault();
           console.log('Formulário de login submetido');
           console.log('Tentando conectar em:', `${API_URL}/api/login`);

           const username = document.getElementById('username').value;
           const email = document.getElementById('email').value;
           const password = document.getElementById('password').value;

           try {
               const response = await fetch(`${API_URL}/api/login`, {
                   method: 'POST',
                   credentials: 'include',
                   headers: {
                       'Content-Type': 'application/json',
                       'Accept': 'application/json'
                   },
                   body: JSON.stringify({ 
                       username: username,
                       email: email,
                       password: password 
                   })
               });

               console.log('Resposta recebida:', response);
               const data = await response.json();
               console.log('Resposta do servidor:', data);

               if (response.ok) {
                   localStorage.setItem('username', data.user.username);
                   alert('Login bem-sucedido!');
                   
                   window.location.href = 'PaginaDadosClientes.html';
               } else {
                   alert(data.message || 'Erro ao fazer login');
               }
           } catch (error) {
               console.error('Erro detalhado:', error);
               alert('Erro ao conectar com o servidor');
           }
       });
   }

   const createAccountLink = document.getElementById('createAccountLink');
   if (createAccountLink) {
       createAccountLink.addEventListener('click', function(event) {
           event.preventDefault();
           window.location.href = 'signup.html';
       });
   }

});