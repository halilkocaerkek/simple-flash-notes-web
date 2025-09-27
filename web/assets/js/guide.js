// User Guide Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeNavigation();
    initializeAccordions();
    initializeTOC();
    initializePrintFunctionality();
});

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('guide-search');
    const functionItems = document.querySelectorAll('.function-item');
    const sections = document.querySelectorAll('.guide-section');

    if (!searchInput) return;

    let searchTimeout;

    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value.trim().toLowerCase());
        }, 300);
    });

    function performSearch(query) {
        if (query === '') {
            showAllItems();
            removeSearchResults();
            return;
        }

        let matchCount = 0;
        let hasVisibleSections = false;

        sections.forEach(section => {
            const sectionItems = section.querySelectorAll('.function-item');
            let sectionHasMatches = false;

            sectionItems.forEach(item => {
                const title = item.querySelector('.function-title').textContent.toLowerCase();
                const description = item.querySelector('.function-description').textContent.toLowerCase();
                const content = item.querySelector('.function-text').textContent.toLowerCase();

                const isMatch = title.includes(query) ||
                               description.includes(query) ||
                               content.includes(query);

                if (isMatch) {
                    item.classList.remove('hidden');
                    highlightSearchTerms(item, query);
                    matchCount++;
                    sectionHasMatches = true;
                } else {
                    item.classList.add('hidden');
                    removeHighlights(item);
                }
            });

            // Show/hide entire sections based on matches
            if (sectionHasMatches) {
                section.style.display = 'block';
                hasVisibleSections = true;
            } else {
                section.style.display = 'none';
            }
        });

        showSearchResults(matchCount, query);

        // Hide FAQ and support sections during search
        const faqSection = document.querySelector('.faq-section');
        const supportSection = document.querySelector('.support-section');
        if (faqSection) faqSection.style.display = 'none';
        if (supportSection) supportSection.style.display = 'none';

        // Scroll to first result
        if (matchCount > 0) {
            const firstMatch = document.querySelector('.function-item:not(.hidden)');
            if (firstMatch) {
                firstMatch.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    function showAllItems() {
        functionItems.forEach(item => {
            item.classList.remove('hidden');
            removeHighlights(item);
        });

        sections.forEach(section => {
            section.style.display = 'block';
        });

        // Show FAQ and support sections
        const faqSection = document.querySelector('.faq-section');
        const supportSection = document.querySelector('.support-section');
        if (faqSection) faqSection.style.display = 'block';
        if (supportSection) supportSection.style.display = 'block';
    }

    function highlightSearchTerms(item, query) {
        const elements = item.querySelectorAll('.function-title, .function-description, .function-text p, .function-text li');

        elements.forEach(element => {
            const text = element.textContent;
            if (text.toLowerCase().includes(query)) {
                const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
                const highlightedText = text.replace(regex, '<span class="highlight">$1</span>');
                element.innerHTML = highlightedText;
            }
        });
    }

    function removeHighlights(item) {
        const highlights = item.querySelectorAll('.highlight');
        highlights.forEach(highlight => {
            const parent = highlight.parentNode;
            parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
            parent.normalize();
        });
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function showSearchResults(count, query) {
        removeSearchResults();

        const resultsInfo = document.createElement('div');
        resultsInfo.className = 'search-results-info';

        if (count === 0) {
            resultsInfo.innerHTML = `
                <div class="no-results">
                    <h3>No results found</h3>
                    <p>No functions match "${query}". Try different keywords or browse by category.</p>
                </div>
            `;
        } else {
            resultsInfo.innerHTML = `
                <p>Found ${count} function${count !== 1 ? 's' : ''} matching "${query}"</p>
            `;
        }

        const guideContent = document.querySelector('.guide-content .container');
        guideContent.insertBefore(resultsInfo, guideContent.firstChild);
    }

    function removeSearchResults() {
        const existingResults = document.querySelector('.search-results-info');
        if (existingResults) {
            existingResults.remove();
        }
    }

    // Clear search on Escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            performSearch('');
            this.blur();
        }
    });
}

// Navigation Enhancements
function initializeNavigation() {
    // Smooth scrolling for TOC links
    const tocLinks = document.querySelectorAll('.toc-category a');

    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Clear any active search
                const searchInput = document.getElementById('guide-search');
                if (searchInput && searchInput.value) {
                    searchInput.value = '';
                    performSearch('');
                }

                // Smooth scroll with offset for fixed header
                const offset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Add highlight effect to target
                highlightTarget(targetElement);
            }
        });
    });

    // Add scroll spy for navigation
    initializeScrollSpy();

    // Add back to top button
    addBackToTopButton();
}

