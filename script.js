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
    setupScrollAnimations();
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

// Setup scroll-triggered fade-in animations for cards
function setupScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Function to observe cards - will be called after cards are rendered
    window.observeElectricianCards = function() {
        const cards = document.querySelectorAll('.electrician-card');
        cards.forEach((card, index) => {
            // Set initial opacity to 0 for fade-in effect
            card.style.opacity = '0';
            // Observe the card
            observer.observe(card);
        });
    };
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

// Sort electricians by view count (lowest views first for fair rotation)
function sortElectriciansByViews(electricians) {
    return [...electricians].sort((a, b) => {
        // Get view counts from analytics (default to 0 for new listings)
        const statsA = getElectricianStats(a.id);
        const statsB = getElectricianStats(b.id);
        const viewsA = statsA.totalViews || 0;
        const viewsB = statsB.totalViews || 0;

        // Sort by views ascending (lowest views first)
        return viewsA - viewsB;
    });
}

// Legacy function kept for backwards compatibility
function sortElectriciansByTier(electricians) {
    // Now uses view-based sorting instead
    return sortElectriciansByViews(electricians);
}

// Filter electricians based on search term
function filterElectricians(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return sortElectriciansByTier(allElectricians);
    }

    const normalizedSearch = normalizeGreekText(searchTerm);

    const filtered = allElectricians.filter(electrician => {
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

    return sortElectriciansByTier(filtered);
}

// Handle search action
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();

    const filteredElectricians = filterElectricians(searchTerm);

    // If searching, also filter rotating electricians
    if (searchTerm) {
        const rotatingIds = getRotatingElectricianIds();
        const rotatingElectricians = allElectricians.filter(e => rotatingIds.includes(e.id));
        const filteredRotating = rotatingElectricians.filter(e => {
            const normalizedSearch = normalizeGreekText(searchTerm);
            const normalizedName = normalizeGreekText(e.name);
            const normalizedNeighborhood = normalizeGreekText(e.neighborhood);
            const servicesMatch = e.services.some(service =>
                normalizeGreekText(service).includes(normalizedSearch)
            );
            return normalizedName.includes(normalizedSearch) ||
                   normalizedNeighborhood.includes(normalizedSearch) ||
                   servicesMatch;
        });

        // Update rotating list with filtered results
        const rotatingList = document.getElementById('rotatingList');
        if (filteredRotating.length > 0) {
            const hoursRemaining = getRotationHoursRemaining();
            const hoursText = hoursRemaining === 1 ? 'ώρα' : 'ώρες';
            const cardsHTML = filteredRotating.map(electrician => {
                const servicesHTML = electrician.services
                    .map(service => `<span class="service-badge">${service}</span>`)
                    .join('');
                return `
                    <div class="electrician-card electrician-card-rotating" data-electrician-id="${electrician.id}" onclick="window.location.href='electrician-detail.html?id=${electrician.id}'">
                        <div class="rotating-badge-container">
                            <span class="rotating-badge">📍 ΣΕ ΠΡΟΒΟΛΗ</span>
                            <span class="rotating-countdown">Σε προβολή για ακόμα ${hoursRemaining} ${hoursText}</span>
                        </div>
                        <h3 class="electrician-name">${electrician.name}</h3>
                        <a href="electrician-detail.html?id=${electrician.id}" class="btn-view-profile" onclick="event.stopPropagation()">
                            👤 Δείτε Προφίλ
                        </a>
                        <a href="tel:${electrician.phone}" class="electrician-phone" onclick="handlePhoneClick(event, ${electrician.id}, '${electrician.phone}')">
                            📞 Κλείστε Ραντεβού
                        </a>
                        <p class="electrician-neighborhood">${electrician.neighborhood}</p>
                        <div class="services-container">
                            ${servicesHTML}
                        </div>
                    </div>
                `;
            }).join('');
            rotatingList.innerHTML = cardsHTML;
        } else {
            rotatingList.innerHTML = '';
        }
    } else {
        // No search term, restore rotating electricians
        displayRotatingElectricians();
    }

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

        // Initialize rotation system
        initializeRotation(allElectricians);

        // Display rotating electricians separately
        displayRotatingElectricians();

        // Display remaining electricians sorted by tier
        displayElectricians(sortElectriciansByTier(allElectricians));
    } catch (error) {
        console.error('Σφάλμα:', error);
        const electriciansList = document.getElementById('electriciansList');
        electriciansList.innerHTML = '<p class="placeholder-text">Σφάλμα φόρτωσης δεδομένων</p>';
    }
}

// Get tier badge HTML based on tier
function getTierBadge(tier) {
    if (tier === 'premium') {
        return `
            <div class="tier-badges">
                <span class="tier-badge tier-premium">⭐⭐ ΚΟΡΥΦΑΙΟΣ</span>
                <span class="verified-badge">✓ ΕΠΑΛΗΘΕΥΜΕΝΟΣ</span>
            </div>
        `;
    } else if (tier === 'featured') {
        return `
            <div class="tier-badges">
                <span class="tier-badge tier-featured">⭐ ΠΡΟΤΕΙΝΟΜΕΝΟΣ</span>
                <span class="verified-badge">✓ ΕΠΑΛΗΘΕΥΜΕΝΟΣ</span>
            </div>
        `;
    }
    return '';
}

