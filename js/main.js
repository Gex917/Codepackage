/**
 * GRILLE Portfolio - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== Configuration ====================
    const CONFIG = {
        typingSpeed: 100,
        typingDeleteSpeed: 50,
        typingDelay: 2000,
        scrollOffset: 100,
        animationDuration: 600
    };
    
    // ==================== Navigation ====================
    const Navigation = {
        init() {
            this.navLinks = document.querySelectorAll('.nav-link');
            this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            this.navMenu = document.querySelector('.nav-menu');
            this.sections = document.querySelectorAll('section[id]');
            
            this.bindEvents();
            this.updateActiveNav();
        },
        
        bindEvents() {
            window.addEventListener('scroll', () => this.updateActiveNav());
            
            if (this.mobileMenuBtn) {
                this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
            }
            
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    if (link.getAttribute('href').includes('.html')) {
                        return;
                    }
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        this.scrollToSection(targetSection);
                        this.closeMobileMenu();
                    }
                });
            });
            
            document.addEventListener('click', (e) => {
                if (!e.target.closest('nav')) {
                    this.closeMobileMenu();
                }
            });
        },
        
        updateActiveNav() {
            const scrollPosition = window.scrollY + CONFIG.scrollOffset;
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },
        
        scrollToSection(target) {
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        },
        
        toggleMobileMenu() {
            this.navMenu.classList.toggle('active');
            this.mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
            this.mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
        },
        
        closeMobileMenu() {
            this.navMenu.classList.remove('active');
            this.mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            this.mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        }
    };
    
    // ==================== Typing Effect ====================
    const TypingEffect = {
        init() {
            this.element = document.querySelector('.typed-text');
            if (!this.element) return;
            
            this.texts = [
                'Python Developer',
                'Data Analyst',
                'Full Stack Explorer',
                'Problem Solver'
            ];
            this.textIndex = 0;
            this.charIndex = 0;
            this.isDeleting = false;
            
            this.type();
        },
        
        type() {
            const currentText = this.texts[this.textIndex];
            
            if (this.isDeleting) {
                this.element.textContent = currentText.substring(0, this.charIndex - 1);
                this.charIndex--;
            } else {
                this.element.textContent = currentText.substring(0, this.charIndex + 1);
                this.charIndex++;
            }
            
            let typeSpeed = this.isDeleting ? CONFIG.typingDeleteSpeed : CONFIG.typingSpeed;
            
            if (!this.isDeleting && this.charIndex === currentText.length) {
                typeSpeed = CONFIG.typingDelay;
                this.isDeleting = true;
            } else if (this.isDeleting && this.charIndex === 0) {
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.texts.length;
                typeSpeed = 500;
            }
            
            setTimeout(() => this.type(), typeSpeed);
        }
    };
    
    // ==================== Project Filter ====================
    const ProjectFilter = {
        init() {
            this.filterBtns = document.querySelectorAll('.filter-btn');
            this.projectCards = document.querySelectorAll('.project-card');
            
            if (this.filterBtns.length === 0) return;
            
            this.bindEvents();
        },
        
        bindEvents() {
            this.filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.dataset.filter;
                    this.filterProjects(filter);
                    this.updateActiveBtn(btn);
                });
            });
        },
        
        filterProjects(filter) {
            this.projectCards.forEach(card => {
                const categories = card.dataset.category || '';
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeIn ${CONFIG.animationDuration}ms ease forwards`;
                } else {
                    card.classList.add('hidden');
                }
            });
        },
        
        updateActiveBtn(activeBtn) {
            this.filterBtns.forEach(btn => btn.classList.remove('active'));
            activeBtn.classList.add('active');
        }
    };
    
    // ==================== Stats Counter ====================
    const StatsCounter = {
        init() {
            this.stats = document.querySelectorAll('.stat-number[data-count]');
            if (this.stats.length === 0) return;
            
            this.observed = new Set();
            this.createObserver();
        },
        
        createObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.observed.has(entry.target)) {
                        this.observed.add(entry.target);
                        this.animateCounter(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            this.stats.forEach(stat => observer.observe(stat));
        },
        
        animateCounter(element) {
            const target = parseInt(element.dataset.count);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 16);
        }
    };
    
    // ==================== Scroll Animations ====================
    const ScrollAnimations = {
        init() {
            this.createObserver();
        },
        
        createObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fadeIn');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            const animElements = document.querySelectorAll(
                '.project-card, .skill-card, .exp-card, .summary-card, .skill-detail-card'
            );
            
            animElements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.animationDelay = `${index * 100}ms`;
                observer.observe(el);
            });
        }
    };
    
    // ==================== Back to Top ====================
    const BackToTop = {
        init() {
            this.button = document.getElementById('backToTop');
            if (!this.button) return;
            
            this.bindEvents();
        },
        
        bindEvents() {
            window.addEventListener('scroll', () => this.toggleVisibility());
            this.button.addEventListener('click', () => this.scrollToTop());
        },
        
        toggleVisibility() {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        },
        
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };
    
    // ==================== Contact Form ====================
    const ContactForm = {
        init() {
            this.form = document.getElementById('contactForm');
            if (!this.form) return;
            
            this.bindEvents();
        },
        
        bindEvents() {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        },
        
        async handleSubmit(e) {
            e.preventDefault();
            
            const submitBtn = this.form.querySelector('.send-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                this.showMessage('Message sent successfully!', 'success');
                this.form.reset();
            } catch (error) {
                this.showMessage('Failed to send. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        },
        
        showMessage(message, type) {
            const existingMsg = document.querySelector('.form-message');
            if (existingMsg) existingMsg.remove();
            
            const msgEl = document.createElement('div');
            msgEl.className = `form-message ${type}`;
            msgEl.textContent = message;
            msgEl.style.cssText = `
                padding: 1rem;
                margin-top: 1rem;
                border-radius: 8px;
                font-size: 0.95rem;
                animation: fadeIn 0.3s ease;
                background: ${type === 'success' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'};
                color: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
                border: 1px solid ${type === 'success' ? '#2ecc71' : '#e74c3c'};
            `;
            
            this.form.appendChild(msgEl);
            
            setTimeout(() => {
                msgEl.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => msgEl.remove(), 300);
            }, 3000);
        }
    };
    
    // ==================== Dynamic Year ====================
    const DynamicYear = {
        init() {
            const yearElements = document.querySelectorAll('#currentYear');
            const currentYear = new Date().getFullYear();
            
            yearElements.forEach(el => {
                el.textContent = currentYear;
            });
        }
    };
    
    // ==================== Smooth Scroll ====================
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href === '#') return;
                    
                    e.preventDefault();
                    const target = document.querySelector(href);
                    
                    if (target) {
                        const navHeight = document.querySelector('nav').offsetHeight;
                        const targetPosition = target.offsetTop - navHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };
    
    // ==================== Loading Animation ====================
    const LoadingAnimation = {
        init() {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            window.addEventListener('load', () => {
                document.body.classList.add('loaded');
            });
        }
    };
    
    // ==================== Initialize ====================
    function initApp() {
        Navigation.init();
        TypingEffect.init();
        ProjectFilter.init();
        StatsCounter.init();
        ScrollAnimations.init();
        BackToTop.init();
        ContactForm.init();
        DynamicYear.init();
        SmoothScroll.init();
        LoadingAnimation.init();
        
        console.log('🚀 GRILLE Portfolio initialized');
    }
    
    initApp();
    
});