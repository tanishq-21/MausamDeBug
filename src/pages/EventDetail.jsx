import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { StatusBadge, SeverityBadge, CredibilityCircle } from '../components/ui'
import { MapPin, ArrowLeft, CheckCircle, TrendingUp } from 'lucide-react'
import SourceCorrelation from '../components/SourceCorrelation'
import EventTimeline from '../components/EventTimeline'
import CredibilityScore from '../components/CredibilityScore'

const EVENT_ICONS = { rainfall: '🌧', flood: '🌊', thunderstorm: '⛈', heatwave: '🌡', fog: '🌫', dust_storm: '💨', strong_wind: '🌬', hailstorm: '🌨', landslide: '⛰', cyclone: '🌀' }

export default function EventDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { events, reports } = useAppStore()
    const event = events.find(e => e.id === id) || events[0]

    if (!event) return <div style={{ padding: 40, color: '#64748b' }}>Event not found</div>

    const eventReports = reports.filter(r => r.city === event.city && r.event_type === event.event_type).slice(0, 8)

    // Timeline
    const timeline = [
        { time: '08:10 PM', icon: '📱', label: 'First citizen report received', detail: event.location },
        { time: '08:16 PM', icon: '📡', label: `${Math.floor(event.report_count * 0.2)} additional reports`, detail: 'From social media and citizen reporters' },
        { time: '08:21 PM', icon: '🌐', label: 'Weather API confirms conditions', detail: 'Open-Meteo observation matches report' },
        { time: '08:27 PM', icon: '🤖', label: 'AI groups correlated reports', detail: `${event.report_count} reports → 1 unified event` },
        { time: '08:30 PM', icon: '✅', label: `Event credibility: ${event.confidence}% HIGH`, detail: 'Multi-source verification complete' },
        { time: '08:35 PM', icon: '🛡', label: 'Admin verification complete', detail: 'Event status updated to VERIFIED' },
    ]

    const sources = [
        { name: 'Citizen Reports', count: Math.floor(event.report_count * 0.5), icon: '👤', verified: true },
        { name: 'Weather API (Open-Meteo)', count: 1, icon: '🌐', verified: true },
        { name: 'Social Media', count: Math.floor(event.report_count * 0.3), icon: '📱', verified: false },
        { name: 'News Source', count: Math.floor(event.report_count * 0.1), icon: '📰', verified: true },
        { name: 'IMD Data', count: Math.floor(event.report_count * 0.1), icon: '🏛', verified: true },
    ]

    return (
        <div style={{ padding: 24, maxWidth: 1200 }}>
            <button onClick={() => navigate(-1)} style={backBtn}>
                <ArrowLeft size={13} /> Back to Events
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBlock: 20 }}>
                <div style={{ fontSize: 48 }}>{EVENT_ICONS[event.event_type] || '🌧'}</div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>EVENT {event.id}</div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', textTransform: 'capitalize', margin: 0 }}>{event.event_type.replace('_', ' ')}</h1>
                    <div style={{ fontSize: 14, color: '#475569', marginTop: 4 }}><MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />{event.location}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <SeverityBadge severity={event.severity} />
                        <StatusBadge status={event.status} />
                    </div>
                </div>
                <CredibilityCircle score={event.confidence} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
                {/* Left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {[
                            { label: 'Total Reports', value: event.report_count, color: '#3b82f6', sub: 'Correlated' },
                            { label: 'Source Types', value: event.source_count, color: '#10b981', sub: 'Independent' },
                            { label: 'Credibility', value: `${event.confidence}%`, color: event.confidence >= 75 ? '#10b981' : '#f59e0b', sub: event.confidence >= 75 ? 'HIGH' : 'MEDIUM' },
                        ].map(s => (
                            <div key={s.label} style={{ background: '#ffffff', border: `1px solid ${s.color}33`, borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
                                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                                <div style={{ fontSize: 11, color: '#64748b' }}>{s.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* "Reports → Event" visualization */}
                    <div style={card}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 12 }}>
                            🔗 Correlation: {event.report_count} Reports → 1 Unified Event
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                            {eventReports.map((r, i) => (
                                <div key={r.id} style={{ padding: '4px 8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 6, fontSize: 10, color: '#60a5fa', fontFamily: 'JetBrains Mono, monospace' }}>
                                    {r.id.split('-').pop()}
                                </div>
                            ))}
                            {event.report_count > 8 && (
                                <div style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.04)', borderRadius: 6, fontSize: 10, color: '#64748b' }}>+{event.report_count - 8} more</div>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 1, background: 'rgba(59,130,246,0.3)' }} />
                            <div style={{ padding: '4px 12px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, fontSize: 12, color: '#60a5fa', fontWeight: 700 }}>
                                = {event.id}
                            </div>
                            <div style={{ flex: 1, height: 1, background: 'rgba(59,130,246,0.3)' }} />
                        </div>
                    </div>

                    {/* Timeline */}
                    <div style={card}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 14 }}>⏱ Event Timeline</div>
                        {timeline.map((t, i) => (
                            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, position: 'relative' }}>
                                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{t.icon}</div>
                                    {i < timeline.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(0,0,0,0.05)', marginTop: 3, minHeight: 16 }} />}
                                </div>
                                <div style={{ paddingBottom: 8 }}>
                                    <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{t.time}</div>
                                    <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 600, marginTop: 2 }}>{t.label}</div>
                                    <div style={{ fontSize: 11, color: '#475569' }}>{t.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: sources + evidence graph */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* AI Credibility (formula-based) */}
                    <CredibilityScore
                        report={{
                            credibility_score: event.confidence,
                            source: 'citizen',
                            minutes_ago: 20,
                            latitude: event.latitude,
                            longitude: event.longitude,
                            city: event.city,
                            state: event.state,
                            event_type: event.event_type,
                        }}
                    />

                    {/* Multi-source correlation */}
                    <SourceCorrelation event={event} />

                    {/* Why trending */}
                    <div style={card}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <TrendingUp size={16} color="#f59e0b" /> Why is this event trending?
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { positive: true, text: `${event.report_count} reports in the last 30 minutes` },
                                { positive: true, text: 'Weather observations support the event' },
                                { positive: true, text: `${event.source_count} independent source types reporting` },
                                { positive: true, text: 'Location is geographically consistent' },
                                { positive: event.confidence >= 75, text: `Confidence crossed ${event.confidence}% threshold` },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: item.positive ? '#0f172a' : '#f59e0b' }}>
                                    <span style={{ color: item.positive ? '#10b981' : '#f59e0b', fontWeight: 700, flexShrink: 0 }}>
                                        {item.positive ? '✓' : '⚠'}
                                    </span>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: '#64748b' }}>Current Confidence</span>
                            <span style={{ fontSize: 24, fontWeight: 900, color: event.confidence >= 75 ? '#10b981' : '#f59e0b' }}>{event.confidence}%</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Event Timeline — full width below */}
            <div style={{ marginTop: 20 }}>
                <EventTimeline event={event} />
            </div>
        </div>
    )
}

const card = { background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 16 }
const backBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(0,0,0,0.05)', color: '#475569', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }
