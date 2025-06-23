// Garante que todos os ícones Feather sejam renderizados corretamente
function renderFeatherIcons() {
  if (window.feather) {
    feather.replace();
  } else {
    // Tenta novamente após um pequeno atraso caso feather ainda não esteja disponível
    setTimeout(renderFeatherIcons, 100);
  }
}

window.onload = renderFeatherIcons; // This ensures a final pass for all static icons after the page fully loads.

// Consolidate all DOMContentLoaded logic into a single listener
document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica para o menu móvel ---
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) { // Add null checks for robustness
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Fechar o menu ao clicar num link
    const navLinks = document.querySelectorAll('#mobile-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
             if (mobileMenu) mobileMenu.classList.add('hidden'); // Add null check
        });
    });

    // --- Lógica do Carrossel Deslizante ---
    const carouselContainer = document.getElementById('carousel-container');
    const slides = document.querySelectorAll('.carousel-item');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    if (carouselContainer && slides.length > 0 && indicatorsContainer) { // Add null checks
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
        
        const indicators = document.querySelectorAll('#carousel-indicators button');

        function updateCarousel(slideIndex) {
            // Garante que o index seja circular
            currentSlide = (slideIndex + totalSlides) % totalSlides;
            
            // Desliza o container
            carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

            // Atualiza os indicadores
            indicators.forEach((indicator, index) => {
                if(index === currentSlide) {
                    indicator.classList.add('bg-white');
                    indicator.classList.remove('bg-white/50');
                } else {
                    indicator.classList.remove('bg-white');
                    indicator.classList.add('bg-white/50');
                }
            });
        }

        // Inicia a transição automática
        let autoSlide = setInterval(() => {
            updateCarousel(currentSlide + 1);
        }, slideInterval);

        // Adiciona evento de clique nos indicadores
        indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.getAttribute('data-slide-to'));
                updateCarousel(slideIndex);
                // Reinicia o intervalo do slide automático ao clicar
                clearInterval(autoSlide);
                autoSlide = setInterval(() => {
                    updateCarousel(currentSlide + 1);
                }, slideInterval);
            });
        });
    }

    // --- Lógica do Carrinho (inicialização) ---
    updateCartBadge();
    document.querySelectorAll('[data-add-cart]').forEach(btn => {
        btn.addEventListener('click', function() {
            const product = JSON.parse(this.dataset.product);
            addToCart(product);
        });
    });

    // --- Lógica dos Favoritos (inicialização) ---
    updateFavBadge();
    document.querySelectorAll('[data-fav]').forEach(btn => {
        const product = JSON.parse(btn.dataset.product);
        function updateHeart() {
            const icon = btn.querySelector('i');
            if (icon) { // Add null check for icon element
                if (isFavorite(product.id)) {
                    icon.setAttribute('fill', 'currentColor');
                    icon.classList.add('text-rose-500');
                    icon.classList.remove('text-stone-500');
                } else {
                    icon.removeAttribute('fill');
                    icon.classList.remove('text-rose-500');
                    icon.classList.add('text-stone-500');
                }
            }
        }
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleFavorite(product);
            updateHeart();
            updateFavBadge();
        });
        updateHeart(); // Initial update for heart icon state
    });

    // Embora window.onload já faça isso, uma chamada extra aqui garante a renderização
    // assim que o DOM estiver pronto, sem esperar por imagens.
    if (window.feather) feather.replace();
});

// --- Funções auxiliares (devem permanecer fora do DOMContentLoaded) ---

// Função para adicionar ao carrinho
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('auraCart')) || [];
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    localStorage.setItem('auraCart', JSON.stringify(cart));
    // Atualiza badge do carrinho
    updateCartBadge();
}

// Atualiza o badge do carrinho no header
function updateCartBadge() {
    let cart = JSON.parse(localStorage.getItem('auraCart')) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('a[aria-label="Ir para o carrinho"] span');
    if (badge) badge.textContent = total;
}

// Função para favoritos
function toggleFavorite(product) {
    let favorites = JSON.parse(localStorage.getItem('auraFavorites')) || [];
    const idx = favorites.findIndex(item => item.id === product.id);
    if (idx >= 0) {
        favorites.splice(idx, 1);
    } else {
        favorites.push(product);
    }
    localStorage.setItem('auraFavorites', JSON.stringify(favorites));
}

function isFavorite(productId) {
    let favorites = JSON.parse(localStorage.getItem('auraFavorites')) || [];
    return favorites.some(item => item.id === productId);
}

function updateFavBadge() {
    let favs = JSON.parse(localStorage.getItem('auraFavorites')) || [];
    const badge = document.getElementById('fav-badge');
    if (badge) {
        if (favs.length > 0) {
            badge.textContent = favs.length;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}