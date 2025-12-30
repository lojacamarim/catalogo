// ============================================
// GERENCIAMENTO DO CARRINHO
// ============================================

class CartManager {
    constructor() {
        this.cart = [];
        this.toast = new window.utils.Toast();
        this.init();
    }
    
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Eventos serão configurados no main.js
    }
    
    // Carregar do localStorage
    loadFromStorage() {
        try {
            const savedCart = localStorage.getItem('camarimCart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
                this.updateDisplay();
            }
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error);
            this.cart = [];
        }
    }
    
    // Salvar no localStorage
    saveToStorage() {
        try {
            localStorage.setItem('camarimCart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Erro ao salvar carrinho:', error);
        }
    }
    
    // Adicionar produto ao carrinho
    addToCart(product) {
        const cartItem = this.cart.find(item => item.id === product.id);
        const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
        
        // Verificar estoque
        if (currentQuantityInCart >= product.stock) {
            this.toast.show('error', 'Estoque insuficiente', 
                `Não há estoque suficiente para adicionar mais unidades de ${product.name}. Estoque disponível: ${product.stock}`);
            return false;
        }
        
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            const discountedPrice = window.utils.calculateDiscountedPrice(product.sellingPrice, product.discount);
            this.cart.push({
                id: product.id,
                name: product.name,
                price: discountedPrice,
                originalPrice: product.sellingPrice,
                discount: product.discount,
                quantity: 1,
                stock: product.stock,
                category: product.category
            });
        }
        
        this.saveToStorage();
        this.updateDisplay();
        
        // Feedback visual
        this.showAddToCartFeedback(product);
        
        return true;
    }
    
    // Remover produto do carrinho
    removeFromCart(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveToStorage();
            this.updateDisplay();
            
            this.toast.show('info', 'Produto removido', 
                `${item.name} foi removido do carrinho.`);
        }
    }
    
    // Atualizar quantidade
    updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }
        
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            // Verificar estoque
            if (newQuantity > item.stock) {
                this.toast.show('error', 'Estoque insuficiente', 
                    `Não há estoque suficiente para ${item.name}. Estoque disponível: ${item.stock}`);
                return;
            }
            
            item.quantity = newQuantity;
            this.saveToStorage();
            this.updateDisplay();
        }
    }
    
    // Calcular total do carrinho
    calculateTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Calcular total de itens
    calculateTotalItems() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    // Limpar carrinho
    clearCart() {
        this.cart = [];
        this.saveToStorage();
        this.updateDisplay();
        this.toast.show('info', 'Carrinho limpo', 'Todos os itens foram removidos do carrinho.');
    }
    
    // Atualizar exibição
    updateDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartCount || !cartItems || !cartTotal) return;
        
        // Atualizar contador
        const totalItems = this.calculateTotalItems();
        cartCount.textContent = totalItems;
        
        // Atualizar lista de itens
        cartItems.innerHTML = '';
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Seu carrinho está vazio</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">Adicione produtos clicando no botão "Adicionar ao Carrinho"</p>
                </div>
            `;
        } else {
            this.cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${window.utils.formatPrice(item.price)} cada</div>
                        <div style="font-size: 0.85rem; color: #666; margin-top: 3px;">
                            Estoque disponível: ${item.stock}
                        </div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}" 
                                    ${item.quantity <= 1 ? 'disabled' : ''}>
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${item.id}"
                                    ${item.quantity >= item.stock ? 'disabled' : ''}>
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}" aria-label="Remover item">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                
                cartItems.appendChild(itemElement);
                
                // Adicionar eventos
                const decreaseBtn = itemElement.querySelector('.decrease');
                const increaseBtn = itemElement.querySelector('.increase');
                const removeBtn = itemElement.querySelector('.remove-item');
                
                decreaseBtn.addEventListener('click', () => {
                    this.updateQuantity(item.id, item.quantity - 1);
                });
                
                increaseBtn.addEventListener('click', () => {
                    this.updateQuantity(item.id, item.quantity + 1);
                });
                
                removeBtn.addEventListener('click', () => {
                    this.removeFromCart(item.id);
                });
            });
        }
        
        // Atualizar total
        const total = this.calculateTotal();
        cartTotal.textContent = window.utils.formatPrice(total);
    }
    
    // Feedback visual ao adicionar ao carrinho
    showAddToCartFeedback(product) {
        // Animação no ícone do carrinho
        const cartIcon = document.querySelector('.cart-icon i');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 300);
        }
        
        // Toast notification
        this.toast.show('success', 'Produto adicionado!', 
            `${product.name} foi adicionado ao carrinho.`);
    }
    
    // Gerar mensagem do WhatsApp para o carrinho
    generateWhatsAppMessage() {
        if (this.cart.length === 0) return '';
        
        let message = `Olá! Gostaria de fazer um pedido com os seguintes produtos:\n\n`;
        
        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            message += `• ${item.name} (Código: ${item.id})\n`;
            message += `  Quantidade: ${item.quantity}\n`;
            message += `  Preço unitário: ${window.utils.formatPrice(item.price)} (${item.discount}% de desconto)\n`;
            message += `  Subtotal: ${window.utils.formatPrice(itemTotal)}\n\n`;
        });
        
        const total = this.calculateTotal();
        message += `Total da compra: ${window.utils.formatPrice(total)}\n\n`;
        message += `Por favor, entre em contato para finalizar o pedido!`;
        
        return encodeURIComponent(message);
    }
    
    // Enviar carrinho para WhatsApp
    sendToWhatsApp() {
        if (this.cart.length === 0) {
            this.toast.show('warning', 'Carrinho vazio', 
                'Adicione produtos ao carrinho antes de finalizar a compra.');
            return;
        }
        
        const message = this.generateWhatsAppMessage();
        const whatsappURL = `https://wa.me/${window.utils.CONFIG.PHONE_NUMBER}?text=${message}`;
        window.open(whatsappURL, '_blank');
    }
    
    // Exportar dados do carrinho
    exportCart() {
        return {
            items: this.cart,
            total: this.calculateTotal(),
            totalItems: this.calculateTotalItems(),
            timestamp: new Date().toISOString()
        };
    }
}

// Exportar
window.cartManager = new CartManager();