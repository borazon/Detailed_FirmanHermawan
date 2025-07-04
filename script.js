// JavaScript for interactive functionality
document.addEventListener('DOMContentLoaded', function () {

    // Initialize visitor tracking
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
        visitorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
        localStorage.setItem('visitorId', visitorId);
    }

    // Track page visit
    trackVisitor();

    // Dark mode functionality
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Update sun/moon icon visibility
    function updateThemeIcons(currentTheme) {
        const sunIcon = themeToggle.querySelector('[data-feather="sun"]');
        const moonIcon = themeToggle.querySelector('[data-feather="moon"]');

        if (sunIcon && moonIcon) {
            sunIcon.style.display = currentTheme === 'dark' ? 'none' : 'block';
            moonIcon.style.display = currentTheme === 'dark' ? 'block' : 'none';
        }
    }

    // Cek preferensi dari localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.classList.toggle('dark', savedTheme === 'dark');

    feather.replace();
    // Saat DOM selesai dimuat
    /*     document.addEventListener('DOMContentLoaded', () => {
            feather.replace(); // render feather icons jadi SVG
            updateThemeIcons(savedTheme);
        }); */

    // Event toggle klik
    themeToggle.addEventListener('click', function () {
        html.classList.toggle('dark');
        const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);

        /* feather.replace(); */
        updateThemeIcons(currentTheme);
    });


    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.add('hidden');
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinksForHighlight = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinksForHighlight.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // Download CV functionality
    const downloadButton = document.getElementById('download-cv');
    downloadButton.addEventListener('click', async function () {
        // Show loading state
        const originalText = this.innerHTML;
        this.innerHTML = '<i data-feather="loader" class="w-5 h-5 inline mr-2 loading"></i>Preparing...';
        this.disabled = true;

        try {
            // Track download in database
            await fetch('/api/analytics/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    visitorId: localStorage.getItem('visitorId')
                })
            });

            // Simulate PDF generation/download
            setTimeout(() => {
                // In a real application, you would generate or fetch the actual PDF
                const link = document.createElement('a');
                link.href = 'https://drive.google.com/uc?export=download&id=1cdWVBReDvr3IzWRzBKoW6YST5yXgqOEi'; // Replace with actual PDF URL
                link.download = 'Firman_Hermawan_CV.pdf';

                document.body.appendChild(link); // penting untuk Firefox dan beberapa browser lain
                link.click();
                document.body.removeChild(link)
                // Show success message
                /*              showToast('CV download started!', 'success'); */

                // Track event
                trackEvent('cv_downloaded', {
                    visitorId: localStorage.getItem('visitorId')
                });

                // Reset button
                this.innerHTML = originalText;
                this.disabled = false;
                feather.replace();
            }, 1000);
        } catch (error) {
            console.error('Error tracking download:', error);
            // Still show the download even if tracking fails
            showToast('CV download started!', 'success');
            this.innerHTML = originalText;
            this.disabled = false;
            feather.replace();
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-item, .project-card');
    animatedElements.forEach(el => observer.observe(el));

    // Typing effect for hero subtitle
    const subtitle = document.querySelector('h2');
    const originalText = subtitle.textContent;
    let index = 0;

    function typeWriter() {
        if (index < originalText.length) {
            subtitle.textContent = originalText.substring(0, index + 1);
            index++;
            setTimeout(typeWriter, 100);
        }
    }

    // Start typing effect after a delay
    setTimeout(() => {
        subtitle.textContent = '';
        typeWriter();
    }, 1000);

    // Parallax effect for hero section
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('section');
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Utility functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showToast(message, type = 'success') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i data-feather="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-5 h-5 mr-3 text-${type === 'success' ? 'green' : 'red'}-600"></i>
                <span class="text-gray-800">${message}</span>
                <button class="ml-4 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                    <i data-feather="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;

        document.body.appendChild(toast);
        feather.replace();

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // Initialize skill bar animations when in view
    const skillBars = document.querySelectorAll('.skill-item');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('[style*="width"]');
                if (progressBar) {
                    const width = progressBar.style.width;
                    progressBar.style.width = '0%';
                    setTimeout(() => {
                        progressBar.style.width = width;
                        progressBar.style.transition = 'width 1.5s ease-in-out';
                    }, 200);
                }
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // Add keyboard navigation support
    document.addEventListener('keydown', function (e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }

        // Ctrl + D for download CV
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            downloadButton.click();
        }
    });

    // Lazy loading for images (if any were added)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add print styles when printing
    window.addEventListener('beforeprint', function () {
        document.body.classList.add('printing');
    });

    window.addEventListener('afterprint', function () {
        document.body.classList.remove('printing');
    });

    // Performance optimization: debounce scroll events
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

    // Apply debouncing to scroll handlers
    const debouncedScrollHandler = debounce(updateActiveNavLink, 10);
    window.removeEventListener('scroll', updateActiveNavLink);
    window.addEventListener('scroll', debouncedScrollHandler);

    // Initialize Feather icons
    feather.replace();

    console.log('CV website loaded successfully!');
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js')
            .then(function (registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function (err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Analytics tracking
function trackEvent(eventName, eventData) {
    console.log('Event tracked:', eventName, eventData);
    // Could also send to additional analytics services here
}

// Track visitor analytics
async function trackVisitor() {
    try {
        const visitorId = localStorage.getItem('visitorId');
        await fetch('/api/analytics/visitor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                visitorId: visitorId,
                pageView: window.location.pathname,
                sessionDuration: null // Could implement session timing
            })
        });
    } catch (error) {
        console.error('Error tracking visitor:', error);
    }
}

// Track button clicks
document.addEventListener('click', function (e) {
    if (e.target.matches('button') || e.target.matches('a')) {
        trackEvent('button_click', {
            element: e.target.tagName,
            text: e.target.textContent.trim(),
            href: e.target.href || null
        });
    }
});
