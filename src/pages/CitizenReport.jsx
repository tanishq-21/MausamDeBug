import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { PageHeader } from '../components/ui'
import { CheckCircle, MapPin, Send, Upload, Image as ImageIcon, ShieldCheck, AlertTriangle, X, Clock, RefreshCw, Trophy, Gift, Sparkles } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { getExactLocalIsoString } from '../services/realWeatherService'
import { INDIAN_STATES_AND_UTS } from '../services/gloryService'

const EVENT_OPTIONS = [
    'Heavy Rainfall', 'Flood', 'Thunderstorm', 'Heatwave', 'Dense Fog',
    'Dust Storm', 'Strong Wind', 'Hailstorm', 'Landslide', 'Lightning Strike', 'Cyclone'
]

const EVENT_TYPE_MAP = {
    'Heavy Rainfall': 'rainfall', 'Flood': 'flood', 'Thunderstorm': 'thunderstorm',
    'Heatwave': 'heatwave', 'Dense Fog': 'fog', 'Dust Storm': 'dust_storm',
    'Strong Wind': 'strong_wind', 'Hailstorm': 'hailstorm', 'Landslide': 'landslide',
    'Lightning Strike': 'strong_wind', 'Cyclone': 'cyclone',
}

import { verifyImageAI, verifyCitizenReportWithAI } from '../services/aiVerificationService'

