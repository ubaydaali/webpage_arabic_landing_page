// Premium 2026 Landing Page - Modern JavaScript
// Using latest ES2026+ features and best practices

// ==================== Configuration ====================
const CONFIG = {
    animations: {
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    scroll: {
        offset: 100,
        smooth: true
    },
    counters: {
        duration: 2000,
        suffixes: ['+', '%']
    }
};

// ==================== Utility Functions ====================
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ==================== Navigation System ====================
class NavigationSystem {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.init();
    }

    init() {
        this.handleScroll();
        this.setupEventListeners();
        this.setupMobileMenu();
    }

    handleScroll() {
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > CONFIG.scroll.offset) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            this.updateActiveLink();
        }, 100));
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    setupEventListeners() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.mobileMenuBtn.classList.toggle('active');
                // Add mobile menu logic here
            });
        }
    }
}

// ==================== Scroll Animations ====================
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll(
            '.feature-card, .service-card, .pricing-card, .testimonial-card'
        );
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all ${CONFIG.animations.duration}ms ${CONFIG.animations.easing}`;
            observer.observe(el);
        });
    }
}

// ==================== Counter Animation ====================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-value[data-target]');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = CONFIG.counters.duration;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }
}

// ==================== Form Handler ====================
class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showNotification('تم إرسال رسالتك بنجاح!', 'success');
            this.form.reset();
        } catch (error) {
            this.showNotification('حدث خطأ في الإرسال. حاول مرة أخرى.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 10px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ==================== Feature Cards Interaction ====================
class FeatureCardsInteraction {
    constructor() {
        this.cards = document.querySelectorAll('.feature-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleHover(card));
            card.addEventListener('mouseleave', () => this.handleLeave(card));
        });
    }

    handleHover(card) {
        const progressBar = card.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = progressBar.style.width;
        }
    }

    handleLeave(card) {
        // Reset any hover effects
    }
}

// ==================== Pricing Cards Interaction ====================
class PricingCardsInteraction {
    constructor() {
        this.cards = document.querySelectorAll('.pricing-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleHover(card));
            card.addEventListener('mouseleave', () => this.handleLeave(card));
        });
    }

    handleHover(card) {
        if (!card.classList.contains('featured')) {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.3)';
        }
    }

    handleLeave(card) {
        if (!card.classList.contains('featured')) {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    }
}

// ==================== Smooth Scroll ====================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ==================== Lazy Loading ====================
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            this.images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
}

// ==================== Performance Monitoring ====================
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        });
    }
}

// ==================== Initialize All Components ====================
document.addEventListener('DOMContentLoaded', () => {
    // Add dynamic styles for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Initialize all components
    new NavigationSystem();
    new ScrollAnimations();
    new CounterAnimation();
    new FormHandler();
    new FeatureCardsInteraction();
    new PricingCardsInteraction();
    new SmoothScroll();
    new LazyLoader();
    new PerformanceMonitor();

    // Log initialization
    console.log('Premium 2026 Landing Page - Initialized Successfully');
    console.log('Using modern JavaScript features and best practices');
});

// Export for potential module usage
export { 
    NavigationSystem, 
    ScrollAnimations, 
    CounterAnimation, 
    FormHandler 
};