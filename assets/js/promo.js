// Promotion Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeHeroAnimations();
    initializeInfiniteScroll();
    initializeFeatureAnimations();
    initializeTestimonialCarousel();
    initializePerformanceOptimizations();
});

// Hero Section Animations
function initializeHeroAnimations() {
    const heroText = document.querySelector('.hero-text');
    const heroDevice = document.querySelector('.hero-device');

    if (heroText && heroDevice) {
        // Staggered entrance animation
        setTimeout(() => {
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 200);

        setTimeout(() => {
            heroDevice.style.opacity = '1';
            heroDevice.style.transform = 'translateY(0)';
        }, 400);

        // Add floating animation to device
        heroDevice.style.animation = 'heroFloat 6s ease-in-out infinite';
    }

    // Add floating animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        .hero-text, .hero-device {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out;
        }

        @keyframes heroFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(1deg); }
            50% { transform: translateY(-5px) rotate(0deg); }
            75% { transform: translateY(-15px) rotate(-1deg); }
        }

        @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 8px 40px rgba(0, 122, 255, 0.3); }
            50% { box-shadow: 0 8px 60px rgba(0, 122, 255, 0.5); }
        }

        .device-frame.active {
            animation: pulseGlow 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
            .hero-text, .hero-device {
                animation: none !important;
                transition: none !important;
            }
            .device-frame.active {
                animation: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Infinite Scroll Effect for Features
function initializeInfiniteScroll() {
    const featuresSection = document.querySelector('.features-showcase');
    const features = document.querySelectorAll('.feature');

    if (!featuresSection || features.length === 0) return;

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const featureObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const feature = entry.target;
                const index = Array.from(features).indexOf(feature);

                // Add entrance animation with stagger
                setTimeout(() => {
                    feature.classList.add('visible');
                    feature.style.animationDelay = '0s';
                }, index * 100);

                // Animate child elements
                animateFeatureContent(feature);
            }
        });
    }, observerOptions);

    features.forEach(feature => {
        featureObserver.observe(feature);
    });

    // Add infinite scroll indicator
    addScrollIndicator(featuresSection);
}

