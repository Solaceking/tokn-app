// TOKN Documentation Scripts
// Theme toggle, navigation, and interactive elements

document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme or prefer dark
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    if (currentTheme === 'light') {
        document.body.classList.add('light');
    }
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light');
            
            const theme = document.body.classList.contains('light') ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            
            // Dispatch event for other components
            document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
        });
    }
    
    // Mobile menu toggle (if needed in future)
    setupMobileMenu();
    
    // Smooth scroll for anchor links
    setupSmoothScroll();
    
    // Copy code blocks functionality
    setupCopyButtons();
    
    // Terminal animation
    animateTerminal();
});

// Mobile menu setup
function setupMobileMenu() {
    // Add mobile menu toggle button if needed
    // For now, we'll keep it simple
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, href);
            }
        });
    });
}

// Copy code blocks functionality
function setupCopyButtons() {
    // Add copy buttons to code blocks
    document.querySelectorAll('pre').forEach(pre => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <span class="copy-text">Copy</span>
        `;
        
        button.addEventListener('click', async function() {
            const code = pre.querySelector('code')?.textContent || pre.textContent;
            
            try {
                await navigator.clipboard.writeText(code);
                
                // Show success feedback
                const originalText = this.querySelector('.copy-text').textContent;
                this.querySelector('.copy-text').textContent = 'Copied!';
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.querySelector('.copy-text').textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                this.querySelector('.copy-text').textContent = 'Failed';
                setTimeout(() => {
                    this.querySelector('.copy-text').textContent = 'Copy';
                }, 2000);
            }
        });
        
        // Style the button
        button.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            color: var(--foreground);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.2s ease;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.borderColor = 'var(--accent)';
            button.style.color = 'var(--accent)';
        });
        
        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('copied')) {
                button.style.borderColor = 'var(--border)';
                button.style.color = 'var(--foreground)';
            }
        });
        
        pre.style.position = 'relative';
        pre.appendChild(button);
    });
}

// Terminal animation
function animateTerminal() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    let delay = 0;
    
    terminalLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            line.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, delay);
        
        // Increase delay for each line
        delay += 300;
    });
}

// Table of Contents generator (for future content pages)
function generateTableOfContents() {
    const content = document.querySelector('.content');
    if (!content) return;
    
    const headings = content.querySelectorAll('h2, h3');
    if (headings.length < 2) return;
    
    const toc = document.createElement('div');
    toc.className = 'toc';
    toc.innerHTML = `
        <div class="toc-header">
            <h4>Table of Contents</h4>
        </div>
        <nav class="toc-nav"></nav>
    `;
    
    const tocNav = toc.querySelector('.toc-nav');
    let currentLevel = 2;
    
    headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        
        // Generate ID if not present
        if (!heading.id) {
            heading.id = 'section-' + index;
        }
        
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.className = 'toc-link toc-level-' + level;
        
        tocNav.appendChild(link);
    });
    
    // Insert TOC after first heading
    const firstHeading = content.querySelector('h1, h2');
    if (firstHeading) {
        firstHeading.parentNode.insertBefore(toc, firstHeading.nextSibling);
    }
}

// Search functionality placeholder
function setupSearch() {
    // This would be implemented with a search service like Algolia
    // or a simple client-side search for smaller documentation
    console.log('Search functionality would be implemented here');
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // Generate table of contents for content pages
    if (window.location.pathname.includes('.html') && 
        !window.location.pathname.includes('index.html')) {
        generateTableOfContents();
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // '/' to focus search (when implemented)
        if (e.key === '/' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            // Focus search input
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close modals/dropdowns
        if (e.key === 'Escape') {
            // Close any open modals
        }
    });
}

// Utility function to debounce expensive operations
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

// Observe theme changes for components that need updates
document.addEventListener('themechange', function(e) {
    // Update any components that depend on theme
    console.log('Theme changed to:', e.detail.theme);
});

// Add styles for dynamic elements
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .copy-button.copied {
        background-color: var(--accent) !important;
        color: var(--background) !important;
        border-color: var(--accent) !important;
    }
    
    .toc {
        background: var(--card);
        border: 2px solid var(--border);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        margin: var(--space-6) 0;
    }
    
    .toc-header {
        margin-bottom: var(--space-3);
    }
    
    .toc-header h4 {
        margin: 0;
        font-size: 1rem;
        color: var(--accent);
    }
    
    .toc-nav {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
    }
    
    .toc-link {
        color: color-mix(in srgb, var(--foreground) 70%, transparent);
        text-decoration: none;
        font-size: 0.875rem;
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
    }
    
    .toc-link:hover {
        color: var(--accent);
        background: color-mix(in srgb, var(--accent) 10%, transparent);
    }
    
    .toc-level-2 {
        font-weight: 600;
        padding-left: 0;
    }
    
    .toc-level-3 {
        font-weight: 400;
        padding-left: var(--space-4);
    }
    
    /* Loading skeleton for future async content */
    .skeleton {
        background: linear-gradient(90deg, var(--border) 25%, var(--card) 50%, var(--border) 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: var(--radius-md);
    }
    
    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
`;
document.head.appendChild(dynamicStyles);