/**
 * SourceCorrelation — shows multi-source funnel for a weather event.
 */
import { useAppStore } from '../store/appStore'
import { getTier } from '../utils/credibility'

const SOURCES = [
    { key: 'weather_api', icon: '📡', label: 'Weather API', color: '#3b82f6' },
    { key: 'citizen', icon: '👥', label: 'Citizen Reports', color: '#10b981' },
    { key: 'news', icon: '📰', label: 'News Reports', color: '#f59e0b' },
    { key: 'government', icon: '🏛', label: 'Official Alerts', color: '#06b6d4' },
    { key: 'sensor', icon: '🔬', label: 'IoT Observations', color: '#8b5cf6' },
]

export default function SourceCorrelation({ event }) {
    const { reports } = useAppStore()

    const supporting = reports.filter(r =>
        r.city === event.city && r.event_type === event.event_type
    )

    const counts = {}
    supporting.forEach(r => { counts[r.source] = (counts[r.source] || 0) + 1 })
    const total = supporting.length
    const tier = getTier(event.confidence)

    return (
        <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 16 }}>
                🔗 Multi-Source Correlation
            </div>

            {SOURCES.filter(s => counts[s.key] > 0).map(src => (
                <div key={src.key} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0f172a', fontWeight: 500 }}>
                            {src.icon} {src.label}
                        </span>
                        <span style={{ fontWeight: 700, color: src.color }}>{counts[src.key]}</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(0,0,0,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', width: `${Math.min(100, (counts[src.key] / Math.max(total, 1)) * 100 * 3)}%`,
                            background: src.color, borderRadius: 999, transition: 'width 0.8s ease',
                        }} />
                    </div>
                </div>
            ))}

            <div style={{ borderTop: '1px dashed rgba(0,0,0,0.08)', marginTop: 16, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Total Sources Reporting</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a' }}>{total}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Event Confidence</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: tier.color }}>{event.confidence}%</div>
                    <div style={{ fontSize: 11, color: tier.color, fontWeight: 700 }}>{tier.label}</div>
                </div>
            </div>

            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(59,130,246,0.06)', borderRadius: 8, fontSize: 12, color: '#475569' }}>
                <strong>Unified Event:</strong> {event.event_type.replace('_', ' ')} at {event.location} — {total} independent source{total !== 1 ? 's' : ''} corroborated
            </div>
        </div>
    )
}
