// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

// Configurações
const CONFIG = {
    PHONE_NUMBER: "5563992973240",
    ENABLE_PROMO_POPUP: true,
    PROMO_PRODUCT_ID: "CAM-00015",
    LAZY_LOAD_THRESHOLD: 0.1,
    TOAST_DURATION: 5000
};

// Toast System
class Toast {
    constructor() {
        this.container = document.getElementById('toastContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toastContainer';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    show(type, title, message, duration = CONFIG.TOAST_DURATION) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="${icons[type]}"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Fechar notificação">
                <i class="fas fa-times"></i>
            </button>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.removeToast(toast));

        this.container.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => this.removeToast(toast), duration);
        }

        return toast;
    }

    removeToast(toast) {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (toast.parentNode === this.container) {
                this.container.removeChild(toast);
            }
        }, 300);
    }
}

// Formatar preço
function formatPrice(price) {
    return 'R$ ' + price.toFixed(2).replace('.', ',');
}

// Calcular preço com desconto
function calculateDiscountedPrice(originalPrice, discountPercent) {
    return originalPrice * (1 - discountPercent / 100);
}

// Debounce para performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle para performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Verificar se elemento está visível no viewport
function isInViewport(element, threshold = CONFIG.LAZY_LOAD_THRESHOLD) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = (rect.top <= windowHeight * (1 - threshold)) && 
                      (rect.top + rect.height >= windowHeight * threshold);
    const horInView = (rect.left <= windowWidth) && (rect.left + rect.width >= 0);
    
    return (vertInView && horInView);
}

// Carregar imagem com lazy loading
function lazyLoadImage(img) {
    if (!img.dataset.src) return;
    
    if (isInViewport(img)) {
        const src = img.dataset.src;
        img.src = src;
        img.removeAttribute('data-src');
        
        img.onload = () => {
            img.classList.add('loaded');
        };
        
        img.onerror = () => {
            console.warn('Erro ao carregar imagem:', src);
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZjYjhiOCIgZHk9Ii4zZW0iPkltYWdlbSBuw6NvIGRpc3BvbsOtdmVsPC90ZXh0Pjwvc3ZnPg==';
            img.classList.add('loaded');
        };
    }
}

// Inicializar lazy loading para todas as imagens
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const lazyLoad = () => {
        images.forEach(img => {
            if (!img.dataset.src) return;
            lazyLoadImage(img);
        });
    };
    
    // Carregar imagens visíveis inicialmente
    lazyLoad();
    
    // Observar scroll para carregar imagens conforme ficam visíveis
    const scrollHandler = throttle(lazyLoad, 100);
    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('resize', scrollHandler);
    
    // Usar Intersection Observer se disponível
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    lazyLoadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            threshold: CONFIG.LAZY_LOAD_THRESHOLD,
            rootMargin: '50px'
        });
        
        images.forEach(img => observer.observe(img));
    }
}

// Gerar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Validar email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Copiar para área de transferência
function copyToClipboard(text) {
    return navigator.clipboard.writeText(text).then(() => {
        return true;
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        return false;
    });
}

// Formatar número de telefone
function formatPhoneNumber(phone) {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/);
    if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }
    return phone;
}

// Exportar utilitários
window.utils = {
    CONFIG,
    Toast,
    formatPrice,
    calculateDiscountedPrice,
    debounce,
    throttle,
    isInViewport,
    lazyLoadImage,
    initLazyLoading,
    generateId,
    isValidEmail,
    copyToClipboard,
    formatPhoneNumber
};