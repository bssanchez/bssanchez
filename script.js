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

    const PANIC_DUMP = [
        '[   42.133700] BUG: unable to handle page fault for address: 00000000deadbeef',
        '[   42.133701] #PF: supervisor read access in kernel mode',
        '[   42.133702] #PF: error_code(0x0000) - not-present page',
        '[   42.133703] PGD 0 P4D 0',
        '[   42.133704] Oops: 0000 [#1] SMP PTI',
        '[   42.133705] CPU: 1 PID: 1337 Comm: recruiter Tainted: G    B D W  O  6.9.3-codesan #1',
        '[   42.133706] Hardware name: CODESAN Terminal Portfolio/BSANCHEZ-DEV, BIOS 4.0.4 07/28/2026',
        '[   42.133707] RIP: 0010:konami_handler+0x1337/0x2000 [easter_egg]',
        '[   42.133708] Code: 55 48 89 e5 41 57 41 56 <ff> ff ff ff 90 90 cc cc 0f 0b eb fe',
        '[   42.133709] RSP: 0018:ffffb00dcafe0000 EFLAGS: 00010246',
        '[   42.133710] RAX: 00000000deadbeef RBX: 0000000000000000 RCX: 0000000000c0ffee',
        '[   42.133711] RDX: 0000000000000539 RSI: ffff8b1ee5000000 RDI: 00000000000f4240',
        '',
        '[   42.133712] Modules linked in: codesan_portfolio(O) easter_egg(O) coffee_driver(O)',
        '[   42.133713]                    imposter_syndrome(E) dark_mode(O) semicolon_missing(F)',
        '[   42.133714]                    works_on_my_machine(OE) [last unloaded: sleep_schedule]',
        '',
        '[   42.133715] Call Trace:',
        '[   42.133716]  <TASK>',
        '[   42.133717]  konami_handler+0x1337/0x2000 [easter_egg]',
        '[   42.133718]  up_up_down_down+0x2a/0x40 [easter_egg]',
        '[   42.133719]  left_right_left_right+0x0b/0xa0 [easter_egg]',
        '[   42.133720]  b_a_start+0x99/0x100 [easter_egg]',
        '[   42.133721]  handle_keydown+0x7c/0xf0 [codesan_portfolio]',
        '[   42.133722]  do_syscall_64+0x5c/0x90',
        '[   42.133723]  entry_SYSCALL_64_after_hwframe+0x76/0x7e',
        '[   42.133724]  </TASK>',
        '',
        '[   42.133725] CR2: 00000000deadbeef',
        '[   42.133726] ---[ end trace 0000000000001337 ]---',
        '[   42.133727] note: recruiter[1337] exited with preempt_count 1',
        '',
        '[   42.133728] Kernel panic - not syncing: Attempted to hire init!',
        '[   42.133729] Kernel Offset: disabled',
        '[   42.133730] ---[ end Kernel panic - not syncing: Attempted to hire init! ]---'
    ];

    const BOOT_DUMP = [
        '[    0.000000] Linux version 6.9.3-codesan (bsanchez@codesan.dev)',
        '[    0.000412] Rebooting portfolio...',
        '[    0.104512] systemd[1]: Starting curiosity.service...',
        '[    0.187330] coffee_driver: refill detected, resuming',
        '[    0.238910] portfolio: all modules loaded. Welcome back.'
    ];

    let panicActive = false;

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
            if (panicActive) return;

            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    konamiIndex = 0;
                    activateEasterEgg();
                }
            } else {
                konamiIndex = e.key === konamiCode[0] ? 1 : 0;
            }
        });
    }

    function activateEasterEgg() {
        if (panicActive) return;
        panicActive = true;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const previousFocus = document.activeElement;
        const timers = [];

        const overlay = document.createElement('div');
        overlay.className = 'kernel-panic';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Kernel panic');
        overlay.setAttribute('tabindex', '-1');

        const scanlines = document.createElement('div');
        scanlines.className = 'kernel-panic__scanlines';
        scanlines.setAttribute('aria-hidden', 'true');

        const log = document.createElement('pre');
        log.className = 'kernel-panic__log';

        const prompt = document.createElement('div');
        prompt.className = 'kernel-panic__prompt';
        prompt.style.visibility = 'hidden';
        prompt.appendChild(document.createTextNode('Press any key to reboot... '));

        const cursor = document.createElement('span');
        cursor.className = 'cursor-blink';
        cursor.textContent = '█';
        prompt.appendChild(cursor);

        overlay.appendChild(scanlines);
        overlay.appendChild(log);
        overlay.appendChild(prompt);

        elements.body.appendChild(overlay);
        elements.body.classList.add('panic-active');
        overlay.focus();

        requestAnimationFrame(() => overlay.classList.add('is-visible'));

        function after(delay, fn) {
            timers.push(setTimeout(fn, delay));
        }

        function print(line) {
            log.appendChild(document.createTextNode(line + '\n'));
            log.scrollTop = log.scrollHeight;
        }

        function typeLines(lines, speed, onDone) {
            if (reduceMotion) {
                lines.forEach(print);
                after(0, onDone);
                return;
            }

            let elapsed = 0;
            lines.forEach((line) => {
                elapsed += line === '' ? speed * 3 : speed;
                after(elapsed, () => print(line));
            });
            after(elapsed + speed * 2, onDone);
        }

        const DISMISS_EVENTS = ['keydown', 'click', 'touchstart'];
        const DISMISS_OPTIONS = { capture: true, passive: false };

        function armDismiss() {
            DISMISS_EVENTS.forEach(type => document.addEventListener(type, dismiss, DISMISS_OPTIONS));
        }

        function disarmDismiss() {
            DISMISS_EVENTS.forEach(type => document.removeEventListener(type, dismiss, DISMISS_OPTIONS));
        }

        function destroy() {
            timers.forEach(clearTimeout);
            timers.length = 0;
            disarmDismiss();
            overlay.remove();
            elements.body.classList.remove('panic-active');
            panicActive = false;

            if (previousFocus && typeof previousFocus.focus === 'function') {
                previousFocus.focus();
            }
        }

        let rebooting = false;

        function reboot() {
            if (rebooting) return;
            rebooting = true;

            timers.forEach(clearTimeout);
            timers.length = 0;
            disarmDismiss();

            log.textContent = '';
            prompt.style.visibility = 'hidden';

            typeLines(BOOT_DUMP, 180, () => {
                after(500, () => {
                    overlay.classList.remove('is-visible');
                    after(200, destroy);
                });
            });
        }

        function dismiss(e) {
            e.preventDefault();
            e.stopPropagation();
            reboot();
        }

        typeLines(PANIC_DUMP, 55, () => {
            prompt.style.visibility = 'visible';
            armDismiss();
            after(15000, reboot);
        });

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
