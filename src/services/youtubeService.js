/**
 * MausamDeBug YouTube / Video Service
 * Mock data with real YouTube IDs. Backend can proxy YouTube Data API v3.
 */

export const MOCK_VIDEOS = [
    {
        id: 'vid-1',
        videoId: 'OGQemQ5mOqA',
        title: 'Heavy Rainfall LIVE: Waterlogging in Dehradun City Areas',
        channel: 'India Today',
        publishedAt: new Date(Date.now() - 18 * 60000).toISOString(),
        location: 'Uttarakhand',
        eventType: 'rainfall',
        thumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&q=80',
        isLive: true,
    },
    {
        id: 'vid-2',
        videoId: 'eCIRtAoXCVc',
        title: 'Assam Floods 2026: Ground Report from Guwahati',
        channel: 'NDTV',
        publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        location: 'Assam',
        eventType: 'flood',
        thumbnail: 'https://images.unsplash.com/photo-1547683905-f30e628153bc?w=600&q=80',
        isLive: false,
    },
    {
        id: 'vid-3',
        videoId: 'KIaJMzVwBgU',
        title: 'IMD Weather Forecast: Monsoon Update for Northern India',
        channel: 'ANI',
        publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
        location: 'New Delhi',
        eventType: 'rainfall',
        thumbnail: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=600&q=80',
        isLive: false,
    },
    {
        id: 'vid-4',
        videoId: 'w3R_4PBl3v8',
        title: 'Rajasthan Heatwave: 47°C Recorded in Bikaner District',
        channel: 'Republic Bharat',
        publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
        location: 'Rajasthan',
        eventType: 'heatwave',
        thumbnail: 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=600&q=80',
        isLive: false,
    },
    {
        id: 'vid-5',
        videoId: 'OGQemQ5mOqA',
        title: 'Cyclone Watch: Bay of Bengal Tracking LIVE',
        channel: 'Zee News',
        publishedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
        location: 'Bay of Bengal',
        eventType: 'cyclone',
        thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
        isLive: true,
    },
    {
        id: 'vid-6',
        videoId: 'eCIRtAoXCVc',
        title: 'Dense Fog Warning: Northern India Highways Shut',
        channel: 'ABP News',
        publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
        location: 'Punjab / UP / Haryana',
        eventType: 'fog',
        thumbnail: 'https://images.unsplash.com/photo-1545127027-e85d95febecc?w=600&q=80',
        isLive: false,
    },
]

export async function getVideos() {
    try {
        const res = await fetch('http://localhost:5000/api/videos')
        if (res.ok) return await res.json()
    } catch { }
    return MOCK_VIDEOS
}
