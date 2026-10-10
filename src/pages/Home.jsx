import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { Bell, Search, MapPin, Wind, Droplets, Thermometer, AlertTriangle, CheckCircle, Navigation, ArrowRight, CloudRain, Cloud, Sun, Radio, RefreshCw, Trophy } from 'lucide-react'
import { MOCK_NEWS_ARTICLES, formatRelativeTime } from '../services/newsService'
import { EventTypeBadge } from '../components/ui'
import IndiaMap from '../components/IndiaMap'
import { getDetailedCityForecast, REAL_INDIAN_STATIONS, geocodedCitySearch } from '../services/realWeatherService'

export default function Home() {
    const navigate = useNavigate()
    const { reports, events, realAlerts, userLocation, userWeather, detectUserLocation, isLocatingUser, setUserLocation } = useAppStore()
    const [currentTime, setCurrentTime] = useState(() => new Date())
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCityName, setSelectedCityName] = useState(() => (userLocation?.city && userLocation?.city !== 'Piran Kaliyar') ? userLocation.city : 'Roorkee')
    const [selectedState, setSelectedState] = useState(() => userLocation?.state || 'Uttarakhand')
    const [liveCityWeather, setLiveCityWeather] = useState(() => userLocation?.weather || userWeather || null)
    const [loadingForecast, setLoadingForecast] = useState(false)
    const [isCurrentLocation, setIsCurrentLocation] = useState(true)

    // Load city forecast
    const loadCityForecast = async (station, isUserLoc = false) => {
        setLoadingForecast(true)
        const cityName = station.name || station.city
        const forecast = await getDetailedCityForecast(station.lat, station.lng, cityName)
        if (forecast) {
            setLiveCityWeather(forecast)
            setSelectedCityName(cityName)
            setSelectedState(station.state || '')
            setIsCurrentLocation(isUserLoc)
            if (isUserLoc && setUserLocation) {
                setUserLocation({
                    city: cityName,
                    state: station.state || '',
                    lat: station.lat,
                    lng: station.lng,
                    formattedLocation: station.state ? `${cityName}, ${station.state}` : cityName,
                    weather: forecast,
                    source: 'gps',
                    detectedAt: new Date().toISOString()
                })
            }
        }
        setLoadingForecast(false)
    }

    // Auto-detect and sync user's actual location where they logged in on mount
    useEffect(() => {
        let mounted = true
        const initLocation = async () => {
            if (userLocation && userLocation.weather && userLocation.city && userLocation.city !== 'Piran Kaliyar') {
                if (mounted) {
                    setSelectedCityName(userLocation.city)
                    setSelectedState(userLocation.state)
                    setLiveCityWeather(userLocation.weather)
                    setIsCurrentLocation(true)
                }
            }
            // Always run real live detection on mount
            const detected = await detectUserLocation(true)
            if (mounted && detected) {
                const finalCity = (detected.city === 'Piran Kaliyar' || !detected.city) ? 'Roorkee' : detected.city
                setSelectedCityName(finalCity)
                setSelectedState(detected.state || 'Uttarakhand')
                setLiveCityWeather(detected.weather)
                setIsCurrentLocation(true)
            } else if (mounted && !liveCityWeather) {
                const fallback = REAL_INDIAN_STATIONS.find(s => s.name === 'Roorkee') || REAL_INDIAN_STATIONS[0]
                loadCityForecast(fallback, true)
            }
        }
        initLocation()
        return () => { mounted = false }
    }, [])

    // Live clock ticking every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const handleUseMyLocation = async () => {
        const loc = await detectUserLocation(true)
        if (loc) {
            setSelectedCityName(loc.city)
            setSelectedState(loc.state)
            setLiveCityWeather(loc.weather)
            setIsCurrentLocation(true)
        }
    }

    const handleSearchSubmit = async (e) => {
        e.preventDefault()
        if (!searchQuery.trim()) return
        const query = searchQuery.trim().toLowerCase()
        const matched = REAL_INDIAN_STATIONS.find(s =>
            s.name.toLowerCase().includes(query) || s.state.toLowerCase().includes(query)
        )
        if (matched) {
            loadCityForecast(matched, false)
            return
        }
        // Universal search for any Indian city or district
        const results = await geocodedCitySearch(searchQuery.trim())
        if (results && results.length > 0) {
            const first = results[0]
            loadCityForecast({
                name: first.name,
                city: first.name,
                state: first.state,
                lat: first.lat,
                lng: first.lng
            }, false)
        } else {
            const fallback = REAL_INDIAN_STATIONS.find(s => s.name === 'Delhi') || REAL_INDIAN_STATIONS[0]
            loadCityForecast(fallback, false)
        }
    }

    const currentDateLabel = currentTime.toLocaleDateString('en-IN', {
        weekday: 'long', day: '2-digit', month: 'short', year: 'numeric',
    })
    const currentTimeLabel = currentTime.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true,
    })

    const latestNews = MOCK_NEWS_ARTICLES.slice(0, 3)
    const recentReports = reports.slice(0, 3)

    // Use REAL active alerts computed from ground stations
    const activeAlertsToDisplay = (realAlerts && realAlerts.length > 0) ? realAlerts.slice(0, 4) : [
        {
            title: 'Active Meteorological Monitoring Watch',
            location: `${selectedCityName}, India`,
            validTill: 'Live Ground Stream',
            severity: 'Moderate',
            color: '#3b82f6',
            bg: '#eff6ff',
            liveMetric: 'Telemetry Connected',
        }
    ]

    return (
        <div style={{ padding: 24, maxWidth: 1600, margin: '0 auto', background: '#f8fafc', minHeight: '100vh' }}>
            {/* Top Bar with Live Search & Auto-Detect Location */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 480px', maxWidth: 640 }}>
                    <form onSubmit={handleSearchSubmit} style={{ position: 'relative', flex: 1 }}>
                        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="text"
                            placeholder="Search Indian city (e.g. Noida, Delhi, Mumbai, Jaipur)…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 14px 10px 40px', background: '#e2e8f0',
                                border: '1px solid transparent', borderRadius: 8, fontSize: 13, color: '#0f172a', outline: 'none',
                                fontFamily: 'Inter, sans-serif'
                            }}
                        />
                    </form>
                    <button
                        type="button"
                        onClick={handleUseMyLocation}
                        disabled={isLocatingUser}
                        title="Detect and show real-time GPS / Wi-Fi weather for where you are currently sitting"
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '10px 14px', borderRadius: 8,
                            background: isCurrentLocation ? '#eff6ff' : '#ffffff',
                            border: `1.5px solid ${isCurrentLocation ? '#2563eb' : '#cbd5e1'}`,
                            color: isCurrentLocation ? '#1d4ed8' : '#475569',
                            fontSize: 12, fontWeight: 800, cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 6px rgba(37,99,235,0.1)',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <RefreshCw size={13} className={isLocatingUser ? 'animate-spin' : ''} color="#2563eb" />
                        {isLocatingUser ? 'Acquiring Real GPS…' : '📍 Auto-Detect Real Location'}
                    </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
                        color: '#0f172a',
                        fontWeight: 700, background: '#ffffff',
                        padding: '6px 14px', borderRadius: 20, border: '1.5px solid #bfdbfe',
                        boxShadow: '0 2px 8px rgba(37,99,235,0.06)'
                    }}>
                        <MapPin size={16} color="#2563eb" />
                        <span>{selectedCityName}{selectedState && selectedCityName !== selectedState ? `, ${selectedState}` : ''}</span>
                        <span style={{
                            fontSize: 10,
                            background: userLocation?.source === 'gps' ? '#dcfce7' : '#dbeafe',
                            color: userLocation?.source === 'gps' ? '#15803d' : '#1e40af',
                            padding: '2px 8px', borderRadius: 999, fontWeight: 800
                        }}>
                            {userLocation?.source === 'gps' ? '● Precise GPS Fix' : '● Live Telemetry'}
                        </span>
                    </div>
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/map')}>
                        <Bell size={20} color="#475569" />
                        {activeAlertsToDisplay.length > 0 && (
                            <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid #f8fafc' }} />
                        )}
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1e293b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
                        A
                    </div>
                </div>
            </div>

            {/* Quick Location Pills Bar */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                marginBottom: 20, padding: '8px 12px', background: '#ffffff',
                borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12
            }}>
                <span style={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Navigation size={12} color="#2563eb" /> Quick City:
                </span>
                {[
                    { name: 'Roorkee', lat: 29.8543, lng: 77.8880, state: 'Uttarakhand' },
                    { name: 'Haridwar', lat: 29.9457, lng: 78.1642, state: 'Uttarakhand' },
                    { name: 'Dehradun', lat: 30.3165, lng: 78.0322, state: 'Uttarakhand' },
                    { name: 'Delhi', lat: 28.6139, lng: 77.2090, state: 'Delhi' },
                    { name: 'Gurugram', lat: 28.4597, lng: 77.0282, state: 'Haryana' },
                    { name: 'Noida', lat: 28.5355, lng: 77.3910, state: 'Uttar Pradesh' },
                    { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538, state: 'Uttar Pradesh' },
                    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
                    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
                    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
                    { name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
                ].map(c => (
                    <button
                        key={c.name}
                        type="button"
                        onClick={() => loadCityForecast({ name: c.name, city: c.name, state: c.state, lat: c.lat, lng: c.lng }, true)}
                        style={{
                            padding: '3px 9px', borderRadius: 6,
                            background: selectedCityName.toLowerCase() === c.name.toLowerCase() ? '#2563eb' : '#f8fafc',
                            color: selectedCityName.toLowerCase() === c.name.toLowerCase() ? '#ffffff' : '#334155',
                            border: `1px solid ${selectedCityName.toLowerCase() === c.name.toLowerCase() ? '#1d4ed8' : '#cbd5e1'}`,
                            fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s'
                        }}
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', display: 'flex', gap: 10, alignItems: 'center' }}>
                        Welcome 👋
                    </h1>
                    <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>
                        Real-time weather telemetry for <strong>{selectedCityName}</strong> and safety warnings across India
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginBottom: 4 }}>
                        {currentDateLabel}
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', color: '#059669', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, border: '1px solid rgba(16,185,129,0.2)' }}>
                            <Radio size={12} className="animate-pulse" /> Open-Meteo Satellites Live
                        </span>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 8 }}>
                        {currentTimeLabel}
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>Exact Local Time</span>
                    </div>
                </div>
            </div>

            {/* Top Row: Weather + Real Forecasts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr 2fr', gap: 20, marginBottom: 20 }}>
                {/* Main Weather Card */}
                <div style={{ background: 'linear-gradient(135deg, #1d4ed8, #0284c7)', borderRadius: 16, padding: '24px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700 }}>
                            {selectedCityName}{selectedState ? `, ${selectedState}` : ', India'} <Navigation size={12} />
                        </div>
                        <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 999 }}>
                            {isCurrentLocation ? '📍 Logged-in Location' : 'Ground Station Telemetry'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>
                                {liveCityWeather ? `${liveCityWeather.temp}°c` : '22°c'}
                            </div>
                            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 8 }}>
                                {liveCityWeather ? liveCityWeather.conditionLabel : 'Live Telemetry'}
                            </div>
                        </div>
                        <span style={{ fontSize: 54 }}>
                            {liveCityWeather ? liveCityWeather.conditionIcon : '🌤️'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.85)', flexWrap: 'wrap' }}>
                        <span>Feels like {liveCityWeather ? `${liveCityWeather.feelsLike}°C` : '22°C'}</span>
                        <span>|</span>
                        <span>Humidity {liveCityWeather ? `${liveCityWeather.humidity}%` : '65%'}</span>
                        <span>|</span>
                        <span>Wind {liveCityWeather ? `${liveCityWeather.windSpeed} km/h` : '12 km/h'}</span>
                    </div>
                </div>

                {/* Today's Hourly Forecast (Live from Open-Meteo) */}
                <div style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <h3 style={cardTitle}>Today's Hourly Forecast</h3>
                        <span style={{ fontSize: 11, color: '#64748b' }}>Next 6 Hours</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 }}>
                        {liveCityWeather?.hourly?.slice(0, 5).map((f, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{f.time}</div>
                                <div style={{ fontSize: 24 }}>{f.icon}</div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{f.temp}°</div>
                                {f.prob > 0 && <span style={{ fontSize: 10, color: '#2563eb', fontWeight: 700 }}>{f.prob}% rain</span>}
                            </div>
                        )) || (
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>Loading hourly forecast…</div>
                        )}
                    </div>
                </div>

                {/* 7 Day Forecast (Live from Open-Meteo) */}
                <div style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h3 style={cardTitle}>7-Day Forecast</h3>
                        <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 700 }}>Open-Meteo Model</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {liveCityWeather?.sevenDay?.slice(0, 7).map((f, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{f.day}</div>
                                <div style={{ fontSize: 20 }}>{f.icon}</div>
                                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{f.high}°</div>
                                <div style={{ fontSize: 11, color: '#94a3b8' }}>{f.low}°</div>
                            </div>
                        )) || (
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>Loading 7-day forecast…</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Middle Row: Highlights + Map + Real Alerts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr 1.5fr', gap: 20, marginBottom: 20 }}>
                {/* Highlights */}
                <div style={card}>
                    <h3 style={cardTitle}>Today's Highlights ({selectedCityName})</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <HighlightCard
                            icon={<Droplets size={20} color="#3b82f6" />}
                            title="Precipitation"
                            value={liveCityWeather ? `${liveCityWeather.precip} mm` : '0 mm'}
                            sub={liveCityWeather?.precip > 0 ? 'Active rainfall' : 'No rain observed'}
                            subColor={liveCityWeather?.precip > 0 ? '#2563eb' : '#64748b'}
                        />
                        <HighlightCard
                            icon={<Thermometer size={20} color="#ef4444" />}
                            title="Temperature"
                            value={liveCityWeather ? `${liveCityWeather.temp}°C` : '22°C'}
                            sub={`Feels like ${liveCityWeather ? liveCityWeather.feelsLike : 22}°C`}
                        />
                        <HighlightCard
                            icon={<Wind size={20} color="#06b6d4" />}
                            title="Wind Speed"
                            value={liveCityWeather ? `${liveCityWeather.windSpeed} km/h` : '12 km/h'}
                            sub={`Pressure: ${liveCityWeather?.pressure || 1012} hPa`}
                        />
                        <HighlightCard
                            icon={<Droplets size={20} color="#3b82f6" />}
                            title="Humidity"
                            value={liveCityWeather ? `${liveCityWeather.humidity}%` : '65%'}
                            sub="Atmospheric moisture"
                            subColor="#10b981"
                        />
                    </div>
                </div>

                {/* Weather Risk Map */}
                <div style={{ ...card, padding: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                            India Live Risk Map <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>(Live Stations Active)</span>
                        </h3>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/map') }} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            View Full Map <ArrowRight size={12} />
                        </a>
                    </div>
                    <div style={{ flex: 1, position: 'relative', minHeight: 220, background: '#e2e8f0', borderRadius: '0 0 16px 16px', overflow: 'hidden' }}>
                        <IndiaMap events={events} />
                    </div>
                </div>

                {/* Active Real Alerts */}
                <div style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <h3 style={cardTitle}>Active Alerts</h3>
                            <span style={{ fontSize: 11, background: '#ef4444', color: '#fff', padding: '1px 7px', borderRadius: 999, fontWeight: 800 }}>
                                {activeAlertsToDisplay.length} LIVE
                            </span>
                        </div>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/map') }} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            View Map <ArrowRight size={12} />
                        </a>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {activeAlertsToDisplay.map((alert, i) => (
                            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 14, background: alert.bg || '#fef2f2', border: `1px solid ${alert.color || '#ef4444'}33`, borderRadius: 12 }}>
                                <AlertTriangle size={22} color={alert.color || '#ef4444'} style={{ flexShrink: 0, marginTop: 2 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>{alert.title}</div>
                                    <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>{alert.location}</div>
                                    {alert.liveMetric && (
                                        <div style={{ fontSize: 11, color: '#b91c1c', fontWeight: 700, marginBottom: 2 }}>
                                            {alert.liveMetric}
                                        </div>
                                    )}
                                    <div style={{ fontSize: 11, color: '#64748b' }}>{alert.validTill}</div>
                                </div>
                                <div style={{ background: alert.color || '#ef4444', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 999, flexShrink: 0 }}>
                                    {alert.severity}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Glory of Honour & Monthly State Lucky Draw Promo Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a8a 100%)',
                borderRadius: 16,
                padding: '20px 24px',
                color: '#fff',
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
                boxShadow: '0 8px 24px rgba(30, 27, 75, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 750 }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 12,
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 26, flexShrink: 0, boxShadow: '0 4px 12px rgba(245,158,11,0.35)'
                    }}>
                        🏆
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>Glory of Honour & Monthly ₹500 State Lucky Draw</span>
                            <span style={{ fontSize: 10, background: 'rgba(245,158,11,0.25)', color: '#fde047', border: '1px solid rgba(245,158,11,0.5)', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                                ✨ ₹500 Lucky Winner Per State
                            </span>
                        </div>
                        <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>
                            Submit verified and authorized weather reports to join the <strong>Glory of Honour list</strong>. Every month, <strong>1 lucky citizen from each Indian state</strong> receives an automated ₹500 cash prize directly via UPI!
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button
                        onClick={() => navigate('/glory-of-honour')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: '#ffffff', color: '#1e1b4b', border: 'none',
                            borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 800,
                            cursor: 'pointer', transition: 'all 0.15s ease'
                        }}
                    >
                        <Trophy size={14} color="#f59e0b" /> View Glory List & Draw
                    </button>
                    <button
                        onClick={() => navigate('/report')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: '#f59e0b', color: '#0f172a', border: 'none',
                            borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 800,
                            cursor: 'pointer', transition: 'all 0.15s ease'
                        }}
                    >
                        Report & Qualify
                    </button>
                </div>
            </div>

            {/* Bottom Row: News + Citizen Reports */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(600px, 2fr) 1fr', gap: 20, paddingBottom: 40 }}>
                {/* News */}
                <div style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={cardTitle}>Latest Weather News</h3>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/live-news') }} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View All <ArrowRight size={12} /></a>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {latestNews.map(news => (
                            <div key={news.id} style={{ display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/live-news')}>
                                <div style={{ height: 120, borderRadius: 12, background: `url(${news.image}) center/cover` }} />
                                <div>
                                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.4 }}>{news.title}</h4>
                                    <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {news.source} · {formatRelativeTime(news.publishedAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Citizen Reports */}
                <div style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={cardTitle}>Recent Citizen Reports</h3>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/reports') }} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View All <ArrowRight size={12} /></a>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {recentReports.map(rp => (
                            <div key={rp.id} onClick={() => navigate(`/reports/${rp.id}`)} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                {rp.has_image ? (
                                    <div style={{ width: 64, height: 48, borderRadius: 8, background: `url(https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=200&q=80) center/cover` }} />
                                ) : (
                                    <div style={{ width: 64, height: 48, borderRadius: 8, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{rp.event_type === 'rainfall' ? '🌧' : '🌊'}</div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rp.text}</h4>
                                    <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <MapPin size={10} /> {rp.location} · {rp.minutes_ago || 0} min ago
                                    </div>
                                </div>
                                <div>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: rp.verification_status === 'verified' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: rp.verification_status === 'verified' ? '#10b981' : '#f59e0b', padding: '4px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>
                                        {rp.verification_status === 'verified' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                                        {rp.verification_status === 'verified' ? 'Verified' : 'Under Review'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function HighlightCard({ icon, title, value, sub, subColor = '#64748b' }) {
    return (
        <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {icon}
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{title}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 11, color: subColor, fontWeight: 500 }}>{sub}</div>
        </div>
    )
}

const card = { background: '#ffffff', borderRadius: 16, padding: '20px', border: '1px solid #e2e8f0' }
const cardTitle = { margin: '0 0 12px', fontSize: 15, fontWeight: 800, color: '#0f172a' }
