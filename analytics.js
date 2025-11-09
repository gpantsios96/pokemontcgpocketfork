// ==========================================
// ANALYTICS - COMPATIBILITY LAYER
// ==========================================
//
// This file now acts as a compatibility layer for existing code.
// All actual analytics operations are handled by analytics-secure.js
// which provides Base64 obfuscation for data protection.
//
// IMPORTANT: Include analytics-secure.js BEFORE this file in HTML:
// <script src="js/analytics-secure.js"></script>
// <script src="analytics.js"></script>
// ==========================================

// Legacy key (no longer used, but kept for reference)
const ANALYTICS_KEY = 'electrician-analytics';

// Migrate old data to new secure format if exists
function migrateOldAnalytics() {
    const oldData = localStorage.getItem(ANALYTICS_KEY);
    if (oldData) {
        try {
            const parsed = JSON.parse(oldData);
            // Check if secure analytics already has data
            const secureData = loadAnalytics();

            // If secure storage is empty, migrate old data
            if (Object.keys(secureData.electricians || {}).length === 0) {
                secureData.electricians = parsed;
                saveAnalytics(secureData);
                console.log('✅ Old analytics data migrated to secure storage');
            }

            // Remove old insecure data
            localStorage.removeItem(ANALYTICS_KEY);
        } catch (e) {
            console.error('Migration error:', e);
        }
    }
}

// Run migration check on load
if (typeof loadAnalytics === 'function' && typeof saveAnalytics === 'function') {
    migrateOldAnalytics();
} else {
    console.warn('⚠️ Secure analytics not loaded! Include js/analytics-secure.js first.');
}

// ==========================================
// COMPATIBILITY FUNCTIONS
// These functions maintain the same API as before
// but now use secure storage underneath
// ==========================================

// Get monthly stats for a specific electrician
function getMonthlyStats(electricianId, month) {
    const analytics = loadAnalytics();

    if (!analytics.electricians || !analytics.electricians[electricianId]) {
        return {
            views: 0,
            phoneClicks: 0
        };
    }

    return {
        views: analytics.electricians[electricianId].monthlyViews[month] || 0,
        phoneClicks: analytics.electricians[electricianId].monthlyPhoneClicks[month] || 0
    };
}

// Get all stats (returns all electricians data)
function getAllStats() {
    const analytics = loadAnalytics();
    return analytics.electricians || {};
}

// Clear all analytics (for testing/reset)
function clearAnalytics() {
    if (typeof clearAllAnalytics === 'function') {
        clearAllAnalytics();
    } else {
        localStorage.removeItem(ANALYTICS_KEY);
        console.log('Analytics cleared (old method)');
    }
}

// Export function (useful for admin dashboard)
function exportAnalyticsToJSON() {
    if (typeof exportAnalytics === 'function') {
        return exportAnalytics();
    }
    return JSON.stringify(getAllStats(), null, 2);
}

// Import function (useful for admin dashboard)
function importAnalyticsFromJSON(jsonString) {
    if (typeof importAnalytics === 'function') {
        return importAnalytics(jsonString);
    }
    return false;
}

console.log('📊 Analytics compatibility layer loaded');

