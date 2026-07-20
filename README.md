# 🛵 SL Delivery Analytics Pro

![UI Dashboard](https://img.shields.io/badge/UI-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![Backend API](https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi)
![Machine Learning](https://img.shields.io/badge/ML-Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn)

A full-stack, AI-powered command center designed to optimize logistics and predict customer churn for a food/grocery delivery platform operating in Sri Lanka. 

## 🌟 Project Overview
This project demonstrates an end-to-end Data Science and Full-Stack Engineering workflow:
1. **Data Engineering:** Generation and preprocessing of localized synthetic delivery data (handling real-world variables like Monsoon weather, Colombo traffic, and regional distances).
2. **Machine Learning:** Training Random Forest models to predict exact delivery delays and classify customer churn risk.
3. **Backend API:** A lightning-fast RESTful API built with Python (FastAPI) to serve the trained models in real-time.
4. **Frontend Dashboard:** A premium, interactive UI built with React, Vite, and Recharts, utilizing modern glassmorphism design principles.

---

## 🏗️ Architecture & Tech Stack

### 🧠 Data & Machine Learning (Python)
- **Pandas & NumPy:** For data manipulation, cleaning, and exploratory data analysis.
- **Scikit-Learn:** 
  - `RandomForestRegressor` for predicting continuous delivery delay minutes.
  - `RandomForestClassifier` for predicting the binary probability of customer churn.
- **Joblib:** Model serialization and loading.

### ⚙️ Backend API (Python)
- **FastAPI:** High-performance web framework for serving the ML endpoints.
- **Uvicorn:** ASGI server for production-grade routing.

### 🎨 Frontend UI (JavaScript)
- **React & Vite:** For a blazing-fast, component-based user interface.
- **Recharts:** For interactive, animated data visualizations (Area, Bar, and Pie charts).
- **Lucide-React:** For modern, scalable iconography.
- **Vanilla CSS:** Custom glassmorphism, glowing risk meters, and CSS animations.

---

## 🚀 How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Imashaidk/SL-delivery-analytics.git
cd SL-delivery-analytics
```

### 2. Start the FastAPI Backend
Open a terminal and run the following commands:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/Scripts/activate  # On Windows

# Install dependencies
pip install -r requirements.txt
pip install fastapi uvicorn

# Start the API server
python backend/main.py
```
*The backend will run on `http://localhost:8000`*

### 3. Start the React Frontend
Open a **new** terminal window and run:
```bash
cd frontend
npm install
npm run dev
```
*The frontend dashboard will be available at `http://localhost:5173`*

---

## 📊 Features

- **Global Insights:** Visualize order volume distribution across Sri Lankan regions and analyze how severe weather (Monsoons) impacts fleet delays.
- **AI Routing Simulator:** Input real-time conditions (Region, Traffic, Weather) to predict exactly how many minutes an order will be delayed.
- **Retention Sentinel:** Analyze a customer's history of severe delays to instantly calculate their probability of uninstalling the app, triggering automated retention protocols.

---
*Created as a comprehensive portfolio project demonstrating Data Science, Backend Engineering, and Frontend UI/UX Design.*
