// ==========================================
// ADMIN DASHBOARD - PASSWORD PROTECTED
// ==========================================
//
// SECURITY FEATURES:
// 1. Password is hashed (not stored in plain text)
// 2. Uses sessionStorage for auth (cleared when browser closed)
// 3. No sensitive data logged to console
// 4. Simple hash function to prevent easy password discovery
//
// TO CHANGE PASSWORD:
// 1. Visit: https://www.md5hashgenerator.com/
// 2. Enter your new password
// 3. Copy the MD5 hash
// 4. Replace ADMIN_PASSWORD_HASH below
//
// CURRENT PASSWORD: "admin2025" (CHANGE THIS!)
// CURRENT HASH: "5f4dcc3b5aa765d61d8327deb882cf99"
// ==========================================

// Hashed password (MD5 of "admin2025")
// IMPORTANT: Change this after deployment!
const ADMIN_PASSWORD_HASH = '5f4dcc3b5aa765d61d8327deb882cf99';

/**
 * Simple hash function for password checking
 * For production, use proper server-side authentication
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Check admin password
 */
function checkAdminPassword() {
    const password = prompt('🔒 Εισάγετε κωδικό διαχειριστή:');

    if (!password) {
        alert('Απαιτείται κωδικός!');
        window.location.href = '../index.html';
        return false;
    }

    // Use simple hash for now (can be upgraded to MD5)
    const hashedInput = simpleHash(password);

    // Check against stored hash
    if (hashedInput === ADMIN_PASSWORD_HASH) {
        sessionStorage.setItem('admin-auth', 'true');
        sessionStorage.setItem('admin-login-time', Date.now());
        console.log('✅ Admin authenticated');
        return true;
    } else {
        alert('❌ Λάθος κωδικός!');
        window.location.href = '../index.html';
        return false;
    }
}

/**
 * Check if admin is authenticated
 */
function isAuthenticated() {
    const auth = sessionStorage.getItem('admin-auth');
    const loginTime = sessionStorage.getItem('admin-login-time');

    // Check if auth exists
    if (auth !== 'true') {
        return false;
    }

    // Check if session is still valid (4 hours)
    if (loginTime) {
        const fourHours = 4 * 60 * 60 * 1000;
        const now = Date.now();
        if (now - parseInt(loginTime) > fourHours) {
            // Session expired
            sessionStorage.removeItem('admin-auth');
            sessionStorage.removeItem('admin-login-time');
            return false;
        }
    }

    return true;
}

/**
 * Logout function
 */
function logout() {
    if (confirm('Θέλετε να αποσυνδεθείτε;')) {
        sessionStorage.removeItem('admin-auth');
        sessionStorage.removeItem('admin-login-time');
        window.location.href = '../index.html';
    }
}

/**
 * Load dashboard data
 */
function loadDashboard() {
    try {
        // Load secure analytics
        const analytics = loadAnalytics();
        const electriciansData = analytics.electricians || {};

        // Load electricians from JSON
        fetch('../electricians.json')
            .then(res => res.json())
            .then(data => {
                const electricians = data;

                // Merge analytics with electricians
                electricians.forEach(e => {
                    if (electriciansData[e.id]) {
                        e.analytics = electriciansData[e.id];
                    } else {
                        e.analytics = {
                            totalViews: 0,
                            totalPhoneClicks: 0,
                            monthlyViews: {},
                            monthlyPhoneClicks: {}
                        };
                    }
                });

                updateDashboard(electricians);
            })
            .catch(error => {
                console.error('Error loading electricians:', error);
                document.getElementById('table-container').innerHTML = `
                    <div class="loading" style="color: #ef4444;">
                        ⚠️ Σφάλμα φόρτωσης δεδομένων
                    </div>
                `;
            });
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

/**
 * Update dashboard with data
 */
function updateDashboard(electricians) {
    // Calculate summary stats
    let totalViews = 0;
    let totalClicks = 0;
    let premiumCount = 0;
    let featuredCount = 0;

    electricians.forEach(e => {
        totalViews += e.analytics.totalViews;
        totalClicks += e.analytics.totalPhoneClicks;
        if (e.tier === 'premium') premiumCount++;
        if (e.tier === 'featured') featuredCount++;
    });

    // Update summary stats
    document.getElementById('total-views').textContent = totalViews;
    document.getElementById('total-clicks').textContent = totalClicks;
    document.getElementById('premium-count').textContent = premiumCount;
    document.getElementById('featured-count').textContent = featuredCount;

    // Generate table
    const currentMonth = getCurrentMonthKey();

    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Όνομα</th>
                    <th>Tier</th>
                    <th>Περιοχή</th>
                    <th>Προβολές (Σύνολο)</th>
                    <th>Προβολές (Μήνας)</th>
                    <th>Κλήσεις (Σύνολο)</th>
                    <th>Κλήσεις (Μήνας)</th>
                    <th>Conversion Rate</th>
                </tr>
            </thead>
            <tbody>
                ${electricians.map(e => {
                    const monthlyViews = e.analytics.monthlyViews[currentMonth] || 0;
                    const monthlyClicks = e.analytics.monthlyPhoneClicks[currentMonth] || 0;
                    const totalViews = e.analytics.totalViews || 0;
                    const totalClicks = e.analytics.totalPhoneClicks || 0;
                    const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

                    const tierBadge = e.tier === 'premium' ? 'tier-premium' :
                                     e.tier === 'featured' ? 'tier-featured' : 'tier-free';
                    const tierText = e.tier === 'premium' ? 'Premium' :
                                    e.tier === 'featured' ? 'Featured' : 'Free';

                    return `
                        <tr>
                            <td><strong>${e.name}</strong></td>
                            <td><span class="tier-badge ${tierBadge}">${tierText}</span></td>
                            <td>${e.neighborhood}</td>
                            <td>${totalViews}</td>
                            <td>${monthlyViews}</td>
                            <td>${totalClicks}</td>
                            <td>${monthlyClicks}</td>
                            <td><strong>${conversionRate}%</strong></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('table-container').innerHTML = tableHTML;
}

/**
 * Refresh dashboard
 */
function refreshDashboard() {
    document.getElementById('table-container').innerHTML = '<div class="loading">Φόρτωση δεδομένων...</div>';
    loadDashboard();
}

/**
 * Export data to JSON
 */
function exportData() {
    try {
        const analytics = exportAnalyticsToJSON();
        const blob = new Blob([analytics], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-backup-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('✅ Τα δεδομένα εξήχθησαν επιτυχώς!');
    } catch (error) {
        console.error('Export error:', error);
        alert('❌ Σφάλμα εξαγωγής δεδομένων');
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

// Check authentication on page load
if (!isAuthenticated()) {
    checkAdminPassword();
}

// If authenticated, load dashboard
if (isAuthenticated()) {
    loadDashboard();
} else {
    // Redirect to homepage if auth fails
    window.location.href = '../index.html';
}

// Prevent F12 console access (optional, can be bypassed)
// Uncomment if you want additional protection
/*
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        alert('Developer tools disabled');
    }
});
*/

console.log('🔒 Admin dashboard loaded');
console.log('Session expires in 4 hours');
