// Get electrician ID from URL
function getElectricianIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Load electrician data from JSON
async function loadElectricianData() {
    try {
        const response = await fetch('electricians.json');
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading electrician data:', error);
        return [];
    }
}

// Get electrician by ID
function getElectricianById(electricians, id) {
    return electricians.find(e => e.id === id);
}

// Get similar electricians (same neighborhood, excluding current)
function getSimilarElectricians(electricians, currentElectrician, limit = 3) {
    return electricians
        .filter(e =>
            e.id !== currentElectrician.id &&
            e.neighborhood === currentElectrician.neighborhood
        )
        .slice(0, limit);
}

// Update page title and meta
function updatePageMeta(electrician) {
    document.title = `${electrician.name} - Ηλεκτρολόγος ${electrician.neighborhood} Θεσσαλονίκη`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.content = `${electrician.name} - Επαγγελματίας ηλεκτρολόγος στην ${electrician.neighborhood}. ${electrician.services.join(', ')}. Καλέστε τώρα: ${electrician.phone}`;
    }

    // Update schema markup
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": electrician.name,
        "telephone": electrician.phone,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": electrician.neighborhood,
            "addressRegion": "Θεσσαλονίκη"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 40.6401,
            "longitude": 22.9444
        }
    };

    const schemaScript = document.getElementById('schema-markup');
    if (schemaScript) {
        schemaScript.textContent = JSON.stringify(schema, null, 2);
    }
}

// Update breadcrumb
function updateBreadcrumb(electrician) {
    const breadcrumbName = document.getElementById('breadcrumb-name');
    if (breadcrumbName) {
        breadcrumbName.textContent = electrician.name;
    }

    // Update neighborhood link
    const breadcrumbNeighborhood = document.getElementById('breadcrumb-neighborhood');
    if (breadcrumbNeighborhood) {
        const neighborhoodSlug = getNeighborhoodSlug(electrician.neighborhood);
        breadcrumbNeighborhood.href = `neighborhoods/${neighborhoodSlug}.html`;
        breadcrumbNeighborhood.textContent = electrician.neighborhood;
    }
}

// Convert Greek neighborhood name to URL slug
function getNeighborhoodSlug(neighborhood) {
    const slugMap = {
        'Καλαμαριά': 'kalamaria',
        'Πανόραμα': 'panorama',
        'Πυλαία': 'pylaia',
        'Εύοσμος': 'evosmos',
        'Νεάπολη': 'neapoli',
        'Τούμπα': 'toumba',
        'Θέρμη': 'thermi',
        'Συκιές': 'sykies',
        'Σταυρούπολη': 'stavroupoli',
        'Κέντρο': 'kentro'
    };
    return slugMap[neighborhood] || 'kalamaria';
}

