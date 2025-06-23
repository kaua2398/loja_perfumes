// ocean.js - Funções específicas da página ocean.html

document.addEventListener('DOMContentLoaded', () => {
    feather.replace();

    function updateCartBadge() {
        let cart = JSON.parse(localStorage.getItem('auraCart')) || [];
        const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const badge = document.getElementById('cart-badge');
        if (badge) {
            if (total > 0) {
                badge.textContent = total;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
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
    function addToCart() {
        let cart = JSON.parse(localStorage.getItem('auraCart')) || [];
        const product = { id: 4, name: 'Océan', price: 79.90, image: 'imagme/ocean.png', quantity: 1 };
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push(product);
        }
        localStorage.setItem('auraCart', JSON.stringify(cart));
        updateCartBadge();
    }
    function addToFav() {
        let favs = JSON.parse(localStorage.getItem('auraFavorites')) || [];
        const product = { id: 4, name: 'Océan', price: 79.90, image: 'imagme/ocean.png' };
        if (!favs.some(item => item.id === product.id)) {
            favs.push(product);
            localStorage.setItem('auraFavorites', JSON.stringify(favs));
            updateFavBadge();
        } else {
            alert('Já está nos favoritos!');
        }
    }
    document.getElementById('add-to-cart').onclick = addToCart;
    document.getElementById('add-to-fav').onclick = addToFav;
    updateCartBadge();
    updateFavBadge();
});
