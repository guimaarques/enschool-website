document.addEventListener("DOMContentLoaded", function() {
    const leadForm = document.getElementById('lead-form'); // Referência ao formulário
    const formMessage = document.getElementById('form-message'); // Referência ao div de mensagens

    
    if (leadForm) {
        leadForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Previne o envio padrão do formulário

            const fullNameInput = document.getElementById('lead-name');
            const emailInput = document.getElementById('lead-email');
            const phoneInputElement = document.getElementById('lead-phone');

            const full_name = fullNameInput.value.trim();
            const email = emailInput.value.trim();
            // Remove todos os caracteres não-numéricos do telefone
            const telephone = phoneInputElement.value.replace(/\D/g, ''); 

            // --- Validações Avançadas ---

            // Validação do Nome (deve ter pelo menos duas palavras)
            if (full_name.split(' ').filter(n => n).length < 2) {
                displayMessage('Por favor, insira seu nome e sobrenome.', 'error');
                fullNameInput.focus(); // Foca no campo com erro
                return;
            }

            // Validação do E-mail (formato válido)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                displayMessage('Por favor, insira um e-mail válido (ex: seu.email@exemplo.com).', 'error');
                emailInput.focus();
                return;
            }

            // Validação do Telefone (deve ter 11 dígitos: DDD + 9 dígitos)
            if (telephone.length !== 11) {
                displayMessage('Por favor, insira um telefone válido com DDD (ex: (11) 98765-4321).', 'error');
                phoneInputElement.focus();
                return;
            }
            // --- Fim das Validações ---

            const apiUrl = 'https://5mxzti9vx0.execute-api.us-east-1.amazonaws.com/prod/customers';

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: full_name,
                        number: telephone,
                        email: email
                    })
                });

                if (response.ok) {
                    // const data = await response.json(); // Se a API retornar JSON de sucesso
                    displayMessage('Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.', 'success');
                    leadForm.reset(); // Limpa o formulário após o sucesso
                } else {
                    // const errorData = await response.json(); // Se a API retornar JSON de erro
                    displayMessage('Ocorreu um erro ao enviar sua mensagem. Tente novamente.', 'error');
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                displayMessage('Não foi possível conectar ao servidor. Verifique sua conexão.', 'error');
            }
        });
    }

    function displayMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message ' + type; // Define a classe para estilização
            // Opcional: Esconde a mensagem após alguns segundos
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
        }
    }
});