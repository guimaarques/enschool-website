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
            value = value.substring(0, 15); // Limita a 15 dígitos (DDI + DDD + 9 dígitos)

            if (value.length > 11) {
                if (value.startsWith('55') && value.length === 13) {
                    value = value.replace(/^(\d{2})(\d{2})(\d{5})(\d{4}).*/, '+$1 ($2) $3-$4');
                } else {
                    value = '+' + value;
                }
            } else if (value.length > 6) {
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

    // Lógica para animar o formulário ao clicar nos CTAs
    const formScrollTriggers = document.querySelectorAll('.js-scroll-to-form');
    const formContainer = document.querySelector('.destaque-form-container');

    if (formScrollTriggers.length > 0 && formContainer) {
        formScrollTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault(); // Previne o comportamento padrão do link

                // Rola a página suavemente para a seção do formulário
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Adiciona a classe para a animação e a remove depois
                // Garante que a animação não seja adicionada se já estiver presente
                if (!formContainer.classList.contains('shake-animation')) {
                    formContainer.classList.add('shake-animation');
                    setTimeout(() => {
                        formContainer.classList.remove('shake-animation');
                    }, 820); // Duração deve ser igual à da animação em CSS
                }
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

    // --- Lógica do Modal de Venda (Carregamento Dinâmico) ---

    const showVendaModal = async () => {
        // Se o modal já existe no DOM, apenas o exiba.
        const existingModal = document.getElementById('vendaModal');
        if (existingModal) {
            existingModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            return;
        }

        try {
            // Busca o conteúdo do modal do arquivo HTML.
            const response = await fetch('/modals/matricula-aula-grupo.html');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const modalHTML = await response.text();

            // Insere o HTML do modal no final do body.
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            const modal = document.getElementById('vendaModal');
            const closeModalBtn = document.getElementById('closeModalBtn');

            // Função para fechar o modal
            const closeModal = () => {
                modal.classList.remove('show');
                document.body.style.overflow = ''; // Restaura o scroll
                sessionStorage.setItem('vendaModalClosed', 'true'); // Marca que o modal foi fechado na sessão
            };

            // Adiciona os eventos de clique para fechar
            closeModalBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (event) => {
                if (event.target === modal) closeModal();
            });

            // Exibe o modal com uma pequena transição
            // requestAnimationFrame garante que o navegador processe a inserção antes da animação.
            requestAnimationFrame(() => {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Impede o scroll da página ao fundo
            });

        } catch (error) {
            console.error("Falha ao carregar o modal:", error);
        }
    };

    // Fecha o modal se o usuário pressionar a tecla 'Escape'
    document.addEventListener('keydown', (event) => {
        const modal = document.getElementById('vendaModal');
        if (event.key === 'Escape' && modal && modal.classList.contains('show')) {
            // Reutiliza a lógica de fechar para manter a consistência
            modal.querySelector('.close-button').click();
        }
    });

    // Abre o modal automaticamente apenas se ele ainda não foi fechado nesta sessão
    if (!sessionStorage.getItem('vendaModalClosed')) {
        setTimeout(showVendaModal, 500); // Um pequeno delay para a página renderizar primeiro
    }

    // O botão no card de "Aulas ao Vivo" também deve abrir o modal
    const openLiveClassModalBtn = document.querySelector('.product-card .btn-card'); // Ajuste o seletor se necessário
    if (openLiveClassModalBtn && openLiveClassModalBtn.closest('.product-link').href.includes('#home')) {
        openLiveClassModalBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Previne a rolagem para o topo
            showVendaModal();
        });
    }
});