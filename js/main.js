// ============================================
// ARQUIVO PRINCIPAL
// ============================================

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    try {
        // Mostrar loading
        showLoading();
        
        // Inicializar utilitários
        await initUtils();
        
        // Inicializar componentes
        initComponents();
        
        // Carregar dados
        await loadData();
        
        // Configurar eventos
        setupEventListeners();
        
        // Inicializar lazy loading
        window.utils.initLazyLoading();
        
        // Esconder loading
        hideLoading();
        
        // Mostrar popup de promoção (se habilitado)
        showPromoPopup();
        
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        hideLoading();
        showError('Erro ao carregar o catálogo. Por favor, recarregue a página.');
    }
}

function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 500);
    }
}

function showError(message) {
    const toast = new window.utils.Toast();
    toast.show('error', 'Erro', message);
}

async function initUtils() {
    // Utilitários já estão carregados via utils.js
    console.log('Utilitários inicializados');
}

function initComponents() {
    // Inicializar carrinho
    if (window.cartManager) {
        window.cartManager.updateDisplay();
    }
    
    // Inicializar formas de pagamento com lazy loading
    initPaymentIcons();
}

async function loadData() {
    // Renderizar produtos iniciais
    if (window.productsManager) {
        const productsContainer = document.getElementById('productsContainer');
        if (productsContainer) {
            const filteredProducts = window.productsManager.filterAndSortProducts('all', 'name');
            window.productsManager.renderProducts(filteredProducts, productsContainer);
        }
    }
}

function setupEventListeners() {
    // Filtros
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryChange);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', handleSortChange);
    }
    
    // Carrinho
    const openCartBtn = document.getElementById('openCart');
    const closeCartBtn = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartWhatsAppBtn = document.getElementById('cartWhatsAppBtn');
    
    if (openCartBtn) {
        openCartBtn.addEventListener('click', openCart);
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }
    
    if (cartWhatsAppBtn) {
        cartWhatsAppBtn.addEventListener('click', () => {
            if (window.cartManager) {
                window.cartManager.sendToWhatsApp();
            }
        });
    }
    
    // Botão voltar ao topo
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
        window.addEventListener('scroll', toggleBackToTopButton);
    }
    
    // Popup de promoção
    setupPromoPopupEvents();
    
    // Otimizar performance com debounce
    const debouncedRender = window.utils.debounce(renderFilteredProducts, 300);
    if (categoryFilter) categoryFilter.addEventListener('change', debouncedRender);
    if (sortFilter) sortFilter.addEventListener('change', debouncedRender);
}

function handleCategoryChange() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    const category = categoryFilter.value;
    updateURLWithCategory(category);
    renderFilteredProducts();
}

function handleSortChange() {
    renderFilteredProducts();
}

function renderFilteredProducts() {
    const productsContainer = document.getElementById('productsContainer');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const productsLoading = document.getElementById('productsLoading');
    
    if (!productsContainer || !categoryFilter || !sortFilter) return;
    
    // Mostrar loading
    if (productsLoading) {
        productsLoading.style.display = 'block';
    }
    
    // Usar setTimeout para dar tempo da animação de loading aparecer
    setTimeout(() => {
        try {
            const category = categoryFilter.value;
            const sort = sortFilter.value;
            
            const filteredProducts = window.productsManager.filterAndSortProducts(category, sort);
            window.productsManager.renderProducts(filteredProducts, productsContainer);
            
        } catch (error) {
            console.error('Erro ao renderizar produtos:', error);
        } finally {
            if (productsLoading) {
                productsLoading.style.display = 'none';
            }
        }
    }, 100);
}

