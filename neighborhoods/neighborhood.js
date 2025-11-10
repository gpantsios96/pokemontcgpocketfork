// Neighborhood configuration and data
const NEIGHBORHOODS = {
    'kalamaria': {
        name: 'Καλαμαριά',
        slug: 'kalamaria',
        description: 'Αναζητάτε αξιόπιστο ηλεκτρολόγο στην Καλαμαριά; Βρείτε τους καλύτερους επαγγελματίες της περιοχής με ανταγωνιστικές τιμές. Άμεση εξυπηρέτηση και 24ωρη κάλυψη.',
        nearby: ['Πανόραμα', 'Πυλαία', 'Κέντρο']
    },
    'panorama': {
        name: 'Πανόραμα',
        slug: 'panorama',
        description: 'Βρείτε έμπειρο ηλεκτρολόγο στο Πανόραμα Θεσσαλονίκης. Επαγγελματίες με χρόνια πείρας, ασφαλισμένη εργασία και εγγύηση ποιότητας. Διαθέσιμοι για άμεση εξυπηρέτηση.',
        nearby: ['Καλαμαριά', 'Πυλαία', 'Θέρμη']
    },
    'pylaia': {
        name: 'Πυλαία',
        slug: 'pylaia',
        description: 'Αξιόπιστοι ηλεκτρολόγοι στην Πυλαία με εμπειρία σε κατοικίες και επαγγελματικούς χώρους. Άμεση ανταπόκριση, προσιτές τιμές και εγγύηση για όλες τις εργασίες.',
        nearby: ['Πανόραμα', 'Καλαμαριά', 'Θέρμη']
    },
    'evosmos': {
        name: 'Εύοσμος',
        slug: 'evosmos',
        description: 'Χρειάζεστε ηλεκτρολόγο στον Εύοσμο; Επιλέξτε από τους κορυφαίους επαγγελματίες της περιοχής. 24ωρη εξυπηρέτηση για έκτακτες ανάγκες και προγραμματισμένες εργασίες.',
        nearby: ['Συκιές', 'Σταυρούπολη', 'Νεάπολη']
    },
    'neapoli': {
        name: 'Νεάπολη',
        slug: 'neapoli',
        description: 'Ηλεκτρολόγοι στη Νεάπολη Θεσσαλονίκης. Εξειδικευμένοι σε επισκευές, εγκαταστάσεις και συντήρηση. Καλέστε τώρα για δωρεάν προσφορά.',
        nearby: ['Τούμπα', 'Κέντρο', 'Συκιές']
    },
    'toumba': {
        name: 'Τούμπα',
        slug: 'toumba',
        description: 'Βρείτε έμπειρο ηλεκτρολόγο στην Τούμπα. Επαγγελματίες με πιστοποιήσεις, άδειες και ασφάλιση. Γρήγορη εξυπηρέτηση και ανταγωνιστικές τιμές.',
        nearby: ['Νεάπολη', 'Κέντρο', 'Καλαμαριά']
    },
    'thermi': {
        name: 'Θέρμη',
        slug: 'thermi',
        description: 'Αξιόπιστοι ηλεκτρολόγοι στη Θέρμη για κάθε ηλεκτρολογική ανάγκη. Από απλές επισκευές έως πλήρεις εγκαταστάσεις. Εγγυημένη εργασία και άμεση ανταπόκριση.',
        nearby: ['Πυλαία', 'Πανόραμα', 'Καλαμαριά']
    },
    'sykies': {
        name: 'Συκιές',
        slug: 'sykies',
        description: 'Ηλεκτρολόγοι στις Συκιές με χρόνια εμπειρίας. Εξυπηρέτηση σε κατοικίες, καταστήματα και βιομηχανικούς χώρους. 24ωρη διαθεσιμότητα για επείγοντα περιστατικά.',
        nearby: ['Εύοσμος', 'Νεάπολη', 'Σταυρούπολη']
    },
    'stavroupoli': {
        name: 'Σταυρούπολη',
        slug: 'stavroupoli',
        description: 'Επαγγελματίες ηλεκτρολόγοι στη Σταυρούπολη. Άμεση εξυπηρέτηση, προσιτές τιμές και εγγύηση ποιότητας. Κλείστε ραντεβού online ή καλέστε τώρα.',
        nearby: ['Εύοσμος', 'Συκιές', 'Κέντρο']
    },
    'kentro': {
        name: 'Κέντρο',
        slug: 'kentro',
        description: 'Ηλεκτρολόγοι στο κέντρο της Θεσσαλονίκης για άμεση εξυπηρέτηση. Εξειδικευμένοι σε εμπορικούς χώρους, κατοικίες και επαγγελματικά κτίρια. Διαθέσιμοι 24/7.',
        nearby: ['Νεάπολη', 'Τούμπα', 'Καλαμαριά']
    }
};

