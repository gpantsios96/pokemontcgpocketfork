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
// RATE LIMITING & SPAM PROTECTION
// ==========================================

// Rate limiting state - tracks last action timestamps
const rateLimits = {
    phoneClicks: {},
    formSubmits: {},
    pageViews: {}
};

// Spam detection state
let spamDetection = {
    clickCount: 0,
    lastClickTime: Date.now(),
    isBlocked: false,
    blockUntil: 0
};

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

/**
 * Check if action is rate limited
 * @param {string} action - Action type ('phoneClicks', 'formSubmits', 'pageViews')
 * @param {string|number} identifier - Unique identifier (usually electrician ID)
 * @param {number} limitMs - Minimum milliseconds between actions (default: 2000)
 * @returns {boolean} - True if rate limited (blocked), false if allowed
 */
function isRateLimited(action, identifier, limitMs = 2000) {
    const now = Date.now();
    const key = `${action}_${identifier}`;

    // Check if this action was done recently
    if (rateLimits[action][key]) {
        const timeSince = now - rateLimits[action][key];
        if (timeSince < limitMs) {
            console.log(`⏱️ Rate limited: ${action} (${timeSince}ms < ${limitMs}ms)`);
            return true; // Too soon, block it
        }
    }

    // Update timestamp
    rateLimits[action][key] = now;
    return false; // Allow it
}

/**
 * Detect spam behavior (too many rapid clicks)
 * @returns {boolean} - True if spam detected, false if normal behavior
 */
function detectSpam() {
    const now = Date.now();

    // Check if currently blocked
    if (spamDetection.isBlocked) {
        if (now < spamDetection.blockUntil) {
            console.warn('🚫 User temporarily blocked for spam');
            return true; // Still blocked
        } else {
            // Block expired, reset
            spamDetection.isBlocked = false;
            spamDetection.clickCount = 0;
            console.log('✅ Spam block expired');
        }
    }

    // Track click frequency
    if (now - spamDetection.lastClickTime < 1000) {
        // More than 1 click per second
        spamDetection.clickCount++;

        if (spamDetection.clickCount > 5) {
            // Too many rapid clicks - block for 30 seconds
            console.warn('🚨 Spam detected! Blocking user temporarily');
            spamDetection.isBlocked = true;
            spamDetection.blockUntil = now + 30000; // Block for 30 seconds
            showNotification('⚠️ Πάρα πολλές ενέργειες. Παρακαλώ περιμένετε 30 δευτερόλεπτα.');
            return true; // Spam detected
        }
    } else {
        // Reset counter if more than 1 second passed
        spamDetection.clickCount = 1;
    }

    spamDetection.lastClickTime = now;
    return false; // Not spam
}

/**
 * Check if user is temporarily blocked for spam
 * @returns {boolean} - True if blocked, false if allowed
 */
function isUserBlocked() {
    if (spamDetection.isBlocked) {
        const now = Date.now();
        if (now < spamDetection.blockUntil) {
            const secondsRemaining = Math.ceil((spamDetection.blockUntil - now) / 1000);
            showNotification(`⏳ Παρακαλώ περιμένετε ${secondsRemaining} δευτερόλεπτα`);
            return true;
        } else {
            // Block expired
            spamDetection.isBlocked = false;
            spamDetection.clickCount = 0;
        }
    }
    return false;
}

/**
 * Track listing view (when electrician card is viewed)
 * @param {number} electricianId - ID of electrician
 * @returns {boolean} - True if tracked, false if blocked
 */
function trackListingView(electricianId) {
    // Check for spam behavior
    if (detectSpam()) {
        return false; // Block if spam detected
    }

    // Rate limit: minimum 1 second between views of same electrician
    if (isRateLimited('pageViews', electricianId, 1000)) {
        console.log('View tracking rate limited');
        return false; // Block if too frequent
    }

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
 * @returns {boolean} - True if tracked, false if blocked
 */
function trackPhoneClick(electricianId) {
    // Check if user is blocked for spam
    if (isUserBlocked()) {
        return false; // Block if spam blocked
    }

    // Check for spam behavior
    if (detectSpam()) {
        return false; // Block if spam detected
    }

    // Rate limit: minimum 2 seconds between phone clicks
    if (isRateLimited('phoneClicks', electricianId, 2000)) {
        showNotification('⏱️ Παρακαλώ περιμένετε λίγο...');
        return false; // Block if too frequent
    }

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
 * Check if form submission is rate limited
 * @param {string|number} identifier - Unique identifier (usually electrician ID)
 * @returns {boolean} - True if allowed, false if blocked
 */
function checkFormRateLimit(identifier) {
    // Check if user is blocked for spam
    if (isUserBlocked()) {
        return false;
    }

    // Rate limit: minimum 10 seconds between form submissions
    if (isRateLimited('formSubmits', identifier, 10000)) {
        showNotification('⏱️ Παρακαλώ περιμένετε πριν στείλετε ξανά');
        return false;
    }

    return true;
}

// Log security status on load
console.log('🔒 Secure analytics loaded');
console.log('📊 Data stored as obfuscated Base64');
console.log('🛡️ Rate limiting enabled');