// Get premium stats HTML (only for premium tier)
function getPremiumStatsHTML(electrician) {
    if (electrician.tier !== 'premium') {
        return '';
    }

    // Get stats from localStorage
    const stats = getElectricianStats(electrician.id);
    const currentMonth = getCurrentMonthKey();
    const monthlyViews = stats.monthlyViews[currentMonth] || 0;
    const monthlyPhoneClicks = stats.monthlyPhoneClicks[currentMonth] || 0;

    return `
        <div class="premium-stats">
            📊 Αυτόν τον μήνα: ${monthlyViews} προβολές, ${monthlyPhoneClicks} κλήσεις
        </div>
    `;
}

// Display rotating electricians in spotlight section
function displayRotatingElectricians() {
    const rotatingList = document.getElementById('rotatingList');
    const rotatingIds = getRotatingElectricianIds();

    if (rotatingIds.length === 0) {
        rotatingList.innerHTML = '<p class="placeholder-text">Δεν υπάρχουν ηλεκτρολόγοι σε προβολή αυτή τη στιγμή</p>';
        return;
    }

    // Get rotating electricians
    const rotatingElectricians = allElectricians.filter(e => rotatingIds.includes(e.id));

    // Get hours remaining
    const hoursRemaining = getRotationHoursRemaining();
    const hoursText = hoursRemaining === 1 ? 'ώρα' : 'ώρες';

    // Create HTML for rotating cards
    const cardsHTML = rotatingElectricians.map(electrician => {
        const servicesHTML = electrician.services
            .map(service => `<span class="service-badge">${service}</span>`)
            .join('');

        return `
            <div class="electrician-card electrician-card-rotating" data-electrician-id="${electrician.id}" onclick="window.location.href='electrician-detail.html?id=${electrician.id}'">
                <div class="rotating-badge-container">
                    <span class="rotating-badge">📍 ΣΕ ΠΡΟΒΟΛΗ</span>
                    <span class="rotating-countdown">Σε προβολή για ακόμα ${hoursRemaining} ${hoursText}</span>
                </div>
                <h3 class="electrician-name">${electrician.name}</h3>
                <a href="electrician-detail.html?id=${electrician.id}" class="btn-view-profile" onclick="event.stopPropagation()">
                    👤 Δείτε Προφίλ
                </a>
                <a href="tel:${electrician.phone}" class="electrician-phone" onclick="handlePhoneClick(event, ${electrician.id}, '${electrician.phone}')">
                    📞 Κλείστε Ραντεβού
                </a>
                <p class="electrician-neighborhood">${electrician.neighborhood}</p>
                <div class="services-container">
                    ${servicesHTML}
                </div>
            </div>
        `;
    }).join('');

    rotatingList.innerHTML = cardsHTML;

    // Setup view tracking for rotating cards
    setupViewTracking();
}

// Display electricians as cards (excluding rotating ones)
function displayElectricians(electricians, searchTerm = '') {
    const electriciansList = document.getElementById('electriciansList');

    // Exclude rotating electricians from main list
    const rotatingIds = getRotatingElectricianIds();
    const filteredElectricians = electricians.filter(e => !rotatingIds.includes(e.id));

    if (!filteredElectricians || filteredElectricians.length === 0) {
        const message = searchTerm
            ? '<p class="placeholder-text">Δεν βρέθηκαν αποτελέσματα για την αναζήτησή σας</p>'
            : '<p class="placeholder-text">Δεν βρέθηκαν ηλεκτρολόγοι</p>';
        electriciansList.innerHTML = message;
        return;
    }

    // Show results count
    const countHTML = searchTerm
        ? `<p class="search-results-count">Βρέθηκαν ${filteredElectricians.length} ${filteredElectricians.length === 1 ? 'ηλεκτρολόγος' : 'ηλεκτρολόγοι'}</p>`
        : '';

    // Create HTML for each electrician card
    const cardsHTML = filteredElectricians.map(electrician => {
        const servicesHTML = electrician.services
            .map(service => `<span class="service-badge">${service}</span>`)
            .join('');

        const tierClass = `electrician-card-${electrician.tier}`;
        const tierBadge = getTierBadge(electrician.tier);
        const premiumStats = getPremiumStatsHTML(electrician);

        return `
            <div class="electrician-card ${tierClass}" data-electrician-id="${electrician.id}" onclick="window.location.href='electrician-detail.html?id=${electrician.id}'">
                ${tierBadge}
                <h3 class="electrician-name">${electrician.name}</h3>
                <a href="electrician-detail.html?id=${electrician.id}" class="btn-view-profile" onclick="event.stopPropagation()">
                    👤 Δείτε Προφίλ
                </a>
                <a href="tel:${electrician.phone}" class="electrician-phone" onclick="handlePhoneClick(event, ${electrician.id}, '${electrician.phone}')">
                    📞 Κλείστε Ραντεβού
                </a>
                <p class="electrician-neighborhood">${electrician.neighborhood}</p>
                <div class="services-container">
                    ${servicesHTML}
                </div>
                ${premiumStats}
            </div>
        `;
    }).join('');

    electriciansList.innerHTML = countHTML + cardsHTML;

    // Trigger scroll animations for cards
    if (window.observeElectricianCards) {
        window.observeElectricianCards();
    }

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
    // Stop propagation to prevent card click
    event.stopPropagation();
    // Prevent default action temporarily
    event.preventDefault();

    // Track the click BEFORE opening dialer
    // Rate limiting is handled inside trackPhoneClick
    const allowed = trackPhoneClick(electricianId);

    // If rate limited or spam detected, block the call
    if (!allowed) {
        console.log('Phone click blocked by rate limiting');
        return false;
    }

    trackClick('phone', electricianId);

    // Show confirmation toast (notification shown by trackPhoneClick)
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
