// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupSearchFunctionality();
    setupClickTracking();
    loadElectricians();
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

// Load electricians from JSON file
async function loadElectricians() {
    try {
        const response = await fetch('electricians.json');

        if (!response.ok) {
            throw new Error('Αποτυχία φόρτωσης δεδομένων');
        }

        const electricians = await response.json();
        displayElectricians(electricians);
    } catch (error) {
        console.error('Σφάλμα:', error);
        const electriciansList = document.getElementById('electriciansList');
        electriciansList.innerHTML = '<p class="placeholder-text">Σφάλμα φόρτωσης δεδομένων</p>';
    }
}

// Display electricians as cards
function displayElectricians(electricians) {
    const electriciansList = document.getElementById('electriciansList');

    if (!electricians || electricians.length === 0) {
        electriciansList.innerHTML = '<p class="placeholder-text">Δεν βρέθηκαν ηλεκτρολόγοι</p>';
        return;
    }

    // Create HTML for each electrician card
    const cardsHTML = electricians.map(electrician => {
        const servicesHTML = electrician.services
            .map(service => `<span class="service-badge">${service}</span>`)
            .join('');

        return `
            <div class="electrician-card">
                <h3 class="electrician-name">${electrician.name}</h3>
                <a href="tel:${electrician.phone}" class="electrician-phone" onclick="trackPhoneClick(${electrician.id})">
                    ${electrician.phone}
                </a>
                <p class="electrician-neighborhood">${electrician.neighborhood}</p>
                <div class="services-container">
                    ${servicesHTML}
                </div>
            </div>
        `;
    }).join('');

    electriciansList.innerHTML = cardsHTML;
}

// Track phone click
function trackPhoneClick(electricianId) {
    console.log('Κλικ στο τηλέφωνο - Ηλεκτρολόγος ID:', electricianId);
    trackClick('phone', electricianId);

    // TODO: Update analytics in backend/database
}
