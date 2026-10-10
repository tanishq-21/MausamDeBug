import { useAppStore } from '../store/appStore'
import { PageHeader, StatusBadge, CredibilityBadge, EventTypeBadge } from '../components/ui'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Eye, Flag, AlertTriangle, Shield } from 'lucide-react'

export default function AdminPanel() {
    const navigate = useNavigate()
    const { reports, stats, events, verifyReport, rejectReport, markSuspicious } = useAppStore()

    const pending = reports.filter(r => r.verification_status === 'pending').slice(0, 20)
    const suspicious = reports.filter(r => r.verification_status === 'suspicious').slice(0, 10)
    const duplicates = reports.filter(r => r.duplicate_group).slice(0, 10)

    return (
        <div style={{ padding: 24, maxWidth: 1400 }}>
            <PageHeader
                title="Admin Verification Panel"
                subtitle="Review, verify, and manage incoming weather reports"
                actions={
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Logged in as: <strong style={{ color: '#0f172a' }}>Admin</strong></div>
                        <div style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', fontSize: 11, color: '#60a5fa', fontWeight: 600 }}>
                            🛡 ADMIN ACCESS
                        </div>
                    </div>
                }
            />

            {/* Admin KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                    { label: 'Pending Verification', value: stats.pending, color: '#f59e0b', icon: '⏳' },
                    { label: 'Suspicious Reports', value: stats.suspicious, color: '#ef4444', icon: '⚠️' },
                    { label: 'Duplicate Groups', value: duplicates.length, color: '#8b5cf6', icon: '🔗' },
                    { label: 'Active Events', value: stats.activeEvents, color: '#3b82f6', icon: '⚡' },
                ].map(kpi => (
                    <div key={kpi.label} style={{ background: '#ffffff', border: `1px solid ${kpi.color}33`, borderRadius: 12, padding: '16px 20px' }}>
                        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div>
                        <div style={{ fontSize: 32, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                    </div>
                ))}
            </div>

            {/* Pending reports table */}
            <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, marginBottom: 20, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AlertTriangle size={16} color="#f59e0b" />
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Pending Reports ({pending.length})</div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(0,0,0,0.03)' }}>
                                {['ID', 'Event', 'Location', 'Source', 'Credibility', 'Time', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {pending.map(r => (
                                <tr key={r.id}
                                    style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '10px 16px', fontSize: 11, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{r.id.split('-').pop()}</td>
                                    <td style={{ padding: '10px 16px' }}><EventTypeBadge eventType={r.event_type} /></td>
                                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#1e293b', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.location}</td>
                                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#475569' }}>{r.source_label}</td>
                                    <td style={{ padding: '10px 16px' }}><CredibilityBadge score={r.credibility_score} /></td>
                                    <td style={{ padding: '10px 16px', fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>{r.minutes_ago}m ago</td>
                                    <td style={{ padding: '10px 16px' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button onClick={() => navigate(`/reports/${r.id}`)} title="View" style={tblBtn('#3b82f6')}>
                                                <Eye size={12} />
                                            </button>
                                            <button onClick={() => verifyReport(r.id)} title="Verify" style={tblBtn('#10b981')}>
                                                <CheckCircle size={12} />
                                            </button>
                                            <button onClick={() => rejectReport(r.id)} title="Reject" style={tblBtn('#ef4444')}>
                                                <XCircle size={12} />
                                            </button>
                                            <button onClick={() => markSuspicious(r.id)} title="Flag" style={tblBtn('#f59e0b')}>
                                                <Flag size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Suspicious reports */}
            <div style={{ background: '#ffffff', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Shield size={16} color="#ef4444" />
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>Suspicious Reports ({suspicious.length})</div>
                    <div style={{ marginLeft: 'auto', fontSize: 12, color: '#ef4444' }}>Require manual review</div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(239,68,68,0.03)' }}>
                                {['ID', 'Event', 'Location', 'Credibility', 'Reason', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {suspicious.map(r => (
                                <tr key={r.id} style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                                    <td style={{ padding: '10px 16px', fontSize: 11, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{r.id.split('-').pop()}</td>
                                    <td style={{ padding: '10px 16px' }}><EventTypeBadge eventType={r.event_type} /></td>
                                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#1e293b' }}>{r.location}</td>
                                    <td style={{ padding: '10px 16px' }}><CredibilityBadge score={r.credibility_score} /></td>
                                    <td style={{ padding: '10px 16px', fontSize: 11, color: '#ef4444' }}>
                                        {r.credibility_score < 45 ? 'Low credibility score' : 'Unverified source'}
                                    </td>
                                    <td style={{ padding: '10px 16px' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button onClick={() => navigate(`/reports/${r.id}`)} style={tblBtn('#3b82f6')}><Eye size={12} /></button>
                                            <button onClick={() => verifyReport(r.id)} style={tblBtn('#10b981')}><CheckCircle size={12} /></button>
                                            <button onClick={() => rejectReport(r.id)} style={tblBtn('#ef4444')}><XCircle size={12} /></button>
                                        </div>
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

const tblBtn = (color) => ({ width: 26, height: 26, borderRadius: 6, border: `1px solid ${color}33`, background: `${color}15`, color, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0 })