function initializeScrollSpy() {
    const sections = document.querySelectorAll('.guide-section');
    const tocLinks = document.querySelectorAll('.toc-category a');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-100px 0px -80% 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');

                // Update active TOC link
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                        link.parentElement.classList.add('active-category');
                    } else {
                        link.parentElement.classList.remove('active-category');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Add styles for active states
    const style = document.createElement('style');
    style.textContent = `
        .toc-category a.active {
            color: #007AFF;
            font-weight: 600;
            padding-left: 15px;
            border-left: 3px solid #007AFF;
        }

        .toc-category.active-category {
            border-left-color: #28a745;
            background: linear-gradient(to right, #f8f9fa, #e8f5e8);
        }

        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #007AFF;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
            z-index: 1000;
        }

        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }

        .back-to-top:hover {
            background: #0056CC;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
        }

        .target-highlight {
            animation: targetPulse 2s ease-out;
        }

        @keyframes targetPulse {
            0% { background-color: rgba(0, 122, 255, 0.1); }
            50% { background-color: rgba(0, 122, 255, 0.2); }
            100% { background-color: transparent; }
        }
    `;
    document.head.appendChild(style);
}

function highlightTarget(element) {
    element.classList.add('target-highlight');
    setTimeout(() => {
        element.classList.remove('target-highlight');
    }, 2000);
}

function addBackToTopButton() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(button);

    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide based on scroll position
    window.addEventListener('scroll', SimpleFlashNotes.throttle(function() {
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    }, 100));
}

// Accordion Functionality for Function Items
function initializeAccordions() {
    const functionItems = document.querySelectorAll('.function-item');

    functionItems.forEach(item => {
        const header = item.querySelector('.function-header');
        const content = item.querySelector('.function-content');

        // Add click to expand/collapse functionality
        header.addEventListener('click', function() {
            const isExpanded = item.classList.contains('expanded');

            if (isExpanded) {
                item.classList.remove('expanded');
                content.style.maxHeight = null;
            } else {
                item.classList.add('expanded');
                content.style.maxHeight = content.scrollHeight + 'px';
            }

            // Add expand icon
            updateExpandIcon(header, !isExpanded);
        });

        // Add expand icon
        if (!header.querySelector('.expand-icon')) {
            const expandIcon = document.createElement('span');
            expandIcon.className = 'expand-icon';
            expandIcon.innerHTML = '⌄';
            header.appendChild(expandIcon);
        }

        // Set initial state (expanded by default)
        item.classList.add('expanded');
        updateExpandIcon(header, true);
    });

    // Add styles for accordion
    const style = document.createElement('style');
    style.textContent = `
        .function-header {
            cursor: pointer;
            user-select: none;
            position: relative;
        }

        .function-header:hover {
            background: rgba(0, 122, 255, 0.05);
            border-radius: 8px;
            margin: -10px;
            padding: 10px;
        }

        .expand-icon {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.5rem;
            color: #666;
            transition: transform 0.2s ease;
        }

        .function-item.expanded .expand-icon {
            transform: translateY(-50%) rotate(180deg);
        }

        .function-content {
            overflow: hidden;
            transition: max-height 0.3s ease;
        }

        .function-item:not(.expanded) .function-content {
            max-height: 0 !important;
        }
    `;
    document.head.appendChild(style);
}

function updateExpandIcon(header, isExpanded) {
    const icon = header.querySelector('.expand-icon');
    if (icon) {
        icon.style.transform = isExpanded ?
            'translateY(-50%) rotate(180deg)' :
            'translateY(-50%) rotate(0deg)';
    }
}

// Table of Contents Enhancements
function initializeTOC() {
    const tocCategories = document.querySelectorAll('.toc-category');

    tocCategories.forEach(category => {
        // Add hover effects
        category.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });

        category.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });

        // Add click analytics
        const links = category.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                // Track TOC usage (could be sent to analytics)
                console.log('TOC Navigation:', this.textContent);
            });
        });
    });

    // Add collapse/expand for mobile
    if (window.innerWidth <= 768) {
        addMobileTOC();
    }

    window.addEventListener('resize', SimpleFlashNotes.debounce(function() {
        if (window.innerWidth <= 768) {
            addMobileTOC();
        } else {
            removeMobileTOC();
        }
    }, 250));
}

