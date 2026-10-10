import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CloudRain, Wind, Droplets, ArrowRight, PlayCircle, Map as MapIcon, Zap, Activity, AlertTriangle, Menu, X } from 'lucide-react';
import SOSSystem from '../components/SOSSystem';
import MausamAI from '../components/MausamAI';
import { useAppStore } from '../store/appStore';

export default function Landing() {
    const navigate = useNavigate();
    const { realAlerts: alerts, userLocation, userWeather, detectUserLocation } = useAppStore();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        detectUserLocation(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f8fafc', color: '#0f172a', minHeight: '100vh', overflowX: 'hidden' }}>

            {/* NOVEL THEME NAVBAR */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 40px', background: scrolled ? 'rgba(255,255,255,0.95)' : '#ffffff',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
            }}>
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ padding: '6px', borderRadius: 8, background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 'bold' }}>☁️/&gt;</div>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>MausamDeBug</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden-mobile" style={{ display: 'flex', gap: 30, fontSize: 13, fontWeight: 600, color: '#475569' }}>
                    {['Home', 'Forecast', 'Map', 'Events', 'Insights', 'About'].map(item => (
                        <span key={item} style={{ cursor: 'pointer', transition: 'color 0.2s', color: item === 'Home' ? '#0f172a' : '#475569' }}
                            onMouseEnter={e => e.target.style.color = '#0f172a'}
                            onMouseLeave={e => e.target.style.color = item === 'Home' ? '#0f172a' : '#475569'}>
                            {item}
                        </span>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 9 }} />
                        <input type="text" placeholder="Search city, state or region..." style={{
                            padding: '8px 12px 8px 32px', borderRadius: 20, border: '1px solid #e2e8f0', background: '#f8fafc',
                            fontSize: 12, outline: 'none', width: 220, fontFamily: 'Inter'
                        }} />
                    </div>
                    {/* SOS Desktop */}
                    <SOSSystem isMobile={false} />
                    <button onClick={() => navigate('/login')} style={{ border: '1px solid #e2e8f0', background: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#0f172a', whiteSpace: 'nowrap' }}>Login</button>
                    <button onClick={() => navigate('/login?mode=register')} style={{ border: 'none', background: '#3b82f6', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Sign Up</button>
                </div>

                {/* Mobile Menu Icon */}
                <div className="show-mobile" style={{ display: 'none', cursor: 'pointer' }} onClick={() => setMobileMenuOpen(true)}>
                    <Menu size={24} />
                </div>
            </nav>

            {/* MOBILE MENU SIDER */}
            {mobileMenuOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 10000, padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ padding: '6px', borderRadius: 8, background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 'bold' }}>☁️/&gt;</div>
                            <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>MausamDeBug</span>
                        </div>
                        <X size={24} onClick={() => setMobileMenuOpen(false)} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: 16, fontWeight: 600, marginBottom: 30 }}>
                        {['Home', 'Forecast', 'Map', 'Events', 'Insights'].map(i => <div key={i}>{i}</div>)}
                    </div>
                    <button onClick={() => navigate('/login')} style={{ width: '100%', padding: 14, background: '#f1f5f9', color: '#0f172a', borderRadius: 10, fontWeight: 700, border: 'none', marginBottom: 12 }}>Login</button>
                    <button onClick={() => navigate('/login?mode=register')} style={{ width: '100%', padding: 14, background: '#3b82f6', color: '#fff', borderRadius: 10, fontWeight: 700, border: 'none', marginBottom: 12 }}>Sign Up</button>
                    <button onClick={() => navigate('/dashboard')} style={{ width: '100%', padding: 14, background: '#f1f5f9', color: '#0f172a', borderRadius: 10, fontWeight: 700, border: 'none' }}>Get Started</button>
                </div>
            )}

            {/* HERO SECTION */}
            <section style={{ paddingTop: 120, paddingBottom: 60, paddingInline: '5%', display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Left Typography */}
                <div style={{ flex: '1 1 400px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#e0f2fe', color: '#0284c7', padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 24 }}>
                        <Activity size={14} /> India's Weather Intelligence Platform
                    </div>
                    <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#0f172a', margin: '0 0 20px' }}>
                        See the Weather.<br />
                        <span style={{ color: '#3b82f6' }}>Understand the Future.</span>
                    </h1>
                    <p style={{ fontSize: 'clamp(14px, 1.5vw, 16px)', color: '#475569', lineHeight: 1.6, maxWidth: 480, marginBottom: 32 }}>
                        Real-time weather data, AI-powered insights and early alerts for a safer, cleaner and more prepared India.
                    </p>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#3b82f6', color: '#fff', padding: '14px 28px', borderRadius: 999, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 20px rgba(59,130,246,0.3)' }}>
                            Explore Weather <ArrowRight size={16} />
                        </button>
                        <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0f172a', padding: '14px 28px', borderRadius: 999, border: '1px solid #cbd5e1', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                            <PlayCircle size={16} /> Watch Demo
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: 30, marginTop: 40, flexWrap: 'wrap' }}>
                        {[{ i: '☁️', t1: 'Real-Time', t2: 'Weather Data' }, { i: '🤖', t1: 'AI-Powered', t2: 'Insights' }, { i: '🚨', t1: 'Early Warnings', t2: 'for a Safer India' }].map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ fontSize: 20 }}>{f.i}</div>
                                <div style={{ fontSize: 12, lineHeight: 1.2 }}><strong style={{ color: '#0f172a' }}>{f.t1}</strong><br /><span style={{ color: '#64748b' }}>{f.t2}</span></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right UI Mockup */}
                <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.06)', padding: 24, width: '100%', maxWidth: 540, border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#3b82f6', fontWeight: 700, fontSize: 14 }}>
                                    <MapIcon size={16} /> {userLocation?.formattedLocation?.replace('Piran Kaliyar', 'Roorkee') || 'Roorkee, Uttarakhand'}
                                </div>
                                <div style={{ fontSize: 11, color: '#94a3b8' }}>Live Open-Meteo Ground Stream</div>
                            </div>
                            <div style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />Live Observation</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ fontSize: 64 }}>{userWeather?.conditionIcon || '🌤️'}</div>
                                <div>
                                    <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{userWeather ? `${userWeather.temp}°C` : '23°C'}</div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{userWeather?.conditionLabel || 'Clear Sky'}</div>
                                    <div style={{ fontSize: 12, color: '#64748b' }}>Feels like {userWeather ? `${userWeather.feelsLike}°C` : '24°C'}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, fontWeight: 600 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, width: 80 }}><Droplets size={14} /> Humidity</span> <span style={{ color: '#0f172a' }}>{userWeather?.humidity ? `${userWeather.humidity}%` : '60%'}</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, width: 80 }}><Wind size={14} /> Wind</span> <span style={{ color: '#0f172a' }}>{userWeather?.windSpeed ? `${userWeather.windSpeed} km/h` : '10 km/h'}</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, width: 80 }}><CloudRain size={14} /> Rain Observed</span> <span style={{ color: '#0f172a' }}>{userWeather?.precip ? `${userWeather.precip} mm` : '0 mm'}</span></div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 30 }}>
                            {[{ t: 'AQI', v: '82', s: 'Good', icon: 1 }, { t: 'UV Index', v: '5', s: 'Moderate', icon: 2 }, { t: 'Visibility', v: '8 km', s: 'Good', icon: 3 }, { t: 'Sunrise', v: '5:48 AM', s: '', icon: 4 }].map((b, i) => (
                                <div key={i} style={{ background: '#f8fafc', padding: 12, borderRadius: 12, textAlign: 'center' }}>
                                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{b.t}</div>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{b.v}</div>
                                    <div style={{ fontSize: 11, color: i === 1 ? '#f59e0b' : '#10b981', fontWeight: 600 }}>{b.s}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section style={{ padding: '60px 5%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
                    {[
                        { i: '☁️', c: '#3b82f6', t: 'Real-Time Weather', d: 'Get accurate, location-based weather data with live updates across India.' },
                        { i: '🧠', c: '#a855f7', t: 'AI Weather Insights', d: 'AI-powered analysis to understand weather patterns and future impacts.' },
                        { i: '🔔', c: '#ef4444', t: 'Weather Alerts', d: 'Stay informed with early warnings for heavy rain, heatwaves, cyclones and more.' },
                        { i: '🗺️', c: '#10b981', t: 'Interactive Maps', d: 'Explore real-time weather maps with rainfall, temperature, wind and air quality layers.' }
                    ].map((f, i) => (
                        <div key={i} style={{ background: '#fff', padding: 30, borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: f.c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>{f.i}</div>
                            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{f.t}</h3>
                            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{f.d}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* MAP & INSIGHTS PREVIEW */}
            <section style={{ padding: '40px 5% 80px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ flex: '2 1 500px', background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <MapIcon color="#3b82f6" />
                            <div><div style={{ fontSize: 16, fontWeight: 800 }}>Live Weather Map</div><div style={{ fontSize: 12, color: '#64748b' }}>Real-time weather layers across India.</div></div>
                        </div>
                        <div style={{ padding: '6px 12px', background: '#f1f5f9', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>💧 Rainfall (Radar)</div>
                    </div>
                    <div style={{ width: '100%', height: 400, borderRadius: 16, background: 'linear-gradient(to bottom right, #0f172a, #1e293b)', position: 'relative', overflow: 'hidden' }}>
                        {/* Mock Map Image Representation */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.6, backgroundSize: 'cover', backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/e/e4/India_relief_location_map.jpg)' }}></div>
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, transparent 60%)' }}></div>
                        <div style={{ position: 'absolute', bottom: 20, left: 20, background: '#fff', padding: '10px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 700 }}>
                            Light <div style={{ height: 6, width: 100, background: 'linear-gradient(to right, #60a5fa, #34d399, #facc15, #ef4444, #a855f7)', borderRadius: 3 }}></div> Heavy
                        </div>
                    </div>
                </div>

                <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Insights Block */}
                    <div style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <div style={{ fontSize: 24 }}>✨</div>
                            <div><div style={{ fontSize: 16, fontWeight: 800 }}>AI Weather Insight</div><div style={{ fontSize: 12, color: '#64748b' }}>Simple insights for a better prepared you.</div></div>
                        </div>
                        <div style={{ background: '#eff6ff', padding: 16, borderRadius: 12, fontSize: 13, color: '#1e3a8a', lineHeight: 1.6, marginBottom: 16 }}>
                            {userLocation ? (
                                `Live meteorological conditions in ${userLocation.city}: ${userWeather?.conditionLabel || 'Pleasant weather'} with current ground temperatures of ${userWeather?.temp || 23}°C (feels like ${userWeather?.feelsLike || 24}°C). Real-time ground telemetry connected.`
                            ) : (
                                `Real-time meteorological monitoring active across India with instant satellite telemetry and ground observations.`
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, background: '#f1f5f9', padding: '6px 12px', borderRadius: 999, fontWeight: 600 }}>Will it rain today?</span>
                            <span style={{ fontSize: 11, background: '#f1f5f9', padding: '6px 12px', borderRadius: 999, fontWeight: 600 }}>Should I carry an umbrella?</span>
                        </div>
                    </div>

                        {/* Alerts Block */}
                    <div style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 16 }}><Zap color="#f59e0b" /> Live Weather Alerts</div>
                            <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/map')}>View Map →</div>
                        </div>
                        <div>
                            {(alerts && alerts.length > 0 ? alerts.slice(0, 3) : [
                                { icon: '🌧️', title: 'Rainfall Monitoring Watch', location: 'Uttarakhand', validTill: 'Live Stream', color: '#ef4444', severity: 'High' },
                                { icon: '💨', title: 'High Wind Telemetry', location: 'Coastal Belt', validTill: 'Live Stream', color: '#f59e0b', severity: 'Moderate' }
                            ]).map((e, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ fontSize: 24 }}>{e.icon || '⚠️'}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700 }}>{e.title}</div>
                                        <div style={{ fontSize: 11, color: '#64748b' }}>{e.location}</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                                        <div style={{ fontSize: 10, color: '#94a3b8' }}>{e.validTill}</div>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: e.color || '#ef4444', background: `${e.color || '#ef4444'}1a`, padding: '2px 8px', borderRadius: 999 }}>{e.severity}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* BOTTOM BANNER */}
            <section style={{ margin: '0 5% 60px', borderRadius: 32, padding: '60px 40px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
                <div style={{ flex: '1 1 300px' }}>
                    <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 16px' }}>
                        Stay ahead of <span style={{ color: '#3b82f6' }}>the weather.</span>
                    </h2>
                    <p style={{ fontSize: 16, color: '#94a3b8', marginBottom: 32, maxWidth: 400 }}>
                        Make smarter decisions with real-time data, AI insights and early alerts.
                    </p>
                    <button onClick={() => navigate('/login')} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: 999, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                        Get Started <ArrowRight size={16} />
                    </button>
                </div>
                {/* Decorative mockups */}
                <div style={{ flex: '1 1 300px', display: 'flex', gap: 16, flexWrap: 'wrap', opacity: 0.9 }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: 20, borderRadius: 20 }}>
                        <div style={{ fontSize: 32, fontWeight: 900 }}>31°C</div><div style={{ fontSize: 12, color: '#94a3b8' }}>Tomorrow</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: 20, borderRadius: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} /> <span style={{ fontWeight: 700 }}>AQI 82</span></div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Good</div>
                    </div>
                </div>
            </section>

            {/* Mobile CSS override */}
            <style>{`
                @media (max-width: 768px) {
                    .hidden-mobile { display: none !important; }
                    .show-mobile { display: block !important; }
                }
            `}</style>

            {/* FLOATING SOS ON MOBILE */}
            <SOSSystem isMobile={true} />
            <MausamAI isMobile={window.innerWidth < 768} />
        </div>
    );
}
