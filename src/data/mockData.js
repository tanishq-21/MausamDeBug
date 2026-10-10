// Mock data for MausamDeBug - Realistic Indian weather events
export const INDIAN_CITIES = [
    { name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322 },
    { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
    { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
    { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },
    { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
    { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
    { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
    { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
    { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
    { name: 'Srinagar', state: 'J&K', lat: 34.0837, lng: 74.7973 },
    { name: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734 },
    { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
    { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096 },
    { name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296 },
    { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
    { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
    { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
    { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366 },
    { name: 'Chandigarh', state: 'Punjab', lat: 30.7333, lng: 76.7794 },
    { name: 'Agartala', state: 'Tripura', lat: 23.8315, lng: 91.2868 },
    { name: 'Imphal', state: 'Manipur', lat: 24.8170, lng: 93.9368 },
    { name: 'Gangtok', state: 'Sikkim', lat: 27.3389, lng: 88.6065 },
    { name: 'Shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933 },
    { name: 'Tura', state: 'Meghalaya', lat: 25.5137, lng: 90.2144 },
    { name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119 },
];

export const EVENT_TYPES = [
    { id: 'rainfall', label: 'Heavy Rainfall', icon: '🌧', color: '#3b82f6', bg: 'rgba(59,130,246,0.2)' },
    { id: 'flood', label: 'Flood', icon: '🌊', color: '#06b6d4', bg: 'rgba(6,182,212,0.2)' },
    { id: 'thunderstorm', label: 'Thunderstorm', icon: '⛈', color: '#8b5cf6', bg: 'rgba(139,92,246,0.2)' },
    { id: 'heatwave', label: 'Heatwave', icon: '🌡', color: '#f97316', bg: 'rgba(249,115,22,0.2)' },
    { id: 'fog', label: 'Dense Fog', icon: '🌫', color: '#475569', bg: 'rgba(156,163,175,0.2)' },
    { id: 'dust_storm', label: 'Dust Storm', icon: '💨', color: '#d97706', bg: 'rgba(217,119,6,0.2)' },
    { id: 'strong_wind', label: 'Strong Wind', icon: '🌬', color: '#10b981', bg: 'rgba(16,185,129,0.2)' },
    { id: 'hailstorm', label: 'Hailstorm', icon: '🌨', color: '#60a5fa', bg: 'rgba(96,165,250,0.2)' },
    { id: 'landslide', label: 'Landslide', icon: '⛰', color: '#a16207', bg: 'rgba(161,98,7,0.2)' },
    { id: 'cyclone', label: 'Cyclone', icon: '🌀', color: '#ef4444', bg: 'rgba(239,68,68,0.2)' },
];

export const SOURCES = [
    { id: 'citizen', label: 'Citizen Report', reliability: 0.72, color: '#10b981' },
    { id: 'social', label: 'Social Media', reliability: 0.58, color: '#8b5cf6' },
    { id: 'weather_api', label: 'Weather API', reliability: 0.95, color: '#3b82f6' },
    { id: 'news', label: 'News Source', reliability: 0.78, color: '#f59e0b' },
    { id: 'government', label: 'Government/IMD', reliability: 0.98, color: '#06b6d4' },
    { id: 'sensor', label: 'IoT Sensor', reliability: 0.92, color: '#f97316' },
];

export const SEVERITIES = ['LOW', 'MODERATE', 'HIGH', 'SEVERE', 'EXTREME'];
export const STATUSES = ['verified', 'pending', 'suspicious', 'rejected'];

// Generate mock reports
const generateReports = () => {
    const reports = [];
    const texts = {
        rainfall: [
            'Heavy rainfall observed near {loc}. Roads waterlogged.',
            'Continuous rain for last 3 hours in {loc} area. Water logging reported.',
            '{loc} mein tez baarish ho rahi hai. Sadkein doob gayi hain.',
            'Heavy downpour at {loc}. Visibility poor. Advisory issued.',
            'Massive rainfall in {loc}. Citizens advised to stay indoors.',
        ],
        flood: [
            'Flood alert! Water levels rising near {loc} river.',
            'Low-lying areas in {loc} submerged. Evacuation underway.',
            '{loc} district facing severe flooding. NDRF deployed.',
            'Flash flood warning issued for {loc}. Citizens evacuate immediately.',
        ],
        thunderstorm: [
            'Severe thunderstorm with lightning reported near {loc}.',
            'Thunder and lightning activity in {loc}. Power outages reported.',
            'Gusty winds and thunderstorm in {loc}. Trees uprooted.',
        ],
        heatwave: [
            'Severe heatwave conditions in {loc}. Temperature touching 47°C.',
            'Heat emergency in {loc}. Schools closed. Stay hydrated.',
            '{loc} sizzling at 45 degrees. IMD red alert issued.',
        ],
        fog: [
            'Dense fog in {loc}. Visibility below 50m. Traffic disrupted.',
            'Thick fog blanket over {loc}. Flights delayed.',
            'Foggy conditions in {loc}. Drive with caution.',
        ],
        dust_storm: [
            'Severe dust storm approaching {loc}. Sky turning orange.',
            'Aandhi in {loc}! Winds at 80 kmph. Stay inside.',
            'Major dust storm in {loc} area. Visibility near zero.',
        ],
        strong_wind: [
            'Strong winds (60+ kmph) in {loc}. Trees and poles damaged.',
            'Cyclonic wind conditions near {loc} coast.',
            'High-speed winds uprooting trees in {loc}.',
        ],
    };

    const eventKeys = Object.keys(texts);
    let id = 10000;
    const now = Date.now();

    for (let i = 0; i < 150; i++) {
        const city = INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
        const eventType = eventKeys[Math.floor(Math.random() * eventKeys.length)];
        const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
        const textArr = texts[eventType];
        const text = textArr[Math.floor(Math.random() * textArr.length)].replace(/{loc}/g, city.name);
        const credibility = Math.floor(40 + Math.random() * 55);
        const status = credibility >= 75 ? 'verified' : credibility >= 55 ? 'pending' : credibility >= 40 ? 'suspicious' : 'rejected';
        const minsAgo = Math.floor(Math.random() * 720);
        const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];

        reports.push({
            id: `MSA-2026-${id++}`,
            event_type: eventType,
            text,
            source: source.id,
            source_label: source.label,
            location: `${city.name}, ${city.state}`,
            city: city.name,
            state: city.state,
            latitude: city.lat + (Math.random() - 0.5) * 0.05,
            longitude: city.lng + (Math.random() - 0.5) * 0.05,
            credibility_score: credibility,
            verification_status: status,
            severity,
            timestamp: new Date(now - minsAgo * 60000).toISOString(),
            minutes_ago: minsAgo,
            has_image: Math.random() > 0.6,
            duplicate_group: Math.random() > 0.7 ? `EV-${Math.floor(1000 + Math.random() * 999)}` : null,
        });
    }
    return reports.sort((a, b) => a.minutes_ago - b.minutes_ago);
};

// Generate mock events (correlated)
const generateEvents = (reports) => {
    const events = [];
    const groups = {};
    reports.forEach(r => {
        const key = `${r.city}-${r.event_type}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(r);
    });

    let evId = 1001;
    Object.entries(groups).forEach(([key, reps]) => {
        if (reps.length < 2) return;
        const first = reps[0];
        const avgCred = Math.floor(reps.reduce((s, r) => s + r.credibility_score, 0) / reps.length);
        const maxSev = ['LOW', 'MODERATE', 'HIGH', 'SEVERE', 'EXTREME'].indexOf(
            reps.reduce((max, r) => {
                const idx = SEVERITIES.indexOf(r.severity);
                return idx > SEVERITIES.indexOf(max) ? r.severity : max;
            }, 'LOW')
        );
        events.push({
            id: `EV-${evId++}`,
            event_type: first.event_type,
            location: first.location,
            city: first.city,
            state: first.state,
            latitude: first.latitude,
            longitude: first.longitude,
            severity: SEVERITIES[Math.min(maxSev + 1, 4)],
            confidence: avgCred,
            report_count: reps.length,
            source_count: [...new Set(reps.map(r => r.source))].length,
            status: avgCred >= 75 ? 'verified' : avgCred >= 55 ? 'active' : 'monitoring',
            start_time: reps[reps.length - 1].timestamp,
            last_updated: reps[0].timestamp,
            reports: reps.map(r => r.id),
        });
    });
    return events.sort((a, b) => b.report_count - a.report_count);
};

export const MOCK_REPORTS = generateReports();
export const MOCK_EVENTS = generateEvents(MOCK_REPORTS);

// Analytics data
export const ANALYTICS_DATA = {
    reportsOverTime: Array.from({ length: 24 }, (_, i) => ({
        hour: `${String(i).padStart(2, '0')}:00`,
        reports: Math.floor(80 + Math.random() * 200),
        verified: Math.floor(50 + Math.random() * 120),
    })),
    eventDistribution: Object.fromEntries(
        EVENT_TYPES.slice(0, 7).map(et => [et.id, Math.floor(5 + Math.random() * 30)])
    ),
    stateReports: INDIAN_CITIES.reduce((acc, city) => {
        acc[city.state] = (acc[city.state] || 0) + Math.floor(10 + Math.random() * 200);
        return acc;
    }, {}),
    sourceDistribution: SOURCES.map(s => ({
        source: s.label,
        count: Math.floor(100 + Math.random() * 800),
        reliability: Math.floor(s.reliability * 100),
    })),
    credibilityDist: [
        { range: '0-20', count: 12 },
        { range: '21-40', count: 34 },
        { range: '41-60', count: 89 },
        { range: '61-75', count: 245 },
        { range: '76-90', count: 432 },
        { range: '91-100', count: 198 },
    ],
};

// KPI stats
export const MOCK_STATS = {
    totalReports: 12458,
    verified: 8932,
    pending: 1204,
    suspicious: 247,
    rejected: 75,
    activeEvents: 57,
    regionsMonitored: 28,
    dataQuality: 91.4,
};

// Demo scenario for Dehradun
export const DEMO_SCENARIO_STEPS = [
    { step: 1, label: 'Citizen report received', detail: 'Heavy rain at Rajpur Road, Dehradun', delay: 0 },
    { step: 2, label: 'NLP processing...', detail: 'Extracting location, event type, severity', delay: 1500 },
    { step: 3, label: 'Location extracted ✓', detail: 'Dehradun, Uttarakhand (30.31°N, 78.03°E)', delay: 3000 },
    { step: 4, label: 'Event classified ✓', detail: 'Heavy Rainfall — 91% confidence', delay: 4500 },
    { step: 5, label: 'Duplicate check ✓', detail: 'Found 3 similar recent reports', delay: 6000 },
    { step: 6, label: 'Weather API verification ✓', detail: 'Open-Meteo confirms: 18.4mm/h rainfall', delay: 7500 },
    { step: 7, label: 'Credibility calculated ✓', detail: 'Score: 94/100 — HIGH CREDIBILITY', delay: 9000 },
    { step: 8, label: 'Event correlated ✓', detail: '23 reports → Unified Event EV-1024', delay: 10500 },
    { step: 9, label: 'Alert dispatched ✓', detail: 'Admin notified. Map updated. Dashboard refreshed.', delay: 12000 },
];

// System health
export const SYSTEM_HEALTH = {
    api: { status: 'healthy', latency: 42 },
    database: { status: 'healthy', records: 12458 },
    ai_engine: { status: 'healthy', latency: 218 },
    weather_api: { status: 'healthy', latency: 156 },
    websocket: { status: 'healthy', connections: 7 },
    ingestion: { status: 'healthy', rate: 1995 },
};

export const INGESTION_RATES = [
    { source: 'Weather APIs', rate: 1240, color: '#3b82f6' },
    { source: 'Citizen Reports', rate: 83, color: '#10b981' },
    { source: 'Social Sources', rate: 520, color: '#8b5cf6' },
    { source: 'News Sources', rate: 110, color: '#f59e0b' },
    { source: 'Public Datasets', rate: 42, color: '#06b6d4' },
];
