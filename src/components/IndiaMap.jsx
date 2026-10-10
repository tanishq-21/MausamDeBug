import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAppStore } from '../store/appStore'
import { StatusBadge, SeverityBadge } from './ui'
import { Radio, Wind, Droplets, Thermometer, ShieldCheck } from 'lucide-react'

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const EVENT_COLORS = {
    rainfall: '#3b82f6', flood: '#06b6d4', thunderstorm: '#8b5cf6',
    heatwave: '#ef4444', fog: '#64748b', dust_storm: '#d97706',
    strong_wind: '#10b981', hailstorm: '#60a5fa', landslide: '#a16207', cyclone: '#ef4444',
    clear: '#f59e0b', cloudy: '#64748b', snow: '#38bdf8',
}

const EVENT_ICONS = {
    rainfall: '🌧️', flood: '🌊', thunderstorm: '⛈️', heatwave: '🌡️',
    fog: '🌫️', dust_storm: '💨', strong_wind: '🌬️', hailstorm: '🌨️',
    landslide: '⛰️', cyclone: '🌀', clear: '☀️', cloudy: '⛅', snow: '❄️',
}

function createRealWeatherIcon(event, factor = 'temperature') {
    const isCitizen = event.is_citizen_report
    const isLive = event.is_live_station || event.temperature !== undefined
    const temp = event.temperature !== undefined ? `${Math.round(event.temperature)}°` : null
    const precip = event.precipitation !== undefined ? event.precipitation : 0
    const wind = event.wind_speed !== undefined ? Math.round(event.wind_speed) : 12
    const humidity = event.humidity !== undefined ? Math.round(event.humidity) : 60
    const color = EVENT_COLORS[event.event_type] || '#3b82f6'
    const iconEmoji = event.condition_icon || EVENT_ICONS[event.event_type] || '📍'

    if (isCitizen) {
        return L.divIcon({
            html: `
            <div style="
                display: flex; align-items: center; gap: 4px;
                background: #ffffff; color: #0f172a;
                border: 2px solid #10b981; border-radius: 20px;
                padding: 3px 8px; font-weight: 700; font-size: 11px;
                box-shadow: 0 4px 12px rgba(16,185,129,0.35);
                font-family: Inter, sans-serif; cursor: pointer;
            ">
                <span style="font-size: 13px;">👥</span>
                <span>Citizen</span>
            </div>`,
            className: '',
            iconSize: [80, 26],
            iconAnchor: [40, 13],
            popupAnchor: [0, -14],
        })
    }

    if (isLive) {
        let label = `${temp || '24°'}`
        let displayIcon = iconEmoji
        let borderColor = color
        let bgColor = '#ffffff'
        let textColor = '#0f172a'
        let isSpecialAlert = false

        if (factor === 'rainfall') {
            const hasRain = precip > 0 || event.event_type === 'rainfall' || event.event_type === 'flood'
            label = `${precip > 0 ? precip + 'mm' : '0 mm'}`
            displayIcon = hasRain ? '🌧️' : '💧'
            if (hasRain) {
                borderColor = '#2563eb'
                bgColor = '#eff6ff'
                textColor = '#1d4ed8'
                isSpecialAlert = true
            } else {
                borderColor = '#94a3b8'
                textColor = '#475569'
            }
        } else if (factor === 'thunderstorm') {
            const isThunder = event.event_type === 'thunderstorm' || (event.weather_code >= 95 && event.weather_code <= 99)
            displayIcon = isThunder ? '⛈️' : '⚡'
            label = isThunder ? 'Storm' : 'Clear'
            if (isThunder) {
                borderColor = '#7c3aed'
                bgColor = '#f5f3ff'
                textColor = '#6d28d9'
                isSpecialAlert = true
            } else {
                borderColor = '#cbd5e1'
                textColor = '#64748b'
            }
        } else if (factor === 'fog') {
            const isFog = event.event_type === 'fog' || event.weather_code === 45 || event.weather_code === 48 || (humidity > 85 && event.temperature < 22)
            displayIcon = isFog ? '🌫️' : '👀'
            label = isFog ? 'Dense Fog' : 'Clear'
            if (isFog) {
                borderColor = '#475569'
                bgColor = '#f1f5f9'
                textColor = '#1e293b'
                isSpecialAlert = true
            } else {
                borderColor = '#cbd5e1'
                textColor = '#64748b'
            }
        } else if (factor === 'heatwave') {
            const isHeat = event.event_type === 'heatwave' || (event.temperature !== undefined && event.temperature >= 35)
            displayIcon = isHeat ? '🔥' : '🌡️'
            label = `${temp}`
            if (isHeat) {
                borderColor = '#dc2626'
                bgColor = '#fef2f2'
                textColor = '#b91c1c'
                isSpecialAlert = true
            } else {
                borderColor = '#f59e0b'
                textColor = '#b45309'
            }
        } else if (factor === 'wind') {
            const isHighWind = wind >= 25 || event.event_type === 'strong_wind' || event.event_type === 'cyclone'
            displayIcon = isHighWind ? '💨' : '🌬️'
            label = `${wind} km/h`
            if (isHighWind) {
                borderColor = '#ea580c'
                bgColor = '#fff7ed'
                textColor = '#c2410c'
                isSpecialAlert = true
            } else {
                borderColor = '#10b981'
                textColor = '#047857'
            }
        } else if (factor === 'humidity') {
            displayIcon = '💧'
            label = `${humidity}%`
            borderColor = '#0284c7'
            textColor = '#0369a1'
            if (humidity >= 80) bgColor = '#f0f9ff'
        }

        const isSevere = ['SEVERE', 'EXTREME', 'HIGH'].includes(event.severity) || isSpecialAlert
        const pillWidth = factor === 'thunderstorm' || factor === 'fog' || factor === 'wind' ? 84 : 70

        return L.divIcon({
            html: `
            <div style="
                display: flex; align-items: center; gap: 4px;
                background: ${isSevere && factor === 'temperature' ? '#fef2f2' : bgColor};
                color: ${isSevere && factor === 'temperature' ? '#b91c1c' : textColor};
                border: 2px solid ${borderColor}; border-radius: 20px;
                padding: 3px 8px; font-weight: 800; font-size: 11px;
                box-shadow: 0 4px 14px ${borderColor}44;
                font-family: Inter, sans-serif; cursor: pointer;
                transition: transform 0.2s ease;
                white-space: nowrap;
            ">
                <span style="font-size: 13px;">${displayIcon}</span>
                <span>${label}</span>
                ${isSevere ? '<span style="width:6px;height:6px;border-radius:50%;background:#ef4444;animation:pulse 1.5s infinite;"></span>' : ''}
            </div>`,
            className: '',
            iconSize: [pillWidth, 26],
            iconAnchor: [Math.floor(pillWidth / 2), 13],
            popupAnchor: [0, -14],
        })
    }

    // Standard fallback icon
    return L.divIcon({
        html: `
        <div style="
            width: 32px; height: 32px; border-radius: 50%;
            background: ${color}22; border: 2px solid ${color};
            display: flex; align-items: center; justify-content: center;
            font-size: 15px; box-shadow: 0 0 12px ${color}66;
            cursor: pointer;
        ">
            ${iconEmoji}
        </div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
    })
}

function MapUpdater({ center }) {
    const map = useMap()
    useEffect(() => {
        if (center) map.setView(center, 7, { animate: true })
    }, [center, map])
    return null
}

export default function IndiaMap({ events, center, onEventClick, height = '100%', factor = 'temperature' }) {
    const { filters } = useAppStore()

    const filtered = (events || []).filter(ev => {
        if (filters.eventType !== 'all' && ev.event_type !== filters.eventType) return false
        if (filters.status !== 'all' && ev.status !== filters.status) return false
        return true
    })

    return (
        <MapContainer
            center={center || [22.5937, 78.9629]}
            zoom={5}
            style={{ height, width: '100%', borderRadius: 0 }}
            zoomControl={true}
            attributionControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {center && <MapUpdater center={center} />}

            {filtered.map(event => (
                <Marker
                    key={event.id}
                    position={[event.latitude, event.longitude]}
                    icon={createRealWeatherIcon(event, factor)}
                    eventHandlers={{
                        click: () => onEventClick && onEventClick(event),
                    }}
                >
                    <Popup>
                        <div style={{ minWidth: 240, fontFamily: 'Inter, sans-serif' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid #e2e8f0' }}>
                                <span style={{
                                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                                    background: event.is_citizen_report ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                                    color: event.is_citizen_report ? '#10b981' : '#2563eb',
                                    display: 'flex', alignItems: 'center', gap: 4
                                }}>
                                    {event.is_citizen_report ? '👥 Citizen Report' : '📡 Live Telemetry Station'}
                                </span>
                                <span style={{ fontSize: 10, color: '#64748b' }}>
                                    {event.status === 'verified' ? '✓ Verified' : 'Under Review'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <span style={{ fontSize: 24 }}>{event.condition_icon || EVENT_ICONS[event.event_type] || '📍'}</span>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>
                                        {event.city || event.location}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#64748b' }}>{event.state}</div>
                                </div>
                            </div>

                            {/* Live Observations */}
                            {event.temperature !== undefined && (
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 10px',
                                    padding: '8px 10px', background: '#f8fafc', borderRadius: 8,
                                    border: '1px solid #e2e8f0', marginBottom: 10, fontSize: 12
                                }}>
                                    <div>
                                        <span style={{ color: '#64748b', fontSize: 10 }}>Temperature</span>
                                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{event.temperature}°C</div>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b', fontSize: 10 }}>Condition</span>
                                        <div style={{ fontWeight: 700, color: '#2563eb' }}>{event.condition_label || event.event_type}</div>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b', fontSize: 10 }}>Humidity</span>
                                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{event.humidity ?? 65}%</div>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b', fontSize: 10 }}>Precipitation</span>
                                        <div style={{ fontWeight: 700, color: (event.precipitation > 0 ? '#2563eb' : '#64748b') }}>{event.precipitation ?? 0} mm</div>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b', fontSize: 10 }}>Wind Speed</span>
                                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{event.wind_speed ?? 12} km/h</div>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b', fontSize: 10 }}>Wind Gusts</span>
                                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{event.wind_gusts ? `${Math.round(event.wind_gusts)} km/h` : 'Normal'}</div>
                                    </div>
                                </div>
                            )}

                            {/* Citizen Report text snippet */}
                            {event.summary && (
                                <div style={{ fontSize: 12, color: '#334155', fontStyle: 'italic', marginBottom: 8, background: '#f1f5f9', padding: '6px 8px', borderRadius: 6 }}>
                                    "{event.summary}"
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#64748b' }}>
                                <span>AI Credibility: <b style={{ color: event.confidence >= 75 ? '#10b981' : '#f59e0b' }}>{event.confidence}%</b></span>
                                <span>Severity: <b style={{ color: '#ef4444' }}>{event.severity}</b></span>
                            </div>

                            <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #f1f5f9', fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Radio size={10} color="#10b981" /> Open-Meteo Satellite & Ground Network (Live)
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
