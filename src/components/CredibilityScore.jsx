import { computeCredibility, getTier } from '../utils/credibility'
import { useAppStore } from '../store/appStore'

export default function CredibilityScore({ report, compact = false }) {
    const { reports } = useAppStore()
    const { score, tier, breakdown } = computeCredibility(report, reports)

    if (compact) return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: tier.bg, border: `1px solid ${tier.color}33`,
            borderRadius: 999, padding: '3px 10px', fontSize: 12, fontWeight: 700, color: tier.color,
        }}>
            {score}% <span style={{ fontWeight: 400 }}>— {tier.label}</span>
        </span>
    )

    return (
        <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 20 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>🧠 AI Credibility Score</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 28, fontWeight: 900, color: tier.color }}>{score}%</span>
                    <span style={{
                        padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                        background: tier.bg, color: tier.color, border: `1px solid ${tier.color}44`,
                    }}>{tier.label}</span>
                </div>
            </div>

            {/* Master bar */}
            <div style={{ height: 10, background: 'rgba(0,0,0,0.06)', borderRadius: 999, marginBottom: 20, overflow: 'hidden' }}>
                <div style={{
                    height: '100%', width: `${score}%`, borderRadius: 999,
                    background: `linear-gradient(90deg, ${tier.color}99, ${tier.color})`,
                    transition: 'width 0.8s ease', boxShadow: `0 2px 8px ${tier.color}44`,
                }} />
            </div>

            {/* Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {breakdown.map(item => (
                    <div key={item.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569', marginBottom: 4 }}>
                            <span>{item.label}</span>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.score}/{item.max}
                                <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: 4 }}>
                                    ({Math.round(item.weight * 100)}% weight)
                                </span>
                            </span>
                        </div>
                        <div style={{ height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', width: `${(item.score / item.max) * 100}%`, borderRadius: 999,
                                background: item.score / item.max >= 0.75 ? '#10b981' : item.score / item.max >= 0.4 ? '#f59e0b' : '#ef4444',
                                transition: 'width 0.8s ease',
                            }} />
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 14, fontSize: 11, color: '#94a3b8' }}>
                Formula: C = 0.30W + 0.25N + 0.20G + 0.15S + 0.10T  ·  Weights are configurable
            </div>
        </div>
    )
}
