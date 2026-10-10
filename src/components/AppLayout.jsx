import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import DemoModePanel from './DemoModePanel'
import SOSSystem from './SOSSystem'
import MausamAI from './MausamAI';
import useIsMobile from '../hooks/useIsMobile'

export default function AppLayout() {
    const isMobile = useIsMobile();
    const { demoMode, wsConnected, setWsConnected, addReport, addNotification, stats, loadData } = useAppStore()

    // Bootstrap: load data from MongoDB API (fallback to mock)
    useEffect(() => { loadData() }, [])

    // Simulate WebSocket with fake event stream
    useEffect(() => {
        if (!demoMode) return

        const cities = ['Dehradun', 'Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Guwahati']
        const events = ['rainfall', 'flood', 'thunderstorm', 'heatwave', 'fog']
        const sources = ['citizen', 'social', 'weather_api']
        const texts = [
            'Heavy rainfall reported in {city}. Roads flooded.',
            'Strong winds and rain in {city} area.',
            'Thunderstorm warning issued for {city}.',
            'Citizens report waterlogging near {city}.',
        ]

        const interval = setInterval(() => {
            const city = cities[Math.floor(Math.random() * cities.length)]
            const event = events[Math.floor(Math.random() * events.length)]
            const source = sources[Math.floor(Math.random() * sources.length)]
            const text = texts[Math.floor(Math.random() * texts.length)].replace('{city}', city)
            const credibility = Math.floor(55 + Math.random() * 40)
            const id = `MSA-2026-${Date.now()}`

            const newReport = {
                id,
                event_type: event,
                text,
                source,
                source_label: source === 'citizen' ? 'Citizen Report' : source === 'social' ? 'Social Media' : 'Weather API',
                location: `${city}, India`,
                city,
                state: 'India',
                latitude: 20 + Math.random() * 15,
                longitude: 72 + Math.random() * 20,
                credibility_score: credibility,
                verification_status: credibility >= 75 ? 'verified' : 'pending',
                severity: credibility >= 80 ? 'HIGH' : 'MODERATE',
                timestamp: new Date().toISOString(),
                minutes_ago: 0,
                has_image: false,
                duplicate_group: null,
            }

            addReport(newReport)
            addNotification({
                type: credibility >= 75 ? 'success' : 'warning',
                message: `New report: ${text.slice(0, 60)}...`,
            })

            toast.custom((t) => (
                <div style={{
                    background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 10, padding: '12px 16px', maxWidth: 320,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    animation: t.visible ? 'slide-in-right 0.3s ease' : 'none',
                }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 16 }}>🌧</span>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>New Report — Demo Mode</div>
                            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{text.slice(0, 70)}</div>
                            <div style={{ fontSize: 10, color: '#10b981', marginTop: 4 }}>Credibility: {credibility}%</div>
                        </div>
                    </div>
                </div>
            ), { duration: 3000 })
        }, 4000)

        return () => clearInterval(interval)
    }, [demoMode])

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#f8fafc' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Navbar />
                <main style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
                    <Outlet />
                </main>
            </div>
            {demoMode && <DemoModePanel />}
            <Toaster position="bottom-right" />
            <SOSSystem isMobile={true} />
            <MausamAI isMobile={isMobile} />
        </div>
    )
}
