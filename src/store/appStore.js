import { create } from 'zustand'
import { MOCK_REPORTS, MOCK_EVENTS, MOCK_STATS } from '../data/mockData'
import {
    fetchReports, fetchEvents, fetchStats,
    updateReportStatus, createReport as apiCreateReport
} from '../services/api'
import {
    getRealWeatherEvents, getRealWeatherAlerts, fetchLiveIndianWeather,
    detectUserLocationAndWeather, getSavedUserLocation
} from '../services/realWeatherService'
import {
    getStoredGloryList, saveStoredGloryList,
    getStoredMonthlyWinners, saveStoredMonthlyWinners,
    drawRandomStateWinner
} from '../services/gloryService'

const LOCAL_STORAGE_REPORTS_KEY = 'mausam_citizen_reports_v1'

function getSavedLocalReports() {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

function saveLocalReports(reports) {
    try {
        localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports))
    } catch {
        // ignore storage errors
    }
}

const initialSavedLoc = getSavedUserLocation()
const initialGloryList = getStoredGloryList()
const initialMonthlyWinners = getStoredMonthlyWinners()

export const useAppStore = create((set, get) => ({
    // Data
    reports: [],
    events: [],
    realAlerts: [],
    liveStations: [],
    stats: MOCK_STATS,

    // Glory of Honour & Monthly State Lucky Winners
    gloryList: initialGloryList,
    monthlyWinners: initialMonthlyWinners,

    // Real detected user location and live temperature
    userLocation: initialSavedLoc,
    userWeather: initialSavedLoc?.weather || null,
    isLocatingUser: false,

    // Loading state
    loading: true,
    apiOnline: false,

    // Filters
    filters: {
        date: 'all',
        eventType: 'all',
        status: 'all',
        source: 'all',
        search: '',
    },

    // Auth / Role
    role: 'user',   // 'user' | 'admin'
    setRole: (val) => set({ role: val }),

    // UI State
    demoMode: false,
    demoScenarioRunning: false,
    wsConnected: true,
    activeTab: 'dashboard',
    selectedEvent: null,
    selectedReport: null,
    notifications: [],
    sidebarOpen: true,

    // Detect user location and fetch live weather
    detectUserLocation: async (force = true) => {
        set({ isLocatingUser: true })
        try {
            const loc = await detectUserLocationAndWeather({ force })
            if (loc) {
                set({
                    userLocation: loc,
                    userWeather: loc.weather,
                    isLocatingUser: false
                })
                return loc
            }
        } catch (err) {
            console.warn('[Store] detectUserLocation error:', err.message)
        }
        set({ isLocatingUser: false })
        return null
    },

    setUserLocation: (loc) => {
        if (loc) {
            try {
                localStorage.setItem('mausam_detected_user_location', JSON.stringify(loc))
            } catch {}
        }
        set({
            userLocation: loc,
            userWeather: loc?.weather || null
        })
    },

    // ── Bootstrap: load real live data + API + local citizen submissions ─────
    loadData: async () => {
        set({ loading: true })

        // 1. Load real live weather events and alerts from Open-Meteo
        let realEvents = []
        let realAlerts = []
        let liveStations = []

        try {
            const [evs, alrts, stns] = await Promise.all([
                getRealWeatherEvents(),
                getRealWeatherAlerts(),
                fetchLiveIndianWeather(),
                get().detectUserLocation(),
            ])
            realEvents = evs
            realAlerts = alrts
            liveStations = stns
        } catch (err) {
            console.warn('[Store] Live weather fetch fallback:', err.message)
            realEvents = MOCK_EVENTS
        }

        // 2. Load reports from API or fallback, then prepend saved citizen reports
        let baseReports = []
        let isApiOnline = false
        try {
            const apiReports = await fetchReports()
            baseReports = apiReports
            isApiOnline = true
        } catch {
            baseReports = MOCK_REPORTS
        }

        const localReports = getSavedLocalReports()
        // Deduplicate
        const mergedReports = [
            ...localReports,
            ...baseReports.filter(r => !localReports.some(lr => lr.id === r.id))
        ]

        // 3. Convert citizen reports with coords into map events so they appear on the map
        const citizenEvents = localReports.map(rep => ({
            id: `EV-CITIZEN-${rep.id}`,
            event_type: rep.event_type,
            location: rep.location,
            city: rep.city || rep.location.split(',')[0].trim(),
            state: rep.state || 'India',
            latitude: rep.latitude,
            longitude: rep.longitude,
            severity: rep.severity || 'MODERATE',
            confidence: rep.credibility_score || 85,
            report_count: 1,
            source_count: 1,
            status: rep.verification_status || 'verified',
            start_time: rep.timestamp,
            last_updated: rep.timestamp,
            is_citizen_report: true,
            temperature: rep.temp || 24,
            summary: rep.text,
        }))

        const combinedEvents = [...citizenEvents, ...realEvents]

        // 4. Generate dynamic notifications from real live alerts
        const dynamicNotifications = realAlerts.slice(0, 5).map((alert, idx) => ({
            id: `notif-${alert.id || idx}`,
            type: alert.severity === 'Extreme' || alert.severity === 'High' ? 'critical' : 'warning',
            message: `${alert.title} in ${alert.location}: ${alert.liveMetric || ''}`,
            time: 'Just now',
            read: false,
        }))

        // 5. Compute stats from real counts
        const verifiedCount = mergedReports.filter(r => r.verification_status === 'verified').length
        const pendingCount = mergedReports.filter(r => r.verification_status === 'pending').length
        const suspiciousCount = mergedReports.filter(r => r.verification_status === 'suspicious').length

        set({
            reports: mergedReports,
            events: combinedEvents,
            realAlerts,
            liveStations,
            notifications: dynamicNotifications.length ? dynamicNotifications : [
                { id: 1, type: 'critical', message: 'Heavy Rainfall Alert active for Dehradun', time: 'Just now', read: false },
                { id: 2, type: 'info', message: 'Live satellite and ground weather telemetry connected', time: '1 min ago', read: true }
            ],
            stats: {
                totalReports: mergedReports.length,
                verified: verifiedCount,
                pending: pendingCount,
                suspicious: suspiciousCount,
                rejected: mergedReports.filter(r => r.verification_status === 'rejected').length,
                activeEvents: combinedEvents.length,
                regionsMonitored: liveStations.length || 28,
                dataQuality: 94.8,
            },
            loading: false,
            apiOnline: isApiOnline,
        })
    },

    // ── Filters ───────────────────────────────────────────────────────────────
    setFilter: (key, value) => set(state => ({
        filters: { ...state.filters, [key]: value }
    })),

    resetFilters: () => set({
        filters: { date: 'all', eventType: 'all', status: 'all', source: 'all', search: '' }
    }),

    // ── Reports ───────────────────────────────────────────────────────────────
    addReport: async (reportData) => {
        const saved = await apiCreateReport(reportData)
        const currentSaved = getSavedLocalReports()
        saveLocalReports([saved, ...currentSaved])

        // Create immediate map event if location coords are present
        const newMapEvent = {
            id: `EV-CITIZEN-${saved.id}`,
            event_type: saved.event_type,
            location: saved.location,
            city: saved.city || saved.location.split(',')[0].trim(),
            state: saved.state || 'India',
            latitude: saved.latitude || 28.6139,
            longitude: saved.longitude || 77.2090,
            severity: saved.severity || 'MODERATE',
            confidence: saved.credibility_score || 85,
            report_count: 1,
            source_count: 1,
            status: saved.verification_status || 'verified',
            start_time: saved.timestamp || new Date().toISOString(),
            last_updated: saved.timestamp || new Date().toISOString(),
            is_citizen_report: true,
            temperature: 24,
            summary: saved.text,
        }

        set(state => ({
            reports: [saved, ...state.reports],
            events: [newMapEvent, ...state.events],
            stats: { ...state.stats, totalReports: state.stats.totalReports + 1, pending: state.stats.pending + 1 }
        }))
        return saved
    },

    verifyReport: async (id) => {
        await updateReportStatus(id, 'verified')
        set(state => ({
            reports: state.reports.map(r => r.id === id ? { ...r, verification_status: 'verified' } : r),
            stats: { ...state.stats, verified: state.stats.verified + 1, pending: Math.max(0, state.stats.pending - 1) }
        }))
    },

    rejectReport: async (id) => {
        await updateReportStatus(id, 'rejected')
        set(state => ({
            reports: state.reports.map(r => r.id === id ? { ...r, verification_status: 'rejected' } : r),
            stats: { ...state.stats, rejected: (state.stats.rejected || 0) + 1, pending: Math.max(0, state.stats.pending - 1) }
        }))
    },

    markSuspicious: async (id) => {
        await updateReportStatus(id, 'suspicious')
        set(state => ({
            reports: state.reports.map(r => r.id === id ? { ...r, verification_status: 'suspicious' } : r),
        }))
    },

    // ── Glory of Honour & Monthly State Lucky Draw ───────────────────────────
    addGloryEntry: (entry) => {
        const current = get().gloryList
        const updated = [entry, ...current.filter(g => g.id !== entry.id)]
        saveStoredGloryList(updated)
        set({ gloryList: updated })
    },

    runStateLuckyDraw: (stateName) => {
        const { gloryList, monthlyWinners } = get()
        const eligible = gloryList.filter(g =>
            g.state?.toLowerCase().trim() === stateName?.toLowerCase().trim() ||
            g.city?.toLowerCase().trim() === stateName?.toLowerCase().trim()
        )
        const result = drawRandomStateWinner(stateName, eligible.length > 0 ? eligible : gloryList)
        if (!result) return null

        const { winner, chosenCitizenId } = result
        const updatedWinners = [winner, ...monthlyWinners.filter(w => w.state !== stateName)]
        saveStoredMonthlyWinners(updatedWinners)

        const updatedGlory = gloryList.map(g =>
            g.id === chosenCitizenId || g.name === winner.winner_name
                ? { ...g, is_lucky_winner: true, prize_won: '₹500', badge: '🏆' }
                : g
        )
        saveStoredGloryList(updatedGlory)

        set({
            monthlyWinners: updatedWinners,
            gloryList: updatedGlory,
        })
        return winner
    },

    // ── UI Setters ────────────────────────────────────────────────────────────
    setDemoMode: (val) => set({ demoMode: val }),
    setDemoScenarioRunning: (val) => set({ demoScenarioRunning: val }),
    setWsConnected: (val) => set({ wsConnected: val }),
    setSidebarOpen: (val) => set({ sidebarOpen: val }),
    setSelectedEvent: (ev) => set({ selectedEvent: ev }),
    setSelectedReport: (r) => set({ selectedReport: r }),
    setRole: (val) => set({ role: val }),

    markNotificationRead: (id) => set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    })),

    addNotification: (notif) => set(state => ({
        notifications: [{ id: Date.now(), ...notif, read: false, time: 'just now' }, ...state.notifications]
    })),

    // ── Filtered view ─────────────────────────────────────────────────────────
    getFilteredReports: () => {
        const { reports, filters } = get()
        return reports.filter(r => {
            if (filters.eventType !== 'all' && r.event_type !== filters.eventType) return false
            if (filters.status !== 'all' && r.verification_status !== filters.status) return false
            if (filters.source !== 'all' && r.source !== filters.source) return false
            if (filters.search && !r.text?.toLowerCase().includes(filters.search.toLowerCase()) &&
                !r.location?.toLowerCase().includes(filters.search.toLowerCase())) return false
            return true
        })
    },
}))