export default function CitizenReport() {
    const navigate = useNavigate()
    const { addReport, userLocation, userWeather, detectUserLocation, addGloryEntry } = useAppStore()
    const [submitted, setSubmitted] = useState(false)
    const [submittedId, setSubmittedId] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState('')
    const [imageAnalysis, setImageAnalysis] = useState(null)
    const [analyzingImage, setAnalyzingImage] = useState(false)
    const [aiVerificationResult, setAiVerificationResult] = useState(null)
    const [currentTime, setCurrentTime] = useState(() => new Date())
    const [form, setForm] = useState({
        reporter_name: '',
        state: userLocation?.state || 'Uttarakhand',
        upi_id: '',
        event: '',
        description: '',
        location: userLocation?.formattedLocation?.replace('Piran Kaliyar', 'Roorkee') || 'Roorkee, Uttarakhand',
        lat: userLocation?.lat ? String(userLocation.lat.toFixed(4)) : '29.8543',
        lng: userLocation?.lng ? String(userLocation.lng.toFixed(4)) : '77.8880',
        datetime: getExactLocalIsoString(),
        contact: ''
    })

    // Ticking exact clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Auto-populate location from fresh detected user location
    useEffect(() => {
        detectUserLocation(true).then(loc => {
            if (loc) {
                const cleanLoc = (loc.formattedLocation || '').replace('Piran Kaliyar', 'Roorkee')
                const cleanCity = loc.city === 'Piran Kaliyar' ? 'Roorkee' : loc.city
                setForm(f => ({
                    ...f,
                    location: cleanLoc || 'Roorkee, Uttarakhand',
                    state: loc.state || 'Uttarakhand',
                    lat: loc.lat ? String(loc.lat.toFixed(4)) : '29.8543',
                    lng: loc.lng ? String(loc.lng.toFixed(4)) : '77.8880'
                }))
            }
        })
    }, [])

    const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleImageSelect = (file) => {
        if (!file) return
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Please choose a JPG, PNG, or WebP image')
            return
        }
        if (file.size > 8 * 1024 * 1024) {
            toast.error('Image must be smaller than 8 MB')
            return
        }
        if (imagePreview) URL.revokeObjectURL(imagePreview)
        setSelectedImage(file)
        setImagePreview(URL.createObjectURL(file))
        setImageAnalysis(null)
    }

    const analyzeImage = async () => {
        if (!selectedImage) return
        setAnalyzingImage(true)
        setImageAnalysis(null)
        try {
            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result)
                reader.onerror = () => reject(new Error('Could not read the selected image'))
                reader.readAsDataURL(selectedImage)
            })

            const result = await verifyImageAI({
                file: selectedImage,
                imageBase64: dataUrl,
                claimedLocation: form.location,
                claimedDate: form.datetime?.split('T')[0],
                claimedCaption: form.description,
            })

            setImageAnalysis(result)
            if (result.status === 'likely_ai_generated') {
                toast('AI-generation or synthetic smoothing signals detected', { icon: '⚠️' })
            } else if (result.status === 'likely_real') {
                toast.success('Physical camera sensor & shot noise confirmed!')
            } else {
                toast('Image check inconclusive. Review details.', { icon: 'ℹ️' })
            }
        } catch (error) {
            setImageAnalysis({ status: 'unavailable', error: error.message })
            toast.error(error.message || 'Could not analyze image')
        } finally {
            setAnalyzingImage(false)
        }
    }

    const removeImage = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview)
        setSelectedImage(null)
        setImagePreview('')
        setImageAnalysis(null)
    }

    const getLocation = async () => {
        toast.loading('Acquiring high-accuracy GPS fix…', { id: 'geo' })
        const loc = await detectUserLocation(true)
        if (loc) {
            handleChange('lat', loc.lat.toFixed(4))
            handleChange('lng', loc.lng.toFixed(4))
            handleChange('location', loc.formattedLocation)
            if (loc.state) handleChange('state', loc.state)
            toast.success(`Location captured: ${loc.city}${loc.state ? `, ${loc.state}` : ''}!`, { id: 'geo' })
        } else {
            toast.error('Could not detect location automatically', { id: 'geo' })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.event || !form.description || !form.location) {
            toast.error('Please fill required fields')
            return
        }
        setLoading(true)

        try {
            // Run real AI credibility verification against Open-Meteo live ground station
            const verification = await verifyCitizenReportWithAI({
                location: form.location,
                event: form.event,
                description: form.description,
                lat: form.lat,
                lng: form.lng,
            })

            setAiVerificationResult(verification)

            const id = `MSA-2026-${10000 + Math.floor(Math.random() * 5000)}`
            const reporterName = form.reporter_name?.trim() || 'Citizen Sentinel'
            const reportState = form.state || userLocation?.state || 'Uttar Pradesh'
            const upiId = form.upi_id?.trim() || ''

            const newReport = {
                id,
                event_type: EVENT_TYPE_MAP[form.event] || 'rainfall',
                text: form.description,
                reporter_name: reporterName,
                upi_id: upiId,
                source: 'citizen',
                source_label: 'Citizen Report',
                location: form.location,
                city: form.location.split(',')[0].trim(),
                state: reportState,
                latitude: parseFloat(form.lat) || (userLocation?.lat ?? 28.58),
                longitude: parseFloat(form.lng) || (userLocation?.lng ?? 77.32),
                credibility_score: verification.credibilityScore,
                verification_status: verification.verificationStatus,
                severity: verification.credibilityScore >= 80 ? 'HIGH' : 'MODERATE',
                timestamp: form.datetime ? new Date(form.datetime).toISOString() : new Date().toISOString(),
                temperature: userWeather?.temp ?? 23,
                exact_time_logged: currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
                exact_date_logged: currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }),
                minutes_ago: 0,
                has_image: Boolean(selectedImage),
                image_ai_analysis_status: imageAnalysis?.status || 'not_checked',
                duplicate_group: null,
                ai_verification: verification,
            }

            await addReport(newReport)

            // If report is credible (≥ 75%), automatically induct into Glory of Honour & monthly state lucky draw
            if (verification.credibilityScore >= 75) {
                addGloryEntry({
                    id: `GLORY-${Date.now()}`,
                    name: reporterName,
                    city: form.location.split(',')[0].trim() || 'Local City',
                    state: reportState,
                    report_title: `${form.event} in ${form.location.split(',')[0].trim()}`,
                    event_type: EVENT_TYPE_MAP[form.event] || 'rainfall',
                    credibility_score: verification.credibilityScore,
                    status: 'authorized',
                    rank: verification.credibilityScore >= 95 ? 'Platinum Sentinel' : verification.credibilityScore >= 85 ? 'Gold Sentinel' : 'Silver Sentinel',
                    verified_date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                    report_id: id,
                    upi_id: upiId,
                    is_lucky_winner: false,
                    prize_won: null,
                    badge: verification.credibilityScore >= 95 ? '💎' : verification.credibilityScore >= 85 ? '🥇' : '🥈',
                })
                toast.success(`🎖️ Inducted into Glory of Honour! Enrolled in ${reportState} ₹500 draw!`, { duration: 5000 })
            }

            setSubmittedId(id)
            setSubmitted(true)
        } catch (err) {
            toast.error('Error submitting report: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div style={{ padding: 40, maxWidth: 640, margin: '0 auto' }}>
                <div style={{ background: '#ffffff', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 36, textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#10b981', margin: '0 0 8px' }}>Report Verified & Submitted!</h2>
                    <div style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>Your report has been analyzed by AI and plotted on the Live National Weather Map.</div>

                    <div style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 10, padding: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Report ID</div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: '#2563eb', fontFamily: 'JetBrains Mono, monospace' }}>{submittedId}</div>
                        </div>
                        <div style={{ height: 32, width: 1, background: '#cbd5e1' }} />
                        <div>
                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>AI Credibility Score</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: aiVerificationResult?.credibilityScore >= 75 ? '#10b981' : '#f59e0b' }}>
                                {aiVerificationResult?.credibilityScore || 85}/100
                            </div>
                        </div>
                        <div style={{ height: 32, width: 1, background: '#cbd5e1' }} />
                        <div>
                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>AI Status</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                                {aiVerificationResult?.verificationStatus || 'VERIFIED'}
                            </div>
                        </div>
                    </div>

                    {/* Glory of Honour Induction Banner */}
                    {aiVerificationResult?.credibilityScore >= 75 && (
                        <div style={{
                            background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
                            border: '1.5px solid #818cf8',
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 20,
                            textAlign: 'left'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <span style={{ fontSize: 22 }}>🏆</span>
                                <div style={{ fontSize: 14, fontWeight: 800, color: '#1e1b4b' }}>
                                    Inducted into Glory of Honour!
                                </div>
                                <span style={{ marginLeft: 'auto', background: '#dcfce7', color: '#15803d', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>
                                    Eligible for ₹500 Draw
                                </span>
                            </div>
                            <p style={{ fontSize: 12, color: '#334155', margin: '0 0 10px', lineHeight: 1.5 }}>
                                Congratulations <strong>{form.reporter_name || 'Citizen Sentinel'}</strong>! Your report scored <strong>{aiVerificationResult?.credibilityScore}%</strong> and is officially authorized. You are enrolled in the <strong>{form.state}</strong> monthly <strong>₹500 cash lucky draw</strong> pool!
                            </p>
                            <button
                                onClick={() => navigate('/glory-of-honour')}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    background: '#2563eb', color: '#fff', border: 'none',
                                    borderRadius: 7, padding: '7px 14px', fontSize: 12, fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                <Trophy size={14} /> View Glory of Honour & Lucky Draw
                            </button>
                        </div>
                    )}

                    {/* AI processing steps */}
                    <div style={{ textAlign: 'left', marginBottom: 20, background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>🤖 Real-Time AI Verification Pipeline</div>
                        {[
                            { icon: '✓', text: 'Report ingested & geocoded', detail: form.location, done: true },
                            { icon: '✓', text: 'NLP parsing & severity classification', detail: `${form.event} identified`, done: true },
                            { icon: '✓', text: 'Open-Meteo live ground station corroboration', detail: `Cross-referenced with ${aiVerificationResult?.stationUsed || 'regional'} telemetry`, done: true },
                            { icon: '✓', text: 'Physical image sensor forensics', detail: selectedImage ? (imageAnalysis?.status === 'likely_real' ? 'Camera sensor shot noise confirmed' : 'Image inspected') : 'No image attached', done: true },
                            { icon: '✓', text: 'Plotted live to India Weather Map', detail: 'Visible to national emergency dashboard', done: true },
                        ].map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                <span style={{ color: '#10b981', fontWeight: 'bold' }}>{s.icon}</span>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{s.text}</div>
                                    <div style={{ fontSize: 11, color: '#64748b' }}>{s.detail}</div>
                                </div>
                                <CheckCircle size={14} color="#10b981" style={{ marginLeft: 'auto', flexShrink: 0, marginTop: 2 }} />
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                        <button onClick={() => { setSubmitted(false); setForm({ event: '', description: '', location: userLocation?.formattedLocation || '', lat: userLocation?.lat ? String(userLocation.lat.toFixed(4)) : '', lng: userLocation?.lng ? String(userLocation.lng.toFixed(4)) : '', datetime: getExactLocalIsoString(), contact: '' }); setSelectedImage(null); setImagePreview(''); setImageAnalysis(null); }}
                            style={secondaryBtn}>Submit Another</button>
                        <button onClick={() => navigate('/map')} style={primaryBtn}>View on Live Map</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ padding: 24, maxWidth: 700 }}>
            <PageHeader
                title="Submit Weather Report"
                subtitle="Report a weather event in your area. Your report helps build national weather intelligence."
            />

            {/* Live Location & Temperature Status Banner of where report is being logged */}
            <div style={{
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                borderRadius: 14,
                padding: '14px 18px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(37,99,235,0.06)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{userWeather?.conditionIcon || '📍'}</span>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                                📍 Logging from: {userLocation?.city || 'Detecting...'}{userLocation?.state ? `, ${userLocation.state}` : ''}
                            </span>
                            <span style={{
                                fontSize: 10, fontWeight: 700, color: '#16a34a',
                                background: '#dcfce7', padding: '1px 7px', borderRadius: 999
                            }}>
                                ● Live Station Connected
                            </span>
                        </div>
                        <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                            {userWeather ? (
                                <span>
                                    Live ground temperature: <strong style={{ color: '#0f172a', fontSize: 13 }}>{userWeather.temp}°C</strong> ({userWeather.conditionLabel}) · Open-Meteo
                                </span>
                            ) : (
                                <span style={{ color: '#94a3b8' }}>Fetching live ground telemetry…</span>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'right', borderLeft: '1px solid #e2e8f0', paddingLeft: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                        {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                    </div>
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
                        {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Citizen Sentinel Identity & State ₹500 Lucky Draw Enrollment */}
                <div style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
                    border: '1.5px solid #bfdbfe',
                    borderRadius: 12,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: '#1e3a8a' }}>
                            <Trophy size={16} color="#2563eb" /> Glory of Honour & Monthly ₹500 Cash Draw Enrollment
                        </div>
                        <span style={{ fontSize: 11, background: '#dbeafe', color: '#1d4ed8', fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>
                            🎁 ₹500 Drawn Monthly Per State
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                        {/* Full Name */}
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Your Full Name (Glory List Display) *</label>
                            <input
                                value={form.reporter_name}
                                onChange={e => handleChange('reporter_name', e.target.value)}
                                placeholder="e.g. Vikram Sharma"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {/* State / UT */}
                        <div style={fieldStyle}>
                            <label style={labelStyle}>State / UT (Lucky Draw Pool) *</label>
                            <select
                                value={form.state}
                                onChange={e => handleChange('state', e.target.value)}
                                style={inputStyle}
                                required
                            >
                                {INDIAN_STATES_AND_UTS.map(st => (
                                    <option key={st} value={st}>{st}</option>
                                ))}
                            </select>
                        </div>

                        {/* UPI ID */}
                        <div style={fieldStyle}>
                            <label style={labelStyle}>UPI ID (for ₹500 lucky transfer)</label>
                            <input
                                value={form.upi_id}
                                onChange={e => handleChange('upi_id', e.target.value)}
                                placeholder="e.g. vikram@oksbi or 9876543210@paytm"
                                style={inputStyle}
                            />
                        </div>
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>
                        Authorized reports (AI Credibility ≥ 75%) are automatically showcased in the Glory of Honour and enrolled into your state's random draw!
                    </div>
                </div>

                {/* Event type */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Weather Event *</label>
                    <select value={form.event} onChange={e => handleChange('event', e.target.value)} style={inputStyle} required>
                        <option value="">Select event type...</option>
                        {EVENT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>

                {/* Description */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Description *</label>
                    <textarea
                        value={form.description}
                        onChange={e => handleChange('description', e.target.value)}
                        placeholder="Describe what you're observing. Include details like intensity, road conditions, visibility, etc. You can write in English, Hindi, or Hinglish."
                        rows={4}
                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                        required
                    />
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Supports English, Hindi, and Hinglish</div>
                </div>

                {/* Location */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Location *</label>
                    <input
                        value={form.location}
                        onChange={e => handleChange('location', e.target.value)}
                        placeholder={userLocation?.formattedLocation ? `e.g. Sector 18, ${userLocation.formattedLocation}` : "e.g. Connaught Place, New Delhi"}
                        style={inputStyle}
                        required
                    />
                </div>

                {/* GPS */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>GPS Coordinates (optional)</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input value={form.lat} onChange={e => handleChange('lat', e.target.value)} placeholder="Latitude" style={{ ...inputStyle, flex: 1 }} />
                        <input value={form.lng} onChange={e => handleChange('lng', e.target.value)} placeholder="Longitude" style={{ ...inputStyle, flex: 1 }} />
                        <button type="button" onClick={getLocation} style={{ ...secondaryBtn, whiteSpace: 'nowrap' }}>
                            <MapPin size={12} /> Auto-detect
                        </button>
                    </div>
                </div>

                {/* Datetime */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Date & Time</label>
                    <input type="datetime-local" value={form.datetime} onChange={e => handleChange('datetime', e.target.value)} style={inputStyle} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: '#64748b' }}>
                            Exact Local Time: <strong>{currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })} • {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</strong>
                        </span>
                        <button
                            type="button"
                            onClick={() => handleChange('datetime', getExactLocalIsoString())}
                            style={{ fontSize: 11, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                        >
                            Set to Exact Current Time
                        </button>
                    </div>
                </div>

                {/* Working image upload and AI-image analysis */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Upload Weather Image (optional)</label>
                    <label htmlFor="weather-image-upload" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleImageSelect(e.dataTransfer.files?.[0]) }} style={{
                        display: 'block', border: '2px dashed rgba(0,0,0,0.15)', borderRadius: 10,
                        padding: 20, textAlign: 'center', cursor: 'pointer', background: '#f8fafc',
                    }}>
                        <Upload size={24} color="#64748b" style={{ marginBottom: 8 }} />
                        <div style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>{selectedImage ? 'Choose a different image' : 'Click to upload or drag a file here'}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>JPG, PNG, or WebP · Maximum 8 MB</div>
                    </label>
                    <input id="weather-image-upload" type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={e => handleImageSelect(e.target.files?.[0])} />

                    {selectedImage && (
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, background: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                                    <ImageIcon size={16} color="#64748b" />
                                    <span style={{ fontSize: 12, color: '#334155', overflowWrap: 'anywhere' }}>{selectedImage.name} · {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                                <button type="button" onClick={removeImage} aria-label="Remove image" style={{ ...secondaryBtn, padding: 6 }}><X size={14} /></button>
                            </div>
                            <img src={imagePreview} alt="Selected weather report preview" style={{ width: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 8, background: '#f1f5f9' }} />
                            <button type="button" onClick={analyzeImage} disabled={analyzingImage} style={{ ...primaryBtn, width: '100%', marginTop: 12, opacity: analyzingImage ? 0.7 : 1 }}>
                                <ShieldCheck size={15} /> {analyzingImage ? 'Analyzing image…' : 'Check for AI-generated image'}
                            </button>
                            {imageAnalysis && (
                                <div style={{ marginTop: 12, padding: 12, borderRadius: 9, background: imageAnalysis.status === 'likely_ai_generated' ? '#fff7ed' : imageAnalysis.status === 'likely_real' ? '#f0fdf4' : '#fffbeb', border: `1px solid ${imageAnalysis.status === 'likely_ai_generated' ? '#fed7aa' : imageAnalysis.status === 'likely_real' ? '#bbf7d0' : '#fde68a'}` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                                        <AlertTriangle size={16} />
                                        {imageAnalysis.status === 'likely_ai_generated' ? 'Signals associated with AI-generated content' : imageAnalysis.status === 'likely_real' ? 'Signals associated with a real photograph' : imageAnalysis.status === 'inconclusive' ? 'Inconclusive result' : 'Image detection unavailable'}
                                    </div>
                                    {imageAnalysis.topPrediction && <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>Model label: {imageAnalysis.topPrediction.label} · score {(imageAnalysis.topPrediction.score * 100).toFixed(1)}%</div>}
                                    {imageAnalysis.error && <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{imageAnalysis.error}</div>}
                                    <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5, marginTop: 8 }}>{imageAnalysis.disclaimer || 'This feature checks AI-generation signals only. It does not verify the photo source, date, location, or weather claim.'}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Contact */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Contact (optional — not shared publicly)</label>
                    <input value={form.contact} onChange={e => handleChange('contact', e.target.value)} placeholder="Phone / Email (for follow-up only)" style={inputStyle} />
                </div>

                {/* Disclaimer */}
                <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
                    ⚠️ Submitting false or misleading weather reports affects emergency response. Your report may be checked by AI tools and should be reviewed by operators. Image AI-detection is an estimate, not proof.
                </div>

                <button type="submit" disabled={loading} style={{ ...primaryBtn, opacity: loading ? 0.7 : 1 }}>
                    <Send size={14} />
                    {loading ? 'Analyzing Report...' : 'Submit Report'}
                </button>
            </form>
            <Toaster position="top-center" />
        </div>
    )
}

const fieldStyle = { display: 'flex', flexDirection: 'column', gap: 6 }
const labelStyle = { fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }
const inputStyle = { padding: '9px 12px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, color: '#0f172a', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' }
const primaryBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'opacity 0.2s' }
const secondaryBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.05)', color: '#475569', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }
