import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { Mail, Lock, ArrowRight, ShieldCheck, User, MapPin, Clock, RefreshCw } from 'lucide-react'

// ── Credential presets ────────────────────────────────────────────────────────
const ACCOUNTS = {
    user: { email: 'user@mausamdebug.in', password: 'user123', role: 'user' },
    admin: { email: 'admin@mausamdebug.in', password: 'admin123', role: 'admin' },
}

export default function Login() {
    const navigate = useNavigate()
    const { setRole, userLocation, userWeather, detectUserLocation, isLocatingUser } = useAppStore()
    const queryParams = new URLSearchParams(window.location.search)
    const [isRegister, setIsRegister] = useState(queryParams.get('mode') === 'register')
    const [name, setName] = useState('')

    const [email, setEmail] = useState(ACCOUNTS.user.email)
    const [password, setPassword] = useState(ACCOUNTS.user.password)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [selected, setSelected] = useState('user')   // which tile is highlighted
    const [currentTime, setCurrentTime] = useState(() => new Date())

    // Clock updates every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Ensure user location & live temperature is detected for login location
    useEffect(() => {
        if (!userLocation) {
            detectUserLocation()
        }
    }, [])

    // Prefill credentials when tile is clicked
    const selectRole = (role) => {
        if (isRegister) return
        setSelected(role)
        setEmail(ACCOUNTS[role].email)
        setPassword(ACCOUNTS[role].password)
        setError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (isRegister) {
            if (!name.trim() || !email.trim() || !password) {
                setError('Please fill out all fields.')
                return
            }
            setIsLoading(true)
            setTimeout(() => {
                setRole('user') // Register defaults to user
                setIsLoading(false)
                navigate('/home')
            }, 1200)
        } else {
            const match = Object.values(ACCOUNTS).find(
                a => a.email === email.trim() && a.password === password
            )
            if (!match) { setError('Invalid credentials. Use the quick-login tiles above.'); return }
            setIsLoading(true)
            setTimeout(() => {
                setRole(match.role)
                setIsLoading(false)
                navigate('/home')
            }, 900)
        }
    }

    const currentDateLabel = currentTime.toLocaleDateString('en-IN', {
        weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
    })
    const currentTimeLabel = currentTime.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    })

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0f7ff 0%, #f8fafc 50%, #f0fdf4 100%)',
            position: 'relative', overflow: 'hidden', fontFamily: 'Inter, sans-serif',
        }}>
            {/* BG blobs */}
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />

            {/* Logo top-left */}
            <div style={{ position: 'absolute', top: 32, left: 40, zIndex: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => navigate('/')}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>☁️/&gt;</div>
                <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a' }}>MausamDeBug</div>
            </div>

            <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 10, paddingInline: 16 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#3b82f6' }}>
                        <ShieldCheck size={28} />
                    </div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>{isRegister ? 'Create an Account' : 'Welcome Back'}</h1>
                    <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>{isRegister ? 'Join India\'s Weather Intelligence Platform' : 'Select your role to continue'}</p>
                </div>

                {/* Live Detected Location & Real Temperature of Login Place */}
                <div style={{
                    background: '#ffffff',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    borderRadius: 16,
                    padding: '12px 16px',
                    marginBottom: 18,
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 24 }}>{userWeather?.conditionIcon || '📍'}</span>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                                    {(userLocation?.city && userLocation?.city !== 'Piran Kaliyar' ? userLocation.city : 'Roorkee')}{userLocation?.state ? `, ${userLocation.state}` : ', Uttarakhand'}
                                </span>
                                <span style={{
                                    fontSize: 10, fontWeight: 700, color: '#16a34a',
                                    background: '#dcfce7', padding: '1px 6px', borderRadius: 999
                                }}>
                                    ● Live
                                </span>
                            </div>
                            <div style={{ fontSize: 12, color: '#475569', fontWeight: 600, marginTop: 2 }}>
                                {userWeather ? (
                                    <span>
                                        <strong style={{ color: '#0f172a', fontSize: 14 }}>{userWeather.temp}°C</strong> · {userWeather.conditionLabel} · Feels {userWeather.feelsLike}°C
                                    </span>
                                ) : (
                                    <span style={{ color: '#94a3b8' }}>Fetching live ground temperature…</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', borderLeft: '1px solid #e2e8f0', paddingLeft: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                            {currentTimeLabel}
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
                            {currentDateLabel}
                        </div>
                    </div>
                </div>

                {/* Role tiles */}
                {!isRegister && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                        <RoleTile
                            icon={<User size={22} />}
                            title="User"
                            sub="View weather, alerts & map"
                            color="#3b82f6"
                            active={selected === 'user'}
                            onClick={() => selectRole('user')}
                        />
                        <RoleTile
                            icon={<ShieldCheck size={22} />}
                            title="Admin"
                            sub="Manage reports & verification"
                            color="#8b5cf6"
                            active={selected === 'admin'}
                            onClick={() => selectRole('admin')}
                        />
                    </div>
                )}

                {/* Card */}
                <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 24, padding: '30px 34px', boxShadow: '0 20px 50px rgba(0,0,0,0.06)' }}>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {/* Name (for register only) */}
                        {isRegister && (
                            <div>
                                <label style={labelSt}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        type="text" value={name} onChange={e => setName(e.target.value)}
                                        placeholder="Arjun Verma" required
                                        style={inputSt}
                                        onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)' }}
                                        onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none' }}
                                    />
                                </div>
                            </div>
                        )}
                        {/* Email */}
                        <div>
                            <label style={labelSt}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="your@email.com" required
                                    style={inputSt}
                                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)' }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none' }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <label style={labelSt}>Password</label>
                                <span style={{ fontSize: 12, color: '#3b82f6', cursor: 'pointer' }}>Forgot?</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••" required
                                    style={inputSt}
                                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)' }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none' }}
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#ef4444' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" disabled={isLoading} style={{
                            marginTop: 4, padding: '13px', borderRadius: 12, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                            background: (!isRegister && selected === 'admin') ? 'linear-gradient(135deg,#8b5cf6,#6366f1)' : 'linear-gradient(135deg,#3b82f6,#06b6d4)',
                            color: '#fff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 14px rgba(59,130,246,0.3)', opacity: isLoading ? 0.8 : 1, transition: 'all 0.2s',
                        }}>
                            {isLoading ? 'Processing...' : <>{isRegister ? 'Register Account' : (!isRegister && selected === 'admin' ? '🛡 Admin Login' : '👤 User Login')} <ArrowRight size={15} /></>}
                        </button>

                        <div style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 8 }}>
                            {isRegister ? "Already have an account? " : "Don't have an account? "}
                            <span
                                onClick={() => {
                                    setIsRegister(!isRegister);
                                    setError('');
                                    if (isRegister) {
                                        // switching to login, preset demo creds
                                        setEmail(ACCOUNTS.user.email);
                                        setPassword(ACCOUNTS.user.password);
                                        setSelected('user');
                                    } else {
                                        // switching to register, clear creds
                                        setEmail('');
                                        setPassword('');
                                    }
                                }}
                                style={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>
                                {isRegister ? 'Login' : 'Sign Up'}
                            </span>
                        </div>

                        {!isRegister && (
                            <div style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>
                                Demo mode — credentials are prefilled when you click a role tile above.
                            </div>
                        )}
                    </form>
                </div>

                {/* Back to landing */}
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <span style={{ fontSize: 13, color: '#64748b', cursor: 'pointer' }} onClick={() => navigate('/')}>
                        ← Back to Landing
                    </span>
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: 24, width: '100%', textAlign: 'center', fontSize: 12, color: '#cbd5e1', zIndex: 0 }}>
                MausamDeBug © 2026
            </div>
        </div>
    )
}

// ── Sub-component: Role Tile ───────────────────────────────────────────────────
function RoleTile({ icon, title, sub, color, active, onClick }) {
    return (
        <button onClick={onClick} style={{
            padding: '18px 14px', border: `2px solid ${active ? color : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 16, background: active ? `${color}0d` : '#fff',
            cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
            boxShadow: active ? `0 4px 16px ${color}22` : 'none',
            fontFamily: 'Inter, sans-serif',
        }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: active ? `${color}18` : 'rgba(0,0,0,0.04)', border: `1px solid ${active ? color + '30' : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? color : '#94a3b8', margin: '0 auto 10px', transition: 'all 0.2s' }}>
                {icon}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: active ? '#0f172a' : '#64748b', marginBottom: 3 }}>{title}</div>
            <div style={{ fontSize: 11, color: active ? '#475569' : '#94a3b8', lineHeight: 1.4 }}>{sub}</div>
        </button>
    )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const labelSt = { display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }
const inputSt = {
    width: '100%', padding: '11px 12px 11px 38px',
    background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 11, color: '#0f172a', fontSize: 13,
    outline: 'none', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
}