// Get neighborhood from current page URL
function getCurrentNeighborhood() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    return NEIGHBORHOODS[filename] || null;
}

// Load electricians data
async function loadNeighborhoodElectricians() {
    try {
        const response = await fetch('../electricians.json');
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading electricians:', error);
        return [];
    }
}

// Filter electricians by neighborhood
function filterByNeighborhood(electricians, neighborhoodName) {
    return electricians.filter(e => e.neighborhood === neighborhoodName);
}

// Update page content with neighborhood data
function updatePageContent(neighborhood) {
    if (!neighborhood) return;

    // Update title
    document.title = `Ηλεκτρολόγος ${neighborhood.name} Θεσσαλονίκη - Επαγγελματίες στην Περιοχή`;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.content = neighborhood.description;
    }

    // Update H1 (select the one in the hero section specifically)
    const h1 = document.querySelector('.neighborhood-hero h1');
    if (h1) {
        h1.textContent = `Ηλεκτρολόγος ${neighborhood.name} - Βρείτε Έμπειρους Επαγγελματίες`;
    }

    // Update breadcrumb
    const breadcrumbNeighborhood = document.getElementById('breadcrumb-neighborhood');
    if (breadcrumbNeighborhood) {
        breadcrumbNeighborhood.textContent = neighborhood.name;
    }

    // Update intro text
    const intro = document.querySelector('.intro');
    if (intro) {
        intro.textContent = neighborhood.description;
    }

    // Update section headings
    document.querySelectorAll('[data-neighborhood-name]').forEach(el => {
        el.textContent = el.textContent.replace('[Neighborhood]', neighborhood.name);
    });

    // Update nearby links
    updateNearbyLinks(neighborhood);

    // Update FAQ
    updateFAQ(neighborhood);
}

// Update nearby neighborhood links
function updateNearbyLinks(neighborhood) {
    const nearbyContainer = document.querySelector('.nearby-links');
    if (!nearbyContainer) return;

    const links = neighborhood.nearby.map(nearbyName => {
        const nearbySlug = Object.values(NEIGHBORHOODS).find(n => n.name === nearbyName)?.slug;
        return nearbySlug ?
            `<a href="${nearbySlug}.html" class="nearby-link">${nearbyName}</a>` : '';
    }).join('');

    nearbyContainer.innerHTML = links;
}

// Update FAQ with neighborhood-specific content
function updateFAQ(neighborhood) {
    const faqItems = document.querySelectorAll('.faq-item h3, .faq-item p');
    faqItems.forEach(el => {
        el.innerHTML = el.innerHTML.replace(/\[Neighborhood\]/g, neighborhood.name);
    });
}

// Display electricians for this neighborhood
async function displayNeighborhoodElectricians() {
    const neighborhood = getCurrentNeighborhood();
    if (!neighborhood) {
        console.error('Neighborhood not found');
        return;
    }

    // Update page content
    updatePageContent(neighborhood);

    // Load all electricians
    const allElectricians = await loadNeighborhoodElectricians();

    // Filter by neighborhood
    const neighborhoodElectricians = filterByNeighborhood(allElectricians, neighborhood.name);

    console.log(`Found ${neighborhoodElectricians.length} electricians in ${neighborhood.name}`);

    // Sort by tier
    const sorted = sortElectriciansByTier(neighborhoodElectricians);

    // Display
    displayElectricianCards(sorted);

    // Update count
    updateElectriciansCount(sorted.length);
}

