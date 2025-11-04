document.addEventListener("DOMContentLoaded", function() {
    const fadeInElements = document.querySelectorAll('.fade-in');
    const menuHamburguer = document.querySelector('.menu-hamburguer');
    const phoneInput = document.getElementById('lead-phone');

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
});