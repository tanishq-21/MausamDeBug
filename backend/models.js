const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    event_type: { type: String, required: true },
    text: String,
    source: String,
    source_label: String,
    location: String,
    city: String,
    state: String,
    latitude: Number,
    longitude: Number,
    credibility_score: Number,
    verification_status: { type: String, enum: ['verified', 'pending', 'suspicious', 'rejected'], default: 'pending' },
    severity: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'SEVERE', 'EXTREME'] },
    timestamp: { type: Date, default: Date.now },
    minutes_ago: Number,
    has_image: Boolean,
    duplicate_group: String,
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    event_type: String,
    location: String,
    city: String,
    state: String,
    latitude: Number,
    longitude: Number,
    severity: String,
    confidence: Number,
    report_count: Number,
    source_count: Number,
    status: String,
    start_time: Date,
    last_updated: Date,
    reports: [String], // list of report IDs
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
const Event = mongoose.model('Event', eventSchema);

module.exports = { Report, Event };
