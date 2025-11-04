document.addEventListener("DOMContentLoaded", function() {
    const fadeInElements = document.querySelectorAll('.fade-in');
    const menuHamburguer = document.querySelector('.menu-hamburguer');

    const observerOptions = {
        root: null, // usa o viewport como a área de observação
        rootMargin: '0px',
        threshold: 0.1 // aciona quando 10% do elemento está visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible'); // Adiciona a classe quando entra na tela
            } else {
                entry.target.classList.remove('is-visible'); // Remove a classe quando sai da tela
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
            // Impede o scroll da página quando o menu está aberto
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
});