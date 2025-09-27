// Common JavaScript functionality for Simple Flash Notes web pages

document.addEventListener('DOMContentLoaded', function() {
    initializeDeviceSwitcher();
    initializeAnimations();
    initializeLazyLoading();
    initializeAccessibility();
});

// Device Switcher Functionality
function initializeDeviceSwitcher() {
    const deviceButtons = document.querySelectorAll('.device-btn');
    const deviceFrames = document.querySelectorAll('.device-frame, .screenshot-device');

    deviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetDevice = this.getAttribute('data-device');

            // Update active button
            deviceButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update visible device frames
            deviceFrames.forEach(frame => {
                frame.classList.remove('active');
                if (frame.classList.contains(targetDevice)) {
                    frame.classList.add('active');
                }
            });

            // Add smooth transition effect
            const activeFrames = document.querySelectorAll('.device-frame.active, .screenshot-device.active');
            activeFrames.forEach(frame => {
                frame.style.opacity = '0';
                frame.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    frame.style.transition = 'all 0.3s ease';
                    frame.style.opacity = '1';
                    frame.style.transform = 'translateY(0)';
                }, 50);
            });

            // Track device preference
            localStorage.setItem('preferredDevice', targetDevice);
        });
    });

    // Restore user preference
    const preferredDevice = localStorage.getItem('preferredDevice');
    if (preferredDevice) {
        const preferredButton = document.querySelector(`[data-device="${preferredDevice}"]`);
        if (preferredButton) {
            preferredButton.click();
        }
    }
}

// Intersection Observer for Animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.feature, .testimonial, .function-item');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Add staggered animation for multiple elements
                const siblings = Array.from(entry.target.parentNode.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Lazy Loading for Images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Keyboard navigation for device switcher
    const deviceButtons = document.querySelectorAll('.device-btn');
    deviceButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Focus management for smooth scrolling
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Set focus for accessibility
                setTimeout(() => {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }, 500);
            }
        });
    });

    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.scrollBehavior = 'auto';

        // Remove animations
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

// Parallax Effect (with performance optimization)
function initializeParallax() {
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero');

        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Only enable parallax on desktop and for users who don't prefer reduced motion
    if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', requestTick);
    }
}

// Image Modal Functionality
function initializeImageModals() {
    const deviceScreenshots = document.querySelectorAll('.device-screenshot');

    deviceScreenshots.forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });

        // Add cursor pointer style
        img.style.cursor = 'pointer';
    });
}

function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-backdrop" onclick="closeImageModal()">
            <div class="image-modal-content" onclick="event.stopPropagation()">
                <img src="${src}" alt="${alt}" class="image-modal-img">
                <button class="image-modal-close" onclick="closeImageModal()" aria-label="Close modal">&times;</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .image-modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .image-modal-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            margin: 20px;
        }

        .image-modal-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 8px;
        }

        .image-modal-close {
            position: absolute;
            top: -10px;
            right: -10px;
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: white;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
    `;
    document.head.appendChild(style);

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

function closeImageModal() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeParallax();
    initializeImageModals();
});

// Utility Functions
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

// Export functions for use in other scripts
window.SimpleFlashNotes = {
    initializeDeviceSwitcher,
    initializeAnimations,
    initializeLazyLoading,
    initializeAccessibility,
    initializeParallax,
    initializeImageModals,
    openImageModal,
    closeImageModal,
    debounce,
    throttle
};