# 🚗 Smart Accident Risk Analysis System

## 📌 Overview
Smart Accident Risk Analysis System is a web-based application that predicts road accident risk levels and helps users choose safer travel routes. It integrates historical accident data, traffic conditions, and weather information to visualize high-risk zones on an interactive map.

This project is designed especially for **Indian city environments** and aims to improve road safety through data-driven insights.

---

## 🎯 Key Features

- 🔍 Predicts accident risk levels (Low / Medium / High)
- 🗺️ Interactive map visualization using Leaflet
- 📊 Displays accident-prone zones (heatmaps & markers)
- 🚦 Considers traffic conditions for risk analysis
- 🌦️ Includes weather-based risk factors
- 🚨 Real-time alerts and notifications
- 🛣️ Suggests safer alternative routes
- 📁 Uses structured datasets (CSV + JSON)

---

## 🧠 How It Works

1. User selects a location  
2. System fetches:
   - Accident data  
   - Traffic conditions  
   - Weather data  
3. Risk is calculated using internal logic  
4. Results are displayed on a map with alerts  
5. Safer routes are suggested avoiding high-risk zones  

---

## 🏗️ Tech Stack

- **Frontend:** Next.js, React  
- **Backend:** Next.js API Routes  
- **Mapping:** Leaflet.js  
- **Data Processing:** JavaScript  
- **Data Sources:** CSV, JSON  

---

## 📂 Full Project Structure
```
smart-accident-risk-system/
│
├── app/
│ ├── alerts/
│ │ └── page.js
│ │
│ ├── api/
│ │ ├── accidents/
│ │ │ └── route.js
│ │ ├── geocode/
│ │ │ └── route.js
│ │ ├── news/
│ │ │ └── route.js
│ │ ├── risk/
│ │ │ └── route.js
│ │ ├── route/
│ │ │ └── route.js
│ │ ├── traffic/
│ │ │ └── route.js
│ │ └── weather/
│ │ └── route.js
│ │
│ ├── dashboard/
│ │ └── page.js
│ │
│ ├── favicon.ico
│ ├── globals.css
│ ├── layout.js
│ ├── page.js
│ └── page.module.css
│
├── components/
│ ├── AlertsCenter.jsx
│ ├── MapView.jsx
│ ├── RiskWorkbench.jsx
│ └── SafetyNotifier.jsx
│
├── data/
│ ├── accidents.csv
│ └── risk_grid.json
│
├── lib/
│ ├── accidentInsights.js
│ ├── cityRadius.js
│ ├── citySizing.js
│ ├── dataParser.js
│ ├── mapOverlays.js
│ ├── reportGenerator.js
│ ├── riskCalculator.js
│ ├── riskModel.js
│ ├── routePlanner.js
│ ├── trafficLogic.js
│ ├── zoneAggregator.js
│ ├── zoneGenerator.js
│ └── zoneRiskProfile.js
│
├── public/
│ ├── file.svg
│ ├── globe.svg
│ ├── next.svg
│ ├── vercel.svg
│ └── window.svg
│
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
└── package.json
```
---

## 🚀 Installation & Setup

### 1️⃣ Clone the repository
```git clone https://github.com/Nimalan07/smart-accident-risk-system.git ```
### 2️⃣ Navigate into the project
- cd smart-accident-risk-system
### 3️⃣ Install dependencies
- npm install
### 4️⃣ Run the development server
- npm run dev
### 5️⃣ Open in browser
- http://localhost:3000
---

## 📊 Use Cases
- 🚗 Drivers choosing safer routes
- 🚓 Traffic authorities identifying accident hotspots
- 🏙️ Smart city planning and analysis
- 🚑 Emergency services route optimization
- 📈 Research and data analysis
---

## ⚠️ Limitations
- Uses static datasets (not fully real-time)
- Risk prediction is rule-based (no ML yet)
- Requires external APIs for live deployment
---

## 🔮 Future Enhancements
- 🤖 Machine Learning-based prediction
- 📡 Real-time traffic and accident APIs
- 📱 Mobile responsive UI / App
- 🔔 Push notifications
- 📊 Advanced analytics dashboard
