import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { StatusBadge, SeverityBadge, CredibilityBadge, EventTypeBadge } from './ui'
import { MapPin, Eye, CheckCircle, XCircle, Copy, ExternalLink, Clock } from 'lucide-react'

export default function ReportCard({ report, showActions = true, compact = false }) {
    const navigate = useNavigate()
    const { verifyReport, rejectReport, markSuspicious } = useAppStore()

    const mins = report.minutes_ago
    const timeLabel = mins === 0 ? 'just now' : mins < 60
        ? `${mins} min ago`
        : `${Math.floor(mins / 60)}h ${mins % 60}m ago`

    return (
        <div style={{
            background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 12, padding: compact ? '12px 14px' : '16px',
            transition: 'border-color 0.2s, transform 0.2s',
            cursor: 'pointer',
        }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'
                e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
            }}
        >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <EventTypeBadge eventType={report.event_type} />
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <SeverityBadge severity={report.severity} />
                    <StatusBadge status={report.verification_status} />
                </div>
            </div>

            {/* Text */}
            <p style={{
                color: '#1e293b', fontSize: 13, lineHeight: 1.5,
                margin: '8px 0', fontStyle: 'italic',
                display: '-webkit-box', WebkitLineClamp: compact ? 1 : 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
                "{report.text}"
            </p>

            {/* Meta */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8, fontSize: 11, color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={11} /> {report.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {timeLabel}
                </span>
                <span>📡 {report.source_label}</span>
            </div>

            {/* Credibility */}
            {!compact && (
                <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Credibility:</div>
                        <CredibilityBadge score={report.credibility_score} />
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>
                        {report.id}
                    </div>
                </div>
            )}

            {/* Credibility bar */}
            {!compact && (
                <div style={{ marginTop: 8, height: 3, background: 'rgba(0,0,0,0.06)', borderRadius: 2 }}>
                    <div style={{
                        width: `${report.credibility_score}%`, height: '100%', borderRadius: 2,
                        background: report.credibility_score >= 75 ? '#10b981' : report.credibility_score >= 40 ? '#f59e0b' : '#ef4444',
                        transition: 'width 0.5s ease',
                    }} />
                </div>
            )}

            {/* Actions */}
            {showActions && !compact && (
                <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate(`/reports/${report.id}`)}
                        style={btnStyle('#3b82f6')}
                    >
                        <Eye size={11} /> View
                    </button>
                    <button
                        onClick={() => verifyReport(report.id)}
                        disabled={report.verification_status === 'verified'}
                        style={btnStyle('#10b981', report.verification_status === 'verified')}
                    >
                        <CheckCircle size={11} /> Verify
                    </button>
                    <button
                        onClick={() => rejectReport(report.id)}
                        style={btnStyle('#ef4444')}
                    >
                        <XCircle size={11} /> Reject
                    </button>
                    <button
                        onClick={() => markSuspicious(report.id)}
                        style={btnStyle('#f59e0b')}
                    >
                        <Copy size={11} /> Duplicate?
                    </button>
                </div>
            )}
        </div>
    )
}

function btnStyle(color, disabled = false) {
    return {
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '4px 10px', borderRadius: 6, border: `1px solid ${color}44`,
        background: `${color}15`, color: disabled ? '#94a3b8' : color,
        fontSize: 11, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
        opacity: disabled ? 0.5 : 1,
    }
}
