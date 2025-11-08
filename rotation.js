// Smart Rotation System for Free Electricians
// BUSINESS STRATEGY: Prove the value of premium placement to free-tier users
// By rotating 3 free electricians daily to a spotlight section, we demonstrate
// that top positioning = more views = more business = worth paying for

const ROTATION_KEY = 'electrician-rotation';
const ROTATION_HISTORY_KEY = 'rotation-history';
const ROTATION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const ROTATION_COOLDOWN = 7 * 24 * 60 * 60 * 1000; // 7 days cooldown

// Get current rotation data from localStorage
function getRotationData() {
    try {
        const data = localStorage.getItem(ROTATION_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading rotation data:', error);
        return null;
    }
}

// Save rotation data to localStorage
function saveRotationData(data) {
    try {
        localStorage.setItem(ROTATION_KEY, JSON.stringify(data));
        console.log('✅ Rotation data saved:', data);
    } catch (error) {
        console.error('Error saving rotation data:', error);
    }
}

// Get rotation history (for sales pitch data!)
function getRotationHistory() {
    try {
        const data = localStorage.getItem(ROTATION_HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading rotation history:', error);
        return [];
    }
}

// Save completed rotation to history (THIS IS YOUR SALES GOLD!)
function saveRotationToHistory(rotationResult) {
    try {
        const history = getRotationHistory();
        history.push(rotationResult);
        localStorage.setItem(ROTATION_HISTORY_KEY, JSON.stringify(history));
        console.log('💰 SALES DATA: Rotation performance saved:', rotationResult);
    } catch (error) {
        console.error('Error saving rotation history:', error);
    }
}

// Check if it's time to rotate (24 hours passed)
function shouldRotateToday() {
    const rotation = getRotationData();

    if (!rotation || !rotation.startTime) {
        return true; // No active rotation, start one
    }

    const now = Date.now();
    const timePassed = now - rotation.startTime;

    return timePassed >= ROTATION_DURATION;
}

// Get electricians who were recently rotated (within cooldown period)
function getRecentlyRotatedIds() {
    const history = getRotationHistory();
    const now = Date.now();
    const cooldownPeriod = now - ROTATION_COOLDOWN;

    return history
        .filter(rotation => rotation.endTime > cooldownPeriod)
        .flatMap(rotation => rotation.electricianIds);
}

// Select 3 FREE electricians for rotation
// STRATEGY: Prioritize those with lowest views (fairness + prove value to skeptics)
function selectElectriciansForRotation(allElectricians) {
    // Filter for FREE tier only
    const freeElectricians = allElectricians.filter(e => e.tier === 'free');

    if (freeElectricians.length === 0) {
        console.log('No free electricians available for rotation');
        return [];
    }

    // Get recently rotated IDs (exclude them)
    const recentlyRotated = getRecentlyRotatedIds();

    // Filter out recently rotated electricians
    const eligible = freeElectricians.filter(e => !recentlyRotated.includes(e.id));

    // If not enough eligible, include some recently rotated ones
    const candidates = eligible.length >= 3 ? eligible : freeElectricians;

    // Get analytics for sorting
    const analytics = loadAnalytics();

    // Sort by total views (ascending = lowest views first)
    // This is FAIR and proves value better (bigger percentage increases)
    const sorted = candidates.sort((a, b) => {
        const viewsA = analytics[a.id]?.totalViews || 0;
        const viewsB = analytics[b.id]?.totalViews || 0;
        return viewsA - viewsB;
    });

    // Return top 3 (lowest views)
    return sorted.slice(0, 3);
}

// Start rotation for selected electricians
function startRotation(electricians) {
    const now = Date.now();
    const analytics = loadAnalytics();

    const rotationData = {
        startTime: now,
        endTime: now + ROTATION_DURATION,
        electricians: electricians.map(e => ({
            id: e.id,
            name: e.name,
            viewsAtStart: analytics[e.id]?.totalViews || 0,
            phoneClicksAtStart: analytics[e.id]?.totalPhoneClicks || 0
        }))
    };

    saveRotationData(rotationData);

    console.log('🌟 ROTATION STARTED:', {
        electricians: electricians.map(e => e.name),
        duration: '24 hours',
        startTime: new Date(now).toLocaleString('el-GR')
    });

    return rotationData;
}

// End current rotation and calculate performance (SALES PITCH DATA!)
function endRotation() {
    const rotation = getRotationData();

    if (!rotation) {
        console.log('No active rotation to end');
        return null;
    }

    const analytics = loadAnalytics();
    const now = Date.now();

    // Calculate performance for each electrician
    const results = rotation.electricians.map(e => {
        const currentViews = analytics[e.id]?.totalViews || 0;
        const currentPhoneClicks = analytics[e.id]?.totalPhoneClicks || 0;

        const viewsGained = currentViews - e.viewsAtStart;
        const phoneClicksGained = currentPhoneClicks - e.phoneClicksAtStart;

        const viewsIncrease = e.viewsAtStart > 0
            ? Math.round((viewsGained / e.viewsAtStart) * 100)
            : (viewsGained > 0 ? 999 : 0); // 999% for first-timers with results

        const phoneClicksIncrease = e.phoneClicksAtStart > 0
            ? Math.round((phoneClicksGained / e.phoneClicksAtStart) * 100)
            : (phoneClicksGained > 0 ? 999 : 0);

        return {
            id: e.id,
            name: e.name,
            viewsBefore: e.viewsAtStart,
            viewsAfter: currentViews,
            viewsGained: viewsGained,
            viewsIncreasePercent: viewsIncrease,
            phoneClicksBefore: e.phoneClicksAtStart,
            phoneClicksAfter: currentPhoneClicks,
            phoneClicksGained: phoneClicksGained,
            phoneClicksIncreasePercent: phoneClicksIncrease
        };
    });

    // Save to history (THIS IS GOLD FOR SALES CALLS!)
    const historyEntry = {
        startTime: rotation.startTime,
        endTime: now,
        electricianIds: rotation.electricians.map(e => e.id),
        results: results
    };

    saveRotationToHistory(historyEntry);

    // Clear current rotation
    localStorage.removeItem(ROTATION_KEY);

    console.log('💰 ROTATION ENDED - SALES DATA:', results);

    return results;
}

// Get time remaining in current rotation (for countdown display)
function getRotationTimeRemaining() {
    const rotation = getRotationData();

    if (!rotation) {
        return 0;
    }

    const now = Date.now();
    const remaining = rotation.endTime - now;

    return Math.max(0, remaining);
}

// Get hours remaining (for display)
function getRotationHoursRemaining() {
    const millisRemaining = getRotationTimeRemaining();
    return Math.ceil(millisRemaining / (60 * 60 * 1000));
}

// Get current rotating electrician IDs
function getRotatingElectricianIds() {
    const rotation = getRotationData();

    if (!rotation || !rotation.electricians) {
        return [];
    }

    return rotation.electricians.map(e => e.id);
}

// Check if an electrician is currently rotating
function isElectricianRotating(electricianId) {
    const rotatingIds = getRotatingElectricianIds();
    return rotatingIds.includes(electricianId);
}

// Initialize rotation system (call on page load)
function initializeRotation(allElectricians) {
    console.log('🔄 Checking rotation status...');

    if (shouldRotateToday()) {
        console.log('⏰ Time to rotate! Ending previous rotation...');

        // End previous rotation if exists
        const results = endRotation();
        if (results) {
            console.log('📊 Previous rotation results:', results);
        }

        // Start new rotation
        const selected = selectElectriciansForRotation(allElectricians);

        if (selected.length > 0) {
            startRotation(selected);
            console.log('✨ New rotation started with:', selected.map(e => e.name));
        }
    } else {
        const hoursRemaining = getRotationHoursRemaining();
        console.log(`⏳ Current rotation active for ${hoursRemaining} more hours`);
    }
}

// Get performance summary for an electrician (for sales calls!)
function getElectricianRotationHistory(electricianId) {
    const history = getRotationHistory();

    return history
        .filter(rotation => rotation.electricianIds.includes(electricianId))
        .map(rotation => {
            const result = rotation.results.find(r => r.id === electricianId);
            return {
                date: new Date(rotation.startTime).toLocaleDateString('el-GR'),
                ...result
            };
        });
}
