import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { FilterBar } from '../components/ui'
import IndiaMap from '../components/IndiaMap'
import { useNavigate } from 'react-router-dom'
import { Radio, RefreshCw, MapPin, ShieldAlert, Users, CloudRain, Layers, Flame, CloudLightning, CloudFog, Thermometer, Wind, Droplets } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const QUICK_CITIES = [
    { name: 'All India', center: [22.5937, 78.9629] },
    { name: 'Dehradun', center: [30.3165, 78.0322] },
    { name: 'Delhi', center: [28.6139, 77.2090] },
    { name: 'Mumbai', center: [19.0760, 72.8777] },
    { name: 'Bengaluru', center: [12.9716, 77.5946] },
    { name: 'Kolkata', center: [22.5726, 88.3639] },
    { name: 'Shimla', center: [31.1048, 77.1734] },
    { name: 'Guwahati', center: [26.1445, 91.7362] },
    { name: 'Jaipur', center: [26.9124, 75.7873] },
]

const MAP_FACTORS = [
    { id: 'temperature', label: 'Temperature (°C)', icon: '🌡️', short: 'Temperature' },
    { id: 'rainfall', label: 'Rainfall & Precipitation (mm)', icon: '🌧️', short: 'Rainfall' },
    { id: 'thunderstorm', label: 'Thunderstorm & Lightning', icon: '⛈️', short: 'Thunderstorm' },
    { id: 'fog', label: 'Dense Fog & Low Visibility', icon: '🌫️', short: 'Dense Fog' },
    { id: 'heatwave', label: 'Heat Wave Index (High Temp)', icon: '🔥', short: 'Heat Wave' },
    { id: 'wind', label: 'Wind Speed & Gusts (km/h)', icon: '💨', short: 'Wind Speed' },
    { id: 'humidity', label: 'Relative Humidity (%)', icon: '💧', short: 'Humidity' },
]

