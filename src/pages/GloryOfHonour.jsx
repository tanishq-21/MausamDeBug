import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { PageHeader } from '../components/ui'
import {
    Trophy, Award, Gift, Sparkles, ShieldCheck, CheckCircle2,
    MapPin, Search, Filter, RefreshCw, Send, ArrowRight, DollarSign,
    Zap, Calendar, CreditCard, ExternalLink
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { INDIAN_STATES_AND_UTS } from '../services/gloryService'

export default function GloryOfHonour() {
    const navigate = useNavigate()
    const { gloryList, monthlyWinners, runStateLuckyDraw, userLocation } = useAppStore()

    const [activeTab, setActiveTab] = useState('draw') // 'draw' | 'hall_of_fame'
    const [selectedState, setSelectedState] = useState(userLocation?.state || 'Uttarakhand')
    const [drawingState, setDrawingState] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterState, setFilterState] = useState('all')

    // Find current winner for the selected state
    const currentWinner = useMemo(() => {
        return monthlyWinners.find(
            w => w.state?.toLowerCase().trim() === selectedState?.toLowerCase().trim()
        )
    }, [monthlyWinners, selectedState])

    // Filtered Glory Hall of Fame list
    const filteredGlory = useMemo(() => {
        return gloryList.filter(item => {
            if (filterState !== 'all' && item.state !== filterState) return false
            if (searchQuery) {
                const q = searchQuery.toLowerCase()
                const matchName = item.name?.toLowerCase().includes(q)
                const matchCity = item.city?.toLowerCase().includes(q)
                const matchState = item.state?.toLowerCase().includes(q)
                const matchTitle = item.report_title?.toLowerCase().includes(q)
                const matchId = item.report_id?.toLowerCase().includes(q)
                if (!matchName && !matchCity && !matchState && !matchTitle && !matchId) return false
            }
            return true
        })
    }, [gloryList, filterState, searchQuery])

    // Eligible candidates count for current selected state
    const eligibleCountForState = useMemo(() => {
        return gloryList.filter(
            g => g.state?.toLowerCase().trim() === selectedState?.toLowerCase().trim()
        ).length
    }, [gloryList, selectedState])

    // Trigger random lucky draw
    const handleTriggerLuckyDraw = async () => {
        setDrawingState(true)
        toast.loading(`Conducting random draw for ${selectedState}...`, { id: 'draw-progress' })

        setTimeout(() => {
            const winner = runStateLuckyDraw(selectedState)
            setDrawingState(false)
            if (winner) {
                toast.success(
                    `🎉 Winner Selected for ${selectedState}: ${winner.winner_name} wins ₹500!`,
                    { id: 'draw-progress', duration: 4000 }
                )
            } else {
                toast.error(`Could not conduct draw for ${selectedState}`, { id: 'draw-progress' })
            }
        }, 900)
    }

    return (
        <div style={{ padding: '24px 28px', maxWidth: 1200, margin: '0 auto' }}>
            <PageHeader
                title="Glory of Honour & State Lucky Draw"
                subtitle="Celebrating citizen weather sentinels across India who submit authorized and AI-verified ground reports."
            />

            {/* Hero Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a8a 100%)',
                borderRadius: 18,
                padding: '28px 32px',
                color: '#ffffff',
                marginBottom: 24,
                boxShadow: '0 12px 30px rgba(30, 27, 75, 0.25)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', right: -20, top: -20, width: 220, height: 220,
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
                    <div style={{ maxWidth: 650 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#fde047', marginBottom: 12 }}>
                            <Sparkles size={14} /> Monthly ₹500 State Citizen Prize Pool
                        </div>
                        <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 10px', color: '#ffffff', letterSpacing: '-0.02em' }}>
                            Authorized Citizen Weather Sentinels
                        </h2>
                        <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                            Citizens who report accurate, verified, and authorized weather incidents are enrolled into the
                            <strong> Glory of Honour</strong>. Every month, <strong>1 lucky citizen from each Indian State & UT</strong> is
                            randomly selected to receive an automated cash grant of <strong>₹500</strong> directly to their UPI ID!
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <button
                            onClick={() => navigate('/report')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: '#f59e0b', color: '#0f172a', border: 'none',
                                borderRadius: 10, padding: '12px 20px', fontWeight: 800,
                                fontSize: 13, cursor: 'pointer', transition: 'transform 0.15s ease',
                                boxShadow: '0 4px 14px rgba(245,158,11,0.4)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Send size={15} /> Submit Report & Qualify
                        </button>
                    </div>
                </div>

                {/* Stat Counters */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 14, marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.12)'
                }}>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 16px' }}>
                        <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Authorized Sentinels</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: '#38bdf8', marginTop: 4 }}>{gloryList.length} Citizens</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 16px' }}>
                        <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Prize Per State / Month</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: '#4ade80', marginTop: 4 }}>₹500 Cash</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 16px' }}>
                        <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total State Pool (36 States & UTs)</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: '#fde047', marginTop: 4 }}>₹18,000 / mo</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 16px' }}>
                        <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Avg AI Credibility Score</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: '#a78bfa', marginTop: 4 }}>95.2%</div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>
                <button
                    onClick={() => setActiveTab('draw')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 18px', borderRadius: 8, border: 'none',
                        background: activeTab === 'draw' ? '#2563eb' : '#f1f5f9',
                        color: activeTab === 'draw' ? '#ffffff' : '#475569',
                        fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s ease'
                    }}
                >
                    <Gift size={16} /> Monthly State Lucky Draw (₹500 Prize)
                </button>
                <button
                    onClick={() => setActiveTab('hall_of_fame')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 18px', borderRadius: 8, border: 'none',
                        background: activeTab === 'hall_of_fame' ? '#2563eb' : '#f1f5f9',
                        color: activeTab === 'hall_of_fame' ? '#ffffff' : '#475569',
                        fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s ease'
                    }}
                >
                    <Trophy size={16} /> Glory of Honour (Hall of Fame)
                </button>
            </div>

            {/* TAB 1: Monthly State Lucky Draw Simulator & Winners */}
            {activeTab === 'draw' && (
                <div>
                    {/* State Selector & Interactive Lucky Draw Card */}
                    <div style={{
                        background: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: 16,
                        padding: 24,
                        marginBottom: 24,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                                    🎯 State-by-State Lucky Draw (October 2026)
                                </h3>
                                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                                    Select any state to view or conduct the transparent random ₹500 draw among authorized reporters.
                                </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Select State / UT:</label>
                                <select
                                    value={selectedState}
                                    onChange={e => setSelectedState(e.target.value)}
                                    style={{
                                        padding: '8px 14px', borderRadius: 8, border: '1.5px solid #2563eb',
                                        background: '#eff6ff', color: '#1e3a8a', fontWeight: 700, fontSize: 13,
                                        outline: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif'
                                    }}
                                >
                                    {INDIAN_STATES_AND_UTS.map(st => (
                                        <option key={st} value={st}>{st}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Active State Draw Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            border: '1.5px solid #cbd5e1',
                            borderRadius: 14,
                            padding: 24,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 20,
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span style={{ fontSize: 20 }}>🏛️</span>
                                    <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{selectedState}</span>
                                    <span style={{ background: '#dcfce7', color: '#15803d', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>
                                        {eligibleCountForState > 0 ? `${eligibleCountForState} Eligible Reporters` : 'Enrolling Citizens'}
                                    </span>
                                </div>

                                {currentWinner ? (
                                    <div style={{ background: '#ffffff', borderRadius: 12, padding: 16, border: '1px solid #bfdbfe', boxShadow: '0 4px 10px rgba(37,99,235,0.06)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: 5 }}>
                                                🏆 Lucky Winner Selected
                                            </span>
                                            <span style={{ fontSize: 16, fontWeight: 800, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 6 }}>
                                                {currentWinner.prize} Won
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                                            {currentWinner.winner_name}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <MapPin size={13} color="#64748b" /> {currentWinner.city}, {currentWinner.state}
                                        </div>

                                        <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 10, marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                                            <div>
                                                <span style={{ color: '#64748b' }}>Payout Status: </span>
                                                <strong style={{ color: '#16a34a' }}>{currentWinner.payout_status}</strong>
                                            </div>
                                            <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#334155', fontWeight: 600 }}>
                                                Ref: {currentWinner.payout_ref}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ background: '#ffffff', borderRadius: 12, padding: 18, border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                                        <div style={{ fontSize: 28, marginBottom: 6 }}>🎁</div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>No draw completed yet for {selectedState}</div>
                                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                                            Click the button on the right to trigger the monthly random draw!
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Lucky Draw Trigger Panel */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#ffffff', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Zap size={15} color="#f59e0b" /> Provably Random Draw Mechanism
                                </div>
                                <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, margin: 0 }}>
                                    The selection algorithm operates over all authorized sentinels from {selectedState}.
                                    Once drawn, a ₹500 instant UPI transfer reference is created.
                                </p>
                                <button
                                    onClick={handleTriggerLuckyDraw}
                                    disabled={drawingState}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: '#ffffff', border: 'none', borderRadius: 8, padding: '12px 18px',
                                        fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'opacity 0.2s',
                                        boxShadow: '0 4px 12px rgba(16,185,129,0.3)', opacity: drawingState ? 0.7 : 1
                                    }}
                                >
                                    <Sparkles size={16} />
                                    {drawingState ? 'Selecting Random Winner…' : `🎲 Run Lucky Draw for ${selectedState}`}
                                </button>
                                <div style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>
                                    Monthly payout disbursed via National Unified Payments Interface (UPI)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* All States Lucky Draw Records Table */}
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 16,
                        padding: 22,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Award size={18} color="#2563eb" /> Active State Winners Ledger (October 2026)
                            </div>
                            <span style={{ fontSize: 12, color: '#64748b' }}>
                                Showing {monthlyWinners.length} states awarded
                            </span>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>
                                        <th style={{ padding: '10px 12px' }}>State / UT</th>
                                        <th style={{ padding: '10px 12px' }}>Lucky Citizen Winner</th>
                                        <th style={{ padding: '10px 12px' }}>City</th>
                                        <th style={{ padding: '10px 12px' }}>Prize Amount</th>
                                        <th style={{ padding: '10px 12px' }}>Report ID</th>
                                        <th style={{ padding: '10px 12px' }}>Disbursement Reference</th>
                                        <th style={{ padding: '10px 12px' }}>Draw Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyWinners.map((win, idx) => (
                                        <tr key={idx} style={{
                                            borderBottom: '1px solid #f1f5f9',
                                            background: win.state === selectedState ? '#eff6ff' : 'transparent',
                                            transition: 'background 0.15s ease'
                                        }}>
                                            <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>
                                                {win.state}
                                            </td>
                                            <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>
                                                <span style={{ marginRight: 6 }}>🏆</span> {win.winner_name}
                                            </td>
                                            <td style={{ padding: '12px', color: '#475569' }}>
                                                {win.city}
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ background: '#dcfce7', color: '#15803d', fontWeight: 800, padding: '3px 8px', borderRadius: 6, fontSize: 12 }}>
                                                    {win.prize}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <span
                                                    onClick={() => navigate(`/reports/${win.report_id}`)}
                                                    style={{ fontFamily: 'JetBrains Mono, monospace', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}
                                                >
                                                    {win.report_id}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#475569' }}>
                                                {win.payout_ref}
                                            </td>
                                            <td style={{ padding: '12px', color: '#64748b', fontSize: 12 }}>
                                                {win.draw_date}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: Glory of Honour (Hall of Fame) */}
            {activeTab === 'hall_of_fame' && (
                <div>
                    {/* Search & Filter bar */}
                    <div style={{
                        display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
                        marginBottom: 20, background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '6px 12px', flex: 1, minWidth: 240 }}>
                            <Search size={15} color="#94a3b8" />
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search sentinel by name, city, state, or report title..."
                                style={{ border: 'none', outline: 'none', width: '100%', fontSize: 13, background: 'transparent' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Filter size={15} color="#64748b" />
                            <select
                                value={filterState}
                                onChange={e => setFilterState(e.target.value)}
                                style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#ffffff', fontSize: 12, fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                            >
                                <option value="all">All States & UTs</option>
                                {INDIAN_STATES_AND_UTS.map(st => (
                                    <option key={st} value={st}>{st}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sentinel Cards Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: 16,
                        marginBottom: 30
                    }}>
                        {filteredGlory.map(sentinel => (
                            <div
                                key={sentinel.id}
                                style={{
                                    background: '#ffffff',
                                    border: sentinel.is_lucky_winner ? '1.5px solid #fbbf24' : '1px solid #e2e8f0',
                                    borderRadius: 14,
                                    padding: 20,
                                    boxShadow: sentinel.is_lucky_winner ? '0 6px 18px rgba(245,158,11,0.1)' : '0 2px 8px rgba(0,0,0,0.03)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    transition: 'transform 0.15s ease'
                                }}
                            >
                                {sentinel.is_lucky_winner && (
                                    <div style={{
                                        position: 'absolute', top: 12, right: 12,
                                        background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a',
                                        fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 999,
                                        display: 'flex', alignItems: 'center', gap: 4
                                    }}>
                                        <span>🏆</span> ₹500 State Winner
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                        color: '#ffffff', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontSize: 18, fontWeight: 800,
                                        boxShadow: '0 4px 10px rgba(37,99,235,0.2)'
                                    }}>
                                        {sentinel.badge || '🥇'}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                                            {sentinel.name}
                                        </div>
                                        <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <MapPin size={11} /> {sentinel.city}, {sentinel.state}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12, marginBottom: 14, flex: 1 }}>
                                    <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                                        Authorized Ground Incident
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', lineHeight: 1.4, marginBottom: 8 }}>
                                        "{sentinel.report_title}"
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                                        <span style={{ color: '#64748b' }}>Verified: {sentinel.verified_date}</span>
                                        <span
                                            onClick={() => navigate(`/reports/${sentinel.report_id}`)}
                                            style={{ color: '#2563eb', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
                                        >
                                            {sentinel.report_id} <ExternalLink size={10} />
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <ShieldCheck size={16} color="#16a34a" />
                                        <div>
                                            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>AI Credibility</div>
                                            <div style={{ fontSize: 13, fontWeight: 800, color: '#16a34a' }}>{sentinel.credibility_score}% Match</div>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            background: '#f1f5f9', color: '#475569', fontSize: 11,
                                            fontWeight: 700, padding: '3px 8px', borderRadius: 6
                                        }}>
                                            {sentinel.rank}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* How to Qualify for Glory & Cash Prize */}
            <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
            }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={18} color="#2563eb" /> How to Qualify for Glory of Honour & The ₹500 State Cash Prize
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                    <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#2563eb', marginBottom: 4 }}>1. Observe & Report</div>
                        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                            Report local weather conditions (rain, storm, waterlogging, heatwave) via the Citizen Report portal.
                        </div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a', marginBottom: 4 }}>2. AI & Ground Corroboration</div>
                        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                            The AI Credibility Engine cross-references your report with live Open-Meteo satellite and ground station telemetry.
                        </div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#f59e0b', marginBottom: 4 }}>3. Automatic Glory Induction</div>
                        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                            Reports scoring ≥ 75% credibility are authorized and permanently showcased in the Glory of Honour list.
                        </div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#7c3aed', marginBottom: 4 }}>4. State ₹500 Random Draw</div>
                        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
                            One lucky citizen from each of India's 36 States and UTs wins ₹500 transferred to their UPI ID every single month!
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="top-center" />
        </div>
    )
}
