/**
 * EventTimeline — chronological sequence inside event details.
 */
import { useAppStore } from '../store/appStore'

const EVENT_STEPS = [
    { key: 'first_report', icon: '📍', label: 'First citizen report' },
    { key: 'more_reports', icon: '👥', label: 'Additional reports aggregated' },
    { key: 'news_article', icon: '📰', label: 'First news article' },
    { key: 'weather_verify', icon: '📡', label: 'Weather API confirmation' },
    { key: 'ai_correlate', icon: '🧠', label: 'AI correlation complete' },
    { key: 'high_confidence', icon: '✅', label: 'High-confidence event created' },
]

function addMinutes(base, mins) {
    return new Date(new Date(base).getTime() + mins * 60000)
}

export default function EventTimeline({ event }) {
    const { reports } = useAppStore()

    const supporting = reports
        .filter(r => r.city === event.city && r.event_type === event.event_type)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    const base = supporting[0]?.timestamp || event.start_time

    const timeline = [
        { ...EVENT_STEPS[0], time: base },
        { ...EVENT_STEPS[1], time: addMinutes(base, 4).toISOString() },
        { ...EVENT_STEPS[2], time: addMinutes(base, 8).toISOString() },
        { ...EVENT_STEPS[3], time: addMinutes(base, 11).toISOString() },
        { ...EVENT_STEPS[4], time: addMinutes(base, 14).toISOString() },
        { ...EVENT_STEPS[5], time: addMinutes(base, 17).toISOString() },
    ]

    function fmtTime(iso) {
        try {
            return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        } catch { return '—' }
    }

    return (
        <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 20 }}>⏱ Event Timeline</div>

            <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: 'rgba(59,130,246,0.15)', borderRadius: 999 }} />

                {timeline.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, position: 'relative' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                            background: i === timeline.length - 1 ? '#3b82f6' : '#f1f5f9',
                            border: `2px solid ${i === timeline.length - 1 ? '#3b82f6' : 'rgba(0,0,0,0.08)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                        }}>
                            {step.icon}
                        </div>
                        <div style={{ paddingTop: 8 }}>
                            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2, display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, color: '#0f172a' }}>{fmtTime(step.time)}</span>
                            </div>
                            <div style={{ fontSize: 13, color: '#475569', fontWeight: i === timeline.length - 1 ? 600 : 400 }}>
                                {step.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
