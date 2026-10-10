import { useState } from 'react'
import { explainScore } from '../utils/credibility'
import { useAppStore } from '../store/appStore'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function WhyThisScore({ report }) {
    const { reports } = useAppStore()
    const { reasons, warnings } = explainScore(report, reports)
    const [open, setOpen] = useState(false)

    return (
        <div style={{ background: '#f8fafc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, overflow: 'hidden' }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    width: '100%', padding: '14px 20px', background: 'transparent', border: 'none',
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>💡 Why this score?</span>
                {open ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
            </button>

            {open && (
                <div style={{ padding: '0 20px 16px' }}>
                    {reasons.map((r, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6, fontSize: 13, color: '#0f172a' }}>
                            <span style={{ color: '#10b981', fontWeight: 700, flexShrink: 0 }}>✓</span> {r}
                        </div>
                    ))}
                    {warnings.map((w, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6, fontSize: 13, color: '#92400e' }}>
                            <span style={{ color: '#f59e0b', fontWeight: 700, flexShrink: 0 }}>⚠</span> {w}
                        </div>
                    ))}
                    <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(59,130,246,0.06)', borderRadius: 8, fontSize: 11, color: '#475569' }}>
                        These factors influence the credibility estimate. The system does not claim absolute truth.
                    </div>
                </div>
            )}
        </div>
    )
}
