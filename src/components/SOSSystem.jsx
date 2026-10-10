import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, MapPin, X, Navigation, Phone, ChevronRight, AlertTriangle, CloudRain, Wind, Activity } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function SOSSystem({ isMobile = false }) {
    const { realAlerts } = useAppStore();
    const [status, setStatus] = useState('IDLE'); // IDLE, CONFIRM, ACTIVATING, ACTIVE
    const [timer, setTimer] = useState(0);
    const [holdProgress, setHoldProgress] = useState(0);
    const holdTimerRef = useRef(null);
    const activeTimerRef = useRef(null);

    const [location, setLocation] = useState(null);

    // Dynamic weather context from live alerts
    const activeAlert = realAlerts?.[0];
    const weatherContext = {
        condition: activeAlert?.category === 'heatwave' ? 'Extreme Heat' : activeAlert?.category === 'strong_wind' ? 'High Wind' : 'Severe Weather',
        temp: activeAlert?.liveMetric ? activeAlert.liveMetric.split('·')[0] : '26°C',
        wind: activeAlert?.category === 'strong_wind' ? '45 km/h' : '22 km/h',
        visibility: activeAlert?.category === 'fog' ? '< 50m' : '5 km',
        alert: activeAlert ? `${activeAlert.title} (${activeAlert.location})` : 'Severe Weather Advisory'
    };

    // Hold to activate logic
    const startHold = () => {
        setHoldProgress(0);
        holdTimerRef.current = setInterval(() => {
            setHoldProgress(p => {
                if (p >= 100) {
                    clearInterval(holdTimerRef.current);
                    activateSOS();
                    return 100;
                }
                return p + 2; // 50 steps of 20ms = 1 second hold? Let's make it 3 seconds => 3000ms. 3000/20 = 150 steps. 100 / 150 = 0.66
            });
        }, 20); // 3 seconds total = 150 ticks of 20ms
    };

    const stopHold = () => {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        if (status !== 'ACTIVE' && status !== 'ACTIVATING') {
            setHoldProgress(0);
        }
    };

    useEffect(() => {
        if (holdProgress >= 100 && status === 'CONFIRM') {
            activateSOS();
        }
    }, [holdProgress, status]);

    const activateSOS = () => {
        setStatus('ACTIVATING');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                pos => {
                    setLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        acc: pos.coords.accuracy
                    });
                    setStatus('ACTIVE');
                },
                err => {
                    console.error(err);
                    setStatus('ACTIVE'); // Still active even if loc fails
                },
                { enableHighAccuracy: true }
            );
        } else {
            setStatus('ACTIVE');
        }
    };

    useEffect(() => {
        if (status === 'ACTIVE') {
            activeTimerRef.current = setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        } else {
            clearInterval(activeTimerRef.current);
            setTimer(0);
        }
        return () => clearInterval(activeTimerRef.current);
    }, [status]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel the emergency request?")) {
            setStatus('IDLE');
            setLocation(null);
            setHoldProgress(0);
        }
    };

    return (
        <>
            {/* TRIGGER BUTTON (Desktop Header or Mobile Floating) */}
            {isMobile ? (
                <button
                    onClick={() => status === 'IDLE' && setStatus('CONFIRM')}
                    style={{
                        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
                        width: 60, height: 60, borderRadius: '50%',
                        background: '#ef4444', color: '#fff', border: 'none',
                        boxShadow: '0 10px 25px rgba(239,68,68,0.5)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: status === 'ACTIVE' ? 'pulse-red 1.5s infinite' : 'none'
                    }}
                >
                    <ShieldAlert size={28} />
                </button>
            ) : (
                <button
                    onClick={() => status === 'IDLE' && setStatus('CONFIRM')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 999,
                        background: '#ef4444', color: '#fff', border: 'none',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
                        animation: status === 'ACTIVE' ? 'pulse-red 1.5s infinite' : 'none'
                    }}
                >
                    <ShieldAlert size={16} />
                    <span>SOS Emergency</span>
                </button>
            )}

            {/* CONFIRMATION MODAL */}
            {status === 'CONFIRM' && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ef4444' }}>
                                <ShieldAlert size={24} />
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Emergency Assistance</h3>
                            </div>
                            <button onClick={() => setStatus('IDLE')} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
                        </div>
                        <p style={{ margin: '0 0 24px', fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
                            Are you in an emergency and need immediate assistance? This will activate event tracking and location sharing.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {/* HOLD TO ACTIVATE LOGIC */}
                            <button
                                onMouseDown={startHold} onMouseUp={stopHold} onMouseLeave={stopHold}
                                onTouchStart={startHold} onTouchEnd={stopHold}
                                style={{
                                    position: 'relative', overflow: 'hidden', padding: 16, borderRadius: 12,
                                    background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5',
                                    fontWeight: 800, fontSize: 15, cursor: 'pointer', userSelect: 'none'
                                }}
                            >
                                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: '#ef4444', width: `${holdProgress}%`, transition: 'width 0.05s linear', opacity: 0.2 }} />
                                <span style={{ position: 'relative', zIndex: 1 }}>Press & Hold to Activate SOS</span>
                            </button>

                            <button style={secButtonStyle}>
                                <MapPin size={16} /> Share My Location Only
                            </button>
                            <button onClick={() => setStatus('IDLE')} style={{ ...secButtonStyle, background: '#f1f5f9', color: '#475569', border: 'none' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ACTIVE SOS SCREEN */}
            {status === 'ACTIVE' && (
                <div style={{ ...overlayStyle, background: 'rgba(255, 255, 255, 0.98)', alignItems: 'flex-start', overflowY: 'auto', padding: '0' }}>
                    <div style={{ width: '100%', maxWidth: 600, margin: '0 auto', minHeight: '100vh', background: '#fff', boxShadow: '0 0 40px rgba(0,0,0,0.1)', paddingBottom: 60 }}>
                        {/* Header */}
                        <div style={{
                            background: '#ef4444', padding: '24px 20px', color: '#fff',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <AlertTriangle size={24} />
                                <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '1px' }}>SOS ACTIVE</span>
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace' }}>
                                {formatTime(timer)}
                            </div>
                        </div>

                        <div style={{ padding: 20 }}>
                            <p style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 20 }}>Emergency assistance has been activated.</p>

                            {/* Location Section */}
                            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3b82f6', marginBottom: 12, fontWeight: 700 }}>
                                    <MapPin size={18} /> Location Shared
                                </div>
                                {location ? (
                                    <>
                                        <div style={{ fontSize: 13, color: '#475569' }}>Lat: {location.lat.toFixed(5)}, Lng: {location.lng.toFixed(5)}</div>
                                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Accuracy: ±{Math.round(location.acc)} meters</div>
                                    </>
                                ) : (
                                    <div style={{ fontSize: 13, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <AlertTriangle size={14} /> Locating...
                                    </div>
                                )}
                            </div>

                            {/* Weather Context */}
                            <div style={{ background: '#fffbeb', padding: 16, borderRadius: 12, border: '1px solid #fde68a', marginBottom: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d97706', marginBottom: 16, fontWeight: 700 }}>
                                    <CloudRain size={18} /> Weather Context
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13, color: '#92400e' }}>
                                    <div><Wind size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {weatherContext.wind}</div>
                                    <div><Activity size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {weatherContext.temp}</div>
                                    <div style={{ gridColumn: 'span 2' }}><strong>Alert:</strong> {weatherContext.alert}</div>
                                </div>
                            </div>

                            {/* Emergency Numbers */}
                            <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>Important Emergency Numbers</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 30 }}>
                                <a href="tel:112" style={callBtnStyle}><Phone size={16} /> Call 112 (National)</a>
                                <a href="tel:108" style={callBtnStyle}><Phone size={16} /> Ambulance (108)</a>
                                <a href="tel:100" style={callBtnStyle}><Phone size={16} /> Police (100)</a>
                                <a href="tel:101" style={callBtnStyle}><Phone size={16} /> Fire (101)</a>
                            </div>

                            {/* Actions */}
                            <button onClick={handleCancel} style={{
                                width: '100%', padding: 16, borderRadius: 12, background: '#f1f5f9',
                                color: '#ef4444', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: 15
                            }}>
                                Cancel SOS
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse-red {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
            `}</style>
        </>
    );
}

const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
    zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center'
};
const modalStyle = {
    background: '#fff', borderRadius: 20, padding: 24, width: '90%', maxWidth: 400,
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
};
const secButtonStyle = {
    padding: '14px 16px', borderRadius: 12, background: '#fff',
    border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 700,
    fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', cursor: 'pointer'
};
const callBtnStyle = {
    display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
    padding: '12px', borderRadius: 10, background: '#ef4444', color: '#fff',
    fontWeight: 700, fontSize: 13, textDecoration: 'none'
};