export default function LiveMap() {
    const navigate = useNavigate()
    const { events, filters, setFilter, setSelectedEvent, loadData, realAlerts } = useAppStore()
    const [selectedCenter, setSelectedCenter] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const [selectedFactor, setSelectedFactor] = useState('temperature')
    const [filterOnlyCondition, setFilterOnlyCondition] = useState(false)

    // Filter events
    const filtered = events.filter(ev => {
        if (filters.eventType !== 'all' && ev.event_type !== filters.eventType) return false
        if (filters.status !== 'all' && ev.status !== filters.status) return false
        if (filterOnlyCondition) {
            if (selectedFactor === 'rainfall') return ev.precipitation > 0 || ev.event_type === 'rainfall' || ev.event_type === 'flood'
            if (selectedFactor === 'thunderstorm') return ev.event_type === 'thunderstorm' || (ev.weather_code >= 95 && ev.weather_code <= 99)
            if (selectedFactor === 'fog') return ev.event_type === 'fog' || ev.weather_code === 45 || ev.weather_code === 48
            if (selectedFactor === 'heatwave') return ev.temperature >= 35 || ev.event_type === 'heatwave'
            if (selectedFactor === 'wind') return ev.wind_speed >= 20 || ev.event_type === 'strong_wind'
        }
        return true
    })

    const handleRefresh = async () => {
        setRefreshing(true)
        await loadData()
        setRefreshing(false)
        toast.success('Live telemetry refreshed from Open-Meteo satellites!')
    }

    const liveStationCount = events.filter(e => e.is_live_station || e.temperature !== undefined).length
    const citizenCount = events.filter(e => e.is_citizen_report).length
    const severeCount = events.filter(e => ['SEVERE', 'EXTREME', 'HIGH'].includes(e.severity)).length

    // Active condition metrics
    const rainCount = events.filter(e => e.precipitation > 0 || e.event_type === 'rainfall').length
    const stormCount = events.filter(e => e.event_type === 'thunderstorm' || (e.weather_code >= 95 && e.weather_code <= 99)).length
    const fogCount = events.filter(e => e.event_type === 'fog' || e.weather_code === 45 || e.weather_code === 48 || (e.humidity > 85 && e.temperature < 22)).length
    const heatCount = events.filter(e => e.temperature >= 35 || e.event_type === 'heatwave').length
    const windCount = events.filter(e => e.wind_speed >= 25 || e.event_type === 'strong_wind').length

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Toolbar with Multi-Factor Dropdown */}
            <div style={{
                padding: '10px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
                display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>India Live Weather Map</div>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px',
                        borderRadius: 999, background: 'rgba(16,185,129,0.1)', color: '#059669',
                        fontSize: 11, fontWeight: 700, border: '1px solid rgba(16,185,129,0.25)'
                    }}>
                        <Radio size={12} className="animate-pulse" /> Live Telemetry
                    </span>
                </div>

                {/* Factor / Condition Dropdown */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff',
                    border: '1.5px solid #3b82f6', borderRadius: 8, padding: '4px 8px',
                    boxShadow: '0 2px 8px rgba(59,130,246,0.1)'
                }}>
                    <Layers size={15} color="#2563eb" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#1e3a8a' }}>Map Factor:</span>
                    <select
                        value={selectedFactor}
                        onChange={e => {
                            setSelectedFactor(e.target.value)
                            toast(`Switched map layer to ${MAP_FACTORS.find(f => f.id === e.target.value)?.label}`, { icon: '🗺️' })
                        }}
                        style={{
                            border: 'none', background: 'transparent', color: '#0f172a',
                            fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none',
                            fontFamily: 'Inter, sans-serif'
                        }}
                    >
                        {MAP_FACTORS.map(f => (
                            <option key={f.id} value={f.id}>
                                {f.icon} {f.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quick Factor Buttons */}
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                    {MAP_FACTORS.slice(0, 5).map(f => (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => setSelectedFactor(f.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 4,
                                background: selectedFactor === f.id ? '#2563eb' : '#ffffff',
                                color: selectedFactor === f.id ? '#ffffff' : '#475569',
                                border: `1px solid ${selectedFactor === f.id ? '#1d4ed8' : '#cbd5e1'}`,
                                borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 700,
                                cursor: 'pointer', transition: 'all 0.15s ease'
                            }}
                        >
                            <span>{f.icon}</span>
                            <span>{f.short}</span>
                        </button>
                    ))}
                </div>

                {/* Quick City Jump */}
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    <MapPin size={13} color="#64748b" />
                    <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Jump:</span>
                    {QUICK_CITIES.slice(0, 5).map(c => (
                        <button
                            key={c.name}
                            type="button"
                            onClick={() => setSelectedCenter(c.center)}
                            style={{
                                background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 6,
                                padding: '3px 7px', fontSize: 11, fontWeight: 600, color: '#334155',
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                            borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff',
                            color: '#334155', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                        {refreshing ? 'Syncing…' : 'Sync Telemetry'}
                    </button>
                </div>
            </div>

            {/* Sub-bar: Dynamic Factor Legend */}
            <div style={{
                padding: '7px 20px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0',
                display: 'flex', gap: 16, alignItems: 'center', fontSize: 11, color: '#475569', flexWrap: 'wrap'
            }}>
                <span style={{ fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Active Layer: <span style={{ color: '#2563eb' }}>{MAP_FACTORS.find(f => f.id === selectedFactor)?.label}</span>
                </span>
                <span>🌧️ Rain Active: <b>{rainCount} stations</b></span>
                <span>⛈️ Storms: <b>{stormCount} stations</b></span>
                <span>🌫️ Fog/Low Vis: <b>{fogCount} stations</b></span>
                <span>🔥 Heat Wave (≥35°C): <b>{heatCount} stations</b></span>
                <span>💨 High Wind: <b>{windCount} stations</b></span>
                <span style={{ marginLeft: 'auto', color: '#64748b' }}>Markers dynamically render {selectedFactor} telemetry</span>
            </div>

            {/* Full-screen map */}
            <div style={{ flex: 1, position: 'relative' }}>
                <IndiaMap
                    events={filtered}
                    center={selectedCenter}
                    factor={selectedFactor}
                    height="100%"
                    onEventClick={(ev) => {
                        setSelectedEvent(ev)
                        if (!ev.is_live_station) {
                            navigate(`/events/${ev.id}`)
                        }
                    }}
                />

                {/* Stats overlay */}
                <div style={{
                    position: 'absolute', top: 16, right: 16, background: 'rgba(15,23,42,0.88)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 18px',
                    backdropFilter: 'blur(10px)', zIndex: 1000, color: '#fff', minWidth: 200,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                        Live Ground Network
                    </div>
                    {[
                        { label: 'Active Stations', value: liveStationCount, color: '#38bdf8' },
                        { label: 'Citizen Reports', value: citizenCount, color: '#34d399' },
                        { label: 'Severe Weather Alerts', value: severeCount || realAlerts.length, color: '#f87171' },
                        { label: 'Data Latency', value: '< 1 sec', color: '#a78bfa' },
                    ].map(s => (
                        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 5 }}>
                            <span style={{ fontSize: 12, color: '#cbd5e1' }}>{s.label}</span>
                            <span style={{ fontSize: 12, fontWeight: 800, color: s.color }}>{s.value}</span>
                        </div>
                    ))}
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 10, color: '#94a3b8' }}>
                        Source: Open-Meteo Satellite Feed
                    </div>
                </div>
            </div>
            <Toaster position="top-right" />
        </div>
    )
}
