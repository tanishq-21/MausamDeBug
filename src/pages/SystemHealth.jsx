import { PageHeader } from '../components/ui'
import { SYSTEM_HEALTH, INGESTION_RATES } from '../data/mockData'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function SystemHealth() {
    const healthItems = [
        { label: 'API Gateway', ...SYSTEM_HEALTH.api },
        { label: 'PostgreSQL Database', ...SYSTEM_HEALTH.database },
        { label: 'AI/ML Engine', ...SYSTEM_HEALTH.ai_engine },
        { label: 'Weather API', ...SYSTEM_HEALTH.weather_api },
        { label: 'WebSocket Server', ...SYSTEM_HEALTH.websocket },
        { label: 'Data Ingestion', ...SYSTEM_HEALTH.ingestion },
    ]

    return (
        <div style={{ padding: 24, maxWidth: 1200 }}>
            <PageHeader title="System Health" subtitle="Real-time platform status and performance metrics" />

            {/* Service status grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
                {healthItems.map(item => (
                    <div key={item.label} style={{ background: '#ffffff', border: `1px solid ${item.status === 'healthy' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 12, padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{item.label}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 8px', borderRadius: 999, background: item.status === 'healthy' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.status === 'healthy' ? '#10b981' : '#ef4444', animation: 'pulse-live 2s infinite' }} />
                                <span style={{ fontSize: 11, fontWeight: 600, color: item.status === 'healthy' ? '#10b981' : '#ef4444' }}>{item.status.toUpperCase()}</span>
                            </div>
                        </div>
                        {item.latency && <div style={{ fontSize: 12, color: '#64748b' }}>Latency: <strong style={{ color: '#0f172a' }}>{item.latency}ms</strong></div>}
                        {item.records && <div style={{ fontSize: 12, color: '#64748b' }}>Records: <strong style={{ color: '#0f172a' }}>{item.records.toLocaleString()}</strong></div>}
                        {item.connections && <div style={{ fontSize: 12, color: '#64748b' }}>Connections: <strong style={{ color: '#0f172a' }}>{item.connections}</strong></div>}
                        {item.rate && <div style={{ fontSize: 12, color: '#64748b' }}>Rate: <strong style={{ color: '#0f172a' }}>{item.rate}/min</strong></div>}
                    </div>
                ))}
            </div>

            {/* Ingestion rates chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={card}>
                    <div style={title}>Data Ingestion Rates (per minute)</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={INGESTION_RATES} layout="vertical">
                            <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <YAxis type="category" dataKey="source" tick={{ fontSize: 11, fill: '#475569' }} width={110} />
                            <Tooltip contentStyle={{ background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, color: '#0f172a', fontSize: 12 }} />
                            <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                                {INGESTION_RATES.map((r, i) => (
                                    <rect key={i} fill={r.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Performance metrics */}
                <div style={card}>
                    <div style={title}>Performance Metrics</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
                        {[
                            { label: 'Avg Processing Time', value: '218ms', color: '#10b981', max: 1000, current: 218 },
                            { label: 'API Throughput', value: '1,995 req/min', color: '#3b82f6', max: 3000, current: 1995 },
                            { label: 'WebSocket Connections', value: '7 active', color: '#8b5cf6', max: 100, current: 7 },
                            { label: 'AI Model Accuracy', value: '91.4%', color: '#f59e0b', max: 100, current: 91 },
                            { label: 'Data Quality Score', value: '91.4%', color: '#06b6d4', max: 100, current: 91 },
                        ].map(m => (
                            <div key={m.label}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                                    <span style={{ color: '#475569' }}>{m.label}</span>
                                    <span style={{ color: '#0f172a', fontWeight: 700 }}>{m.value}</span>
                                </div>
                                <div style={{ height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 2 }}>
                                    <div style={{ width: `${(m.current / m.max) * 100}%`, height: '100%', borderRadius: 2, background: m.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pipeline viz */}
            <div style={card}>
                <div style={title}>Data Processing Pipeline</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBlock: 8 }}>
                    {[
                        { label: 'Data Sources', icon: '📡', color: '#3b82f6', rate: '1,995/min' },
                        { label: 'Ingestion Layer', icon: '⬇', color: '#06b6d4', rate: 'stream' },
                        { label: 'NLP / CV', icon: '🤖', color: '#8b5cf6', rate: '218ms' },
                        { label: 'Deduplication', icon: '🔗', color: '#f59e0b', rate: 'cosine sim' },
                        { label: 'Verification', icon: '✅', color: '#10b981', rate: 'multi-source' },
                        { label: 'Event Correlation', icon: '⚡', color: '#f97316', rate: 'geo+time' },
                        { label: 'PostgreSQL+PostGIS', icon: '🗄', color: '#475569', rate: '12,458 rows' },
                        { label: 'React Dashboard', icon: '📊', color: '#3b82f6', rate: 'real-time' },
                    ].map((s, i, arr) => (
                        <div key={s.label} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 12px', background: `${s.color}15`, border: `1px solid ${s.color}33`, borderRadius: 10, minWidth: 110 }}>
                                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', textAlign: 'center' }}>{s.label}</div>
                                <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{s.rate}</div>
                            </div>
                            {i < arr.length - 1 && (
                                <div style={{ display: 'flex', alignItems: 'center', paddingInline: 6 }}>
                                    <div style={{ width: 20, height: 1, background: 'rgba(0,0,0,0.1)' }} />
                                    <div style={{ color: '#94a3b8', fontSize: 12 }}>›</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const card = { background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 16 }
const title = { fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 12 }
