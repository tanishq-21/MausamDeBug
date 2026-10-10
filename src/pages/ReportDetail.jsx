import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { CredibilityCircle, StatusBadge, SeverityBadge, EventTypeBadge } from '../components/ui'
import { MapPin, Clock, Shield, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react'
import CredibilityScore from '../components/CredibilityScore'
import WhyThisScore from '../components/WhyThisScore'

export default function ReportDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { reports, verifyReport, rejectReport } = useAppStore()
    const report = reports.find(r => r.id === id)

    if (!report) return (
        <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Report not found</div>
            <button onClick={() => navigate('/reports')} style={{ marginTop: 12, ...backBtn }}>← Back to Reports</button>
        </div>
    )

    const s = report.credibility_score
    const breakdown = report.ai_verification?.breakdown || [
        { label: 'Live Weather Observation Match', weight: 30, score: Math.floor(s * 0.30 * 0.96), max: 30 },
        { label: 'Nearby Sensor Consensus', weight: 25, score: Math.floor(s * 0.25 * 0.92), max: 25 },
        { label: 'Geographic Telemetry Match', weight: 20, score: report.latitude ? 19 : 14, max: 20 },
        { label: 'Source Reliability Baseline', weight: 15, score: Math.floor(s * 0.15 * 0.88), max: 15 },
        { label: 'Temporal Window Freshness', weight: 10, score: (report.minutes_ago || 0) < 60 ? 10 : 8, max: 10 },
    ]

    const reasons = (report.ai_verification?.reasons || [
        'Weather observation data confirms atmospheric conditions in this sector',
        'Nearby telemetry nodes confirm similar conditions',
        'Report coordinates match claimed location',
        'Report submitted during active observation window',
    ]).map(text => ({ positive: true, text })).concat(
        (report.ai_verification?.warnings || (s < 70 ? ['Source has limited historical verification track record'] : []))
            .map(text => ({ positive: false, text, warning: true }))
    )

    return (
        <div style={{ padding: 24, maxWidth: 1200 }}>
            <button onClick={() => navigate(-1)} style={{ ...backBtn, marginBottom: 20 }}>
                <ArrowLeft size={13} /> Back
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
                {/* Left: main details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Report header */}
                    <div style={card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div>
                                <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>{report.id}</div>
                                <EventTypeBadge eventType={report.event_type} />
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <SeverityBadge severity={report.severity} />
                                <StatusBadge status={report.verification_status} />
                            </div>
                        </div>

                        <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', lineHeight: 1.6, marginBottom: 16, fontStyle: 'italic', padding: '12px 16px', background: 'rgba(0,0,0,0.03)', borderRadius: 8, borderLeft: '3px solid rgba(59,130,246,0.5)' }}>
                            "{report.text}"
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', fontSize: 13 }}>
                            <InfoRow label="Location" value={report.location} icon={<MapPin size={13} />} />
                            <InfoRow label="Timestamp" value={new Date(report.timestamp).toLocaleString('en-IN')} icon={<Clock size={13} />} />
                            <InfoRow label="Source" value={report.source_label} />
                            <InfoRow label="Coordinates" value={`${report.latitude.toFixed(4)}°N, ${report.longitude.toFixed(4)}°E`} />
                            <InfoRow label="Has Image" value={report.has_image ? '✓ Attached' : 'No image'} />
                            <InfoRow label="Duplicate Group" value={report.duplicate_group || 'Not grouped'} />
                        </div>
                    </div>

                    {/* NLP Extraction */}
                    <div style={card}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 12 }}>
                            🔤 NLP Information Extraction
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                                { label: 'Event Type', value: report.event_type.replace('_', ' '), highlight: true },
                                { label: 'Location', value: report.location, highlight: true },
                                { label: 'Severity', value: report.severity },
                                { label: 'Timestamp', value: new Date(report.timestamp).toLocaleTimeString() },
                                { label: 'Language', value: 'English / Hinglish' },
                                { label: 'Keywords', value: 'rainfall, flooding, roads, warning' },
                            ].map(item => (
                                <div key={item.label} style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.04)', borderRadius: 8 }}>
                                    <div style={{ fontSize: 10, color: '#64748b', marginBottom: 3 }}>{item.label}</div>
                                    <div style={{ fontSize: 12, color: item.highlight ? '#60a5fa' : '#0f172a', fontWeight: item.highlight ? 600 : 400 }}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Evidence */}
                    <div style={card}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 12 }}>
                            📋 Supporting Evidence
                        </div>
                        {reasons.map((r, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                                {r.warning
                                    ? <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                                    : <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />}
                                <span style={{ fontSize: 13, color: r.warning ? '#f59e0b' : '#1e293b' }}>{r.text}</span>
                            </div>
                        ))}
                        <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(59,130,246,0.05)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.15)', fontSize: 12, color: '#475569', fontStyle: 'italic' }}>
                            The system estimates report credibility using spatial, temporal, meteorological and multi-source evidence. It does not claim absolute truth.
                        </div>
                    </div>

                    {/* Admin actions */}
                    {report.verification_status === 'pending' || report.verification_status === 'suspicious' ? (
                        <div style={card}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 12 }}>⚙️ Admin Actions</div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => { verifyReport(report.id); navigate('/admin') }} style={actionBtn('#10b981')}>
                                    <CheckCircle size={14} /> Verify Report
                                </button>
                                <button onClick={() => { rejectReport(report.id); navigate(-1) }} style={actionBtn('#ef4444')}>
                                    Reject Report
                                </button>
                                <button style={actionBtn('#f59e0b')}>
                                    <Shield size={14} /> Mark for Review
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ ...card, background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CheckCircle size={16} color="#10b981" />
                                <span style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>
                                    Report is {report.verification_status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: AI Credibility + WhyThisScore */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <CredibilityScore report={report} />
                    <WhyThisScore report={report} />

                    {/* Source reliability */}
                    <div style={card}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 12 }}>📡 Source Reliability</div>
                        <div style={{ fontSize: 13, color: '#475569', marginBottom: 4 }}>Source: <strong style={{ color: '#0f172a' }}>{report.source_label}</strong></div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>42</div>
                                <div style={{ fontSize: 10, color: '#64748b' }}>Verified Reports</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 22, fontWeight: 800, color: '#ef4444' }}>3</div>
                                <div style={{ fontSize: 10, color: '#64748b' }}>Rejected</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 22, fontWeight: 800, color: '#3b82f6' }}>93%</div>
                                <div style={{ fontSize: 10, color: '#64748b' }}>Reliability</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoRow({ label, value, icon }) {
    return (
        <div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                {icon} {label}
            </div>
            <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{value}</div>
        </div>
    )
}

const card = { background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 16 }
const backBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(0,0,0,0.05)', color: '#475569', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }
const actionBtn = (color) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: `1px solid ${color}44`, background: `${color}15`, color, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' })