function updateURLWithCategory(category) {
    if (category === 'all') {
        history.replaceState(null, null, window.location.pathname);
    } else {
        history.replaceState(null, null, `#${category}`);
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const openCartBtn = document.getElementById('openCart');
    
    if (cartSidebar) cartSidebar.classList.add('active');
    if (cartOverlay) cartOverlay.classList.add('active');
    if (openCartBtn) openCartBtn.setAttribute('aria-expanded', 'true');
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const openCartBtn = document.getElementById('openCart');
    
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (cartOverlay) cartOverlay.classList.remove('active');
    if (openCartBtn) openCartBtn.setAttribute('aria-expanded', 'false');
}

function toggleBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function initPaymentIcons() {
    const paymentIconsContainer = document.querySelector('.payment-icons');
    if (!paymentIconsContainer) return;
    
    const paymentMethods = [
        {
            name: 'Visa',
            url: 'https://sites-cms-deco-prd.s3.us-east-1.amazonaws.com/incoming/ton/e6b249d6-d7e6-48aa-a84b-7723822fa8ef/flag-visa.svg'
        },
        {
            name: 'Mastercard',
            url: 'https://sites-cms-deco-prd.s3.us-east-1.amazonaws.com/incoming/ton/d57be004-17fe-45c6-9f96-496b1120e0d3/flag-mastercard.svg'
        },
        {
            name: 'Elo',
            url: 'https://sites-cms-deco-prd.s3.us-east-1.amazonaws.com/incoming/ton/a25181f4-82d7-4534-a903-1aef38a21b6d/flag-elo.svg'
        },
        {
            name: 'PIX',
            url: 'https://sites-cms-deco-prd.s3.us-east-1.amazonaws.com/incoming/ton/ce92f252-49c2-40b4-a316-9fcae30ecbc1/flag-pix.svg'
        },
        {
            name: 'Apple Pay',
            url: 'https://sites-cms-deco-prd.s3.us-east-1.amazonaws.com/incoming/ton/fb9c9c47-af9b-4cee-aa00-345c277f6e49/flag-apple-pay.svg'
        },
        {
            name: 'Google Pay',
            url: 'https://sites-cms-deco-prd.s3.us-east-1.amazonaws.com/incoming/ton/8067d7c4-a20f-416e-9c94-af907a4fade0/flag-google-pay.svg'
        },
        {
            name: 'Samsung Pay',
            url: 'https://sites-cms-deco-prd.s3.us-east-1.amazonaws.com/incoming/ton/9076e148-f7f2-40a9-9955-a7cfef82b785/flag-samsung-pay.svg'
        }
    ];
    
    paymentIconsContainer.innerHTML = '';
    
    paymentMethods.forEach(method => {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'payment-icon';
        iconDiv.setAttribute('title', method.name);
        
        const img = document.createElement('img');
        img.dataset.src = method.url;
        img.alt = method.name;
        img.loading = 'lazy';
        
        iconDiv.appendChild(img);
        paymentIconsContainer.appendChild(iconDiv);
    });
}

function setupPromoPopupEvents() {
    if (!window.utils.CONFIG.ENABLE_PROMO_POPUP) return;
    
    const closePromoPopup = document.getElementById('closePromoPopup');
    const closePromoBtn = document.getElementById('closePromoBtn');
    const promoWhatsAppBtn = document.getElementById('promoWhatsAppBtn');
    
    if (closePromoPopup) {
        closePromoPopup.addEventListener('click', hidePromoPopup);
    }
    
    if (closePromoBtn) {
        closePromoBtn.addEventListener('click', hidePromoPopup);
    }
    
    if (promoWhatsAppBtn) {
        promoWhatsAppBtn.addEventListener('click', () => {
            const product = window.productsManager.productsData.products.find(
                p => p.id === window.utils.CONFIG.PROMO_PRODUCT_ID
            );
            
            if (product) {
                const discountedPrice = window.utils.calculateDiscountedPrice(
                    product.sellingPrice, 
                    product.discount
                );
                const message = window.productsManager.generateWhatsAppMessage(
                    product, 
                    discountedPrice, 
                    product.discount
                );
                const whatsappURL = `https://wa.me/${window.utils.CONFIG.PHONE_NUMBER}?text=${message}`;
                window.open(whatsappURL, '_blank');
                hidePromoPopup();
            }
        });
    }
}

function showPromoPopup() {
    if (!window.utils.CONFIG.ENABLE_PROMO_POPUP) return;
    
    // Verificar se já foi fechado
    const popupClosed = localStorage.getItem('camarimPromoPopupClosed');
    if (popupClosed === 'true') return;
    
    // Configurar produto promocional
    setupPromoProduct();
    
    // Mostrar após delay
    setTimeout(() => {
        const promoPopup = document.getElementById('promoPopup');
        if (promoPopup) {
            promoPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }, 1500);
}

function hidePromoPopup() {
    const promoPopup = document.getElementById('promoPopup');
    if (promoPopup) {
        promoPopup.classList.remove('active');
        document.body.style.overflow = '';
        localStorage.setItem('camarimPromoPopupClosed', 'true');
    }
}

function setupPromoProduct() {
    const promoProductContainer = document.getElementById('promoProductContainer');
    if (!promoProductContainer) return;
    
    const product = window.productsManager.productsData.products.find(
        p => p.id === window.utils.CONFIG.PROMO_PRODUCT_ID
    );
    
    if (!product) {
        console.warn(`Produto promocional não encontrado: ${window.utils.CONFIG.PROMO_PRODUCT_ID}`);
        return;
    }
    
    const discountedPrice = window.utils.calculateDiscountedPrice(
        product.sellingPrice, 
        product.discount
    );
    const discountAmount = product.sellingPrice - discountedPrice;
    const imagePaths = window.productsManager.getProductImagePaths(product);
    
    promoProductContainer.innerHTML = `
        <div class="promo-product-image">
            <img src="${imagePaths[0]}" alt="${product.name}" loading="lazy">
        </div>
        <div class="promo-product-info">
            <div class="promo-product-name">${product.name}</div>
            <div class="promo-product-id">Código: ${product.id}</div>
            <div class="promo-pricing">
                <div class="promo-original-price">${window.utils.formatPrice(product.sellingPrice)}</div>
                <div class="promo-discount-price">${window.utils.formatPrice(discountedPrice)}</div>
            </div>
            <div class="promo-discount-badge">${product.discount}% OFF - Economize ${window.utils.formatPrice(discountAmount)}</div>
            <div style="font-size: 0.9rem; color: #666;">
                <i class="fas fa-box"></i> Estoque: ${product.stock} unidades
            </div>
        </div>
    `;
}

// Exportar funções globais
window.app = {
    initApp,
    openCart,
    closeCart,
    scrollToTop
};