import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { KPICard, PageHeader, FilterBar, CredibilityCircle, StatusBadge, EventTypeBadge, SeverityBadge } from '../components/ui'
import ReportCard from '../components/ReportCard'
import IndiaMap from '../components/IndiaMap'
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts'
import { ANALYTICS_DATA } from '../data/mockData'
import { MapPin, ArrowRight, Shield, Activity, TrendingUp, Database } from 'lucide-react'

export default function Dashboard() {
    const navigate = useNavigate()
    const { stats, events, reports, filters, setFilter, getFilteredReports, setSelectedEvent, demoMode } = useAppStore()
    const [mapEventSelected, setMapEventSelected] = useState(null)

    const filteredReports = getFilteredReports().slice(0, 12)

    // Hourly counts from actual reports for today's Indian calendar date.
    const indiaDateParts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date())
    const todayHourlyReports = Array.from({ length: 24 }, (_, hour) => {
        const count = reports.filter(report => {
            if (!report.timestamp) return false
            const date = new Date(report.timestamp)
            const reportDay = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit'
            }).format(date)
            const reportHour = Number(new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Asia/Kolkata', hour: '2-digit', hourCycle: 'h23'
            }).format(date))
            return reportDay === indiaDateParts && reportHour === hour
        }).length
        return { hour: `${String(hour).padStart(2, '0')}:00`, reports: count }
    })

    const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f97316', '#475569', '#d97706', '#10b981']

    const eventDistData = Object.entries(ANALYTICS_DATA.eventDistribution).map(([k, v], i) => ({
        name: k.replace('_', ' '), value: v, color: COLORS[i % COLORS.length]
    }))

    const handleMapEventClick = (event) => {
        setMapEventSelected(event)
        setSelectedEvent(event)
    }

    return (
        <div style={{ padding: 24, maxWidth: 1600 }}>
            <PageHeader
                title="National Weather Intelligence Dashboard"
                subtitle="Real-time multi-source weather event monitoring & verification"
                actions={
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {demoMode && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                                borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                                fontSize: 12, color: '#ef4444', fontWeight: 600,
                            }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse-live 1s infinite' }} />
                                DEMO STREAM ACTIVE
                            </div>
                        )}
                        <button
                            onClick={() => navigate('/report')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                                borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                            }}
                        >
                            + Submit Report
                        </button>
                    </div>
                }
            />

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
                <KPICard title="Total Reports" value={stats.totalReports} icon="📊" color="#3b82f6" trend={12} />
                <KPICard title="Verified" value={stats.verified} icon="✅" color="#10b981" trend={8} />
                <KPICard title="Pending Review" value={stats.pending} icon="⏳" color="#f59e0b" />
                <KPICard title="Suspicious" value={stats.suspicious} icon="⚠️" color="#ef4444" />
                <KPICard title="Active Events" value={stats.activeEvents} icon="⚡" color="#8b5cf6" />
                <KPICard title="States Monitored" value={stats.regionsMonitored} icon="🗺️" color="#06b6d4" animate={false} />
            </div>

            {/* Main grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 20 }}>
                {/* Live Map */}
                <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>India Live Weather Map</div>
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{events.length} active events plotted</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <FilterBar filters={filters} onFilterChange={setFilter} showSource={false} />
                            <button onClick={() => navigate('/map')} style={linkBtnStyle}>
                                Full Map <ArrowRight size={11} />
                            </button>
                        </div>
                    </div>
                    <div style={{ height: 420 }}>
                        <IndiaMap events={events} onEventClick={handleMapEventClick} height="420px" />
                    </div>

                    {/* Legend */}
                    <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 11, color: '#64748b' }}>
                        {[
                            { label: 'Rainfall', color: '#3b82f6', icon: '🌧' },
                            { label: 'Flood', color: '#06b6d4', icon: '🌊' },
                            { label: 'Thunderstorm', color: '#8b5cf6', icon: '⛈' },
                            { label: 'Heatwave', color: '#f97316', icon: '🌡' },
                            { label: 'Fog', color: '#475569', icon: '🌫' },
                            { label: 'Dust Storm', color: '#d97706', icon: '💨' },
                        ].map(item => (
                            <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span>{item.icon}</span> {item.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Event detail panel (right side) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Selected event */}
                    {mapEventSelected ? (
                        <div style={{ background: '#ffffff', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, padding: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <div style={{ fontWeight: 700, fontSize: 13, color: '#60a5fa' }}>Selected Event</div>
                                <button onClick={() => setMapEventSelected(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 16 }}>×</button>
                            </div>
                            <div style={{ fontSize: 22, marginBottom: 6 }}>
                                {mapEventSelected.event_type === 'rainfall' ? '🌧' : mapEventSelected.event_type === 'flood' ? '🌊' : '⛈'}
                            </div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', textTransform: 'capitalize', marginBottom: 4 }}>
                                {mapEventSelected.event_type.replace('_', ' ')}
                            </div>
                            <div style={{ fontSize: 12, color: '#475569', marginBottom: 10 }}>
                                <MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />
                                {mapEventSelected.location}
                            </div>
                            <div style={{ display: 'grid', gap: 6, fontSize: 12 }}>
                                {[
                                    ...(mapEventSelected.temperature !== undefined ? [
                                        ['Live Temperature', `${mapEventSelected.temperature}°C`],
                                        ['Precipitation', `${mapEventSelected.precipitation ?? 0} mm`],
                                        ['Wind Speed', `${mapEventSelected.wind_speed ?? 12} km/h`],
                                    ] : []),
                                    ['Reports', mapEventSelected.report_count],
                                    ['Sources', mapEventSelected.source_count],
                                    ['Severity', <SeverityBadge severity={mapEventSelected.severity} />],
                                    ['Status', <StatusBadge status={mapEventSelected.status} />],
                                ].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#64748b' }}>{k}</span>
                                        <span style={{ color: '#0f172a', fontWeight: 600 }}>{v}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#64748b' }}>Credibility</span>
                                    <span style={{ color: mapEventSelected.confidence >= 75 ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{mapEventSelected.confidence}%</span>
                                </div>
                            </div>
                            <div style={{ marginTop: 12, height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 2 }}>
                                <div style={{ width: `${mapEventSelected.confidence}%`, height: '100%', borderRadius: 2, background: mapEventSelected.confidence >= 75 ? '#10b981' : '#f59e0b' }} />
                            </div>
                            <button
                                onClick={() => navigate(`/events/${mapEventSelected.id}`)}
                                style={{ ...linkBtnStyle, marginTop: 12, width: '100%', justifyContent: 'center' }}
                            >
                                View Full Event <ArrowRight size={11} />
                            </button>
                        </div>
                    ) : (
                        <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 16 }}>
                            <div style={{ fontWeight: 600, fontSize: 13, color: '#475569', marginBottom: 8 }}>Click a map marker</div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>Select any weather event on the map to view detailed information, credibility score, and supporting evidence.</div>
                            <div style={{ marginTop: 12, fontSize: 11, color: '#94a3b8' }}>
                                → {events.length} events active across India
                            </div>
                        </div>
                    )}

                    {/* Event distribution donut */}
                    <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 16, flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 12 }}>Event Distribution</div>
                        <ResponsiveContainer width="100%" height={160}>
                            <PieChart>
                                <Pie data={eventDistData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70}>
                                    {eventDistData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, color: '#0f172a', fontSize: 12 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', fontSize: 11, marginTop: 4 }}>
                            {eventDistData.map(item => (
                                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                                    <span style={{ color: '#475569', textTransform: 'capitalize' }}>{item.name}</span>
                                    <span style={{ color: '#0f172a', marginLeft: 'auto', fontWeight: 600 }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom section: Live feeds + mini analytics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Live Report Stream */}
                <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                                Live Report Stream
                                {demoMode && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse-live 1s infinite' }} />}
                            </div>
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Showing latest {filteredReports.length} reports</div>
                        </div>
                        <button onClick={() => navigate('/reports')} style={linkBtnStyle}>View All <ArrowRight size={11} /></button>
                    </div>
                    <div style={{ height: 420, overflowY: 'auto', padding: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {filteredReports.map(report => (
                                <ReportCard key={report.id} report={report} compact />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top events table + hourly chart */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Hourly report activity */}
                    <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 16 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 12 }}>Reports Today (Hourly)</div>
                        <ResponsiveContainer width="100%" height={120}>
                            <LineChart data={todayHourlyReports}>
                                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, color: '#0f172a', fontSize: 11 }}
                                />
                                <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#64748b', marginTop: 4 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 20, height: 2, background: '#3b82f6' }} /> Reports</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 20, height: 2, background: '#10b981' }} /> Verified</span>
                        </div>
                    </div>

                    {/* Top active events */}
                    <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, overflow: 'hidden', flex: 1 }}>
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>Top Active Events</div>
                            <button onClick={() => navigate('/events')} style={linkBtnStyle}>View All <ArrowRight size={11} /></button>
                        </div>
                        <div style={{ padding: '8px 16px', overflowY: 'auto', maxHeight: 260 }}>
                            {events.slice(0, 8).map((event, i) => (
                                <div key={event.id}
                                    onClick={() => navigate(`/events/${event.id}`)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 12, paddingBlock: 10,
                                        borderBottom: '1px solid rgba(0,0,0,0.04)', cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ fontSize: 22, flexShrink: 0 }}>
                                        {event.event_type === 'rainfall' ? '🌧' : event.event_type === 'flood' ? '🌊' : event.event_type === 'thunderstorm' ? '⛈' : '🌡'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>
                                            {event.event_type.replace('_', ' ')} — {event.city}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#64748b' }}>
                                            {event.report_count} reports · {event.source_count} sources
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: event.confidence >= 75 ? '#10b981' : '#f59e0b' }}>
                                            {event.confidence}%
                                        </div>
                                        <StatusBadge status={event.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Verification AI callout */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.05))',
                        border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: 16,
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#60a5fa', marginBottom: 4 }}>
                            🤖 AI Credibility Engine
                        </div>
                        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
                            The system estimates report credibility using <strong style={{ color: '#0f172a' }}>spatial, temporal, meteorological
                                and multi-source evidence</strong>. It does not claim absolute truth.
                        </div>
                        <button onClick={() => navigate('/verification')} style={{ ...linkBtnStyle, marginTop: 10 }}>
                            View Credibility Engine <ArrowRight size={11} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const linkBtnStyle = {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(59,130,246,0.3)',
    background: 'rgba(59,130,246,0.1)', color: '#60a5fa',
    fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
    textDecoration: 'none', transition: 'background 0.2s',
}
