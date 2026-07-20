# 🛵 Sri Lankan Delivery Platform Analytics

## 📌 Project Overview
In Sri Lanka's highly competitive food and grocery delivery market, retaining customers is critical for profitability. This project analyzes a simulated dataset of 15,000 orders and 2,000 customers across major Sri Lankan cities (Colombo, Kandy, Galle, Gampaha) to understand the root causes of delivery delays and their impact on customer churn.

### **Business Problem**
Delivery delays caused by monsoon weather and severe traffic lead to customer frustration. We need to:
1. Identify the primary drivers of delivery delays.
2. Predict the exact delay of an order in real-time.
3. Predict which customers are at high risk of churning (abandoning the app) due to poor delivery experiences.

---

## 🛠️ Tech Stack
- **Data Engineering & Analysis:** Python, Pandas, NumPy
- **Machine Learning:** Scikit-Learn (Random Forest Regression & Classification)
- **Data Visualization & Dashboard:** Streamlit, Matplotlib, Seaborn

---

## 📊 Methodology & Models

### 1. Delivery Delay Prediction (Logistics)
- **Algorithm:** Random Forest Regressor
- **Features:** Delivery Region, Distance (KM), Weather (Clear, Monsoon), Time of Day, Traffic Condition.
- **Performance:** Achieved an RMSE of ~9.8 minutes, allowing the operations team to proactively manage customer expectations.

### 2. Customer Churn Prediction (Marketing)
- **Algorithm:** Random Forest Classifier
- **Features:** Total Lifetime Orders, Average Experienced Delay, Number of Severe Delays (>30 mins).
- **Performance:** Achieved an accuracy of 75%. This model allows the marketing team to target at-risk customers with retention campaigns (e.g., promotional codes).

---

## 🚀 How to Run the Dashboard Locally

This project includes an interactive Streamlit dashboard for stakeholders to view delay hotspots, simulate order delays, and assess churn risk.

### Prerequisites
Make sure you have Python 3.8+ installed. 

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/sl-delivery-analytics.git
   cd sl-delivery-analytics
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the App
```bash
streamlit run dashboard.py
```

---

## 💡 Key Business Recommendations
1. **Dynamic Weather Surcharges:** The EDA revealed that Monsoon conditions cause the most severe delays. Implementing a slight "weather surge" fee to incentivize more riders during rain could reduce delays.
2. **Proactive Apologies:** Customers who experience more than 2 severe delays (>30 mins) have a significantly higher probability of churning. An automated system should trigger a high-value apology voucher (e.g., Rs. 500) immediately after their 2nd severe delay.

---
*Disclaimer: The dataset used in this project is synthetically generated for portfolio purposes to mimic real-world logistical challenges in Sri Lanka.*
