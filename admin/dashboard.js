// ==========================================
// ADMIN DASHBOARD - FUNCTIONALITY ONLY
// ==========================================
//
// This file contains ONLY dashboard functionality.
// Authentication is handled in dashboard.html
//
// FUNCTIONS:
// - loadDashboard() - Load and display all dashboard data
// - updateDashboard() - Update dashboard with data
// - refreshDashboard() - Reload dashboard data
// - exportData() - Export analytics data to JSON
// ==========================================

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
        const analytics = exportAnalytics();
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

console.log('📊 Dashboard functionality loaded');
