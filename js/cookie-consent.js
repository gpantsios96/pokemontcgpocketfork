// ==========================================
// COOKIE CONSENT BANNER - GDPR COMPLIANCE
// ==========================================
//
// This script displays a cookie consent banner to comply with GDPR
// regulations for EU/Greece. Users can accept or reject cookies.
//
// Features:
// - Accept/Reject buttons
// - Preference stored in localStorage
// - Google Analytics consent management
// - Mobile responsive
// - Greek language
// ==========================================

/**
 * Initialize cookie consent banner
 * Shows banner if user hasn't made a choice yet
 */
function initCookieConsent() {
    // Check if user already made a choice
    const cookiesAccepted = localStorage.getItem('cookies-accepted');

    if (cookiesAccepted !== null) {
        // User already made a choice, don't show banner
        handleConsentChoice(cookiesAccepted === 'true');
        return;
    }

    // User hasn't made a choice, show banner
    showCookieBanner();
}

/**
 * Create and display the cookie consent banner
 */
function showCookieBanner() {
    // Create banner element
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML = `
        <div style="
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #1f2937;
            color: white;
            padding: 20px;
            z-index: 9999;
            box-shadow: 0 -4px 12px rgba(0,0,0,0.3);
            animation: slideUp 0.4s ease-out;
        ">
            <div style="
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
            ">
                <div style="flex: 1; min-width: 280px;">
                    <p style="
                        margin: 0;
                        font-size: 14px;
                        line-height: 1.6;
                        color: #e5e7eb;
                    ">
                        🍪 Χρησιμοποιούμε cookies για τη βελτίωση της εμπειρίας σας και για στατιστική ανάλυση.
                        Συνεχίζοντας την περιήγηση, συμφωνείτε με τη χρήση cookies.
                        <a href="privacy-policy.html" style="
                            color: #60a5fa;
                            text-decoration: underline;
                            margin-left: 4px;
                        ">
                            Μάθετε περισσότερα
                        </a>
                    </p>
                </div>
                <div style="
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                ">
                    <button id="accept-cookies-btn" style="
                        background: #10b981;
                        color: white;
                        border: none;
                        padding: 10px 24px;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
                        ✓ Αποδοχή
                    </button>
                    <button id="reject-cookies-btn" style="
                        background: transparent;
                        color: #d1d5db;
                        border: 1px solid #4b5563;
                        padding: 10px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: all 0.2s;
                    " onmouseover="this.style.borderColor='#9ca3af'; this.style.color='#f3f4f6'" onmouseout="this.style.borderColor='#4b5563'; this.style.color='#d1d5db'">
                        ✗ Απόρριψη
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @media (max-width: 768px) {
            #cookie-consent-banner > div > div {
                flex-direction: column;
                text-align: center;
            }

            #cookie-consent-banner button {
                width: 100%;
                max-width: 300px;
            }

            #cookie-consent-banner > div > div > div:last-child {
                width: 100%;
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);

    // Append banner to body
    document.body.appendChild(banner);

    // Add event listeners
    document.getElementById('accept-cookies-btn').addEventListener('click', () => {
        acceptCookies();
        removeBanner();
    });

    document.getElementById('reject-cookies-btn').addEventListener('click', () => {
        rejectCookies();
        removeBanner();
    });
}

/**
 * Remove the cookie banner from DOM
 */
function removeBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
        // Add fade out animation
        banner.style.animation = 'slideDown 0.3s ease-in';
        setTimeout(() => {
            banner.remove();
        }, 300);
    }

    // Add slideDown animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Handle user accepting cookies
 */
function acceptCookies() {
    localStorage.setItem('cookies-accepted', 'true');
    handleConsentChoice(true);
    console.log('✅ Cookies accepted');
}

/**
 * Handle user rejecting cookies
 */
function rejectCookies() {
    localStorage.setItem('cookies-accepted', 'false');
    handleConsentChoice(false);
    console.log('❌ Cookies rejected');
}

/**
 * Handle consent choice and configure analytics
 * @param {boolean} accepted - Whether cookies were accepted
 */
function handleConsentChoice(accepted) {
    if (accepted) {
        // Enable Google Analytics if present
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'denied' // We don't use ads
            });
            console.log('📊 Analytics enabled');
        }
    } else {
        // Disable Google Analytics if present
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
            });
            console.log('🚫 Analytics disabled');
        }

        // Clear existing analytics cookies
        clearAnalyticsCookies();
    }
}

/**
 * Clear analytics cookies if user rejects consent
 */
function clearAnalyticsCookies() {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        const cookieName = cookie.split('=')[0].trim();

        // Clear Google Analytics cookies
        if (cookieName.startsWith('_ga') || cookieName.startsWith('_gid')) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            console.log(`Cleared cookie: ${cookieName}`);
        }
    }
}

/**
 * Check if cookies are accepted (for use by other scripts)
 * @returns {boolean} - True if accepted, false if rejected or no choice
 */
function areCookiesAccepted() {
    return localStorage.getItem('cookies-accepted') === 'true';
}

/**
 * Reset cookie consent (for testing or user request)
 */
function resetCookieConsent() {
    localStorage.removeItem('cookies-accepted');
    console.log('🔄 Cookie consent reset');
    location.reload();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
} else {
    initCookieConsent();
}

// Log consent system loaded
console.log('🍪 Cookie consent system loaded');
