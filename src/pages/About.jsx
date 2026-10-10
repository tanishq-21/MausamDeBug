export default function About() {
    const impacts = [
        { icon: '⚡', title: 'Faster Disaster Response', desc: 'Officials receive verified, correlated alerts instead of thousands of raw reports.' },
        { icon: '🎯', title: 'Reduced Misinformation', desc: 'AI credibility scoring filters low-quality & potentially misleading reports.' },
        { icon: '🗺️', title: 'Better Situational Awareness', desc: 'Geospatial visualization gives command centers real-time situational awareness.' },
        { icon: '🤝', title: 'Citizen Participation', desc: 'Citizens contribute verified ground reports through a structured interface.' },
        { icon: '📊', title: 'Better Resource Allocation', desc: 'Authorities can prioritize resources to highest-confidence, highest-severity areas.' },
        { icon: '🏛️', title: 'Unified Intelligence Layer', desc: 'Multiple scattered sources unified into one verified, queryable intelligence platform.' },
    ]

    return (
        <div style={{ padding: 24, maxWidth: 1000 }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: 48, padding: '40px 24px' }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff', fontWeight: 'bold', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(59,130,246,0.4)' }}>☁️/&gt;</div>
                <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>MausamDeBug</h1>
                <div style={{ fontSize: 16, color: '#64748b', marginBottom: 16 }}>National Weather Intelligence, Verification & Situational Awareness Platform</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                    <span style={{ padding: '4px 14px', borderRadius: 999, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', fontSize: 12, color: '#60a5fa', fontWeight: 600 }}>Data Platform</span>
                </div>
            </div>

            {/* Problem */}
            <div style={card}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 10 }}>🔍 The Problem</div>
                <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.8 }}>
                    Weather information is distributed across multiple internet-based sources — social media, news websites, citizen reports,
                    government feeds, weather APIs, and satellite data. These sources often contain <strong style={{ color: '#0f172a' }}>duplicate, misleading,
                        incomplete, or unverified reports</strong>. Without a unified verification and correlation layer, emergency responders receive
                    data that is noisy, hard to prioritize, and difficult to act upon quickly.
                </div>
            </div>

            {/* Solution */}
            <div style={{ ...card, marginTop: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 10 }}>💡 The Solution</div>
                <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.8 }}>
                    MausamDeBug creates a centralized intelligence layer that automatically <strong style={{ color: '#0f172a' }}>collects weather data from
                        multiple sources, extracts structured information using NLP, estimates report credibility using multi-source evidence,
                        detects duplicates via semantic similarity, and correlates reports into unified weather events</strong>.
                    The result is a clean, verified, geospatially-aware weather intelligence feed.
                </div>

                {/* Flow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['Collect', '→', 'Understand', '→', 'Verify', '→', 'Correlate', '→', 'Visualize'].map((step, i) => (
                        <span key={i} style={{
                            fontWeight: step === '→' ? 400 : 700, fontSize: 14,
                            color: step === '→' ? '#94a3b8' : '#3b82f6',
                            padding: step === '→' ? '0' : '4px 14px',
                            borderRadius: 8,
                            background: step === '→' ? 'transparent' : 'rgba(59,130,246,0.1)',
                            border: step === '→' ? 'none' : '1px solid rgba(59,130,246,0.2)',
                        }}>{step}</span>
                    ))}
                </div>
            </div>

            {/* Impact */}
            <div style={{ marginTop: 24, marginBottom: 8, fontWeight: 700, fontSize: 16, color: '#0f172a' }}>🎯 Impact</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {impacts.map(item => (
                    <div key={item.title} style={card}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', marginBottom: 4 }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                ))}
            </div>

            {/* AI Principle */}
            <div style={{ ...card, marginTop: 20, background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#60a5fa', marginBottom: 6 }}>🤖 AI Transparency Principle</div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
                    MausamDeBug does not claim its AI detects "fake news" with absolute accuracy.
                    Instead, the system <strong style={{ color: '#0f172a' }}>estimates the credibility of weather reports</strong> using spatial,
                    temporal, meteorological and multi-source evidence. Terms like <em>credibility, confidence, corroboration,</em> and
                    <em> anomaly</em> are used intentionally to reflect the probabilistic nature of the system.
                </div>
            </div>

            {/* Disclaimer */}
            <div style={{ ...card, marginTop: 16, background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)' }}>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
                    <strong style={{ color: '#f59e0b' }}>⚠️ Disclaimer:</strong> MausamDeBug is an advanced technology demonstration.
                    It is NOT an official Government of India or IMD product. API integrations with government sources
                    would require appropriate authorization in a production deployment.
                </div>
            </div>
        </div>
    )
}

const card = { background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 20 }
