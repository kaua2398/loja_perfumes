function updateCartBadge() {
        let cart = JSON.parse(localStorage.getItem('auraCart')) || [];
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
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

    document.addEventListener('DOMContentLoaded', () => {
        const favoritesContainer = document.getElementById('favorites-container');

        function getFavorites() {
            return JSON.parse(localStorage.getItem('auraFavorites')) || [];
        }

        function saveFavorites(favorites) {
            localStorage.setItem('auraFavorites', JSON.stringify(favorites));
            renderFavorites();
        }

        function removeFromFavorites(productId) {
            let favorites = getFavorites();
            favorites = favorites.filter(item => item.id !== productId);
            saveFavorites(favorites);
        }

        function addToCart(product) {
            let cart = JSON.parse(localStorage.getItem('auraCart')) || [];
            const existing = cart.find(item => item.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({...product, quantity: 1});
            }
            localStorage.setItem('auraCart', JSON.stringify(cart));
            alert(`'${product.name}' foi adicionado ao carrinho!`);
        }

        function renderFavorites() {
            const favorites = getFavorites();

            if (favorites.length === 0) {
                favoritesContainer.innerHTML = `
                    <div class="col-span-full text-center py-16">
                        <h2 class="text-2xl font-semibold mb-4">A sua lista de favoritos está vazia.</h2>
                        <p class="text-stone-600 mb-6">Clique no coração dos produtos que você ama para guardá-los aqui.</p>
                        <a href="index.html" class="bg-stone-800 text-white font-bold py-3 px-8 rounded-md hover:bg-stone-900 transition duration-300">Explorar Produtos</a>
                    </div>
                `;
                return;
            }

            const favoritesHTML = favorites.map(product => `
                <div class="bg-white rounded-lg shadow-md overflow-hidden group">
                    <div class="relative">
                        <img src="${product.image}" alt="Perfume ${product.name}" class="w-full h-auto">
                    </div>
                    <div class="p-6 text-center">
                        <h3 class="text-xl font-semibold mb-1">${product.name}</h3>
                        <span class="text-lg font-bold text-rose-500">R$ ${product.price.toFixed(2)}</span>
                        <button class="mt-4 w-full bg-stone-800 text-white py-2 px-4 rounded-md hover:bg-stone-900 transition duration-300 add-to-cart-btn" data-product='${JSON.stringify(product)}'>Adicionar ao Carrinho</button>
                        <button class="mt-2 w-full text-sm text-stone-500 hover:text-red-500 transition remove-favorite-btn" data-id="${product.id}">Remover dos Favoritos</button>
                    </div>
                </div>
            `).join('');

            favoritesContainer.innerHTML = favoritesHTML;
            addFavoritesActionListeners();
        }

        function addFavoritesActionListeners() {
            document.querySelectorAll('.remove-favorite-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    removeFromFavorites(parseInt(e.currentTarget.dataset.id));
                });
            });

            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const product = JSON.parse(e.currentTarget.dataset.product);
                    addToCart(product);
                });
            });
        }

        renderFavorites();
        updateCartBadge();
        feather.replace();
    });