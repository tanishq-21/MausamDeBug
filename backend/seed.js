/**
 * MausamDeBug Database Seeder
 * Run: node seed.js
 * Seeds MongoDB with 150 realistic mock reports & correlated events.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { Report, Event } = require('./models');

// ── Seed Data Generators (mirrors front-end mockData.js) ────────────────────

const INDIAN_CITIES = [
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
    { name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119 },
    { name: 'Shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933 },
];

const SOURCES = [
    { id: 'citizen', label: 'Citizen Report' },
    { id: 'social', label: 'Social Media' },
    { id: 'weather_api', label: 'Weather API' },
    { id: 'news', label: 'News Source' },
    { id: 'government', label: 'Government/IMD' },
    { id: 'sensor', label: 'IoT Sensor' },
];

const SEVERITIES = ['LOW', 'MODERATE', 'HIGH', 'SEVERE', 'EXTREME'];

const texts = {
    rainfall: ['Heavy rainfall observed near {loc}. Roads waterlogged.', 'Continuous rain for last 3 hours in {loc}. Water logging reported.', 'Heavy downpour at {loc}. Visibility poor.'],
    flood: ['Flood alert! Water levels rising near {loc} river.', 'Low-lying areas in {loc} submerged. Evacuation underway.'],
    thunderstorm: ['Severe thunderstorm with lightning reported near {loc}.', 'Thunder and lightning activity in {loc}. Power outages reported.'],
    heatwave: ['Severe heatwave conditions in {loc}. Temperature touching 47°C.', 'Heat emergency in {loc}. Schools closed. Stay hydrated.'],
    fog: ['Dense fog in {loc}. Visibility below 50m.', 'Thick fog blanket over {loc}. Flights delayed.'],
    dust_storm: ['Severe dust storm approaching {loc}. Sky turning orange.', 'Aandhi in {loc}! Winds at 80 kmph. Stay inside.'],
    strong_wind: ['Strong winds (60+ kmph) in {loc}. Trees and poles damaged.'],
};

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateReports() {
    const reports = [];
    let id = 10000;
    const now = Date.now();
    const eventKeys = Object.keys(texts);

    for (let i = 0; i < 150; i++) {
        const city = rand(INDIAN_CITIES);
        const eventType = rand(eventKeys);
        const source = rand(SOURCES);
        const textArr = texts[eventType];
        const text = rand(textArr).replace(/{loc}/g, city.name);
        const credibility = Math.floor(40 + Math.random() * 55);
        const status = credibility >= 75 ? 'verified' : credibility >= 55 ? 'pending' : credibility >= 40 ? 'suspicious' : 'rejected';
        const minsAgo = Math.floor(Math.random() * 720);
        const severity = rand(SEVERITIES);

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
            timestamp: new Date(now - minsAgo * 60000),
            minutes_ago: minsAgo,
            has_image: Math.random() > 0.6,
            duplicate_group: Math.random() > 0.7 ? `EV-${Math.floor(1000 + Math.random() * 999)}` : null,
        });
    }
    return reports;
}

function generateEvents(reports) {
    const groups = {};
    reports.forEach(r => {
        const key = `${r.city}-${r.event_type}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(r);
    });

    const events = [];
    let evId = 1001;
    Object.values(groups).forEach(reps => {
        if (reps.length < 2) return;
        const first = reps[0];
        const avgCred = Math.floor(reps.reduce((s, r) => s + r.credibility_score, 0) / reps.length);
        const maxSevIdx = reps.reduce((max, r) => {
            const idx = SEVERITIES.indexOf(r.severity);
            return idx > max ? idx : max;
        }, 0);
        events.push({
            id: `EV-${evId++}`,
            event_type: first.event_type,
            location: first.location,
            city: first.city,
            state: first.state,
            latitude: first.latitude,
            longitude: first.longitude,
            severity: SEVERITIES[Math.min(maxSevIdx + 1, 4)],
            confidence: avgCred,
            report_count: reps.length,
            source_count: [...new Set(reps.map(r => r.source))].length,
            status: avgCred >= 75 ? 'verified' : avgCred >= 55 ? 'active' : 'monitoring',
            start_time: reps[reps.length - 1].timestamp,
            last_updated: reps[0].timestamp,
            reports: reps.map(r => r.id),
        });
    });
    return events;
}

// ── Main Seed Function ───────────────────────────────────────────────────────
async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB:', process.env.MONGO_URI);

    // Clear existing data
    await Report.deleteMany({});
    await Event.deleteMany({});
    console.log('🗑  Cleared existing collections.');

    const reports = generateReports();
    await Report.insertMany(reports);
    console.log(`📥 Inserted ${reports.length} reports.`);

    const events = generateEvents(reports);
    await Event.insertMany(events);
    console.log(`📥 Inserted ${events.length} events.`);

    await mongoose.disconnect();
    console.log('🎉 Seeding complete! Database is ready.\n');
}

seed().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