function addMobileTOC() {
    const toc = document.querySelector('.toc');
    if (!toc || toc.classList.contains('mobile-toc')) return;

    toc.classList.add('mobile-toc');

    const tocTitle = toc.querySelector('h2');
    if (tocTitle && !tocTitle.classList.contains('toc-toggle')) {
        tocTitle.classList.add('toc-toggle');
        tocTitle.style.cursor = 'pointer';
        tocTitle.innerHTML += ' <span class="toc-arrow">▼</span>';

        const tocGrid = toc.querySelector('.toc-grid');
        tocGrid.style.display = 'none';

        tocTitle.addEventListener('click', function() {
            const isVisible = tocGrid.style.display !== 'none';
            tocGrid.style.display = isVisible ? 'none' : 'grid';
            const arrow = this.querySelector('.toc-arrow');
            arrow.textContent = isVisible ? '▼' : '▲';
        });
    }
}

function removeMobileTOC() {
    const toc = document.querySelector('.toc');
    if (!toc || !toc.classList.contains('mobile-toc')) return;

    toc.classList.remove('mobile-toc');
    const tocTitle = toc.querySelector('h2');
    const tocGrid = toc.querySelector('.toc-grid');

    if (tocTitle) {
        tocTitle.classList.remove('toc-toggle');
        tocTitle.style.cursor = 'default';
        const arrow = tocTitle.querySelector('.toc-arrow');
        if (arrow) arrow.remove();
    }

    if (tocGrid) {
        tocGrid.style.display = 'grid';
    }
}

// Print Functionality
function initializePrintFunctionality() {
    // Add print button
    const printButton = document.createElement('button');
    printButton.className = 'print-button';
    printButton.innerHTML = '🖨️ Print Guide';
    printButton.setAttribute('aria-label', 'Print user guide');

    const searchSection = document.querySelector('.search-section .container');
    if (searchSection) {
        printButton.style.cssText = `
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: #007AFF;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background 0.2s ease;
        `;

        printButton.addEventListener('click', function() {
            window.print();
        });

        printButton.addEventListener('mouseenter', function() {
            this.style.background = '#0056CC';
        });

        printButton.addEventListener('mouseleave', function() {
            this.style.background = '#007AFF';
        });

        searchSection.style.position = 'relative';
        searchSection.appendChild(printButton);
    }

    // Optimize print layout
    window.addEventListener('beforeprint', function() {
        // Expand all accordion items for printing
        const functionItems = document.querySelectorAll('.function-item');
        functionItems.forEach(item => {
            item.classList.add('expanded');
            const content = item.querySelector('.function-content');
            content.style.maxHeight = 'none';
        });

        // Show all hidden items
        document.querySelectorAll('.hidden').forEach(el => {
            el.style.display = 'block';
        });
    });

    window.addEventListener('afterprint', function() {
        // Restore previous state
        location.reload();
    });
}

// Advanced Features
function initializeAdvancedFeatures() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('guide-search');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('guide-search');
            if (searchInput && document.activeElement === searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.blur();
            }
        }
    });

    // Add progress indicator
    addProgressIndicator();

    // Add reading time estimates
    addReadingTimeEstimates();
}

function addProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(to right, #007AFF, #5856D6);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', SimpleFlashNotes.throttle(function() {
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight - winHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / docHeight) * 100;

        progressBar.style.width = Math.min(progress, 100) + '%';
    }, 10));
}

function addReadingTimeEstimates() {
    const functionItems = document.querySelectorAll('.function-item');
    const wordsPerMinute = 200;

    functionItems.forEach(item => {
        const text = item.querySelector('.function-text').textContent;
        const wordCount = text.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);

        const timeEstimate = document.createElement('span');
        timeEstimate.className = 'reading-time';
        timeEstimate.textContent = `${readingTime} min read`;
        timeEstimate.style.cssText = `
            color: #666;
            font-size: 0.8rem;
            margin-left: 15px;
            opacity: 0.8;
        `;

        const header = item.querySelector('.function-header');
        header.appendChild(timeEstimate);
    });
}

// Initialize advanced features
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeAdvancedFeatures, 500);
});

// Export guide-specific functions
window.SimpleFlashNotesGuide = {
    initializeSearch,
    initializeNavigation,
    initializeAccordions,
    initializeTOC,
    initializePrintFunctionality,
    initializeAdvancedFeatures
};