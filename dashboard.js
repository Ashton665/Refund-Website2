// ================================
// DASHBOARD SPECIFIC FUNCTIONS
// ================================

// Toggle sidebar on mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Section navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        const section = item.getAttribute('data-section');
        if (!section) {
            return; // Skip non-section items
        }

        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('active');
        });

        // Add active class to clicked item
        item.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Show selected section
        const selectedSection = document.getElementById(section);
        if (selectedSection) {
            selectedSection.classList.add('active');
        }

        // Close sidebar on mobile
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }

        trackEvent('section_navigation', { section });
    });
});

// Form submission handler
const accountForm = document.querySelector('.account-form');
if (accountForm) {
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(accountForm);
        const data = Object.fromEntries(formData);

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--color-success);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        successMessage.textContent = '✓ Account created successfully!';
        document.body.appendChild(successMessage);

        // Auto-close after 5 seconds
        setTimeout(() => {
            successMessage.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => successMessage.remove(), 300);
        }, 5000);

        // Reset form
        accountForm.reset();

        trackEvent('account_created', data);
    });
}

// Button click handlers
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const text = this.textContent.trim();
        
        if (text.includes('Claim')) {
            e.preventDefault();
            showClaimModal();
        } else if (text.includes('Create Account')) {
            e.preventDefault();
            const section = document.querySelector('.nav-item[data-section="create-account"]');
            if (section) section.click();
        } else if (text.includes('New Claim')) {
            e.preventDefault();
            showNewClaimForm();
        }
    });
});

// Claim modal
function showClaimModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        animation: fadeIn 0.3s ease-out;
    `;

    modal.innerHTML = `
        <div style="
            background-color: white;
            border-radius: 12px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        ">
            <h2 style="margin-bottom: 10px; color: #1F2937;">Claim Your Refund</h2>
            <p style="color: #6B7280; margin-bottom: 24px;">Available Balance: <strong>$12,847.50</strong></p>
            
            <form style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Claim Amount</label>
                    <input type="number" placeholder="Enter amount" style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 1px solid #E5E7EB;
                        border-radius: 8px;
                        font-size: 14px;
                        box-sizing: border-box;
                    " required>
                </div>
                
                <div>
                    <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Claim Reason</label>
                    <select style="
                        width: 100%;
                        padding: 12px 16px;
                        border: 1px solid #E5E7EB;
                        border-radius: 8px;
                        font-size: 14px;
                        box-sizing: border-box;
                    " required>
                        <option>Select reason</option>
                        <option>Refund from merchant</option>
                        <option>Unauthorized transaction</option>
                        <option>Service dispute</option>
                        <option>Other</option>
                    </select>
                </div>

                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <button type="button" onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" style="
                        flex: 1;
                        padding: 12px 24px;
                        border: 1px solid #E5E7EB;
                        background-color: white;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                    ">Cancel</button>
                    <button type="submit" style="
                        flex: 1;
                        padding: 12px 24px;
                        background-color: #3B82F6;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                    ">Submit Claim</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        showSuccessMessage('Claim submitted successfully! Your claim is now being processed.');
        modal.remove();
        trackEvent('claim_submitted', { amount: e.target[0].value });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// New claim form
function showNewClaimForm() {
    const section = document.querySelector('.nav-item[data-section="claims"]');
    if (section) {
        section.click();
        showClaimModal();
    }
}

// Success message helper
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #10B981;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    `;
    successDiv.textContent = '✓ ' + message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}

// Settings form submission
const settingsForm = document.querySelector('.settings-grid');
if (settingsForm) {
    const saveBtn = document.querySelector('.settings-grid').parentElement.querySelector('.btn-primary');
    if (saveBtn && !saveBtn.onclick) {
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSuccessMessage('Settings saved successfully!');
            trackEvent('settings_updated');
        });
    }
}

// Mobile responsive adjustments
function handleResponsive() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768) {
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    }
}

window.addEventListener('resize', handleResponsive);
window.addEventListener('orientationchange', handleResponsive);

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (sidebar && sidebar.classList.contains('active')) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(400px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(animationStyles);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set first nav item as active on load
    const firstNavItem = document.querySelector('.nav-item[data-section]');
    if (firstNavItem) {
        firstNavItem.classList.add('active');
    }

    // Make sure overview section is active
    const overviewSection = document.getElementById('overview');
    if (overviewSection) {
        overviewSection.classList.add('active');
    }

    // Initialize tooltips
    initializeTooltips();

    // Log dashboard load
    trackEvent('dashboard_loaded');
});

// Simple tooltip system
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    tooltip.style.cssText = `
        position: absolute;
        background-color: #1F2937;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
    `;
    e.target.parentElement.appendChild(tooltip);
}

function hideTooltip(e) {
    const tooltip = e.target.parentElement.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Keyboard navigation for dashboard
document.addEventListener('keydown', (e) => {
    // Alt + O for Overview
    if (e.altKey && e.key === 'o') {
        e.preventDefault();
        document.querySelector('.nav-item[data-section="overview"]')?.click();
    }
    
    // Alt + A for New Account
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        document.querySelector('.nav-item[data-section="create-account"]')?.click();
    }
    
    // Alt + T for Transactions
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        document.querySelector('.nav-item[data-section="transactions"]')?.click();
    }
    
    // Alt + C for Claims
    if (e.altKey && e.key === 'c') {
        e.preventDefault();
        document.querySelector('.nav-item[data-section="claims"]')?.click();
    }
});

// Search functionality
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const transactions = document.querySelectorAll('.transaction-item, .transaction-row');
        
        transactions.forEach(transaction => {
            const text = transaction.textContent.toLowerCase();
            transaction.style.display = text.includes(query) ? '' : 'none';
        });
    });
}

// Log event helper
function trackEvent(eventName, properties = {}) {
    console.log(`Dashboard Event: ${eventName}`, properties);
    // In production, send to analytics service
}
