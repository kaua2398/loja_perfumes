document.addEventListener('DOMContentLoaded', () => {
        const cartContainer = document.getElementById('cart-container');

        function getCart() {
            return JSON.parse(localStorage.getItem('auraCart')) || [];
        }

        function saveCart(cart) {
            localStorage.setItem('auraCart', JSON.stringify(cart));
            renderCart(); // Re-renderiza o carrinho sempre que ele é salvo
        }

        function removeFromCart(productId) {
            let cart = getCart();
            cart = cart.filter(item => item.id !== productId);
            saveCart(cart);
        }

        function updateQuantity(productId, quantity) {
            let cart = getCart();
            const itemInCart = cart.find(item => item.id === productId);
            if (itemInCart) {
                if (quantity > 0) {
                    itemInCart.quantity = quantity;
                } else {
                    // Se a quantidade for 0 ou menos, remove o item
                    cart = cart.filter(item => item.id !== productId);
                }
            }
            saveCart(cart);
        }

        function renderCart() {
            const cart = getCart();

            if (cart.length === 0) {
                cartContainer.innerHTML = `
                    <div class="lg:col-span-3 text-center py-16">
                        <h2 class="text-2xl font-semibold mb-4">O seu carrinho está vazio.</h2>
                        <p class="text-stone-600 mb-6">Volte à loja para adicionar as suas fragrâncias favoritas.</p>
                        <a href="index.html" class="bg-stone-800 text-white font-bold py-3 px-8 rounded-md hover:bg-stone-900 transition duration-300">Voltar à Loja</a>
                    </div>
                `;
                return;
            }

            const cartItemsHTML = cart.map(item => `
                <div class="flex items-center justify-between border-b pb-4 mb-4" data-cart-item-id="${item.id}">
                    <div class="flex items-center space-x-4">
                        <img src="${item.image.replace('400x500', '100x100')}" alt="${item.name}" class="w-20 h-20 rounded-md object-cover">
                        <div>
                            <h2 class="text-lg font-semibold">${item.name}</h2>
                            <p class="text-stone-500 text-sm">R$ ${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input w-16 text-center border rounded-md py-1" data-id="${item.id}">
                        <p class="font-bold w-24 text-right">R$ ${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="remove-from-cart-btn text-stone-500 hover:text-red-500" data-id="${item.id}"><i data-feather="trash-2"></i></button>
                    </div>
                </div>
            `).join('');

            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

            cartContainer.innerHTML = `
                <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    ${cartItemsHTML}
                </div>
                <div class="lg:col-span-1">
                    <div class="bg-white p-6 rounded-lg shadow-md h-fit sticky top-28">
                        <h2 class="text-2xl font-display border-b pb-4 mb-4">Sumário</h2>
                        <div class="flex justify-between mb-2 text-stone-600"><p>Subtotal</p><p>R$ ${subtotal.toFixed(2)}</p></div>
                        <div class="flex justify-between mb-4 text-stone-600"><p>Envio</p><p class="font-semibold text-green-600">Grátis</p></div>
                        <div class="flex justify-between font-bold text-xl border-t pt-4 mt-4"><p>Total</p><p>R$ ${subtotal.toFixed(2)}</p></div>
                        <button class="w-full mt-6 bg-stone-800 text-white py-3 px-4 rounded-md hover:bg-stone-900 transition">Finalizar Compra</button>
                    </div>
                </div>
            `;

            feather.replace();
            addCartActionListeners();
        }

        function addCartActionListeners() {
            document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
                button.addEventListener('click', (e) => removeFromCart(parseInt(e.currentTarget.dataset.id)));
            });

            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const quantity = parseInt(e.currentTarget.value);
                    const id = parseInt(e.currentTarget.dataset.id);
                    updateQuantity(id, quantity);
                });
            });
        }

        renderCart();
    });
