// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupSearchFunctionality();
    setupClickTracking();
}

// Search functionality
function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Search button click handler
    searchBtn.addEventListener('click', handleSearch);

    // Allow search with Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// Handle search action
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();

    if (searchTerm === '') {
        alert('Παρακαλώ εισάγετε κείμενο αναζήτησης');
        return;
    }

    console.log('Αναζήτηση για:', searchTerm);

    // TODO: Implement actual search functionality
    // This will filter electricians based on search term
    alert('Η αναζήτηση θα ενεργοποιηθεί σύντομα: ' + searchTerm);
}

// Click tracking setup
function setupClickTracking() {
    // Track all button clicks
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            trackClick('button', e.target.id || e.target.textContent);
        }
    });

    console.log('Το σύστημα παρακολούθησης κλικ είναι ενεργό');
}

// Click tracking function (placeholder)
function trackClick(elementType, elementIdentifier) {
    const timestamp = new Date().toISOString();

    console.log('Click tracked:', {
        type: elementType,
        identifier: elementIdentifier,
        timestamp: timestamp
    });

    // TODO: Implement actual analytics tracking
    // This could send data to analytics service
}

// Helper function to display electricians (placeholder for future use)
function displayElectricians(electricians) {
    const electriciansList = document.getElementById('electriciansList');

    if (!electricians || electricians.length === 0) {
        electriciansList.innerHTML = '<p class="placeholder-text">Δεν βρέθηκαν ηλεκτρολόγοι</p>';
        return;
    }

    // TODO: Implement actual electrician card rendering
    console.log('Εμφάνιση ηλεκτρολόγων:', electricians.length);
}
