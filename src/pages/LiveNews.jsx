import { useState, useEffect, useRef } from 'react'
import { PageHeader } from '../components/ui'
import { Activity, Radio, PlayCircle, MapPin, Clock, ShieldCheck, ArrowRight, Video, Newspaper, Filter, X } from 'lucide-react'
import IndiaMap from '../components/IndiaMap'
import { useAppStore } from '../store/appStore'
import { useNavigate } from 'react-router-dom'
import { MOCK_NEWS_ARTICLES, EVENT_TYPE_ICON, formatRelativeTime } from '../services/newsService'
import { MOCK_VIDEOS } from '../services/youtubeService'
import { getTier } from '../utils/credibility'

const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'breaking', label: '🔴 Breaking' },
    { id: 'rainfall', label: '🌧 Rainfall' },
    { id: 'flood', label: '🌊 Flood' },
    { id: 'thunderstorm', label: '⛈ Thunderstorm' },
    { id: 'heatwave', label: '🌡 Heatwave' },
    { id: 'fog', label: '🌫 Fog' },
    { id: 'cyclone', label: '🌀 Cyclone' },
    { id: 'strong_wind', label: '🌬 Strong Wind' },
]

function CredBadge({ score }) {
    const tier = getTier(score)
    return (
        <span style={{ fontSize: 11, fontWeight: 700, color: tier.color, background: tier.bg, padding: '2px 8px', borderRadius: 999 }}>
            {score}% {tier.label}
        </span>
    )
}

function VideoModal({ video, onClose }) {
    if (!video) return null
    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#0f172a', borderRadius: 16, overflow: 'hidden', width: '90%', maxWidth: 840 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', color: '#fff' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{video.title}</div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <iframe
                    width="100%" height="440"
                    src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                    frameBorder="0" allow="autoplay; encrypted-media; fullscreen"
                    title={video.title}
                />
            </div>
        </div>
    )
}

