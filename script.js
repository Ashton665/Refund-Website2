// ================================
// GLOBAL FUNCTIONS
// ================================

// Toggle floating widget menu
function toggleWidget() {
    const menu = document.getElementById('widgetMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Close widget menu when clicking outside
document.addEventListener('click', function(event) {
    const widget = document.querySelector('.floating-widget');
    if (widget && !widget.contains(event.target)) {
        const menu = document.getElementById('widgetMenu');
        if (menu) {
            menu.classList.remove('active');
        }
    }
});

// Navigate to dashboard
function openDashboard() {
    window.location.href = 'dashboard.html';
}

// Smooth scroll navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && !href.includes('_blank')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Animate numbers on stat cards
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current.toFixed(0);
    }, 16);
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and review cards
document.querySelectorAll('.feature-card, .review-card, .refund-item, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Add active state to navigation links
window.addEventListener('scroll', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle (if needed)
let mobileMenuOpen = false;

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.style.display = 'none';
        mobileMenuOpen = false;
    }
}

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Live refund notifications simulation
function addLiveRefund() {
    const names = [
        { initials: 'TJ', name: 'Thomas Jefferson', amount: '9,200' },
        { initials: 'CV', name: 'Christina Vasquez', amount: '4,850' },
        { initials: 'PM', name: 'Patricia Martinez', amount: '10,750' },
        { initials: 'RG', name: 'Richard Graham', amount: '6,300' },
        { initials: 'LW', name: 'Linda Watson', amount: '8,100' }
    ];

    setInterval(() => {
        const feed = document.querySelector('.refund-feed');
        if (feed) {
            const randomRefund = names[Math.floor(Math.random() * names.length)];
            const newItem = document.createElement('div');
            newItem.className = 'refund-item';
            newItem.innerHTML = `
                <div class="refund-avatar">${randomRefund.initials}</div>
                <div class="refund-info">
                    <p class="refund-name">${randomRefund.name}</p>
                    <p class="refund-desc">Received $${randomRefund.amount} refund</p>
                </div>
                <p class="refund-time">Just now</p>
            `;

            feed.insertBefore(newItem, feed.firstChild);

            // Remove oldest item if more than 6
            const items = feed.querySelectorAll('.refund-item');
            if (items.length > 6) {
                items[items.length - 1].remove();
            }
        }
    }, 15000); // Add new refund every 15 seconds
}

// Initialize live refunds
document.addEventListener('DOMContentLoaded', addLiveRefund);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchBar = document.querySelector('.search-bar input');
        if (searchBar) {
            searchBar.focus();
        }
    }

    // Escape to close widget menu
    if (e.key === 'Escape') {
        const menu = document.getElementById('widgetMenu');
        if (menu) {
            menu.classList.remove('active');
        }
    }
});

// Detect user's preferred color scheme (optional: implement dark mode)
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Performance monitoring
window.addEventListener('load', () => {
    console.log('FINTECH Bank website loaded successfully');
});

// Log analytics
function trackEvent(eventName, eventProperties = {}) {
    console.log(`Event: ${eventName}`, eventProperties);
    // In production, this would send data to analytics service
}

// Track navigation clicks
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const page = link.textContent.trim();
        trackEvent('navigation_click', { page });
    });
});

// Track button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        trackEvent('button_click', { button: buttonText });
    });
});