function animateFeatureContent(feature) {
    const text = feature.querySelector('.feature-text');
    const device = feature.querySelector('.feature-device');
    const listItems = feature.querySelectorAll('.feature-list li');

    if (text) {
        text.style.animation = 'slideInLeft 0.8s ease-out 0.2s both';
    }

    if (device) {
        device.style.animation = 'slideInRight 0.8s ease-out 0.4s both';
    }

    // Animate list items one by one
    listItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.4s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 600 + (index * 100));
    });

    // Add keyframes for slide animations
    if (!document.querySelector('#feature-animations')) {
        const style = document.createElement('style');
        style.id = 'feature-animations';
        style.textContent = `
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function addScrollIndicator(container) {
    // The scroll indicator is handled in CSS with ::before and ::after pseudo-elements
    // Add mouse wheel smooth scrolling enhancement
    container.addEventListener('wheel', function(e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            const scrollAmount = e.deltaY * 0.5;
            window.scrollBy({
                top: scrollAmount,
                behavior: 'auto'
            });
        }
    }, { passive: false });
}

// Feature Animations with Advanced Effects
function initializeFeatureAnimations() {
    const featureDevices = document.querySelectorAll('.feature-device .device-frame');

    featureDevices.forEach(device => {
        // Add hover effects
        device.addEventListener('mouseenter', function() {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.style.transform = 'scale(1.05) rotateY(5deg) translateZ(20px)';
                this.style.transition = 'transform 0.3s ease-out';
            }
        });

        device.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotateY(0deg) translateZ(0px)';
        });

        // Add click to expand effect
        device.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                window.SimpleFlashNotes.openImageModal(img.src, img.alt);
            }
        });

        // Add cursor pointer
        device.style.cursor = 'pointer';
    });

    // Add parallax effect to feature sections
    initializeFeatureParallax();
}

function initializeFeatureParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const features = document.querySelectorAll('.feature');
    let ticking = false;

    function updateFeatureParallax() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;

        features.forEach((feature, index) => {
            const rect = feature.getBoundingClientRect();
            const elementTop = rect.top + scrolled;
            const elementHeight = rect.height;
            const isVisible = rect.top < windowHeight && rect.bottom > 0;

            if (isVisible) {
                const speed = 0.1 + (index % 2) * 0.05; // Alternate speeds
                const yPos = (scrolled - elementTop) * speed;
                const device = feature.querySelector('.feature-device');

                if (device) {
                    device.style.transform = `translateY(${yPos}px)`;
                }
            }
        });

        ticking = false;
    }

    function requestParallaxTick() {
        if (!ticking && window.innerWidth > 768) {
            requestAnimationFrame(updateFeatureParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', SimpleFlashNotes.throttle(requestParallaxTick, 16));
}

// Testimonial Carousel Enhancement
function initializeTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');

    if (testimonials.length === 0) return;

    // Add entrance animations
    const testimonialObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const testimonial = entry.target;
                const index = Array.from(testimonials).indexOf(testimonial);

                setTimeout(() => {
                    testimonial.style.opacity = '1';
                    testimonial.style.transform = 'translateY(0) scale(1)';
                }, index * 150);
            }
        });
    }, { threshold: 0.2 });

    testimonials.forEach(testimonial => {
        // Set initial state
        testimonial.style.opacity = '0';
        testimonial.style.transform = 'translateY(30px) scale(0.95)';
        testimonial.style.transition = 'all 0.6s ease-out';

        testimonialObserver.observe(testimonial);

        // Add hover effects
        testimonial.addEventListener('mouseenter', function() {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
            }
        });

        testimonial.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Performance Optimizations
function initializePerformanceOptimizations() {
    // Preload critical images
    preloadCriticalImages();

    // Optimize scroll performance
    optimizeScrollPerformance();

    // Add loading states
    addLoadingStates();

    // Initialize intersection observer for performance
    initializePerformanceObserver();
}

function preloadCriticalImages() {
    const criticalImages = [
        'assets/images/iphone/hero-screenshot.png',
        'assets/images/ipad/hero-screenshot.png'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

function optimizeScrollPerformance() {
    // Use passive listeners for better scroll performance
    const scrollElements = document.querySelectorAll('.features-showcase');

    scrollElements.forEach(element => {
        element.addEventListener('scroll', function() {
            // Handle scroll events
        }, { passive: true });
    });

    // Debounce resize events
    window.addEventListener('resize', SimpleFlashNotes.debounce(function() {
        // Handle resize events
        initializeFeatureParallax();
    }, 250));
}

function addLoadingStates() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';

            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });

            img.addEventListener('error', function() {
                this.style.opacity = '0.5';
                this.alt = 'Image could not be loaded';
            });
        }
    });
}

function initializePerformanceObserver() {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver(function(list) {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.entryType === 'largest-contentful-paint') {
                    // Track LCP for optimization
                    console.log('LCP:', entry.startTime);
                }
            });
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
}

// Advanced Animation Effects
function initializeAdvancedEffects() {
    // Magnetic buttons effect
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) scale(1)';
        });
    });

    // Glowing effects
    const glowElements = document.querySelectorAll('.device-frame');

    glowElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.style.filter = 'drop-shadow(0 0 20px rgba(0, 122, 255, 0.5))';
            }
        });

        element.addEventListener('mouseleave', function() {
            this.style.filter = 'none';
        });
    });
}

// Initialize advanced effects
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are rendered
    setTimeout(initializeAdvancedEffects, 500);
});

// Export promotion-specific functions
window.SimpleFlashNotesPromo = {
    initializeHeroAnimations,
    initializeInfiniteScroll,
    initializeFeatureAnimations,
    initializeTestimonialCarousel,
    initializePerformanceOptimizations,
    initializeAdvancedEffects
};