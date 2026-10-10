import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { PageHeader, FilterBar, EventTypeBadge, StatusBadge, SeverityBadge } from '../components/ui'
import { MapPin, ArrowRight } from 'lucide-react'

export default function Events() {
    const navigate = useNavigate()
    const { events, filters, setFilter } = useAppStore()
    const [search, setSearch] = useState('')

    const filtered = events.filter(ev => {
        if (filters.eventType !== 'all' && ev.event_type !== filters.eventType) return false
        if (search && !ev.location.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const EVENT_ICONS = { rainfall: '🌧', flood: '🌊', thunderstorm: '⛈', heatwave: '🌡', fog: '🌫', dust_storm: '💨', strong_wind: '🌬', hailstorm: '🌨', landslide: '⛰', cyclone: '🌀' }

    return (
        <div style={{ padding: 24, maxWidth: 1400 }}>
            <PageHeader title="Weather Events" subtitle={`${filtered.length} correlated events across India`} />

            <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by location..."
                    style={{ padding: '7px 12px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, color: '#0f172a', fontSize: 12, outline: 'none', fontFamily: 'Inter, sans-serif', width: 200 }}
                />
                <FilterBar filters={filters} onFilterChange={setFilter} showStatus={false} showSource={false} />
            </div>

            {/* Summary stat */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                    { label: 'Total Events', value: events.length, color: '#3b82f6' },
                    { label: 'Verified', value: events.filter(e => e.status === 'verified').length, color: '#10b981' },
                    { label: 'Active', value: events.filter(e => e.status === 'active').length, color: '#f59e0b' },
                    { label: 'Avg Reports/Event', value: Math.floor(events.reduce((s, e) => s + e.report_count, 0) / events.length), color: '#8b5cf6' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#ffffff', border: `1px solid ${s.color}33`, borderRadius: 10, padding: '12px 16px' }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Event cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                {filtered.map(event => (
                    <div key={event.id}
                        onClick={() => navigate(`/events/${event.id}`)}
                        style={{
                            background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
                            borderRadius: 12, padding: 16, cursor: 'pointer',
                            transition: 'border-color 0.2s, transform 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 24 }}>{EVENT_ICONS[event.event_type] || '🌧'}</span>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', textTransform: 'capitalize' }}>
                                        {event.event_type.replace('_', ' ')}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{event.id}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 4, flexDirection: 'column', alignItems: 'flex-end' }}>
                                <SeverityBadge severity={event.severity} />
                                <StatusBadge status={event.status} />
                            </div>
                        </div>

                        <div style={{ fontSize: 12, color: '#475569', marginBottom: 10 }}>
                            <MapPin size={11} style={{ display: 'inline', marginRight: 3 }} />{event.location}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                            {[
                                { label: 'Reports', value: event.report_count, color: '#3b82f6' },
                                { label: 'Sources', value: event.source_count, color: '#10b981' },
                                { label: 'Credibility', value: `${event.confidence}%`, color: event.confidence >= 75 ? '#10b981' : '#f59e0b' },
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: 'center', padding: '6px', background: 'rgba(0,0,0,0.04)', borderRadius: 6 }}>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
                                    <div style={{ fontSize: 10, color: '#64748b' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Credibility bar */}
                        <div style={{ height: 3, background: 'rgba(0,0,0,0.06)', borderRadius: 2 }}>
                            <div style={{ width: `${event.confidence}%`, height: '100%', borderRadius: 2, background: event.confidence >= 75 ? '#10b981' : '#f59e0b', transition: 'width 0.5s' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>
                                {event.report_count} reports → 1 unified event
                            </div>
                            <ArrowRight size={14} color="#64748b" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
