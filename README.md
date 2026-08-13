# 🛵 SL Delivery Analytics Pro

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://sl-delivery-analytic.netlify.app)
![UI Dashboard](https://img.shields.io/badge/UI-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![Machine Learning](https://img.shields.io/badge/ML-Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn)
![Inference Engine](https://img.shields.io/badge/Inference-ONNX%20WebAssembly-005CED?style=for-the-badge&logo=onnx)

A full-stack, AI-powered command center designed to optimize logistics and predict customer churn for a food/grocery delivery platform operating in Sri Lanka. 

**This project features a 100% serverless Machine Learning architecture.** The `scikit-learn` predictive models have been converted to ONNX format and run natively inside the user's web browser using WebAssembly.

---

## 🌟 Project Overview
This project demonstrates an end-to-end Data Science and modern Frontend Engineering workflow:
1. **Data Engineering:** Generation and preprocessing of localized synthetic delivery data (handling real-world variables like Monsoon weather, Colombo traffic, and regional distances).
2. **Machine Learning:** Training Random Forest models to predict exact delivery delays and classify customer churn risk.
3. **WebAssembly Inference:** Converting the heavy Python models into lightweight `.onnx` files that execute directly in the browser with zero network latency.
4. **Frontend Dashboard:** A premium, interactive UI built with React, Vite, and Recharts, utilizing modern glassmorphism design principles.

---

## 🏗️ Architecture & Tech Stack

### 🧠 Data & Machine Learning (Python)
- **Pandas & NumPy:** For data manipulation, cleaning, and exploratory data analysis.
- **Scikit-Learn:** 
  - `RandomForestRegressor` for predicting continuous delivery delay minutes.
  - `RandomForestClassifier` for predicting the binary probability of customer churn.
- **ONNX (skl2onnx):** For exporting the trained Scikit-Learn pipelines into highly optimized neural network graphs.

### 🎨 Frontend UI & Inference (JavaScript)
- **React & Vite:** For a blazing-fast, component-based user interface.
- **onnxruntime-web:** For executing the Machine Learning models locally in the browser via WebAssembly, eliminating the need for a backend Python server.
- **Recharts:** For interactive, animated data visualizations (Area, Bar, and Pie charts).
- **Lucide-React:** For modern, scalable iconography.
- **Vanilla CSS:** Custom glassmorphism, glowing risk meters, and CSS animations.

---

## 🚀 How to Run Locally

Because this project is serverless, running it locally is incredibly fast and simple.

### 1. Clone the Repository
```bash
git clone https://github.com/Imashaidk/SL-delivery-analytics.git
cd SL-delivery-analytics
```

### 2. Start the React Dashboard
Open your terminal and run:
```bash
cd frontend
npm install
npm run dev
```
*The dashboard and local AI inference engine will be instantly available at `http://localhost:5173`*

### 3. (Optional) Re-train the AI Models
If you want to modify the data science logic or train new models:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/Scripts/activate  # On Windows

# Install data science dependencies
pip install pandas numpy scikit-learn skl2onnx onnx

# Run the training script (this will overwrite the .onnx files in the frontend public folder)
python train_models.py
```

---

## 📊 Features

- **Global Insights:** Visualize order volume distribution across Sri Lankan regions and analyze how severe weather (Monsoons) impacts fleet delays.
- **AI Routing Simulator:** Input real-time conditions (Region, Traffic, Weather) to predict exactly how many minutes an order will be delayed using browser-based ML.
- **Retention Sentinel:** Analyze a customer's history of severe delays to instantly calculate their probability of uninstalling the app, triggering automated retention protocols.
- **CSV Data Export:** Generate synthesized, real-time reports directly from the dashboard arrays.

---
*Created as a comprehensive portfolio project demonstrating Data Science, WebAssembly integration, and Frontend UI/UX Design.*
