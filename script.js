(function() {
    'use strict';

    const state = {
        currentLang: document.body.getAttribute('data-lang') || 'en',
        currentTheme: 'light'
    };

    const elements = {
        themeToggle: document.getElementById('themeToggle'),
        body: document.body
    };

    const STORAGE_KEYS = {
        THEME: 'portfolio_theme'
    };

    function init() {
        loadPreferences();
        attachEventListeners();
        applyTheme(state.currentTheme);
        initSmoothScroll();
        initTypingEffect();
    }

    function loadPreferences() {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            state.currentTheme = savedTheme;
        }
    }

    function savePreferences() {
        localStorage.setItem(STORAGE_KEYS.THEME, state.currentTheme);
    }

    function attachEventListeners() {
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }

        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    function handleKeyboardShortcuts(e) {
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
    }

    function toggleTheme() {
        state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(state.currentTheme);
        savePreferences();

        if (elements.themeToggle) {
            elements.themeToggle.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                elements.themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        }
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            elements.body.setAttribute('data-theme', 'dark');
        } else {
            elements.body.removeAttribute('data-theme');
        }
    }

    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('.terminal-nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerOffset = 20;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    this.style.color = 'var(--accent-color)';
                    setTimeout(() => {
                        this.style.color = '';
                    }, 300);
                }
            });
        });
    }

    function initTypingEffect() {
        const cursor = document.querySelector('.cursor-blink');
        if (!cursor) return;

        const terminalTitle = document.querySelector('.terminal-title .prompt');
        if (terminalTitle) {
            terminalTitle.style.opacity = '0';
            setTimeout(() => {
                terminalTitle.style.transition = 'opacity 0.5s ease';
                terminalTitle.style.opacity = '1';
            }, 100);
        }
    }

    function initScrollAnimations() {
        const sections = document.querySelectorAll('.section');

        const reveal = (el) => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        };

        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px -50px 0px' });

        const hidden = [];

        sections.forEach(section => {
            const box = section.getBoundingClientRect();
            if (box.top < window.innerHeight && box.bottom > 0) return;

            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            hidden.push(section);
            observer.observe(section);
        });

        if (hidden.length) {
            setTimeout(() => hidden.forEach(reveal), 3000);
        }
    }

    function initEasterEgg() {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    activateEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    }

    function activateEasterEgg() {
        const originalBg = elements.body.style.backgroundColor;
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        let colorIndex = 0;
        
        const interval = setInterval(() => {
            elements.body.style.transition = 'background-color 0.1s';
            elements.body.style.backgroundColor = colors[colorIndex % colors.length];
            colorIndex++;
            
            if (colorIndex > 20) {
                clearInterval(interval);
                elements.body.style.backgroundColor = originalBg;
                elements.body.style.transition = 'background-color 0.3s ease';
            }
        }, 100);

        console.log('🎮 Konami Code activated! You found the easter egg!');
    }

    function showWelcomeMessage() {
        const styles = [
            'color: #00ff00',
            'font-family: monospace',
            'font-size: 14px',
            'font-weight: bold'
        ].join(';');

        console.log('%c' + `
╔═════════════════════════════════════╗
║   Welcome to my Terminal Portfolio   ║
║                                       ║
║   Keyboard Shortcuts:                 ║
║   Alt + T : Toggle Theme              ║
║                                       ║
║   Try the Konami Code for a surprise! ║
╚═══════════════════════════════════════╝
        `, styles);
    }

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

    function handleResize() {
    }

    window.addEventListener('resize', debounce(handleResize, 250));

    document.addEventListener('DOMContentLoaded', () => {
        init();
        initScrollAnimations();
        initEasterEgg();
        showWelcomeMessage();
    });

    if (typeof window !== 'undefined') {
        window.portfolioAPI = {
            getState: () => ({ ...state }),
            setTheme: (theme) => {
                if (theme === 'light' || theme === 'dark') {
                    state.currentTheme = theme;
                    applyTheme(theme);
                    savePreferences();
                }
            }
        };
    }

})();
