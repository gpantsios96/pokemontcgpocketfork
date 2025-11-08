// Analytics tracking for electricians directory
// Stores data in localStorage since we don't have a backend yet

const ANALYTICS_KEY = 'electrician-analytics';

// Get current month in format "2025-11"
function getCurrentMonthKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

// Load analytics from localStorage
function loadAnalytics() {
    try {
        const data = localStorage.getItem(ANALYTICS_KEY);
        if (!data) {
            return {};
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Σφάλμα φόρτωσης analytics:', error);
        return {};
    }
}

// Save analytics to localStorage
function saveAnalytics(analytics) {
    try {
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
        console.log('Analytics αποθηκεύτηκαν:', analytics);
    } catch (error) {
        console.error('Σφάλμα αποθήκευσης analytics:', error);
    }
}

// Initialize electrician analytics if not exists
function initializeElectricianAnalytics(analytics, electricianId) {
    if (!analytics[electricianId]) {
        analytics[electricianId] = {
            totalViews: 0,
            totalPhoneClicks: 0,
            monthlyViews: {},
            monthlyPhoneClicks: {}
        };
    }
    return analytics;
}

// Track when an electrician listing is viewed
function trackListingView(electricianId) {
    const analytics = loadAnalytics();
    initializeElectricianAnalytics(analytics, electricianId);

    const monthKey = getCurrentMonthKey();

    // Increment total views
    analytics[electricianId].totalViews++;

    // Increment monthly views
    if (!analytics[electricianId].monthlyViews[monthKey]) {
        analytics[electricianId].monthlyViews[monthKey] = 0;
    }
    analytics[electricianId].monthlyViews[monthKey]++;

    saveAnalytics(analytics);

    console.log(`📊 View tracked - Electrician ${electricianId}:`, {
        totalViews: analytics[electricianId].totalViews,
        monthlyViews: analytics[electricianId].monthlyViews[monthKey]
    });

    return analytics[electricianId];
}

// Track when phone number is clicked
function trackPhoneClick(electricianId) {
    const analytics = loadAnalytics();
    initializeElectricianAnalytics(analytics, electricianId);

    const monthKey = getCurrentMonthKey();

    // Increment total phone clicks
    analytics[electricianId].totalPhoneClicks++;

    // Increment monthly phone clicks
    if (!analytics[electricianId].monthlyPhoneClicks[monthKey]) {
        analytics[electricianId].monthlyPhoneClicks[monthKey] = 0;
    }
    analytics[electricianId].monthlyPhoneClicks[monthKey]++;

    saveAnalytics(analytics);

    console.log(`📞 Phone click tracked - Electrician ${electricianId}:`, {
        totalPhoneClicks: analytics[electricianId].totalPhoneClicks,
        monthlyPhoneClicks: analytics[electricianId].monthlyPhoneClicks[monthKey]
    });

    return analytics[electricianId];
}

// Get monthly stats for a specific electrician
function getMonthlyStats(electricianId, month) {
    const analytics = loadAnalytics();

    if (!analytics[electricianId]) {
        return {
            views: 0,
            phoneClicks: 0
        };
    }

    return {
        views: analytics[electricianId].monthlyViews[month] || 0,
        phoneClicks: analytics[electricianId].monthlyPhoneClicks[month] || 0
    };
}

// Get all stats for an electrician
function getElectricianStats(electricianId) {
    const analytics = loadAnalytics();
    return analytics[electricianId] || {
        totalViews: 0,
        totalPhoneClicks: 0,
        monthlyViews: {},
        monthlyPhoneClicks: {}
    };
}

// Get stats for all electricians
function getAllStats() {
    return loadAnalytics();
}

// Clear all analytics (for testing/reset)
function clearAnalytics() {
    localStorage.removeItem(ANALYTICS_KEY);
    console.log('Analytics cleared');
}
