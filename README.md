# 🌦️ MausamDeBug | National Weather Big Data Analytics Platform

[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**MausamDeBug** is a production-ready, AI-driven national meteorological intelligence and crowdsourced verification platform. It integrates live ground station observations, Open-Meteo satellite feeds, real-time geolocation with reverse geocoding, multi-factor meteorological mapping, and multimodal forensic AI image analysis for weather authenticity verification.

---

## 🌟 Key Highlights & Production Features

### 📍 1. Real-Time Hyperlocal Weather & Geolocation
- **Live GPS & IP Geocoding**: Automatically detects the exact city, state, latitude, and longitude where the user logs in.
- **Accurate Clock & Calendar**: Real-time ticking 12-hour clock with Indian Standard Time (`en-IN`) formatting.
- **Instant Search**: Search any Indian city, district, or town with real-time temperature, wind, humidity, pressure, and weather condition feeds.

### 🗺️ 2. Multi-Factor Interactive Live Map
- **Multiple Meteorological Overlays**:
  - 🌡️ Temperature (°C)
  - 🌧️ Rainfall & Precipitation (mm)
  - ⛈️ Thunderstorm & Lightning Intensity
  - 🌫️ Dense Fog & Low Visibility Indices
  - 🔥 Heat Wave Index & High Temperature
  - 💨 Wind Speed & Gusts (km/h)
  - 💧 Relative Humidity (%)
- **Live Telemetry & Station Filtering**: Instant filtering for active weather events across all states and union territories.

### 🔬 3. Image Verification Lab & Forensic AI Engine
- **Dual-Stream Forensic Analysis**:
  - High-frequency noise variance and Laplacian spectral checks for synthetic diffusion patterns.
  - Camera sensor shot noise pattern verification.
  - Meteorological cross-referencing against real satellite and ground truth observations.
- **Instant Verification Verdicts**: Real-time visual progress, credibility scoring (0–100%), and explainable forensics.

### 🏆 4. Glory of Honour & Monthly State Lucky Draw
- **Sentinel Hall of Fame**: Citizens submitting authenticated, AI-verified ground reports (credibility score ≥ 75%) are automatically inducted into the national Glory of Honour registry.
- **Monthly ₹500 State Cash Prize**: Completely automated, verifiable random draw selecting one sentinel per Indian state each month.
- **UPI Integration**: Directly stores recipient UPI handles for automated disbursement.

### 🛡️ 5. Production Reliability & Resiliency
- **Zero Blank-Screen Guarantee**: Integrated React `ErrorBoundary` catching unexpected edge-case errors with single-click recovery.
- **Optimized Bundle Splitting**: Rolldown/Vite manual chunk isolation (`vendor-react`, `vendor-icons`, `vendor`) for blazing-fast load speeds.
- **Multi-Cloud Ready**: Pre-configured for seamless 1-click deployment on **Vercel**, **Netlify**, or **Docker/Node.js**.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18.x or 20.x
- npm 9+ or pnpm

### Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/MausamDeBug-AI.git
   cd MausamDeBug-AI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Production Build**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🌐 Production Deployment

### Option A: Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. The included `vercel.json` automatically configures:
   - Single Page Application (SPA) routing fallbacks.
   - Immutable 1-year asset caching for `/assets/*`.
   - Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
4. Click **Deploy**.

### Option B: Deploy to Netlify
1. Connect repository in [Netlify](https://netlify.com).
2. The included `netlify.toml` automatically defines:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - SPA 200 rewrite rule `/* -> /index.html`
   - HTTP security headers and caching headers.
3. Deploy site.

---

## 📁 Architecture & Directory Structure

```
MausamDeBug-AI/
├── public/
│   ├── favicon.svg            # Platform favicon
│   ├── icons.svg              # SVG asset sprite
│   └── _redirects             # Static SPA fallback rule
├── src/
│   ├── components/            # Reusable UI widgets & layouts
│   │   ├── AppLayout.jsx      # Core responsive application frame
│   │   ├── ErrorBoundary.jsx  # Production-grade crash guard
│   │   ├── IndiaMap.jsx       # Interactive Leaflet weather map
│   │   ├── Navbar.jsx         # Live telemetry & search header
│   │   ├── Sidebar.jsx        # Role-based navigation drawer
│   │   └── SOSSystem.jsx      # Emergency SOS beacon trigger
│   ├── pages/                 # Route pages
│   │   ├── Home.jsx           # Hyperlocal weather & live dashboard
│   │   ├── LiveMap.jsx        # Multi-factor India map
│   │   ├── GloryOfHonour.jsx  # Hall of Fame & ₹500 lucky draw
│   │   ├── ImageVerification.jsx # AI forensic lab
│   │   ├── CitizenReport.jsx  # Ground report submission form
│   │   ├── Reports.jsx        # All reports & alert monitor
│   │   ├── Events.jsx         # Active event catalog
│   │   └── Login.jsx          # User / Admin authentication
│   ├── services/              # API & Data processing
│   │   ├── aiVerificationService.js # Multimodal verification engine
│   │   ├── realWeatherService.js    # Open-Meteo & GPS integration
│   │   └── gloryService.js          # State registries & lucky draws
│   ├── store/
│   │   └── appStore.js        # Centralized Zustand reactive state
│   ├── App.jsx                # Route definitions & guards
│   ├── main.jsx               # Entry point with ErrorBoundary
│   └── index.css              # Tailored design system tokens
├── vercel.json                # Vercel deployment configuration
├── netlify.toml               # Netlify deployment configuration
└── vite.config.js             # Vite configuration with chunk splitting
```

---

## 🔒 Security & Privacy Notice
- Meteorological data is aggregated via public Open-Meteo API endpoints without requiring private user credentials.
- All geolocation requests strictly prompt for browser permission (`navigator.geolocation`) with fallback to standard Indian metropolitan coordinates.
- Production builds strip debug logging and enforce strict content-type sniffing protection.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