// Sort by tier (reuse from main script)
function sortElectriciansByTier(electricians) {
    const tierOrder = { 'premium': 1, 'featured': 2, 'free': 3 };
    return [...electricians].sort((a, b) => {
        return (tierOrder[a.tier] || 999) - (tierOrder[b.tier] || 999);
    });
}

// Display electrician cards
function displayElectricianCards(electricians) {
    const container = document.getElementById('electricians-list');
    if (!container) return;

    if (electricians.length === 0) {
        container.innerHTML = `
            <p class="placeholder-text">
                Δεν βρέθηκαν ηλεκτρολόγοι σε αυτή την περιοχή αυτή τη στιγμή.
                <br><br>
                <a href="../index.html" class="back-link">← Επιστροφή στην αρχική</a>
            </p>
        `;
        return;
    }

    const cardsHTML = electricians.map(electrician => {
        const servicesHTML = electrician.services
            .map(service => `<span class="service-badge">${service}</span>`)
            .join('');

        const tierClass = `electrician-card-${electrician.tier}`;
        const tierBadge = getTierBadge(electrician.tier);

        return `
            <div class="electrician-card ${tierClass}" onclick="window.location.href='../electrician-detail.html?id=${electrician.id}'">
                ${tierBadge}
                <h3 class="electrician-name">${electrician.name}</h3>
                <a href="../electrician-detail.html?id=${electrician.id}" class="btn-view-profile" onclick="event.stopPropagation()">
                    👤 Δείτε Προφίλ
                </a>
                <a href="tel:${electrician.phone}" class="electrician-phone" onclick="event.stopPropagation()">
                    📞 Κλείστε Ραντεβού
                </a>
                <p class="electrician-neighborhood">${electrician.neighborhood}</p>
                <div class="services-container">
                    ${servicesHTML}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = cardsHTML;
}

// Get tier badge
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

// Update electricians count
function updateElectriciansCount(count) {
    const countEl = document.getElementById('electricians-count');
    if (countEl) {
        const text = count === 1 ? '1 επαγγελματίας' : `${count} επαγγελματίες`;
        countEl.textContent = text;
    }
}

// Quick filters functionality
function setupQuickFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            const filter = this.dataset.filter;

            // Toggle active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Get neighborhood
            const neighborhood = getCurrentNeighborhood();
            if (!neighborhood) return;

            // Load and filter electricians
            const allElectricians = await loadNeighborhoodElectricians();
            let filtered = filterByNeighborhood(allElectricians, neighborhood.name);

            // Apply service filter
            if (filter === '24h') {
                filtered = filtered.filter(e => e.services.includes('24ωρη'));
            } else if (filter === 'emergency') {
                filtered = filtered.filter(e => e.services.includes('24ωρη'));
            } else if (filter === 'installations') {
                filtered = filtered.filter(e => e.services.includes('Εγκαταστάσεις'));
            } else if (filter === 'repairs') {
                filtered = filtered.filter(e => e.services.includes('Επισκευές'));
            }

            // Display filtered results
            const sorted = sortElectriciansByTier(filtered);
            displayElectricianCards(sorted);
            updateElectriciansCount(sorted.length);
        });
    });

    // "All" button to reset
    const allBtn = document.querySelector('[data-filter="all"]');
    if (allBtn) {
        allBtn.addEventListener('click', displayNeighborhoodElectricians);
    }
}

// FAQ accordion functionality
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        if (!question) return;

        question.addEventListener('click', function() {
            // Toggle active class
            item.classList.toggle('active');
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    displayNeighborhoodElectricians();
    setupQuickFilters();
    setupFAQAccordion();
});