// Get tier badge HTML
function getTierBadgeHTML(tier) {
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

// Populate header section
function populateHeader(electrician) {
    // Tier badges
    const tierBadgesContainer = document.getElementById('tier-badges-container');
    if (tierBadgesContainer) {
        tierBadgesContainer.innerHTML = getTierBadgeHTML(electrician.tier);
    }

    // Name
    const nameElement = document.getElementById('electrician-name');
    if (nameElement) {
        nameElement.textContent = electrician.name;
    }

    // Neighborhood
    const neighborhoodElement = document.getElementById('electrician-neighborhood');
    if (neighborhoodElement) {
        neighborhoodElement.textContent = `📍 ${electrician.neighborhood}, Θεσσαλονίκη`;
    }

    // Main call button
    const mainCallButton = document.getElementById('main-call-button');
    const displayPhone = document.getElementById('display-phone');
    if (mainCallButton && displayPhone) {
        mainCallButton.href = `tel:${electrician.phone}`;
        displayPhone.textContent = electrician.phone;
        mainCallButton.onclick = (e) => handlePhoneClick(e, electrician.id, electrician.phone);
    }
}

// Populate quick info cards
function populateQuickInfo(electrician) {
    const infoLocation = document.getElementById('info-location');
    if (infoLocation) {
        infoLocation.textContent = electrician.neighborhood;
    }

    const infoHours = document.getElementById('info-hours');
    if (infoHours) {
        const has24h = electrician.services.includes('24ωρη');
        infoHours.textContent = has24h ? '24/7' : '08:00 - 20:00';
    }

    const infoPrices = document.getElementById('info-prices');
    if (infoPrices) {
        infoPrices.textContent = 'Από €20';
    }

    const infoEmergency = document.getElementById('info-emergency');
    if (infoEmergency) {
        const has24h = electrician.services.includes('24ωρη');
        infoEmergency.textContent = has24h ? '✓ Διαθέσιμος' : '✗ Κανονικό Ωράριο';
        infoEmergency.style.color = has24h ? '#10b981' : '#6b7280';
    }
}

// Populate services
function populateServices(electrician) {
    const servicesList = document.getElementById('services-list');
    if (!servicesList) return;

    const servicesHTML = electrician.services
        .map(service => `<span class="service-badge-large">${service}</span>`)
        .join('');

    servicesList.innerHTML = servicesHTML;
}

// Populate premium stats (only if premium tier)
function populatePublicStats(electrician) {
    if (electrician.tier !== 'premium') {
        return;
    }

    const statsSection = document.getElementById('public-stats-section');
    if (!statsSection) return;

    // Show the section
    statsSection.style.display = 'block';

    // Get stats from localStorage
    const stats = getElectricianStats(electrician.id);
    const currentMonth = getCurrentMonthKey();
    const monthlyViews = stats.monthlyViews[currentMonth] || 0;
    const monthlyPhoneClicks = stats.monthlyPhoneClicks[currentMonth] || 0;

    const statViews = document.getElementById('stat-views');
    const statClicks = document.getElementById('stat-clicks');

    if (statViews) {
        statViews.textContent = monthlyViews;
    }

    if (statClicks) {
        statClicks.textContent = monthlyPhoneClicks;
    }
}

// Populate similar electricians
function populateSimilarElectricians(electricians, currentElectrician) {
    const similarList = document.getElementById('similar-list');
    if (!similarList) return;

    const similar = getSimilarElectricians(electricians, currentElectrician, 3);

    if (similar.length === 0) {
        similarList.innerHTML = '<p class="placeholder-text">Δεν υπάρχουν άλλοι ηλεκτρολόγοι σε αυτή την περιοχή</p>';
        return;
    }

    const cardsHTML = similar.map(electrician => {
        const servicesHTML = electrician.services
            .map(service => `<span class="service-badge">${service}</span>`)
            .join('');

        const tierClass = `electrician-card-${electrician.tier}`;
        const tierBadge = getTierBadgeHTML(electrician.tier);

        return `
            <div class="electrician-card ${tierClass}" onclick="window.location.href='electrician-detail.html?id=${electrician.id}'">
                ${tierBadge}
                <h3 class="electrician-name">${electrician.name}</h3>
                <a href="electrician-detail.html?id=${electrician.id}" class="btn-view-profile" onclick="event.stopPropagation()">
                    👤 Δείτε Προφίλ
                </a>
                <p class="electrician-neighborhood">${electrician.neighborhood}</p>
                <div class="services-container">
                    ${servicesHTML}
                </div>
            </div>
        `;
    }).join('');

    similarList.innerHTML = cardsHTML;
}

// Setup bottom CTA bar
function setupBottomCTA(electrician) {
    const bottomName = document.getElementById('bottom-name');
    const bottomPhone = document.getElementById('bottom-phone');
    const bottomCallButton = document.getElementById('bottom-call-button');

    if (bottomName) {
        bottomName.textContent = electrician.name;
    }

    if (bottomPhone) {
        bottomPhone.textContent = electrician.phone;
    }

    if (bottomCallButton) {
        bottomCallButton.href = `tel:${electrician.phone}`;
        bottomCallButton.onclick = (e) => handlePhoneClick(e, electrician.id, electrician.phone);
    }

    // Show/hide bottom bar on scroll (mobile only)
    let lastScrollTop = 0;
    const bottomBar = document.getElementById('bottom-cta-bar');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Only on mobile (< 768px)
        if (window.innerWidth < 768) {
            if (scrollTop > 300) {
                bottomBar.classList.add('visible');
            } else {
                bottomBar.classList.remove('visible');
            }
        }

        lastScrollTop = scrollTop;
    });
}