export default function LiveNews() {
    const { events } = useAppStore()
    const navigate = useNavigate()
    const [news, setNews] = useState(MOCK_NEWS_ARTICLES)
    const [videos] = useState(MOCK_VIDEOS)
    const [category, setCategory] = useState('all')
    const [activeVideo, setActiveVideo] = useState(null)
    const [isSimulating, setIsSimulating] = useState(false)
    const [simStep, setSimStep] = useState(0)

    const filtered = category === 'all' ? news
        : category === 'breaking' ? news.filter(n => n.isBreaking)
            : news.filter(n => n.eventType === category)

    const featured = filtered[0] || news[0]
    const grid = filtered.slice(1)

    const runSimulation = () => {
        if (isSimulating) return
        setIsSimulating(true)
        setSimStep(1)
        setTimeout(() => setSimStep(2), 2000)
        setTimeout(() => setSimStep(3), 4000)
        setTimeout(() => {
            setSimStep(4)
            const injected = {
                id: `news-sim-${Date.now()}`, isBreaking: true,
                title: 'Sudden Dust Storm Sweeps Across Rajasthan — Major Highways Closed',
                summary: 'A massive dust storm (aandhi) was reported moving across the Thar region, reducing visibility to near zero near Jaisalmer.',
                source: 'Rajasthan Patrika', sourceTier: 'T2', url: '#',
                image: 'https://images.unsplash.com/photo-1545127027-e85d95febecc?w=800&q=80',
                location: 'Jaisalmer, Rajasthan', eventType: 'dust_storm',
                publishedAt: new Date().toISOString(), aiRelevance: 99, credibility: 95,
            }
            setNews(prev => [injected, ...prev])
        }, 6000)
        setTimeout(() => { setIsSimulating(false); setSimStep(0) }, 9000)
    }

    const SIM_MSGS = {
        1: '🔴 BREAKING: New article detected from News API feed...',
        2: '⚙️ AI Processing: Extracting location (Jaisalmer, Rajasthan) · Classifying event (Dust Storm)...',
        3: '🔍 Correlating: Matching with IMD sensor data and Citizen reports. Building confidence...',
        4: '✅ Unified event created! Live feed updated.',
    }

    return (
        <div style={{ padding: 24, maxWidth: 1600, margin: '0 auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <PageHeader
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            Live Weather Intelligence
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, color: '#ef4444' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse-live 1.5s infinite' }} /> LIVE
                            </div>
                        </div>
                    }
                    subtitle="Breaking weather news, verified reports and real-time visual updates from across India."
                />
                <button onClick={runSimulation} disabled={isSimulating} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: isSimulating ? '#e2e8f0' : 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: isSimulating ? '#64748b' : '#fff', fontSize: 13, fontWeight: 700, cursor: isSimulating ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: isSimulating ? 'none' : '0 4px 12px rgba(59,130,246,0.3)', flexShrink: 0 }}>
                    <Activity size={16} /> {isSimulating ? 'Simulating...' : '▶ LIVE SIMULATION'}
                </button>
            </div>

            <div style={{ textAlign: 'center', fontSize: 13, color: '#64748b', fontStyle: 'italic', marginBottom: 20, padding: '8px 20px', background: 'rgba(59,130,246,0.05)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.1)' }}>
                "See the story. Verify the signal. Understand the event."
            </div>

            {/* Simulation Banner */}
            {isSimulating && (
                <div style={{ background: '#fff', border: '1px solid #3b82f6', borderRadius: 12, padding: '14px 20px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', boxShadow: '0 4px 20px rgba(59,130,246,0.12)' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Radio size={22} color="#3b82f6" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Live Simulation Running — Demo Mode</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>{SIM_MSGS[simStep] || ''}</div>
                    </div>
                </div>
            )}

            {/* Breaking Ticker */}
            <div style={{ background: '#0f172a', borderRadius: 10, display: 'flex', alignItems: 'center', overflow: 'hidden', marginBottom: 28, height: 44 }}>
                <div style={{ background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 800, padding: '0 18px', height: '100%', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} /> BREAKING
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'inline-block', animation: 'marquee 35s linear infinite', color: '#f1f5f9', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', paddingLeft: 20 }}>
                        {news.filter(n => n.isBreaking).map((n, i) => (
                            <span key={i} style={{ cursor: 'pointer', marginRight: 40 }} onClick={() => navigate('/live-news')}>
                                {EVENT_TYPE_ICON[n.eventType] || '🌧'} {n.title} · <span style={{ color: '#64748b', fontSize: 11 }}>{n.source} · {formatRelativeTime(n.publishedAt)}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured + Map */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
                {/* Featured Story */}
                {featured && (
                    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: 300, background: `url(${featured.image}) center/cover`, position: 'relative' }}>
                            {featured.isBreaking && (
                                <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6, background: '#ef4444', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, color: '#fff' }}>
                                    🔴 BREAKING
                                </div>
                            )}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent 60%)' }} />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, color: '#fff' }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                                    {EVENT_TYPE_ICON[featured.eventType]} {featured.eventType?.replace('_', ' ')}
                                </div>
                                <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>{featured.title}</h2>
                            </div>
                        </div>
                        <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>{featured.summary}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#64748b' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {featured.location}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {formatRelativeTime(featured.publishedAt)}</span>
                                <span>Source: <strong style={{ color: '#0f172a' }}>{featured.source}</strong></span>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <CredBadge score={featured.credibility} />
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: 999 }}>
                                    AI Relevance: {featured.aiRelevance}%
                                </span>
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
                                <a href={featured.url} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px 0', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none' }}>
                                    Read Full Story <ArrowRight size={14} />
                                </a>
                                {events[0] && (
                                    <button onClick={() => navigate(`/events/${events[0].id}`)} style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                        Related Event →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Live Map */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden', position: 'relative', minHeight: 420 }}>
                    <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#0f172a', zIndex: 400, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                        📡 Live Weather Map — News & Events
                    </div>
                    <IndiaMap events={events} />
                </div>
            </div>

            {/* Category Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {CATEGORIES.map(c => (
                    <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${category === c.id ? '#3b82f6' : 'rgba(0,0,0,0.08)'}`, background: category === c.id ? 'rgba(59,130,246,0.1)' : '#fff', color: category === c.id ? '#3b82f6' : '#475569', fontSize: 12, fontWeight: category === c.id ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {c.label}
                    </button>
                ))}
            </div>

            {/* News Grid */}
            <div style={{ marginBottom: 40 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <Newspaper size={18} /> Latest Weather News
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>{grid.length} articles</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                    {grid.map(article => (
                        <div key={article.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s', cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                        >
                            <div style={{ height: 150, background: `url(${article.image}) center/cover`, position: 'relative' }}>
                                {article.isBreaking && (
                                    <div style={{ position: 'absolute', top: 8, left: 8, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4 }}>BREAKING</div>
                                )}
                            </div>
                            <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    {EVENT_TYPE_ICON[article.eventType]} {article.eventType?.replace('_', ' ')}
                                </div>
                                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.4 }}>{article.title}</h4>
                                <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.summary}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
                                    <MapPin size={11} /> {article.location} · <Clock size={11} /> {formatRelativeTime(article.publishedAt)}
                                </div>
                                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <div style={{ fontSize: 11, color: '#64748b' }}>{article.source}</div>
                                    <CredBadge score={article.credibility} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Section */}
            <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <Video size={18} /> Weather Videos
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
                    {videos.map(v => (
                        <div key={v.id} onClick={() => setActiveVideo(v)} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                        >
                            <div style={{ height: 148, background: `url(${v.thumbnail}) center/cover`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <PlayCircle size={28} color="#fff" />
                                </div>
                                {v.isLive && (
                                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', alignItems: 'center', gap: 4, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>
                                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff' }} /> LIVE
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: 14 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.4 }}>{v.title}</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                                    <span>{v.channel}</span>
                                    <span>{formatRelativeTime(v.publishedAt)}</span>
                                </div>
                                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <MapPin size={10} /> {v.location}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />

            <style>{`
                @keyframes marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    )
}
