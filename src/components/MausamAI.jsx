import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Mic, Volume2, Maximize2, Minimize2, Map, AlertTriangle, Calendar, Navigation, ShieldAlert, CloudRain, Thermometer, Wind } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function MausamAI({ isMobile = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: "Hello! 👋\n\nI'm Mausam AI, your intelligent weather companion.\nI can help you understand weather, forecasts, alerts and conditions around you.\n\nWhat would you like to know?"
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const QUICK_ACTIONS = [
        { icon: '🌧️', label: 'Will it rain today?' },
        { icon: '🌡️', label: 'How hot will it be?' },
        { icon: '⚠️', label: 'Any weather alerts?' },
        { icon: '🗺️', label: 'Weather near me' },
        { icon: '📅', label: '7-day forecast' },
    ];

    const { realAlerts, liveStations } = useAppStore();

    const generateResponse = (query) => {
        const q = query.toLowerCase();
        let response = "";
        let actions = [];

        // Check for specific city match in live stations
        const matchedStation = liveStations?.find(s => q.includes(s.name.toLowerCase()));

        if (matchedStation) {
            response = `📍 **${matchedStation.name}, ${matchedStation.state}**\n\n🌡️ **${matchedStation.temp}°C** (Feels like ${matchedStation.feelsLike}°C)\n${matchedStation.conditionIcon} **${matchedStation.conditionLabel}**\n\n💧 Humidity: ${matchedStation.humidity}%\n💨 Wind: ${matchedStation.windSpeed} km/h (Gusts: ${matchedStation.windGusts.toFixed(0)} km/h)\n🌧️ Precipitation: ${matchedStation.precip} mm\n\n📡 *Live ground telemetry synced from Open-Meteo network.*`;
            actions = ['View Forecast', 'Open Weather Map'];
        } else if (q.includes('alert') || q.includes('warning') || q.includes('emergency')) {
            if (realAlerts && realAlerts.length > 0) {
                const top = realAlerts[0];
                response = `⚠️ **${top.title}**\n\n📍 Location: ${top.location}\n⚡ Severity: **${top.severity}**\n⏱️ ${top.validTill}\n📊 ${top.liveMetric || ''}\n\n🤖 *Mausam AI Guidance:*\n${top.description}`;
                actions = ['View Alert on Map', 'Activate SOS'];
            } else {
                response = "✅ **No Severe Disasters Currently Active**\n\nGround telemetry across 32 Indian weather stations indicates normal seasonal conditions. We continue monitoring active rainfall and wind thresholds 24/7.";
                actions = ['View Live Map'];
            }
        } else if (q.includes('rain') || q.includes('baarish') || q.includes('umbrella')) {
            const rainingStations = liveStations?.filter(s => s.precip > 0 || s.weatherCode >= 51);
            if (rainingStations && rainingStations.length > 0) {
                const names = rainingStations.slice(0, 3).map(s => `${s.name} (${s.precip}mm)`).join(', ');
                response = `🌧️ **Active Rain Telemetry**\n\nRainfall is currently recorded in: **${names}**.\n\nKeep an umbrella handy if you're traveling through these sectors. Check the Live Map for radar updates!`;
            } else {
                response = "⛅ Currently, minimal rainfall is detected across major telemetry stations. Humidity is moderate and atmospheric pressure is stable. 🌦️";
            }
            actions = ['Open Weather Map', 'View Forecast'];
        } else if (q.includes('sos') || q.includes('help') || q.includes('stuck')) {
            response = "🚨 **Emergency SOS System Ready**\n\nIf you or someone nearby is stranded in severe flooding or waterlogging, activate the Emergency SOS button immediately to dispatch coordinates to responders.";
            actions = ['Activate SOS'];
        } else {
            response = "Hello! I am connected to 32 live meteorological ground stations across India. Ask me about **live weather in any city** (e.g. Dehradun, Delhi, Mumbai, Jaipur), **active weather alerts**, or **rainfall status**!";
            actions = ['Any weather alerts?', 'Weather near me'];
        }

        return { text: response, actions };
    };

    const handleSend = (text) => {
        if (!text.trim()) return;

        const newMsg = { id: Date.now(), type: 'user', text };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate network delay and AI typing
        setTimeout(() => {
            const aiReply = generateResponse(text);
            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', ...aiReply }]);
            setIsTyping(false);
        }, 1500);
    };

    const handleActionClick = (action) => {
        if (action === 'Activate SOS') {
            alert('SOS System would be triggered here!');
        } else {
            handleSend(`Show me ${action.toLowerCase()}`);
        }
    };

    // Chat UI Toggle
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: isMobile ? 95 : 24, // Keep it above SOS on mobile
                    right: 24,
                    zIndex: 9998,
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                    color: '#fff', border: 'none', borderRadius: 999,
                    padding: isMobile ? '16px' : '12px 20px',
                    boxShadow: '0 10px 25px rgba(2, 132, 199, 0.4)',
                    cursor: 'pointer', transition: 'transform 0.2s',
                    animation: 'float 3s ease-in-out infinite'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                title="Mausam AI - Your Weather Companion"
            >
                <Bot size={24} />
                {!isMobile && <span style={{ fontWeight: 700, fontSize: 14 }}>Mausam AI</span>}
                <style>{`
                    @keyframes float {
                        0% { transform: translateY(0px) }
                        50% { transform: translateY(-6px) }
                        100% { transform: translateY(0px) }
                    }
                `}</style>
            </button>
        );
    }

    const panelStyle = (isMobile || isMaximized) ? {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000,
        background: '#f8fafc', display: 'flex', flexDirection: 'column'
    } : {
        position: 'fixed', bottom: 24, right: 24, zIndex: 10000,
        width: 380, height: 600, background: '#f8fafc', borderRadius: 24,
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)'
    };

    return (
        <div style={panelStyle}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)', padding: '16px 20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: '50%' }}>
                        <Bot size={20} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>Mausam AI</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} /> Online
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    {!isMobile && (
                        <button onClick={() => setIsMaximized(!isMaximized)} style={iconBtnStyle}>
                            {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                        </button>
                    )}
                    <button onClick={() => setIsOpen(false)} style={iconBtnStyle}><X size={20} /></button>
                </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-end' }}>
                        {msg.type === 'bot' && (
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                                <Bot size={16} />
                            </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                            <div style={{
                                background: msg.type === 'user' ? '#0284c7' : '#fff',
                                color: msg.type === 'user' ? '#fff' : '#0f172a',
                                padding: '12px 16px', borderRadius: msg.type === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                fontSize: 14, lineHeight: 1.5, boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                                border: msg.type === 'bot' ? '1px solid #e2e8f0' : 'none',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {/* Emulate Markdown strong tags rendering hackily */}
                                {msg.text.split('**').map((part, i) => i % 2 !== 0 ? <strong key={i}>{part}</strong> : part)}
                            </div>

                            {/* Action Buttons for AI */}
                            {msg.actions && msg.actions.length > 0 && (
                                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                                    {msg.actions.map((act, i) => (
                                        <button key={i} onClick={() => handleActionClick(act)} style={{
                                            padding: '6px 12px', background: act === 'Activate SOS' ? '#fee2e2' : '#e0f2fe',
                                            color: act === 'Activate SOS' ? '#ef4444' : '#0284c7', border: 'none', borderRadius: 12,
                                            fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                                        }}>
                                            {act === 'Activate SOS' ? <ShieldAlert size={12} /> : null} {act}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* TTS Button for AI */}
                            {msg.type === 'bot' && (
                                <div style={{ display: 'flex', gap: 8, marginTop: 6, paddingLeft: 4 }}>
                                    <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: 0 }}>
                                        <Volume2 size={12} /> Listen
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Bot size={16} />
                        </div>
                        <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>Mausam AI is thinking...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts (Only if just starting) */}
            {messages.length === 1 && !isTyping && (
                <div style={{ padding: '0 20px 10px', display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
                    {QUICK_ACTIONS.map((ta, i) => (
                        <button key={i} onClick={() => handleSend(ta.label)} style={{
                            flexShrink: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
                            padding: '8px 14px', fontSize: 13, color: '#475569', fontWeight: 500, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                        }}>
                            <span>{ta.icon}</span> {ta.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div style={{ padding: 16, background: '#fff', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                <button title="Voice Input" style={{ padding: 12, background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '50%', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mic size={20} />
                </button>
                <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 24, padding: '10px 16px', display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Ask about weather, alerts..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend(input)}
                        style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#0f172a' }}
                    />
                </div>
                <button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim()}
                    style={{
                        padding: 12, background: input.trim() ? '#0284c7' : '#e2e8f0',
                        color: input.trim() ? '#fff' : '#94a3b8', border: 'none', borderRadius: '50%',
                        cursor: input.trim() ? 'pointer' : 'not-allowed', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
                    }}>
                    <Send size={18} style={{ position: 'relative', left: 2 }} />
                </button>
            </div>

            {/* Quick Action Navigation Bar */}
            <div style={{ display: 'flex', padding: '10px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', justifyContent: 'space-around' }}>
                <QuickNav icon={<CloudRain size={16} />} label="Weather" />
                <QuickNav icon={<AlertTriangle size={16} />} label="Alerts" />
                <QuickNav icon={<Map size={16} />} label="Map" />
                <QuickNav icon={<Calendar size={16} />} label="Forecast" />
            </div>
        </div>
    );
}

function QuickNav({ icon, label }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#64748b', cursor: 'pointer' }}>
            {icon}
            <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>
        </div>
    )
}

const iconBtnStyle = {
    background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: 32, height: 32,
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
};
