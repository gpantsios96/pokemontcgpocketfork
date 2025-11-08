// Global state
let allElectricians = [];
let searchDebounceTimer = null;
let viewedElectricians = new Set(); // Track which cards have been viewed

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

    // Real-time search with debounce
    searchInput.addEventListener('input', function() {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            handleSearch();
        }, 200);
    });

    // Search button click handler
    searchBtn.addEventListener('click', handleSearch);

    // Allow search with Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

// Normalize Greek text (remove accents/tones for search)
function normalizeGreekText(text) {
    if (!text) return '';

    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/ά/g, 'α')
        .replace(/έ/g, 'ε')
        .replace(/ή/g, 'η')
        .replace(/ί/g, 'ι')
        .replace(/ό/g, 'ο')
        .replace(/ύ/g, 'υ')
        .replace(/ώ/g, 'ω')
        .replace(/ΐ/g, 'ι')
        .replace(/ΰ/g, 'υ');
}

// Filter electricians based on search term
function filterElectricians(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return allElectricians;
    }

    const normalizedSearch = normalizeGreekText(searchTerm);

    return allElectricians.filter(electrician => {
        // Search in name
        const normalizedName = normalizeGreekText(electrician.name);
        if (normalizedName.includes(normalizedSearch)) {
            return true;
        }

        // Search in neighborhood
        const normalizedNeighborhood = normalizeGreekText(electrician.neighborhood);
        if (normalizedNeighborhood.includes(normalizedSearch)) {
            return true;
        }

        // Search in services
        const servicesMatch = electrician.services.some(service => {
            const normalizedService = normalizeGreekText(service);
            return normalizedService.includes(normalizedSearch);
        });

        return servicesMatch;
    });
}

// Handle search action
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();

    const filteredElectricians = filterElectricians(searchTerm);
    displayElectricians(filteredElectricians, searchTerm);

    console.log('Αναζήτηση για:', searchTerm, '- Βρέθηκαν:', filteredElectricians.length);
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

        allElectricians = await response.json();
        displayElectricians(allElectricians);
    } catch (error) {
        console.error('Σφάλμα:', error);
        const electriciansList = document.getElementById('electriciansList');
        electriciansList.innerHTML = '<p class="placeholder-text">Σφάλμα φόρτωσης δεδομένων</p>';
    }
}

// Display electricians as cards
function displayElectricians(electricians, searchTerm = '') {
    const electriciansList = document.getElementById('electriciansList');

    if (!electricians || electricians.length === 0) {
        const message = searchTerm
            ? '<p class="placeholder-text">Δεν βρέθηκαν αποτελέσματα για την αναζήτησή σας</p>'
            : '<p class="placeholder-text">Δεν βρέθηκαν ηλεκτρολόγοι</p>';
        electriciansList.innerHTML = message;
        return;
    }

    // Show results count
    const countHTML = searchTerm
        ? `<p class="search-results-count">Βρέθηκαν ${electricians.length} ${electricians.length === 1 ? 'ηλεκτρολόγος' : 'ηλεκτρολόγοι'}</p>`
        : '';

    // Create HTML for each electrician card
    const cardsHTML = electricians.map(electrician => {
        const servicesHTML = electrician.services
            .map(service => `<span class="service-badge">${service}</span>`)
            .join('');

        return `
            <div class="electrician-card" data-electrician-id="${electrician.id}">
                <h3 class="electrician-name">${electrician.name}</h3>
                <a href="tel:${electrician.phone}" class="electrician-phone" onclick="handlePhoneClick(event, ${electrician.id}, '${electrician.phone}')">
                    ${electrician.phone}
                </a>
                <p class="electrician-neighborhood">${electrician.neighborhood}</p>
                <div class="services-container">
                    ${servicesHTML}
                </div>
            </div>
        `;
    }).join('');

    electriciansList.innerHTML = countHTML + cardsHTML;

    // Setup view tracking for all cards
    setupViewTracking();
}

// Setup view tracking using Intersection Observer
function setupViewTracking() {
    const cards = document.querySelectorAll('.electrician-card');

    // Create Intersection Observer to track when cards are viewed
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const electricianId = parseInt(card.dataset.electricianId);

                // Only track each card once per session
                if (!viewedElectricians.has(electricianId)) {
                    viewedElectricians.add(electricianId);
                    trackListingView(electricianId);
                }
            }
        });
    }, {
        threshold: 0.5 // Card must be at least 50% visible
    });

    // Observe all cards
    cards.forEach(card => observer.observe(card));
}

// Handle phone click with confirmation and tracking
function handlePhoneClick(event, electricianId, phoneNumber) {
    // Prevent default action temporarily
    event.preventDefault();

    // Track the click BEFORE opening dialer
    trackPhoneClick(electricianId);
    trackClick('phone', electricianId);

    // Show confirmation toast
    showCallToast();

    // Open dialer after brief delay (1 second)
    setTimeout(() => {
        window.location.href = `tel:${phoneNumber}`;
    }, 1000);
}

// Show call confirmation toast
function showCallToast() {
    const toast = document.getElementById('callToast');
    toast.classList.add('show');

    // Hide after 1 second
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1000);
}
