import { useEffect, useRef, useState } from 'react'

export function AnimatedCounter({ target, duration = 1500, prefix = '', suffix = '' }) {
    const [count, setCount] = useState(0)
    const startRef = useRef(Date.now())

    useEffect(() => {
        startRef.current = Date.now()
        const timer = setInterval(() => {
            const elapsed = Date.now() - startRef.current
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress >= 1) {
                setCount(target)
                clearInterval(timer)
            }
        }, 16)
        return () => clearInterval(timer)
    }, [target, duration])

    return <span>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>
}

export function KPICard({ title, value, sub, icon, color = '#3b82f6', trend, animate = true }) {
    return (
        <div style={{
            background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 12, padding: '16px 20px',
            borderTop: `3px solid ${color}`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default',
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 8px 30px ${color}22`
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                        {title}
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                        {animate ? <AnimatedCounter target={typeof value === 'number' ? value : parseInt(value.toString().replace(/,/g, '')) || 0} /> : value}
                    </div>
                    {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>{sub}</div>}
                    {trend && (
                        <div style={{ fontSize: 11, color: trend > 0 ? '#10b981' : '#ef4444', marginTop: 4 }}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from yesterday
                        </div>
                    )}
                </div>
                <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                }}>
                    {icon}
                </div>
            </div>
        </div>
    )
}

export function StatusBadge({ status }) {
    const config = {
        verified: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'Verified' },
        pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Pending' },
        suspicious: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'Suspicious' },
        rejected: { color: '#64748b', bg: 'rgba(107,114,128,0.15)', label: 'Rejected' },
        active: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', label: 'Active' },
        monitoring: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Monitoring' },
    }
    const c = config[status] || config.pending
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 999,
            background: c.bg, color: c.color, fontSize: 11, fontWeight: 600,
        }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.color }} />
            {c.label}
        </span>
    )
}

export function SeverityBadge({ severity }) {
    const config = {
        LOW: { color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
        MODERATE: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
        HIGH: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
        SEVERE: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
        EXTREME: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
    }
    const c = config[severity] || config.MODERATE
    return (
        <span style={{
            display: 'inline-flex', padding: '2px 8px', borderRadius: 4,
            background: c.bg, color: c.color, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.05em',
        }}>
            {severity}
        </span>
    )
}

export function CredibilityBadge({ score }) {
    const color = score >= 75 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
    const label = score >= 75 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW'
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 999,
            background: `${color}22`, color, fontSize: 11, fontWeight: 600,
        }}>
            {score}% {label}
        </span>
    )
}

export function EventTypeBadge({ eventType }) {
    const icons = {
        rainfall: '🌧', flood: '🌊', thunderstorm: '⛈', heatwave: '🌡',
        fog: '🌫', dust_storm: '💨', strong_wind: '🌬', hailstorm: '🌨',
        landslide: '⛰', cyclone: '🌀',
    }
    const colors = {
        rainfall: '#3b82f6', flood: '#06b6d4', thunderstorm: '#8b5cf6', heatwave: '#f97316',
        fog: '#475569', dust_storm: '#d97706', strong_wind: '#10b981', hailstorm: '#60a5fa',
        landslide: '#a16207', cyclone: '#ef4444',
    }
    const labels = {
        rainfall: 'Rainfall', flood: 'Flood', thunderstorm: 'Thunderstorm', heatwave: 'Heatwave',
        fog: 'Dense Fog', dust_storm: 'Dust Storm', strong_wind: 'Strong Wind', hailstorm: 'Hailstorm',
        landslide: 'Landslide', cyclone: 'Cyclone',
    }
    const color = colors[eventType] || '#475569'
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '2px 8px', borderRadius: 999,
            background: `${color}22`, color, fontSize: 12, fontWeight: 600,
        }}>
            {icons[eventType]} {labels[eventType] || eventType}
        </span>
    )
}

export function SkeletonLoader({ height = 60, borderRadius = 8 }) {
    return (
        <div style={{
            height, borderRadius, width: '100%',
            background: 'rgba(0,0,0,0.05)',
            animation: 'shimmer 1.5s infinite',
            backgroundSize: '200% 100%',
            backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.03) 75%)',
        }} />
    )
}

export function PageHeader({ title, subtitle, actions }) {
    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}>
            <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>{title}</h1>
                {subtitle && <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{subtitle}</p>}
            </div>
            {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
        </div>
    )
}

export function FilterBar({ filters, onFilterChange, showEventType = true, showStatus = true, showSource = true }) {
    const eventTypes = [
        { value: 'all', label: 'All Events' },
        { value: 'rainfall', label: '🌧 Rainfall' },
        { value: 'flood', label: '🌊 Flood' },
        { value: 'thunderstorm', label: '⛈ Thunderstorm' },
        { value: 'heatwave', label: '🌡 Heatwave' },
        { value: 'fog', label: '🌫 Fog' },
        { value: 'dust_storm', label: '💨 Dust Storm' },
        { value: 'strong_wind', label: '🌬 Strong Wind' },
    ]
    const statuses = [
        { value: 'all', label: 'All Status' },
        { value: 'verified', label: '✓ Verified' },
        { value: 'pending', label: '⏳ Pending' },
        { value: 'suspicious', label: '⚠ Suspicious' },
        { value: 'rejected', label: '✗ Rejected' },
    ]
    const sources = [
        { value: 'all', label: 'All Sources' },
        { value: 'citizen', label: 'Citizen' },
        { value: 'social', label: 'Social Media' },
        { value: 'weather_api', label: 'Weather API' },
        { value: 'news', label: 'News' },
        { value: 'government', label: 'Government' },
        { value: 'sensor', label: 'IoT Sensor' },
    ]

    const selectStyle = {
        background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 8, color: '#0f172a', padding: '6px 10px', fontSize: 12,
        cursor: 'pointer', fontFamily: 'Inter, sans-serif', outline: 'none',
    }

    return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {showEventType && (
                <select style={selectStyle} value={filters.eventType} onChange={e => onFilterChange('eventType', e.target.value)}>
                    {eventTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            )}
            {showStatus && (
                <select style={selectStyle} value={filters.status} onChange={e => onFilterChange('status', e.target.value)}>
                    {statuses.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            )}
            {showSource && (
                <select style={selectStyle} value={filters.source} onChange={e => onFilterChange('source', e.target.value)}>
                    {sources.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            )}
        </div>
    )
}

export function CredibilityCircle({ score, size = 120 }) {
    const color = score >= 75 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
    const label = score >= 75 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW'
    const r = 45
    const circ = 2 * Math.PI * r
    const dash = (score / 100) * circ
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={8} />
                    <circle
                        cx={size / 2} cy={size / 2} r={r} fill="none"
                        stroke={color} strokeWidth={8}
                        strokeDasharray={`${dash} ${circ}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                </svg>
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{score}</div>
                    <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>/ 100</div>
                </div>
            </div>
            <span style={{
                padding: '3px 12px', borderRadius: 999,
                background: `${color}22`, color, fontSize: 11, fontWeight: 700,
            }}>{label} CREDIBILITY</span>
        </div>
    )
}
