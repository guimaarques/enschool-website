document.addEventListener("DOMContentLoaded", function() {
    const fadeInElements = document.querySelectorAll('.fade-in');
    const menuHamburguer = document.querySelector('.menu-hamburguer');
    const phoneInput = document.getElementById('lead-phone');
    const leadForm = document.getElementById('lead-form'); // Referência ao formulário
    const workForm = document.getElementById('work-with-us-form');
    const formMessage = document.getElementById('form-message'); // Referência ao div de mensagens

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => observer.observe(el));

    // Lógica para rolagem suave baseada na URL
    const handlePathScrolling = () => {
        const pathMap = {
            '/sobre': '#about-me',
            '/metodo': '#method',
            '/cursos': '#courses'
        };

        const currentPath = window.location.pathname;
        const targetId = pathMap[currentPath];

        if (targetId) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Usamos um pequeno timeout para garantir que a página esteja pronta
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    };

    // Executa a função de rolagem ao carregar a página
    handlePathScrolling();


    // Lógica do Menu Hambúrguer
    if (menuHamburguer) {
        const navContainer = document.querySelector('.navegacao-container');
        const navLinks = document.querySelectorAll('.navegacao a');

        const toggleMenu = () => {
            menuHamburguer.classList.toggle('ativo');
            navContainer.classList.toggle('ativo');
            document.body.style.overflow = navContainer.classList.contains('ativo') ? 'hidden' : '';
        };

        menuHamburguer.addEventListener('click', toggleMenu);

        // Fecha o menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navContainer.classList.contains('ativo')) toggleMenu();
            });
        });
    }

    // Lógica para rolagem suave sem alterar a URL
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Previne o comportamento padrão apenas para links que não são vazios (#)
            if (href.length > 1) {
                e.preventDefault();
            }

            // Pega o ID do alvo, removendo o '#'
            const targetElement = document.querySelector(`[id="${href.substring(1)}"]`);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Lógica da Máscara de Telefone
    if (phoneInput) {
        const applyPhoneMask = (event) => {
            let input = event.target;
            let value = input.value.replace(/\D/g, '');
            value = value.substring(0, 11); // Limita a 11 dígitos (DDD + 9 dígitos)

            if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/^(\d*)/, '($1');
            }
            input.value = value;
        };
        phoneInput.addEventListener('input', applyPhoneMask);
    }

    // Lógica de envio do formulário para a API
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

            // Validação básica
            if (!full_name || !email || !telephone) {
                displayMessage('Por favor, preencha todos os campos.', 'error');
                return;
            }

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

    // Lógica para animar o formulário ao clicar no CTA do header
    const ctaHeaderButtons = document.querySelectorAll('.cabecalho .btn-cta');
    const formContainer = document.querySelector('.destaque-form-container');

    if (ctaHeaderButtons.length > 0 && formContainer) {
        ctaHeaderButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault(); // Previne o comportamento padrão do link

                // Rola a página suavemente para a seção do formulário
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Adiciona a classe para a animação
                formContainer.classList.add('shake-animation');

                // Remove a classe após a animação para que possa ser re-acionada
                setTimeout(() => {
                    formContainer.classList.remove('shake-animation');
                }, 820); // Duração deve ser igual à da animação em CSS (0.82s)
            });
        });
    }

    // Lógica para exibir nome do arquivo no formulário de "Trabalhe Conosco"
    const fileInput = document.getElementById('work-resume');
    if (fileInput) {
        const fileNameDisplay = document.getElementById('file-name');
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
            } else {
                fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
            }
        });
    }

    // Lógica do Banner de Cookies
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptCookiesButton = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesButton) {
        // Verifica se os cookies já foram aceitos
        if (!localStorage.getItem('cookiesAccepted')) {
            // Usa um timeout para o banner deslizar para cima após um momento
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 500);
        }

        acceptCookiesButton.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }
});