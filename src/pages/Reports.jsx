import { useState, useMemo } from 'react'
import { useAppStore } from '../store/appStore'
import { PageHeader, FilterBar, CredibilityCircle, EventTypeBadge, StatusBadge, SeverityBadge } from '../components/ui'
import ReportCard from '../components/ReportCard'
import { Search, Calendar, MapPin, X, ChevronDown, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { INDIAN_CITIES } from '../data/mockData'

// ── Quick date range helpers ───────────────────────────────────────────────────
const getDateRange = (preset) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    switch (preset) {
        case 'today': return { from: today, to: now }
        case 'yesterday': {
            const y = new Date(today); y.setDate(y.getDate() - 1)
            const yt = new Date(y); yt.setHours(23, 59, 59, 999)
            return { from: y, to: yt }
        }
        case 'last7': {
            const d = new Date(today); d.setDate(d.getDate() - 7)
            return { from: d, to: now }
        }
        case 'last30': {
            const d = new Date(today); d.setDate(d.getDate() - 30)
            return { from: d, to: now }
        }
        default: return null
    }
}

export default function Reports() {
    const { reports, filters, setFilter, getFilteredReports, resetFilters } = useAppStore()
    const [searchLocal, setSearchLocal] = useState(filters.search || '')
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 12

    // ── Advanced filter state ──────────────────────────────────────────────────
    const [datePreset, setDatePreset] = useState('all')   // 'all' | 'today' | 'yesterday' | 'last7' | 'last30' | 'custom'
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [locationSearch, setLocationSearch] = useState('')
    const [selectedLocation, setSelectedLocation] = useState(null)  // { city, state } or null
    const [locationDropdown, setLocationDropdown] = useState(false)
    const [sortBy, setSortBy] = useState('latest')
    const [sortDropdown, setSortDropdown] = useState(false)

    const handleSearch = (e) => {
        setSearchLocal(e.target.value); setFilter('search', e.target.value); setPage(1)
    }

    // Build unique location list from existing reports
    const locationOptions = useMemo(() => {
        const seen = new Set()
        const opts = []
        reports.forEach(r => {
            const key = `${r.city}||${r.state}`
            if (!seen.has(key)) { seen.add(key); opts.push({ city: r.city, state: r.state, label: `${r.city}, ${r.state}` }) }
        })
        return opts.sort((a, b) => a.label.localeCompare(b.label))
    }, [reports])

    const filteredLocationOptions = locationOptions.filter(o =>
        o.label.toLowerCase().includes(locationSearch.toLowerCase())
    )

    // ── Apply all filters ──────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        let base = getFilteredReports()

        // Date filter
        let dateRange = null
        if (datePreset !== 'all' && datePreset !== 'custom') {
            dateRange = getDateRange(datePreset)
        } else if (datePreset === 'custom' && fromDate) {
            dateRange = {
                from: new Date(fromDate),
                to: toDate ? new Date(toDate + 'T23:59:59') : new Date()
            }
        }
        if (dateRange) {
            base = base.filter(r => {
                const ts = new Date(r.timestamp)
                return ts >= dateRange.from && ts <= dateRange.to
            })
        }

        // Location filter
        if (selectedLocation) {
            base = base.filter(r =>
                r.city === selectedLocation.city && r.state === selectedLocation.state
            )
        }

        // Sort
        const SMAP = {
            latest: (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
            oldest: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
            severity: (a, b) => {
                const SEV = ['LOW', 'MODERATE', 'HIGH', 'SEVERE', 'EXTREME']
                return SEV.indexOf(b.severity) - SEV.indexOf(a.severity)
            },
            credibility: (a, b) => b.credibility_score - a.credibility_score,
        }
        if (SMAP[sortBy]) base = [...base].sort(SMAP[sortBy])

        return base
    }, [reports, filters, datePreset, fromDate, toDate, selectedLocation, sortBy])

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

    const handleReset = () => {
        resetFilters()
        setSearchLocal('')
        setDatePreset('all')
        setFromDate('')
        setToDate('')
        setSelectedLocation(null)
        setLocationSearch('')
        setSortBy('latest')
        setPage(1)
    }

    // Active chips
    const chips = []
    if (datePreset !== 'all') {
        const presetLabels = { today: 'Today', yesterday: 'Yesterday', last7: 'Last 7 Days', last30: 'Last 30 Days', custom: `${fromDate}${toDate ? ' → ' + toDate : ''}` }
        chips.push({ key: 'date', label: `📅 ${presetLabels[datePreset]}`, onRemove: () => { setDatePreset('all'); setFromDate(''); setToDate(''); setPage(1) } })
    }
    if (selectedLocation) {
        chips.push({ key: 'loc', label: `📍 ${selectedLocation.label}`, onRemove: () => { setSelectedLocation(null); setPage(1) } })
    }
    if (searchLocal) {
        chips.push({ key: 'search', label: `🔍 "${searchLocal}"`, onRemove: () => { setSearchLocal(''); setFilter('search', ''); setPage(1) } })
    }

    const SORT_LABELS = { latest: 'Latest First', oldest: 'Oldest First', severity: 'Highest Severity', credibility: 'Highest Credibility' }

    return (
        <div style={{ padding: 24, maxWidth: 1400 }}>
            <PageHeader
                title="Weather Reports"
                subtitle={`${filtered.length} report${filtered.length !== 1 ? 's' : ''} found`}
                actions={<button onClick={handleReset} style={btnStyle}>Reset Filters</button>}
            />

            {/* ── Enhanced Filter Panel ──────────────────────────────────────── */}
            <div style={filterPanel}>

                {/* Row 1: Search + Date + Location + Sort */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>

                    {/* Keyword search */}
                    <div style={{ position: 'relative', minWidth: 200 }}>
                        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input value={searchLocal} onChange={handleSearch} placeholder="Search reports..."
                            style={{ ...fieldStyle, paddingLeft: 30, width: 200 }} />
                    </div>

                    {/* Date Preset */}
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Calendar size={13} style={{ color: '#64748b' }} />
                        {['all', 'today', 'yesterday', 'last7', 'last30', 'custom'].map(p => (
                            <button key={p} onClick={() => { setDatePreset(p); setPage(1) }} style={{
                                ...chipBtn,
                                background: datePreset === p ? '#3b82f6' : '#f1f5f9',
                                color: datePreset === p ? '#fff' : '#475569',
                            }}>
                                {{ all: 'All Time', today: 'Today', yesterday: 'Yesterday', last7: '7 Days', last30: '30 Days', custom: 'Custom' }[p]}
                            </button>
                        ))}
                    </div>

                    {/* Sort By */}
                    <div style={{ position: 'relative', marginLeft: 'auto' }}>
                        <button onClick={() => setSortDropdown(v => !v)} style={{ ...fieldStyle, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', paddingRight: 12 }}>
                            <ArrowUpDown size={13} style={{ color: '#64748b' }} />
                            <span style={{ fontSize: 12, color: '#475569' }}>{SORT_LABELS[sortBy]}</span>
                            <ChevronDown size={12} style={{ color: '#94a3b8' }} />
                        </button>
                        {sortDropdown && (
                            <div style={dropdownStyle}>
                                {Object.entries(SORT_LABELS).map(([k, v]) => (
                                    <div key={k} onClick={() => { setSortBy(k); setSortDropdown(false); setPage(1) }}
                                        style={{ ...dropdownItem, background: sortBy === k ? 'rgba(59,130,246,0.08)' : 'transparent', color: sortBy === k ? '#3b82f6' : '#475569', fontWeight: sortBy === k ? 600 : 400 }}>
                                        {v}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Row 2: Custom date inputs + Location filter */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>

                    {/* Custom date range (shown only when custom selected) */}
                    {datePreset === 'custom' && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <label style={labelSt}>From:</label>
                                <input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setPage(1) }} style={fieldStyle} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <label style={labelSt}>To:</label>
                                <input type="date" value={toDate} onChange={e => { setToDate(e.target.value); setPage(1) }} style={fieldStyle} />
                            </div>
                        </>
                    )}

                    {/* Location filter */}
                    <div style={{ position: 'relative' }}>
                        <MapPin size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            value={selectedLocation ? selectedLocation.label : locationSearch}
                            onChange={e => { setLocationSearch(e.target.value); setSelectedLocation(null); setLocationDropdown(true) }}
                            onFocus={() => setLocationDropdown(true)}
                            onBlur={() => setTimeout(() => setLocationDropdown(false), 200)}
                            placeholder="Filter by location..."
                            style={{ ...fieldStyle, paddingLeft: 30, width: 220 }}
                        />
                        {selectedLocation && (
                            <button onClick={() => { setSelectedLocation(null); setLocationSearch(''); setPage(1) }} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, lineHeight: 1 }}>
                                <X size={14} />
                            </button>
                        )}
                        {locationDropdown && !selectedLocation && filteredLocationOptions.length > 0 && (
                            <div style={{ ...dropdownStyle, maxHeight: 200, overflowY: 'auto', width: 240 }}>
                                <div onClick={() => { setSelectedLocation(null); setLocationSearch(''); setLocationDropdown(false); setPage(1) }}
                                    style={{ ...dropdownItem, fontStyle: 'italic', color: '#94a3b8' }}>🌏 All Locations</div>
                                {filteredLocationOptions.slice(0, 30).map((o, i) => (
                                    <div key={i} onClick={() => { setSelectedLocation(o); setLocationSearch(''); setLocationDropdown(false); setPage(1) }}
                                        style={{ ...dropdownItem }}>
                                        <span style={{ color: '#475569' }}>{o.city}</span>
                                        <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>{o.state}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Existing FilterBar (event type, status, source) */}
                    <FilterBar filters={filters} onFilterChange={(k, v) => { setFilter(k, v); setPage(1) }} />
                </div>

                {/* Active filter chips */}
                {chips.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Active:</span>
                        {chips.map(c => (
                            <div key={c.key} style={activeChip}>
                                {c.label}
                                <button onClick={c.onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '0 0 0 6px', display: 'flex', alignItems: 'center' }}>
                                    <X size={11} />
                                </button>
                            </div>
                        ))}
                        <button onClick={handleReset} style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', padding: 0 }}>
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Result count banner */}
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16, fontWeight: 500 }}>
                <SlidersHorizontal size={13} style={{ marginRight: 6, verticalAlign: 'middle', color: '#94a3b8' }} />
                <strong style={{ color: '#0f172a' }}>{filtered.length}</strong> reports found
                {selectedLocation && <span> in <strong>{selectedLocation.label}</strong></span>}
                {datePreset !== 'all' && <span> · <strong>date filtered</strong></span>}
            </div>

            {/* Report grid */}
            {paginated.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
                    <div style={{ fontSize: 40, marginBottom: 14 }}>🔍</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#64748b' }}>No reports found for the selected date and location.</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>Try adjusting your filters or resetting them.</div>
                    <button onClick={handleReset} style={{ marginTop: 20, ...btnStyle, background: '#eff6ff', color: '#3b82f6', borderColor: '#bfdbfe' }}>
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, marginBottom: 20 }}>
                    {paginated.map(r => <ReportCard key={r.id} report={r} />)}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pgBtn(page === 1)}>← Prev</button>
                    {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                        const p = i + 1
                        return (
                            <button key={p} onClick={() => setPage(p)} style={{ ...pgBtn(false), background: page === p ? 'rgba(59,130,246,0.15)' : 'transparent', color: page === p ? '#3b82f6' : '#475569', fontWeight: page === p ? 700 : 400 }}>{p}</button>
                        )
                    })}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pgBtn(page === totalPages)}>Next →</button>
                </div>
            )}
        </div>
    )
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const filterPanel = {
    background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)',
    borderRadius: 14, padding: '16px 20px', marginBottom: 20,
    boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
}
const fieldStyle = {
    padding: '7px 12px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.09)',
    borderRadius: 8, color: '#0f172a', fontSize: 12, outline: 'none',
    fontFamily: 'Inter, sans-serif', transition: 'border-color 0.15s', cursor: 'text',
}
const chipBtn = {
    padding: '5px 10px', borderRadius: 999, border: '1px solid transparent',
    fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
    fontFamily: 'Inter, sans-serif',
}
const activeChip = {
    display: 'flex', alignItems: 'center', gap: 4,
    background: 'rgba(59,130,246,0.08)', color: '#3b82f6',
    border: '1px solid rgba(59,130,246,0.2)', borderRadius: 999,
    fontSize: 11, fontWeight: 600, padding: '4px 10px',
}
const dropdownStyle = {
    position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: 180,
    background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden',
}
const dropdownItem = {
    padding: '9px 14px', fontSize: 12, cursor: 'pointer', color: '#475569',
    transition: 'background 0.1s', fontFamily: 'Inter, sans-serif',
    display: 'flex', alignItems: 'center',
}
const labelSt = { fontSize: 12, color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }
const btnStyle = { padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.05)', color: '#475569', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }
const pgBtn = (disabled) => ({ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.08)', background: 'transparent', color: disabled ? '#cbd5e1' : '#475569', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif' })
