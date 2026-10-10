export default function Architecture() {
    const layers = [
        { id: 'sources', label: 'DATA SOURCES', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', items: ['Open-Meteo Weather API', 'NASA FIRMS Satellite', 'IMD Official Feeds', 'Citizen Reports Portal', 'Social Media (Demo)', 'News RSS Feeds', 'IoT Weather Sensors'] },
        { id: 'ingestion', label: 'DATA INGESTION', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', items: ['Apache Kafka (Production)', 'Real-time Stream Processing', 'Data Validation Layer', 'Schema Normalization', 'Rate Limiting & Throttling', 'Deduplication Buffer'] },
        { id: 'ai', label: 'AI / ML ENGINE', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', items: ['NLP: Location & Event Extraction', 'DistilBERT Text Classification', 'Sentence Transformers (Dedup)', 'Computer Vision (OpenCV)', 'Credibility Scoring Formula', 'Event Correlation Engine'] },
        { id: 'storage', label: 'STORAGE', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', items: ['PostgreSQL + PostGIS', 'Redis Cache (hot data)', 'Object Storage (images)', 'Event Ledger', 'Audit Trail', 'Spatial Indexing'] },
        { id: 'api', label: 'FASTAPI BACKEND', color: '#10b981', bg: 'rgba(16,185,129,0.1)', items: ['REST API (50+ endpoints)', 'WebSocket Server', 'JWT Authentication', 'Role-based Access Control', 'CORS / Rate Limiting', 'Pydantic Validation'] },
        { id: 'frontend', label: 'REACT DASHBOARD', color: '#f97316', bg: 'rgba(249,115,22,0.1)', items: ['Real-time Event Map', 'AI Credibility UI', 'Admin Verification Panel', 'Analytics Dashboards', 'Citizen Report Form', 'Demo Mode Simulation'] },
    ]

    const techStack = [
        { category: 'Frontend', techs: ['React + Vite', 'Tailwind CSS', 'Leaflet Maps', 'Recharts', 'Framer Motion', 'Zustand'] },
        { category: 'Backend', techs: ['Python FastAPI', 'Uvicorn', 'Pydantic', 'PostgreSQL', 'PostGIS', 'Redis'] },
        { category: 'AI/ML', techs: ['PyTorch', 'Hugging Face', 'Sentence Transformers', 'scikit-learn', 'OpenCV', 'YOLO (optional)'] },
        { category: 'Infrastructure', techs: ['Docker', 'Docker Compose', 'Apache Kafka', 'Nginx', 'Cloud Deploy', 'GitHub CI/CD'] },
    ]

    return (
        <div style={{ padding: 24, maxWidth: 1400 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>System Architecture</h1>
                <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
                    MausamDeBug end-to-end data pipeline from raw sources to geospatial dashboard
                </p>
            </div>

            {/* Pipeline flow */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {layers.map((layer, i) => (
                        <div key={layer.id}>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
                                {/* Left label */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, marginLeft: 12, flexShrink: 0 }}>
                                    {i > 0 && <div style={{ width: 2, height: 20, background: `${layer.color}44` }} />}
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: layer.color, flexShrink: 0, boxShadow: `0 0 8px ${layer.color}66` }} />
                                    {i < layers.length - 1 && <div style={{ width: 2, flex: 1, background: `${layer.color}44` }} />}
                                </div>

                                {/* Content card */}
                                <div style={{ flex: 1, background: layer.bg, border: `1px solid ${layer.color}33`, borderRadius: 12, padding: '14px 18px', marginBottom: 8 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: layer.color, letterSpacing: '0.08em', marginBottom: 10 }}>{layer.label}</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {layer.items.map(item => (
                                            <span key={item} style={{ padding: '3px 10px', borderRadius: 999, background: `${layer.color}15`, border: `1px solid ${layer.color}25`, color: '#d1d5db', fontSize: 12 }}>{item}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech stack */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {techStack.map(cat => (
                    <div key={cat.category} style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{cat.category}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            {cat.techs.map(t => (
                                <span key={t} style={{ fontSize: 12, color: '#1e293b', padding: '4px 8px', background: 'rgba(0,0,0,0.04)', borderRadius: 6 }}>{t}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Deployment note */}
            <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: 16, fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
                <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: 6 }}>📐 Scalability Note</div>
                Architecture is designed to scale to national-level streaming infrastructure using
                Apache Kafka for real-time stream processing, distributed PostgreSQL/PostGIS for spatial queries,
                and containerized microservices via Docker on cloud platforms (AWS / GCP / Azure).
                The AI pipeline is modular — individual models can be swapped or upgraded independently.
            </div>
        </div>
    )
}