// Handle phone click with tracking
function handlePhoneClick(event, electricianId, phoneNumber) {
    event.preventDefault();

    // Track the click BEFORE opening dialer
    trackPhoneClick(electricianId);
    trackClick('phone-detail-page', electricianId);

    // Show confirmation toast
    showCallToast();

    // Open dialer after brief delay
    setTimeout(() => {
        window.location.href = `tel:${phoneNumber}`;
    }, 1000);
}

// Show call confirmation toast
function showCallToast() {
    const toast = document.getElementById('callToast');
    if (toast) {
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 1000);
    }
}

// Click tracking function
function trackClick(elementType, elementIdentifier) {
    const timestamp = new Date().toISOString();
    console.log('Click tracked:', {
        type: elementType,
        identifier: elementIdentifier,
        timestamp: timestamp
    });
}

// Setup contact form
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const name = document.getElementById('contact-name').value;
        const phone = document.getElementById('contact-phone').value;
        const message = document.getElementById('contact-message').value;

        // Log form submission (in real app, send to backend)
        console.log('Contact form submitted:', { name, phone, message });

        // Show success message
        if (successMessage) {
            successMessage.style.display = 'block';
            form.style.display = 'none';
        }

        // Reset form after 3 seconds
        setTimeout(() => {
            form.reset();
            if (successMessage) {
                successMessage.style.display = 'none';
                form.style.display = 'block';
            }
        }, 3000);
    });
}

// Setup FAQ accordion
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        if (!question) return;

        question.addEventListener('click', function() {
            item.classList.toggle('active');
        });
    });
}

// Main initialization function
async function initializeDetailPage() {
    const electricianId = getElectricianIdFromURL();

    if (!electricianId) {
        console.error('No electrician ID provided');
        document.querySelector('main').innerHTML = `
            <div class="container" style="text-align: center; padding: 60px 20px;">
                <h1>Σφάλμα</h1>
                <p>Δεν βρέθηκε ηλεκτρολόγος</p>
                <a href="index.html" class="btn-call-large" style="max-width: 300px; margin: 20px auto;">
                    ← Επιστροφή στην Αρχική
                </a>
            </div>
        `;
        return;
    }

    // Load all electricians
    const electricians = await loadElectricianData();

    // Find the specific electrician
    const electrician = getElectricianById(electricians, electricianId);

    if (!electrician) {
        console.error('Electrician not found');
        document.querySelector('main').innerHTML = `
            <div class="container" style="text-align: center; padding: 60px 20px;">
                <h1>Σφάλμα</h1>
                <p>Ο ηλεκτρολόγος δεν βρέθηκε</p>
                <a href="index.html" class="btn-call-large" style="max-width: 300px; margin: 20px auto;">
                    ← Επιστροφή στην Αρχική
                </a>
            </div>
        `;
        return;
    }

    // Track view
    trackListingView(electrician.id);

    // Populate all sections
    updatePageMeta(electrician);
    updateBreadcrumb(electrician);
    populateHeader(electrician);
    populateQuickInfo(electrician);
    populateServices(electrician);
    populatePublicStats(electrician);
    populateSimilarElectricians(electricians, electrician);
    setupBottomCTA(electrician);
    setupContactForm();
    setupFAQAccordion();

    console.log('Detail page initialized for:', electrician.name);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeDetailPage);
