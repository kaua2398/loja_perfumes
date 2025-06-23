// ...existing code...
// Garante que todos os ícones Feather sejam renderizados corretamente
function renderFeatherIcons() {
  if (window.feather) {
    feather.replace();
  } else {
    setTimeout(renderFeatherIcons, 100);
  }
}

window.onload = renderFeatherIcons;
// ...existing code...
// Lógica para o menu móvel
const menuButton = document.getElementById('menu-button');
const mobileMenu = document.getElementById('mobile-menu');

menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Fechar o menu ao clicar num link
const navLinks = document.querySelectorAll('#mobile-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
         mobileMenu.classList.add('hidden');
    });
});

// --- Lógica do Carrossel Deslizante ---
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.getElementById('carousel-container');
    const slides = document.querySelectorAll('.carousel-item');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 segundos
    const totalSlides = slides.length;

    // Cria os indicadores (bolinhas)
    slides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.classList.add('w-3', 'h-3', 'rounded-full', 'transition', 'duration-300');
        indicator.classList.add(index === 0 ? 'bg-white' : 'bg-white/50', 'hover:bg-white');
        indicator.setAttribute('data-slide-to', index);
        indicatorsContainer.appendChild(indicator);
    });
    // ...restante do código do carrossel...
});
// ...existing code...
