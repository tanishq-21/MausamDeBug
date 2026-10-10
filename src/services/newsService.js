/**
 * MausamDeBug News Service
 * Returns rich mock data. Wire to NewsAPI via backend /api/news when key is available.
 */

import { fetchStats } from './api'

const UNSPLASH_WEATHER = [
    'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=800&q=80',
    'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=800&q=80',
    'https://images.unsplash.com/photo-1547683905-f30e628153bc?w=800&q=80',
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    'https://images.unsplash.com/photo-1545127027-e85d95febecc?w=800&q=80',
    'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=800&q=80',
    'https://images.unsplash.com/photo-1504608524841-42584120d693?w=800&q=80',
]

export const MOCK_NEWS_ARTICLES = [
    {
        id: 'news-1', isBreaking: true,
        title: 'Heavy Rainfall Disrupts Several Areas in Uttarakhand; NDRF on Standby',
        summary: 'Continuous heavy rainfall has caused severe waterlogging and minor landslides near Dehradun. Authorities have issued a red alert.',
        source: 'Hindustan Times', sourceTier: 'T2', url: '#',
        image: UNSPLASH_WEATHER[0], location: 'Dehradun, Uttarakhand',
        eventType: 'rainfall', publishedAt: new Date(Date.now() - 12 * 60000).toISOString(),
        aiRelevance: 96, credibility: 94,
    },
    {
        id: 'news-2', isBreaking: false,
        title: 'Delhi NCR Thunderstorm Watch: IMD Issues Yellow Alert',
        summary: 'The India Meteorological Department issued a yellow alert for thunderstorms across Delhi NCR for the next 24 hours.',
        source: 'The Hindu', sourceTier: 'T2', url: '#',
        image: UNSPLASH_WEATHER[1], location: 'New Delhi',
        eventType: 'thunderstorm', publishedAt: new Date(Date.now() - 58 * 60000).toISOString(),
        aiRelevance: 88, credibility: 91,
    },
    {
        id: 'news-3', isBreaking: true,
        title: 'Brahmaputra Crosses Danger Mark in Assam; Evacuation Orders Issued',
        summary: 'Flood situation intensifies in 12 districts as the Brahmaputra river crosses the 2026 danger mark.',
        source: 'Assam Tribune', sourceTier: 'T2', url: '#',
        image: UNSPLASH_WEATHER[2], location: 'Guwahati, Assam',
        eventType: 'flood', publishedAt: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
        aiRelevance: 92, credibility: 98,
    },
    {
        id: 'news-4', isBreaking: false,
        title: 'Heatwave Conditions Persist in Rajasthan; Temperature Crosses 47°C',
        summary: 'Bikaner and Jaisalmer recorded temperatures above 47°C. Government has opened 200 cooling centers.',
        source: 'Rajasthan Patrika', sourceTier: 'T2', url: '#',
        image: UNSPLASH_WEATHER[3], location: 'Bikaner, Rajasthan',
        eventType: 'heatwave', publishedAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        aiRelevance: 90, credibility: 89,
    },
    {
        id: 'news-5', isBreaking: false,
        title: 'Cyclonic Activity Developing in Bay of Bengal; Coastal Alert Issued',
        summary: 'IMD tracking a low-pressure area in the Bay of Bengal that may intensify into a cyclone in 72 hours.',
        source: 'Times of India', sourceTier: 'T2', url: '#',
        image: UNSPLASH_WEATHER[4], location: 'Bay of Bengal / Odisha Coast',
        eventType: 'cyclone', publishedAt: new Date(Date.now() - 6 * 60 * 60000).toISOString(),
        aiRelevance: 85, credibility: 87,
    },
    {
        id: 'news-6', isBreaking: false,
        title: 'Dense Fog Advisory for Northern India; Highways Closed',
        summary: 'Dense fog with near-zero visibility affects highways in Punjab, Haryana and UP.',
        source: 'NDTV', sourceTier: 'T2', url: '#',
        image: UNSPLASH_WEATHER[5], location: 'Punjab / Haryana / UP',
        eventType: 'fog', publishedAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
        aiRelevance: 82, credibility: 86,
    },
    {
        id: 'news-7', isBreaking: true,
        title: 'Flash Flood Warning in Himachal Pradesh After Intense Rainfall',
        summary: 'Multiple rivers running above alert levels following heavy rain. SDRF teams deployed.',
        source: 'Tribune India', sourceTier: 'T2', url: '#',
        image: UNSPLASH_WEATHER[6], location: 'Shimla, Himachal Pradesh',
        eventType: 'flood', publishedAt: new Date(Date.now() - 35 * 60000).toISOString(),
        aiRelevance: 94, credibility: 93,
    },
    {
        id: 'news-8', isBreaking: false,
        title: 'Strong Winds Batter Kerala Coast; Fishermen Advised Not to Venture Out',
        summary: 'Cyclonic winds of 65-80 kmph forecast along the Kerala coast.',
        source: 'The News Minute', sourceTier: 'T2', url: '#',
        image: UNSPLASH_WEATHER[7], location: 'Thiruvananthapuram, Kerala',
        eventType: 'strong_wind', publishedAt: new Date(Date.now() - 90 * 60000).toISOString(),
        aiRelevance: 79, credibility: 85,
    },
]

export const EVENT_TYPE_ICON = {
    rainfall: '🌧', flood: '🌊', thunderstorm: '⛈', heatwave: '🌡',
    fog: '🌫', dust_storm: '💨', strong_wind: '🌬', hailstorm: '🌨',
    landslide: '⛰', cyclone: '🌀', wildfire: '🔥', other: '🌍',
}

export function formatRelativeTime(iso) {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins} min ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} hr ago`
    return `${Math.floor(hrs / 24)}d ago`
}

export async function getNewsArticles() {
    try {
        const res = await fetch('http://localhost:5000/api/news')
        if (res.ok) return await res.json()
    } catch { }
    return MOCK_NEWS_ARTICLES
}
