/**
 * MausamDeBug Frontend API Service
 * All browser-side requests go through this module.
 * Falls back to mock data if the backend is unreachable.
 */
import axios from 'axios';
import { MOCK_REPORTS, MOCK_EVENTS, MOCK_STATS } from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({ baseURL: BASE_URL, timeout: 8000 });

// ── Reports ──────────────────────────────────────────────────────────────────
export async function fetchReports(filters = {}) {
    try {
        const params = {};
        if (filters.status && filters.status !== 'all') params.status = filters.status;
        if (filters.eventType && filters.eventType !== 'all') params.eventType = filters.eventType;
        if (filters.source && filters.source !== 'all') params.source = filters.source;
        if (filters.search) params.search = filters.search;
        params.limit = 200;

        const { data } = await client.get('/reports', { params });
        return data.reports;
    } catch (err) {
        console.warn('[API] reports fetch failed — using mock data', err.message);
        return MOCK_REPORTS;
    }
}

export async function fetchReport(id) {
    try {
        const { data } = await client.get(`/reports/${id}`);
        return data;
    } catch (err) {
        console.warn('[API] single report fetch failed', err.message);
        return MOCK_REPORTS.find(r => r.id === id) || null;
    }
}

export async function createReport(payload) {
    try {
        const { data } = await client.post('/reports', payload);
        return data;
    } catch (err) {
        console.warn('[API] create report failed', err.message);
        return { ...payload, id: `MSA-LOCAL-${Date.now()}` };
    }
}

export async function updateReportStatus(id, status) {
    try {
        const { data } = await client.patch(`/reports/${id}/status`, { status });
        return data;
    } catch (err) {
        console.warn('[API] status update failed', err.message);
        return null;
    }
}

// ── Events ───────────────────────────────────────────────────────────────────
export async function fetchEvents() {
    try {
        const { data } = await client.get('/events');
        return data.events;
    } catch (err) {
        console.warn('[API] events fetch failed — using mock data', err.message);
        return MOCK_EVENTS;
    }
}

export async function fetchEvent(id) {
    try {
        const { data } = await client.get(`/events/${id}`);
        return data;
    } catch (err) {
        console.warn('[API] single event fetch failed', err.message);
        return MOCK_EVENTS.find(e => e.id === id) || null;
    }
}

// ── Stats ────────────────────────────────────────────────────────────────────
export async function fetchStats() {
    try {
        const { data } = await client.get('/stats');
        return data;
    } catch (err) {
        console.warn('[API] stats fetch failed — using mock data', err.message);
        return MOCK_STATS;
    }
}

// ── Health ───────────────────────────────────────────────────────────────────
export async function checkHealth() {
    try {
        const { data } = await client.get('/health');
        return { online: true, ...data };
    } catch {
        return { online: false };
    }
}
