import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { CheckCircle, Circle, Loader, X, Play } from 'lucide-react'

const SCENARIO_STEPS = [
    { label: 'New Citizen Report Received', detail: 'Report: Heavy rain at Rajpur Road, Dehradun' },
    { label: 'AI Classification', detail: 'Event Type: Heavy Rainfall — 91% confidence' },
    { label: 'Location Extraction', detail: 'Dehradun, Uttarakhand (30.31°N, 78.03°E)' },
    { label: 'Weather API Verification', detail: 'Open-Meteo confirms: 18.4mm/h rainfall ✓' },
    { label: 'Duplicate Detection', detail: '3 near-identical reports found & grouped' },
    { label: 'News Correlation', detail: '14 news articles reporting same incident' },
    { label: 'Multi-source Correlation', detail: '127 reports → 1 unified event EV-1024' },
    { label: 'Credibility Score Calculated', detail: 'Score: 94/100 — HIGH CREDIBILITY' },
    { label: 'Smart Alert Dispatched', detail: 'Admin notified. Severity: HIGH' },
    { label: 'Map & Dashboard Updated', detail: 'Live marker placed. Stats refreshed.' },
]

export default function DemoModePanel() {
    const { demoScenarioRunning, setDemoScenarioRunning, setDemoMode, addReport, addNotification } = useAppStore()
    const [currentStep, setCurrentStep] = useState(-1)
    const [completed, setCompleted] = useState([])
    const [showResult, setShowResult] = useState(false)

    const runScenario = () => {
        if (demoScenarioRunning) return
        setDemoScenarioRunning(true)
        setCompleted([])
        setShowResult(false)
        setCurrentStep(0)

        SCENARIO_STEPS.forEach((step, i) => {
            const delay = i * 1400
            setTimeout(() => {
                setCurrentStep(i)
                setCompleted(prev => [...prev, i - 1].filter(x => x >= 0))
                if (i === SCENARIO_STEPS.length - 1) {
                    addReport({
                        id: `MSA-DEMO-${Date.now()}`, event_type: 'rainfall',
                        text: 'Heavy rainfall at Rajpur Road, Dehradun. Roads waterlogged.',
                        source: 'citizen', source_label: 'Citizen Report', location: 'Dehradun, Uttarakhand',
                        city: 'Dehradun', state: 'Uttarakhand', latitude: 30.3165, longitude: 78.0322,
                        credibility_score: 94, verification_status: 'verified', severity: 'HIGH',
                        timestamp: new Date().toISOString(), minutes_ago: 0, has_image: true, duplicate_group: 'EV-1024',
                    })
                    addNotification({ type: 'critical', message: 'HIGH: Heavy Rainfall confirmed in Dehradun — 94% credibility' })
                    setTimeout(() => {
                        setCompleted(SCENARIO_STEPS.map((_, idx) => idx))
                        setCurrentStep(-1)
                        setShowResult(true)
                        setDemoScenarioRunning(false)
                    }, 1200)
                }
            }, delay)
        })
    }

    const reset = () => { setCurrentStep(-1); setCompleted([]); setShowResult(false) }

    return (
        <div style={{ position: 'fixed', bottom: 20, right: 20, width: 340, background: '#ffffff', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', zIndex: 9998, overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(6,182,212,0.06))', padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0 }}>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6' }}>🎬 Demo Mode Active</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Dehradun Heavy Rainfall Scenario</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {!demoScenarioRunning && (
                        <button onClick={showResult ? reset : runScenario} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 6, border: 'none', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                            <Play size={11} /> {showResult ? 'Reset' : '▶ Run'}
                        </button>
                    )}
                    <button onClick={() => setDemoMode(false)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'rgba(0,0,0,0.05)', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Idle */}
            {!demoScenarioRunning && currentStep === -1 && !showResult && (
                <div style={{ padding: '14px 16px', fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
                    Click <strong style={{ color: '#3b82f6' }}>▶ Run</strong> to watch a complete 10-step weather incident pipeline: citizen report → AI classification → multi-source correlation → unified event.
                    <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 11, color: '#10b981' }}>
                        ● Live stream running — reports appear on map every 4s
                    </div>
                </div>
            )}

            {/* Steps */}
            {(demoScenarioRunning || (currentStep >= 0 && !showResult)) && (
                <div style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Processing Pipeline</div>
                    {SCENARIO_STEPS.map((step, i) => {
                        const isDone = completed.includes(i)
                        const isActive = currentStep === i && !isDone
                        const isPending = i > currentStep
                        return (
                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, opacity: isPending ? 0.35 : 1, transition: 'opacity 0.4s' }}>
                                <div style={{ flexShrink: 0, marginTop: 2 }}>
                                    {isDone ? <CheckCircle size={14} color="#10b981" />
                                        : isActive ? <Loader size={14} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
                                            : <Circle size={14} color="#cbd5e1" />}
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isDone ? '#10b981' : isActive ? '#0f172a' : '#64748b' }}>{step.label}</div>
                                    {(isDone || isActive) && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{step.detail}</div>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Final Result */}
            {showResult && (
                <div style={{ margin: 14, padding: 16, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>✅ UNIFIED WEATHER EVENT CREATED</div>
                    <div style={{ fontSize: 24, textAlign: 'center', margin: '6px 0' }}>🌧</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>Heavy Rainfall</div>
                    <div style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginBottom: 14 }}>📍 Dehradun, Uttarakhand</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                        {[['127', 'Related Reports'], ['14', 'News Sources'], ['5', 'Weather Obs.'], ['2', 'Official Alerts']].map(([val, lbl]) => (
                            <div key={lbl} style={{ background: '#fff', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: 18, fontWeight: 800, color: '#3b82f6' }}>{val}</div>
                                <div style={{ fontSize: 10, color: '#64748b' }}>{lbl}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ flex: 1, padding: '8px 0', background: 'rgba(16,185,129,0.15)', borderRadius: 8, textAlign: 'center' }}>
                            <div style={{ fontSize: 18, fontWeight: 900, color: '#10b981' }}>94%</div>
                            <div style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>HIGH</div>
                        </div>
                        <div style={{ flex: 1, padding: '8px 0', background: 'rgba(239,68,68,0.1)', borderRadius: 8, textAlign: 'center' }}>
                            <div style={{ fontSize: 14, fontWeight: 900, color: '#ef4444' }}>HIGH</div>
                            <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>SEVERITY</div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
