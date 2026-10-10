import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import {
    Search, Bell, Play, Square, RefreshCw,
    AlertTriangle, CheckCircle, Info, User, Shield, MapPin, Clock
} from 'lucide-react'


export default function Navbar() {
    const navigate = useNavigate()
    const {
        wsConnected, demoMode, setDemoMode, notifications,
        markNotificationRead, stats, role, userLocation, userWeather
    } = useAppStore()
    const [searchVal, setSearchVal] = useState('')
    const [showNotif, setShowNotif] = useState(false)
    const [lastUpdated, setLastUpdated] = useState('12 seconds ago')
    const [currentTime, setCurrentTime] = useState(() => new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length

    const notifIcon = (type) => {
        if (type === 'critical') return <AlertTriangle size={13} color="#ef4444" />
        if (type === 'warning') return <AlertTriangle size={13} color="#f59e0b" />
        if (type === 'success') return <CheckCircle size={13} color="#10b981" />
        return <Info size={13} color="#3b82f6" />
    }

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchVal.trim()) {
            navigate(`/reports?search=${encodeURIComponent(searchVal)}`)
        }
    }

    return (
        <header style={{
            height: 56, background: '#f1f5f9', borderBottom: '1px solid rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', paddingInline: 20, gap: 16, flexShrink: 0, zIndex: 99
        }}>
            {/* Brand + role */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 140 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: '#fff', fontSize: 10, fontWeight: 'bold' }}>☁️/&gt;</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>MausamDeBug</span>
                    <span style={{ fontSize: 9, color: '#94a3b8', letterSpacing: '0.05em' }}>WEATHER INTELLIGENCE</span>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px',
                    borderRadius: 20, fontSize: 10, fontWeight: 700,
                    background: role === 'admin' ? 'rgba(139,92,246,0.1)' : 'rgba(59,130,246,0.1)',
                    border: `1px solid ${role === 'admin' ? 'rgba(139,92,246,0.25)' : 'rgba(59,130,246,0.25)'}`,
                    color: role === 'admin' ? '#8b5cf6' : '#3b82f6',
                }}>
                    {role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                    {role === 'admin' ? 'ADMIN' : 'USER'}
                </div>
            </div>

            {/* Search */}
            <div style={{ flex: 1, maxWidth: 360, position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Search reports, events, locations... (Enter)"
                    style={{
                        width: '100%', paddingLeft: 32, paddingRight: 12, paddingBlock: 7,
                        background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: 8, color: '#0f172a', fontSize: 12,
                        outline: 'none', fontFamily: 'Inter, sans-serif',
                    }}
                />
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* User Logged-in Location & Live Temperature Pill */}
            <div
                onClick={() => navigate('/home')}
                title="Current detected location and live temperature"
                style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    borderRadius: 999, paddingInline: 10, paddingBlock: 4,
                    cursor: 'pointer', transition: 'all 0.2s'
                }}
            >
                <span style={{ fontSize: 13 }}>{userWeather?.conditionIcon || '📍'}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8' }}>
                    {userLocation?.city || 'Noida'}
                </span>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#0f172a' }}>
                    {userWeather ? `${userWeather.temp}°C` : '23°C'}
                </span>
            </div>

            {/* Live Exact Clock */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 5, fontSize: 11,
                fontWeight: 700, color: '#1e293b', background: '#e2e8f0',
                paddingInline: 8, paddingBlock: 4, borderRadius: 6
            }}>
                <Clock size={12} color="#64748b" />
                <span>{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</span>
            </div>

            {/* Live status badge */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: wsConnected ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${wsConnected ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                borderRadius: 999, paddingInline: 10, paddingBlock: 4,
            }}>
                <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: wsConnected ? '#10b981' : '#ef4444',
                    animation: 'pulse-live 2s infinite'
                }} />
                <span style={{ fontSize: 11, color: wsConnected ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                    {wsConnected ? '● LIVE' : '⚠ RECONNECTING'}
                </span>
            </div>

            {/* Last updated */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8' }}>
                <RefreshCw size={11} />
                <span>Updated {lastUpdated}</span>
            </div>

            {/* Demo mode toggle — admin only */}
            {role === 'admin' && (
                <button
                    onClick={() => setDemoMode(!demoMode)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6, paddingInline: 12, paddingBlock: 6,
                        borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        background: demoMode ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
                        color: demoMode ? '#ef4444' : '#3b82f6',
                        border: `1px solid ${demoMode ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'}`,
                        fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                    }}
                >
                    {demoMode ? <Square size={12} /> : <Play size={12} />}
                    {demoMode ? 'Stop Demo' : 'Demo Mode'}
                </button>
            )}

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setShowNotif(!showNotif)}
                    style={{
                        width: 36, height: 36, borderRadius: 8, border: 'none',
                        background: 'rgba(0,0,0,0.05)', color: '#475569',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                >
                    <Bell size={16} />
                    {unreadCount > 0 && (
                        <div style={{
                            position: 'absolute', top: -4, right: -4, width: 16, height: 16,
                            background: '#ef4444', borderRadius: '50%',
                            fontSize: 10, fontWeight: 700, color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>{unreadCount}</div>
                    )}
                </button>

                {showNotif && (
                    <div style={{
                        position: 'absolute', top: 42, right: 0, width: 320,
                        background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                        zIndex: 999, overflow: 'hidden',
                    }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>Notifications</span>
                            <span style={{ fontSize: 11, color: '#64748b' }}>{unreadCount} unread</span>
                        </div>
                        {notifications.slice(0, 6).map(n => (
                            <div
                                key={n.id}
                                onClick={() => markNotificationRead(n.id)}
                                style={{
                                    padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'flex-start',
                                    background: n.read ? 'transparent' : 'rgba(59,130,246,0.05)',
                                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                }}
                            >
                                <div style={{ marginTop: 2 }}>{notifIcon(n.type)}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, color: '#1e293b', lineHeight: 1.4 }}>{n.message}</div>
                                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{n.time}</div>
                                </div>
                                {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: 4 }} />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </header>
    )
}
