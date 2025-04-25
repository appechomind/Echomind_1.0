// Navigation System
class Navigation {
    constructor() {
        this.container = document.querySelector('.nav-container');
        this.mobileToggle = document.querySelector('.nav-mobile-toggle');
        this.menu = document.querySelector('.nav-menu');
        this.scrollProgress = document.querySelector('.scroll-progress');
        this.lastScrollY = window.scrollY;
        this.scrollThreshold = 50;
        this.isMenuOpen = false;

        this.init();
    }

    init() {
        // Set up event listeners
        this.setupScrollHandling();
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupScrollProgress();
    }

    setupScrollHandling() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Hide/show navbar based on scroll direction
        if (currentScrollY > this.lastScrollY && currentScrollY > this.scrollThreshold) {
            this.container.classList.add('hidden');
            if (this.isMenuOpen) {
                this.toggleMobileMenu();
            }
        } else {
            this.container.classList.remove('hidden');
        }

        this.lastScrollY = currentScrollY;
        this.updateScrollProgress();
    }

    setupMobileMenu() {
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.menu.contains(e.target) && 
                !this.mobileToggle.contains(e.target)) {
                this.toggleMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.menu.classList.toggle('active');
        this.mobileToggle.setAttribute('aria-expanded', this.isMenuOpen);
    }

    setupActiveLinks() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.nav-item');

        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }

    setupScrollProgress() {
        if (this.scrollProgress) {
            window.addEventListener('scroll', () => {
                this.updateScrollProgress();
            });
        }
    }

    updateScrollProgress() {
        if (this.scrollProgress) {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            this.scrollProgress.style.width = `${scrolled}%`;
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const nav = new Navigation();
}); 