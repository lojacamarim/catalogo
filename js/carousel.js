// ============================================
// CARROSSEL DE IMAGENS
// ============================================

class Carousel {
    constructor(container, images, productId) {
        this.container = container;
        this.images = images;
        this.productId = productId;
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.init();
    }
    
    init() {
        this.createCarousel();
        this.setupEventListeners();
        this.updateIndicators();
        
        // Auto-play (apenas se tiver mais de uma imagem)
        if (this.images.length > 1) {
            this.startAutoPlay();
        }
    }
    
    createCarousel() {
        // Criar slide container
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        // Adicionar imagens com lazy loading
        this.images.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.dataset.src = imgSrc;
            img.alt = `Produto ${this.productId} - Imagem ${index + 1}`;
            img.loading = 'lazy';
            
            // Placeholder enquanto carrega
            img.style.backgroundColor = '#f8f9fa';
            img.style.minHeight = '200px';
            
            slide.appendChild(img);
        });
        
        // Adicionar botões de navegação (apenas se tiver mais de uma imagem)
        if (this.images.length > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-btn prev';
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.setAttribute('aria-label', 'Imagem anterior');
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-btn next';
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.setAttribute('aria-label', 'Próxima imagem');
            
            // Adicionar indicadores
            const indicators = document.createElement('div');
            indicators.className = 'carousel-indicators';
            
            for (let i = 0; i < this.images.length; i++) {
                const indicator = document.createElement('button');
                indicator.className = `carousel-indicator ${i === 0 ? 'active' : ''}`;
                indicator.setAttribute('data-index', i);
                indicator.setAttribute('aria-label', `Ir para imagem ${i + 1}`);
                indicators.appendChild(indicator);
            }
            
            this.container.appendChild(prevBtn);
            this.container.appendChild(nextBtn);
            this.container.appendChild(indicators);
            
            this.prevBtn = prevBtn;
            this.nextBtn = nextBtn;
            this.indicators = indicators;
        }
        
        this.container.appendChild(slide);
        this.slide = slide;
    }
    
    setupEventListeners() {
        if (this.images.length <= 1) return;
        
        this.prevBtn.addEventListener('click', () => {
            this.stopAutoPlay();
            this.prevSlide();
            this.startAutoPlay();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.stopAutoPlay();
            this.nextSlide();
            this.startAutoPlay();
        });
        
        // Event listeners para indicadores
        if (this.indicators) {
            this.indicators.querySelectorAll('.carousel-indicator').forEach(indicator => {
                indicator.addEventListener('click', (e) => {
                    this.stopAutoPlay();
                    const index = parseInt(e.target.getAttribute('data-index'));
                    this.goToSlide(index);
                    this.startAutoPlay();
                });
            });
        }
        
        // Pausar auto-play no hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Swipe para mobile
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        const threshold = 50;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.stopAutoPlay();
        });
        
        this.container.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });
        
        this.container.addEventListener('touchend', () => {
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            this.startAutoPlay();
        });
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateSlide();
        this.updateIndicators();
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateSlide();
        this.updateIndicators();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlide();
        this.updateIndicators();
    }
    
    updateSlide() {
        const translateX = -this.currentIndex * 100;
        this.slide.style.transform = `translateX(${translateX}%)`;
        
        // Carregar imagem atual se não estiver carregada
        const currentImg = this.slide.children[this.currentIndex];
        if (currentImg && currentImg.dataset.src) {
            window.utils.lazyLoadImage(currentImg);
        }
    }
    
    updateIndicators() {
        if (!this.indicators) return;
        
        const indicators = this.indicators.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('active');
                indicator.setAttribute('aria-current', 'true');
            } else {
                indicator.classList.remove('active');
                indicator.removeAttribute('aria-current');
            }
        });
    }
    
    startAutoPlay() {
        if (this.images.length <= 1) return;
        
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    destroy() {
        this.stopAutoPlay();
        
        if (this.prevBtn) this.prevBtn.remove();
        if (this.nextBtn) this.nextBtn.remove();
        if (this.indicators) this.indicators.remove();
        if (this.slide) this.slide.remove();
    }
}

// Exportar
window.Carousel = Carousel;