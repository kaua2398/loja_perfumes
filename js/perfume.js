document.addEventListener('DOMContentLoaded', () => {
        // --- BASE DE DADOS E ESTADO ---
        const products = [
            { id: 1, name: 'Lumière', description: 'Floral & Radiante', price: 89.90, image: 'imagme/lumiere.png' },
            { id: 2, name: 'Noir', description: 'Amadeirado & Intenso', price: 95.50, image: 'imagme/noir.png' },
            { id: 3, name: 'Fleur', description: 'Frutado & Delicado', price: 82.00, image: 'imagme/fleur.png' },
            { id: 4, name: 'Océan', description: 'Cítrico & Refrescante', price: 79.90, image: 'imagme/ocean.png' }
        ];

        // --- FUNÇÕES DE RENDERIZAÇÃO ---
        function renderProducts() {
            const productListContainer = document.getElementById('product-list');
            if (!productListContainer) return;
            
            const favorites = getFavorites();
            productListContainer.innerHTML = '';
            
            products.forEach(product => {
                const isFavorited = favorites.some(fav => fav.id === product.id);
                const heartIconClass = isFavorited ? 'text-rose-500 filled' : 'text-stone-500';

                productListContainer.innerHTML += `
                    <div class="bg-white rounded-lg shadow-md overflow-hidden group">
                        <div class="relative">
                            <img src="${product.image}" alt="Perfume ${product.name}" class="w-full h-auto transform group-hover:scale-110 transition-transform duration-500 cursor-pointer">
                            <div class="favorite-btn absolute top-4 right-4 bg-white p-2 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" data-product-id="${product.id}">
                                <i data-feather="heart" class="${heartIconClass}"></i>
                            </div>
                        </div>
                        <div class="p-6 text-center">
                            <h3 class="text-xl font-semibold mb-1">${product.name}</h3>
                            <p class="text-stone-500 text-sm mb-3">${product.description}</p>
                            <span class="text-lg font-bold text-rose-500">R$ ${product.price.toFixed(2)}</span>
                            <button class="add-to-cart-btn mt-4 w-full bg-stone-800 text-white py-2 px-4 rounded-md hover:bg-stone-900 transition duration-300" data-product-id="${product.id}">Adicionar ao Carrinho</button>
                        </div>
                    </div>
                `;
            });
            feather.replace();
        }

        // --- FUNÇÕES DE DADOS (LOCALSTORAGE) ---
        const getCart = () => JSON.parse(localStorage.getItem('auraCart')) || [];
        const saveCart = (cart) => localStorage.setItem('auraCart', JSON.stringify(cart));
        const getFavorites = () => JSON.parse(localStorage.getItem('auraFavorites')) || [];
        const saveFavorites = (favorites) => localStorage.setItem('auraFavorites', JSON.stringify(favorites));

        // --- LÓGICA DO CARRINHO ---
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            let cart = getCart();
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            saveCart(cart);
            updateCartBadge();
        }

        function updateCartBadge() {
            const cart = getCart();
            const total = cart.reduce((sum, item) => sum + item.quantity, 0);
            const badge = document.getElementById('cart-count');
            if (badge) {
                badge.textContent = total;
                badge.classList.toggle('hidden', total === 0);
            }
        }

        // --- LÓGICA DOS FAVORITOS ---
        function toggleFavorite(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            let favorites = getFavorites();
            const idx = favorites.findIndex(item => item.id === productId);

            if (idx >= 0) {
                favorites.splice(idx, 1); // Remove
            } else {
                favorites.push(product); // Adiciona
            }
            saveFavorites(favorites);
            updateFavBadge();
            return idx < 0; // Retorna true se foi adicionado, false se foi removido
        }

        function updateFavBadge() {
            const favs = getFavorites();
            const badge = document.getElementById('fav-count');
            if (badge) {
                badge.textContent = favs.length;
                badge.classList.toggle('hidden', favs.length === 0);
            }
        }

        // --- EVENT LISTENERS ---
        document.getElementById('product-list').addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            const favoriteBtn = e.target.closest('.favorite-btn');

            if (addToCartBtn) {
                const productId = parseInt(addToCartBtn.dataset.productId);
                addToCart(productId);
            }

            if (favoriteBtn) {
                const productId = parseInt(favoriteBtn.dataset.productId);
                const wasAdded = toggleFavorite(productId);
                
                const icon = favoriteBtn.querySelector('i');
                icon.classList.toggle('text-rose-500', wasAdded);
                icon.classList.toggle('filled', wasAdded);
                icon.classList.toggle('text-stone-500', !wasAdded);
            }
        });

        // --- INICIALIZAÇÃO ---
        renderProducts();
        updateCartBadge();
        updateFavBadge();
        feather.replace();
    });