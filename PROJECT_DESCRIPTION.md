# 📘 Project Description & Architecture Guide

This document explains the inner workings of the **SL Delivery Analytics Pro** project. It is designed to help anyone (including recruiters and technical interviewers) understand exactly how the system was built, how the AI makes decisions, and how the different components communicate.

---

## 1. The Business Problem
Food and grocery delivery platforms in Sri Lanka face two major operational challenges:
1. **Delivery Delays:** Unpredictable weather (monsoons), traffic gridlocks in Colombo, and long distances severely impact Estimated Time of Arrival (ETA).
2. **Customer Churn:** Customers who repeatedly experience severe delays (e.g., waiting >30 minutes past their ETA) become frustrated and uninstall the app (churn).

**The Goal:** Build an AI system that can predict delays *before* the rider is dispatched, and identify which customers are at the highest risk of churning so the marketing team can intervene.

---

## 2. How the System Works (The Architecture)

The project is broken down into three distinct layers:

### Layer A: Data Engineering & Machine Learning (The Brains)
Because real delivery data is proprietary, we wrote a Python script (`data_generator.py`) to simulate highly realistic data based on Sri Lankan geography and weather patterns.
- **`orders.csv`:** Contains 15,000 simulated deliveries. It calculates `ExpectedDeliveryMins` based on distance, and then adds realistic `DelayMins` if the weather is "Heavy Rain" or traffic is "Gridlock".
- **`customers.csv`:** Contains 2,000 simulated users. It calculates a boolean `Churn` flag. If a customer experiences multiple "Severe Delays" (>30 mins), their probability of churning skyrockets.

We then used **Scikit-Learn** to train two Machine Learning models on this data:
1. **Delay Model (`RandomForestRegressor`):** Looks at Region, Distance, Weather, Time of Day, and Traffic to output a continuous number (e.g., "This order will be delayed by 18.5 minutes").
2. **Churn Model (`RandomForestClassifier`):** Looks at a customer's total orders, average delay, and count of severe delays to output a probability percentage (e.g., "This user has a 74% chance of uninstalling").
*These models were serialized and saved as `.pkl` (pickle) files in the `/models` directory.*

### Layer B: The Backend API (The Nervous System)
We built a REST API using **FastAPI** (`backend/main.py`). 
- When the server starts, it loads the `.pkl` AI models into memory.
- It exposes HTTP endpoints (like `/api/predict-delay`). 
- When the frontend asks for a prediction, the FastAPI server takes the JSON data, runs it through the loaded Random Forest model, and instantly sends the prediction back to the frontend. 

### Layer C: The Frontend Dashboard (The Face)
We built a modern Single Page Application (SPA) using **React** and **Vite** (`frontend/src/App.jsx`).
- It uses **Vanilla CSS** with glassmorphism to create a sleek, dark-mode SaaS aesthetic.
- **Recharts** is used to query data and render interactive charts (Pie, Bar, Area) for the Data Analysis tab.
- When a user fills out the "Delay Simulator" form and clicks Submit, React sends a `fetch()` POST request to the FastAPI backend, waits a few milliseconds for the AI to calculate the delay, and dynamically updates the glowing "Risk Meter" UI.

---

## 3. Why this is an Impressive Portfolio Piece
This project stands out because it is not just a Jupyter Notebook. It is a **Full-Stack AI Application**. 

It demonstrates that the creator can:
1. **Understand Business Logic:** Framing a technical problem around revenue and retention.
2. **Train AI Models:** Using Python, Pandas, and Scikit-Learn to extract patterns from raw data.
3. **Deploy AI Models:** Wrapping models in a REST API (FastAPI) rather than leaving them trapped in a script.
4. **Build User Interfaces:** Creating a polished, consumer-facing React application that interacts with the backend asynchronously.

---

## 4. How to Test This

To fully review and test this project, you can interact with both the Business Analyst artifacts and the live Software Engineering application.

### A. Reviewing the Business Analyst Artifacts
If you are evaluating this project from a BA or Data Analyst perspective, review the native files generated in the `documents` branch:
1. Open **`01_Business_Requirements_Document.docx`** in Microsoft Word to review the formal BRD.
2. Open **`11_Case_Study_Report.docx`** to read the final presentation of findings and quantified ROI.
3. Open **`09_dashboard.xlsx`** in Microsoft Excel to interact with the raw data and Pivot Charts.
4. Open the SVG files (`02_AS-IS_Process_Map.svg`, `03_TO-BE_Process_Map.svg`) in any web browser to view the process flows.

### B. Testing the Live Application (Software Engineering)
If you want to test the actual functioning code, you need to run both the FastAPI Backend and the React Frontend simultaneously.

**Step 1: Start the AI Backend**
1. Open a terminal in the root directory.
2. Activate the virtual environment: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux).
3. Start the server: `python backend/main.py`.
4. *Test it:* Navigate to `http://localhost:8000/docs` in your browser to see the interactive Swagger UI and manually test the API endpoints.

**Step 2: Start the React Frontend**
1. Open a **second** terminal window.
2. Navigate to the frontend folder: `cd frontend`.
3. Start the Vite server: `npm run dev`.
4. *Test it:* Open `http://localhost:5173` in your browser. Go to the "Routing AI" tab, change the weather condition to "Heavy Rain (Monsoon)", and click "Initialize Simulation" to watch the backend AI calculate a delayed ETA in real-time.
