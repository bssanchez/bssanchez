// ============================================
// Portfolio Terminal - Main JavaScript
// ============================================

(function() {
    'use strict';

    // ============================================
    // State Management
    // ============================================
    const state = {
        currentLang: document.body.getAttribute('data-lang') || 'en',
        currentTheme: 'light'
    };

    // ============================================
    // DOM Elements
    // ============================================
    const elements = {
        themeToggle: document.getElementById('themeToggle'),
        body: document.body
    };

    // ============================================
    // Local Storage Keys
    // ============================================
    const STORAGE_KEYS = {
        THEME: 'portfolio_theme'
    };

    // ============================================
    // Initialize Application
    // ============================================
    function init() {
        loadPreferences();
        attachEventListeners();
        applyTheme(state.currentTheme);
        initSmoothScroll();
        initTypingEffect();
    }

    // ============================================
    // Load User Preferences from Local Storage
    // ============================================
    function loadPreferences() {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            state.currentTheme = savedTheme;
        }
    }

    // ============================================
    // Save Preferences to Local Storage
    // ============================================
    function savePreferences() {
        localStorage.setItem(STORAGE_KEYS.THEME, state.currentTheme);
    }

    // ============================================
    // Event Listeners
    // ============================================
    function attachEventListeners() {
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    // ============================================
    // Keyboard Shortcuts
    // ============================================
    function handleKeyboardShortcuts(e) {
        // Alt + T: Toggle Theme
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
    }


    // ============================================
    // Theme Toggle
    // ============================================
    function toggleTheme() {
        state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(state.currentTheme);
        savePreferences();

        // Add visual feedback
        if (elements.themeToggle) {
            elements.themeToggle.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                elements.themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        }
    }

    // ============================================
    // Apply Theme
    // ============================================
    function applyTheme(theme) {
        if (theme === 'dark') {
            elements.body.setAttribute('data-theme', 'dark');
        } else {
            elements.body.removeAttribute('data-theme');
        }
    }

    // ============================================
    // Smooth Scroll for Navigation
    // ============================================
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

                    // Add active state visual feedback
                    this.style.color = 'var(--accent-color)';
                    setTimeout(() => {
                        this.style.color = '';
                    }, 300);
                }
            });
        });
    }

    // ============================================
    // Typing Effect for Terminal Title
    // ============================================
    function initTypingEffect() {
        const cursor = document.querySelector('.cursor-blink');
        if (!cursor) return;

        // Optional: Add typing animation on load
        const terminalTitle = document.querySelector('.terminal-title .prompt');
        if (terminalTitle) {
            terminalTitle.style.opacity = '0';
            setTimeout(() => {
                terminalTitle.style.transition = 'opacity 0.5s ease';
                terminalTitle.style.opacity = '1';
            }, 100);
        }
    }

    // ============================================
    // Section Visibility Animation
    // ============================================
    function initScrollAnimations() {
        const sections = document.querySelectorAll('.section');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(section);
        });
    }

    // ============================================
    // Easter Egg: Konami Code
    // ============================================
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

    // ============================================
    // Console Welcome Message
    // ============================================
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

    // ============================================
    // Performance: Debounce Function
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

    // ============================================
    // Window Resize Handler
    // ============================================
    function handleResize() {
        // Add any resize-specific logic here
        // Currently handled by CSS media queries
    }

    // Attach debounced resize handler
    window.addEventListener('resize', debounce(handleResize, 250));

    // ============================================
    // Start Application
    // ============================================
    document.addEventListener('DOMContentLoaded', () => {
        init();
        initScrollAnimations();
        initEasterEgg();
        showWelcomeMessage();
    });

    // ============================================
    // Expose API for debugging (optional)
    // ============================================
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
