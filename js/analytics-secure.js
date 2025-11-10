// ==========================================
// SECURE ANALYTICS - BASE64 OBFUSCATION
// ==========================================
//
// Security measures:
// 1. Analytics data stored as Base64 encoded string (not plain JSON)
// 2. Storage key is generic ("app_data" instead of "analytics")
// 3. Console logs minimized (no data exposure)
// 4. All sensitive data operations centralized in this file
//
// NOTE: This is obfuscation, not encryption. For production,
// consider server-side storage with proper encryption.
// ==========================================

// Generic storage key (less obvious than "electrician-analytics")
const STORAGE_KEY = 'app_data';

// ==========================================
// RATE LIMITING - REMOVED
// ==========================================
// Rate limiting has been disabled to allow unlimited phone clicks

/**
 * Encode data to Base64 for obfuscation
 * @param {Object} data - The data object to encode
 * @returns {string|null} - Base64 encoded string or null on error
 */
function encodeData(data) {
    try {
        const jsonString = JSON.stringify(data);
        // Double encoding: URI encode first, then Base64
        return btoa(encodeURIComponent(jsonString));
    } catch (e) {
        console.error('Encoding error:', e);
        return null;
    }
}

/**
 * Decode Base64 data back to object
 * @param {string} encodedData - Base64 encoded string
 * @returns {Object|null} - Decoded data object or null on error
 */
function decodeData(encodedData) {
    try {
        if (!encodedData) return null;
        // Reverse double encoding: Base64 decode, then URI decode
        const jsonString = decodeURIComponent(atob(encodedData));
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('Decoding error:', e);
        return null;
    }
}

/**
 * Get default analytics structure
 * @returns {Object} - Default analytics object
 */
function getDefaultAnalyticsStructure() {
    return {
        electricians: {},
        rotation: {
            current: null,
            history: []
        },
        siteStats: {
            totalVisitors: 0,
            lastUpdated: new Date().toISOString()
        }
    };
}

/**
 * Save analytics data (obfuscated)
 * @param {Object} data - Analytics data to save
 */
function saveAnalytics(data) {
    const encoded = encodeData(data);
    if (encoded) {
        localStorage.setItem(STORAGE_KEY, encoded);
        // Minimal logging (no data exposure)
        console.log('Data saved');
    }
}

/**
 * Load analytics data (decode from obfuscated format)
 * @returns {Object} - Analytics data object
 */
function loadAnalytics() {
    const encoded = localStorage.getItem(STORAGE_KEY);
    const decoded = decodeData(encoded);

    // If decoding fails or no data, return default structure
    if (!decoded) {
        return getDefaultAnalyticsStructure();
    }

    // Ensure all required properties exist
    if (!decoded.electricians) decoded.electricians = {};
    if (!decoded.rotation) decoded.rotation = { current: null, history: [] };
    if (!decoded.siteStats) decoded.siteStats = { totalVisitors: 0, lastUpdated: new Date().toISOString() };

    return decoded;
}

/**
 * Get current month key (format: "2025-11")
 * @returns {string} - Current month key
 */
function getCurrentMonthKey() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

// Rate limiting functions removed - unlimited clicks allowed

/**
 * Track listing view (when electrician card is viewed)
 * @param {number} electricianId - ID of electrician
 * @returns {boolean} - True if tracked
 */
function trackListingView(electricianId) {
    const analytics = loadAnalytics();

    // Initialize electrician analytics if doesn't exist
    if (!analytics.electricians[electricianId]) {
        analytics.electricians[electricianId] = {
            totalViews: 0,
            totalPhoneClicks: 0,
            monthlyViews: {},
            monthlyPhoneClicks: {}
        };
    }

    const currentMonth = getCurrentMonthKey();

    // Increment total views
    analytics.electricians[electricianId].totalViews++;

    // Increment monthly views
    if (!analytics.electricians[electricianId].monthlyViews[currentMonth]) {
        analytics.electricians[electricianId].monthlyViews[currentMonth] = 0;
    }
    analytics.electricians[electricianId].monthlyViews[currentMonth]++;

    // Save obfuscated data
    saveAnalytics(analytics);

    // Minimal console log (no sensitive data)
    console.log('View tracked');
    return true;
}

/**
 * Track phone click (when someone clicks to call)
 * @param {number} electricianId - ID of electrician
 * @returns {boolean} - True if tracked
 */
function trackPhoneClick(electricianId) {
    const analytics = loadAnalytics();

    // Initialize electrician analytics if doesn't exist
    if (!analytics.electricians[electricianId]) {
        analytics.electricians[electricianId] = {
            totalViews: 0,
            totalPhoneClicks: 0,
            monthlyViews: {},
            monthlyPhoneClicks: {}
        };
    }

    const currentMonth = getCurrentMonthKey();

    // Increment total phone clicks
    analytics.electricians[electricianId].totalPhoneClicks++;

    // Increment monthly phone clicks
    if (!analytics.electricians[electricianId].monthlyPhoneClicks[currentMonth]) {
        analytics.electricians[electricianId].monthlyPhoneClicks[currentMonth] = 0;
    }
    analytics.electricians[electricianId].monthlyPhoneClicks[currentMonth]++;

    // Save obfuscated data
    saveAnalytics(analytics);

    // Minimal console log
    console.log('Click tracked');

    // Show success notification
    showNotification('📞 Γίνεται κλήση...');
    return true;
}

/**
 * Get stats for a specific electrician
 * @param {number} electricianId - ID of electrician
 * @returns {Object} - Stats object with views and clicks
 */
function getElectricianStats(electricianId) {
    const analytics = loadAnalytics();

    if (!analytics.electricians[electricianId]) {
        return {
            totalViews: 0,
            totalPhoneClicks: 0,
            monthlyViews: {},
            monthlyPhoneClicks: {}
        };
    }

    return analytics.electricians[electricianId];
}

/**
 * Show brief notification to user
 * @param {string} message - Message to display
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #10b981;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 1200);
}

/**
 * Clear all analytics data (admin only)
 * Use with caution!
 */
function clearAllAnalytics() {
    if (confirm('⚠️ Διαγραφή όλων των δεδομένων; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί!')) {
        localStorage.removeItem(STORAGE_KEY);
        console.log('Analytics cleared');
        return true;
    }
    return false;
}

/**
 * Export analytics data (for admin backup)
 * @returns {string} - JSON string of analytics data
 */
function exportAnalytics() {
    const analytics = loadAnalytics();
    return JSON.stringify(analytics, null, 2);
}

/**
 * Import analytics data (for admin restore)
 * @param {string} jsonString - JSON string of analytics data
 * @returns {boolean} - Success status
 */
function importAnalytics(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        saveAnalytics(data);
        console.log('Analytics imported');
        return true;
    } catch (e) {
        console.error('Import error:', e);
        return false;
    }
}

/**
 * Check if form submission is allowed (rate limiting removed)
 * @param {string|number} identifier - Unique identifier (usually electrician ID)
 * @returns {boolean} - Always returns true (unlimited submissions)
 */
function checkFormRateLimit(identifier) {
    // Rate limiting removed - allow unlimited form submissions
    return true;
}

// Log security status on load
console.log('🔒 Secure analytics loaded');
console.log('📊 Data stored as obfuscated Base64');
console.log('✅ Rate limiting disabled - unlimited clicks allowed');
