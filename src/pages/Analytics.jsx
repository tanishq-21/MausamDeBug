import { useAppStore } from '../store/appStore'
import { PageHeader } from '../components/ui'
import {
    BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { ANALYTICS_DATA, MOCK_REPORTS } from '../data/mockData'

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f97316', '#475569', '#d97706', '#10b981', '#ef4444']

const stateData = Object.entries(ANALYTICS_DATA.stateReports)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([state, count]) => ({ state, count }))

const eventDistData = Object.entries(ANALYTICS_DATA.eventDistribution).map(([k, v], i) => ({
    name: k.replace('_', ' '), value: v, color: COLORS[i % COLORS.length]
}))

const verificationData = [
    { name: 'Verified', value: 8932, color: '#10b981' },
    { name: 'Pending', value: 1204, color: '#f59e0b' },
    { name: 'Suspicious', value: 247, color: '#ef4444' },
    { name: 'Rejected', value: 75, color: '#94a3b8' },
]

const TOOLTIP_STYLE = { background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, color: '#0f172a', fontSize: 12 }

export default function Analytics() {
    const { stats } = useAppStore()

    return (
        <div style={{ padding: 24, maxWidth: 1400 }}>
            <PageHeader
                title="Weather Analytics"
                subtitle="Data-driven insights from multi-source weather intelligence"
            />

            {/* Top 3 charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
                {/* Line chart: reports over time */}
                <div style={card}>
                    <div style={cardTitle}>Reports Over Time (Today - Hourly)</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={ANALYTICS_DATA.reportsOverTime}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#94a3b8' }} interval={3} />
                            <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                            <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} dot={false} name="Total Reports" />
                            <Line type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={2} dot={false} name="Verified" />
                        </LineChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', gap: 14, fontSize: 11, color: '#64748b', marginTop: 6 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 16, height: 2, background: '#3b82f6' }} />Total Reports</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 16, height: 2, background: '#10b981' }} />Verified</span>
                    </div>
                </div>

                {/* Event distribution */}
                <div style={card}>
                    <div style={cardTitle}>Event Types</div>
                    <ResponsiveContainer width="100%" height={170}>
                        <PieChart>
                            <Pie data={eventDistData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={72}>
                                {eventDistData.map((e, i) => <Cell key={i} fill={e.color} />)}
                            </Pie>
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 8px', fontSize: 10, marginTop: 6 }}>
                        {eventDistData.map(e => (
                            <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 6, height: 6, borderRadius: 2, background: e.color, flexShrink: 0 }} />
                                <span style={{ color: '#475569', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Verification status */}
                <div style={card}>
                    <div style={cardTitle}>Verification Status</div>
                    <ResponsiveContainer width="100%" height={170}>
                        <PieChart>
                            <Pie data={verificationData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={72}>
                                {verificationData.map((e, i) => <Cell key={i} fill={e.color} />)}
                            </Pie>
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', fontSize: 10, marginTop: 6 }}>
                        {verificationData.map(e => (
                            <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.color }} />
                                <span style={{ color: '#475569' }}>{e.name}</span>
                                <span style={{ color: '#0f172a', fontWeight: 600, marginLeft: 'auto' }}>{e.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* State bar chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={card}>
                    <div style={cardTitle}>Top States by Reports</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={stateData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                            <XAxis type="number" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                            <YAxis type="category" dataKey="state" tick={{ fontSize: 10, fill: '#475569' }} width={90} />
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Reports" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Source distribution */}
                <div style={card}>
                    <div style={cardTitle}>Source Distribution & Reliability</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={ANALYTICS_DATA.sourceDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                            <XAxis dataKey="source" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                            <YAxis yAxisId="left" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: '#94a3b8' }} domain={[0, 100]} />
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                            <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Reports" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="reliability" fill="#10b981" name="Reliability %" radius={[4, 4, 0, 0]} opacity={0.7} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Credibility histogram + hotspot table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={card}>
                    <div style={cardTitle}>Credibility Score Distribution</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={ANALYTICS_DATA.credibilityDist}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                            <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                            <Bar dataKey="count" name="Reports" radius={[4, 4, 0, 0]}>
                                {ANALYTICS_DATA.credibilityDist.map((entry, i) => (
                                    <Cell key={i} fill={i >= 4 ? '#10b981' : i >= 2 ? '#f59e0b' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Hotspot table */}
                <div style={card}>
                    <div style={cardTitle}>Disaster Hotspot Analysis</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr>
                                {['Rank', 'Location', 'Reports', 'Events', 'Risk'].map(h => (
                                    <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 11, color: '#64748b', fontWeight: 600 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { rank: 1, loc: 'Dehradun', state: 'Uttarakhand', count: 320, events: 8, risk: 'HIGH' },
                                { rank: 2, loc: 'Delhi', state: 'Delhi', count: 290, events: 7, risk: 'HIGH' },
                                { rank: 3, loc: 'Mumbai', state: 'Maharashtra', count: 270, events: 6, risk: 'HIGH' },
                                { rank: 4, loc: 'Guwahati', state: 'Assam', count: 245, events: 5, risk: 'SEVERE' },
                                { rank: 5, loc: 'Chennai', state: 'Tamil Nadu', count: 220, events: 4, risk: 'MODERATE' },
                                { rank: 6, loc: 'Patna', state: 'Bihar', count: 198, events: 4, risk: 'MODERATE' },
                                { rank: 7, loc: 'Kolkata', state: 'West Bengal', count: 180, events: 3, risk: 'MODERATE' },
                            ].map(row => (
                                <tr key={row.rank} style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                                    <td style={{ padding: '8px 10px', color: '#64748b' }}>#{row.rank}</td>
                                    <td style={{ padding: '8px 10px' }}>
                                        <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 600 }}>{row.loc}</div>
                                        <div style={{ fontSize: 10, color: '#64748b' }}>{row.state}</div>
                                    </td>
                                    <td style={{ padding: '8px 10px', fontWeight: 700, color: '#3b82f6' }}>{row.count}</td>
                                    <td style={{ padding: '8px 10px', color: '#0f172a' }}>{row.events}</td>
                                    <td style={{ padding: '8px 10px' }}>
                                        <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: row.risk === 'SEVERE' ? 'rgba(239,68,68,0.15)' : row.risk === 'HIGH' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)', color: row.risk === 'SEVERE' ? '#ef4444' : row.risk === 'HIGH' ? '#f59e0b' : '#3b82f6' }}>{row.risk}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const card = { background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 16 }
const cardTitle = { fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 14 }
