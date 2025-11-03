document.addEventListener("DOMContentLoaded", function() {
    const fadeInElements = document.querySelectorAll('.fade-in');

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
});