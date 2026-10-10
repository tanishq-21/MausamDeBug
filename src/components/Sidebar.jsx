import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import {
    Home, Map, Bell, Radio, MessageSquarePlus,
    ChevronLeft, ChevronRight, Wind, LogOut, User,
    LayoutDashboard, FileText, ShieldCheck, BarChart3,
    Activity, Zap, Settings, Shield, ScanSearch, Trophy,
} from 'lucide-react'

// ── Nav definitions ───────────────────────────────────────────────────────────

// Only the most important things a citizen needs
const USER_ITEMS = [
    { path: '/home', icon: Home, label: 'My Weather' },
    { path: '/map', icon: Map, label: 'Live Map' },
    { path: '/glory-of-honour', icon: Trophy, label: 'Glory of Honour (₹500)' },
    { path: '/events', icon: Zap, label: 'Weather Events' },
    { path: '/live-news', icon: Radio, label: 'Weather News' },
    { path: '/reports', icon: Bell, label: 'Alerts' },
    { path: '/report', icon: MessageSquarePlus, label: 'Report Weather' },
    { path: '/image-verification', icon: ScanSearch, label: 'Image Verification' },
    { path: '/verification', icon: ShieldCheck, label: 'AI Credibility Engine' },
]

// Full platform access for admin
const ADMIN_ITEMS = [
    { path: '/home', icon: Home, label: 'Home', group: 'Overview' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Global Dashboard', group: 'Overview' },
    { path: '/map', icon: Map, label: 'Live Map', group: 'Overview' },
    { path: '/glory-of-honour', icon: Trophy, label: 'Glory of Honour (₹500)', group: 'Overview' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', group: 'Reports' },
    { path: '/reports', icon: FileText, label: 'All Reports', group: 'Reports' },
    { path: '/events', icon: Zap, label: 'Events', group: 'Reports' },
    { path: '/live-news', icon: Radio, label: 'Weather News', group: 'Reports' },
    { path: '/verification', icon: ShieldCheck, label: 'Verification', group: 'Admin' },
    { path: '/admin', icon: Settings, label: 'Admin Panel', group: 'Admin' },
    { path: '/system', icon: Activity, label: 'System Health', group: 'Admin' },
    { path: '/report', icon: MessageSquarePlus, label: 'Citizen Report', group: 'Tools' },
    { path: '/image-verification', icon: ScanSearch, label: 'Image Verification', group: 'Tools' },
]

const GROUP_ORDER = ['Overview', 'Reports', 'Admin', 'Tools']

export default function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { sidebarOpen, setSidebarOpen, stats, wsConnected, role, setRole } = useAppStore()

    const isAdmin = role === 'admin'
    const navItems = isAdmin ? ADMIN_ITEMS : USER_ITEMS

    // Group headers only for admin (when sidebar is open)
    const renderAdmin = () => {
        return GROUP_ORDER.map(group => {
            const items = navItems.filter(i => i.group === group)
            if (!items.length) return null
            return (
                <div key={group}>
                    {sidebarOpen && (
                        <div style={{ padding: '14px 14px 4px', fontSize: 9, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            {group}
                        </div>
                    )}
                    {items.map(item => renderItem(item))}
                </div>
            )
        })
    }

    const renderItem = (item) => {
        const isActive = location.pathname === item.path
        const Icon = item.icon
        return (
            <button
                key={item.path}
                onClick={() => navigate(item.path)}
                title={!sidebarOpen ? item.label : undefined}
                style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 8, border: 'none',
                    background: isActive
                        ? (isAdmin ? 'rgba(139,92,246,0.12)' : 'rgba(59,130,246,0.12)')
                        : 'transparent',
                    color: isActive ? (isAdmin ? '#a78bfa' : '#60a5fa') : '#475569',
                    cursor: 'pointer', marginBottom: 1, transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif', fontSize: 13,
                    fontWeight: isActive ? 600 : 400, textAlign: 'left',
                    borderLeft: isActive
                        ? `2px solid ${isAdmin ? '#8b5cf6' : '#3b82f6'}`
                        : '2px solid transparent',
                }}
                onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
                onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
            >
                <Icon size={15} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
            </button>
        )
    }

    return (
        <aside style={{
            width: sidebarOpen ? 220 : 64, transition: 'width 0.3s ease',
            background: '#f1f5f9', borderRight: '1px solid rgba(0,0,0,0.08)',
            display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 100, overflow: 'hidden',
        }}>
            {/* Logo */}
            <div style={{ padding: '16px 12px', borderBottom: '1px solid rgba(0,0,0,0.08)', minHeight: 72 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#fff', fontWeight: 'bold' }}>
                        ☁️/&gt;
                    </div>
                    {sidebarOpen && (
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', whiteSpace: 'nowrap' }}>MausamDeBug</div>
                            <div style={{ fontSize: 9, color: '#64748b', whiteSpace: 'nowrap' }}>Weather Intelligence</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Role badge */}
            {sidebarOpen && (
                <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: isAdmin ? 'rgba(139,92,246,0.1)' : 'rgba(59,130,246,0.1)',
                        border: `1px solid ${isAdmin ? 'rgba(139,92,246,0.25)' : 'rgba(59,130,246,0.25)'}`,
                        color: isAdmin ? '#a78bfa' : '#60a5fa',
                    }}>
                        {isAdmin ? <Shield size={11} /> : <User size={11} />}
                        {isAdmin ? 'ADMIN' : 'USER'}
                    </div>
                    {/* Live dot */}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: wsConnected ? '#10b981' : '#ef4444', animation: 'pulse-live 2s infinite', boxShadow: wsConnected ? '0 0 5px #10b981' : '0 0 5px #ef4444' }} />
                        {wsConnected && <span style={{ fontSize: 9, color: '#10b981', fontWeight: 600 }}>LIVE</span>}
                    </div>
                </div>
            )}

            {/* Nav */}
            <nav style={{ flex: 1, padding: '8px 6px', overflowY: 'auto' }}>
                {isAdmin ? renderAdmin() : navItems.map(item => renderItem(item))}
            </nav>

            {/* Bottom stats (user-friendly for user, pending count for admin) */}
            {sidebarOpen && (
                <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    {isAdmin ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>⏳ Pending Review</span>
                                <span style={{ marginLeft: 'auto', background: '#f59e0b', color: '#000', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '1px 6px' }}>{stats.pending}</span>
                            </div>
                            <div style={{ fontSize: 10, color: '#94a3b8' }}>⚠️ Suspicious: {stats.suspicious}</div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 11, color: '#475569' }}>⚡ Active Events</span>
                            <span style={{ marginLeft: 'auto', background: '#3b82f6', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '1px 7px' }}>{stats.activeEvents}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Logout + collapse */}
            <div style={{ display: 'flex', padding: 8, gap: 8 }}>
                <button
                    onClick={() => { setRole('user'); navigate('/login') }}
                    style={{ flex: 1, padding: 8, borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                >
                    <LogOut size={15} />
                    {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 600 }}>Sign Out</span>}
                </button>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{ padding: 8, borderRadius: 8, border: 'none', background: 'rgba(0,0,0,0.05)', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                >
                    {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
            </div>
        </aside>
    )
}
