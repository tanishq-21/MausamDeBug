/**
 * MausamDeBug Credibility Engine
 * Formula: C = W·weather + N·nearby + G·geo + S·source + T·temporal
 * Weights are configurable (not hardcoded).
 */

export const CREDIBILITY_WEIGHTS = {
    weather: 0.30, // Weather data consistency
    nearby: 0.25, // Nearby independent reports
    geo: 0.20, // Geographic consistency
    source: 0.15, // Source reliability baseline
    temporal: 0.10, // Temporal consistency (recency)
}

export const SOURCE_RELIABILITY = {
    government: 1.00,
    weather_api: 0.95,
    sensor: 0.92,
    news: 0.78,
    citizen: 0.72,
    social: 0.58,
    unknown: 0.40,
}

export const CREDIBILITY_TIERS = [
    { min: 75, label: 'HIGH', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { min: 40, label: 'MEDIUM', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { min: 0, label: 'LOW', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
]

export function getTier(score) {
    return CREDIBILITY_TIERS.find(t => score >= t.min) || CREDIBILITY_TIERS[2]
}

/**
 * Compute a breakdown from a report object.
 * Returns { score, tier, breakdown }
 */
export function computeCredibility(report, allReports = []) {
    const w = CREDIBILITY_WEIGHTS

    // 1. Weather data match (simulated from event_type presence + source)
    const weatherMatch = report.source === 'weather_api' || report.source === 'sensor'
        ? 30
        : report.source === 'government'
            ? 28
            : report.credibility_score >= 80
                ? 26
                : 18

    // 2. Nearby reports count
    const nearby = allReports.filter(r =>
        r.id !== report.id &&
        r.event_type === report.event_type &&
        r.city === report.city
    ).length
    const nearbyScore = Math.min(25, Math.round(nearby * 3.5))

    // 3. Geographic consistency
    const geoScore = report.latitude && report.longitude
        ? report.state ? 20 : 14
        : 8

    // 4. Source reliability
    const reliability = SOURCE_RELIABILITY[report.source] ?? 0.5
    const sourceScore = Math.round(reliability * 15)

    // 5. Temporal (recency)
    const minsAgo = report.minutes_ago ?? 999
    const temporalScore = minsAgo < 30 ? 10 : minsAgo < 120 ? 8 : minsAgo < 360 ? 5 : 2

    const rawScore = (weatherMatch / 30) * w.weather * 100
        + (nearbyScore / 25) * w.nearby * 100
        + (geoScore / 20) * w.geo * 100
        + (sourceScore / 15) * w.source * 100
        + (temporalScore / 10) * w.temporal * 100

    const finalScore = Math.min(100, Math.round(rawScore))

    return {
        score: finalScore,
        tier: getTier(finalScore),
        breakdown: [
            { label: 'Weather Data Consistency', score: weatherMatch, max: 30, weight: w.weather },
            { label: 'Nearby Independent Reports', score: nearbyScore, max: 25, weight: w.nearby },
            { label: 'Geographic Consistency', score: geoScore, max: 20, weight: w.geo },
            { label: 'Source Reliability', score: sourceScore, max: 15, weight: w.source },
            { label: 'Temporal Consistency', score: temporalScore, max: 10, weight: w.temporal },
        ],
    }
}

/**
 * Generate human-readable "Why this score?" bullets from a report.
 */
export function explainScore(report, allReports = []) {
    const reasons = []
    const warnings = []
    const nearbyCount = allReports.filter(r =>
        r.id !== report.id && r.event_type === report.event_type && r.city === report.city
    ).length

    if (report.source === 'government' || report.source === 'weather_api') {
        reasons.push('Weather observation data supports this event')
    }
    if (nearbyCount > 0) reasons.push(`${nearbyCount} independent nearby report${nearbyCount > 1 ? 's' : ''} detected`)
    if (report.latitude && report.longitude) reasons.push('Location is geographically consistent')
    if (report.minutes_ago < 60) reasons.push('Report is recent (within the last hour)')
    if (report.duplicate_group) reasons.push('Multiple sources corroborate this incident')
    if (report.has_image) reasons.push('Visual supporting evidence is attached')

    const sourceRel = SOURCE_RELIABILITY[report.source] ?? 0.5
    if (sourceRel >= 0.9) reasons.push(`Source "${report.source_label}" has very high reliability`)
    else if (sourceRel < 0.65) warnings.push(`Source "${report.source_label}" has limited verification history`)
    if (report.minutes_ago > 300) warnings.push('Report is over 5 hours old — freshness reduced')
    if (nearbyCount === 0) warnings.push('No corroborating nearby reports found yet')

    return { reasons, warnings }
}
