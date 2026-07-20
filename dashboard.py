import streamlit as st
import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

st.set_page_config(page_title="SL Delivery Analytics", layout="wide", page_icon="🛵")

# ---- LOAD DATA & MODELS ----
@st.cache_data
def load_data():
    orders = pd.read_csv('data/orders.csv')
    customers = pd.read_csv('data/customers.csv')
    return orders, customers

@st.cache_resource
def load_models():
    delay_model = joblib.load('models/delay_model.pkl')
    churn_model = joblib.load('models/churn_model.pkl')
    encoders = joblib.load('models/label_encoders.pkl')
    return delay_model, churn_model, encoders

orders, customers = load_data()
delay_model, churn_model, encoders = load_models()

orders['DelayMins'] = orders['ActualDeliveryMins'] - orders['ExpectedDeliveryMins']

# ---- UI LAYOUT ----
st.title("🛵 Sri Lankan Delivery Platform Analytics")
st.markdown("**Project Goal:** Identify root causes of delivery delays and predict customer churn.")

tab1, tab2, tab3 = st.tabs(["📊 Exploratory Data Analysis", "⏱️ Predict Delivery Delay", "⚠️ Predict Churn Risk"])

# --- TAB 1: EDA ---
with tab1:
    st.header("Exploratory Data Analysis (EDA)")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Average Delay by Region")
        fig, ax = plt.subplots(figsize=(6, 4))
        avg_delay_region = orders.groupby('Region')['DelayMins'].mean().sort_values(ascending=False)
        sns.barplot(x=avg_delay_region.values, y=avg_delay_region.index, palette="viridis", ax=ax)
        ax.set_xlabel("Average Delay (Minutes)")
        st.pyplot(fig)
        
    with col2:
        st.subheader("Impact of Weather on Delays")
        fig, ax = plt.subplots(figsize=(6, 4))
        sns.boxplot(data=orders, x='Weather', y='DelayMins', palette="Set2", ax=ax)
        st.pyplot(fig)

    st.subheader("Churn Rate vs. Number of Severe Delays")
    fig, ax = plt.subplots(figsize=(10, 4))
    churn_by_delay = customers.groupby('SevereDelays')['Churn'].mean().reset_index()
    sns.lineplot(data=churn_by_delay, x='SevereDelays', y='Churn', marker="o", color="red", ax=ax)
    ax.set_ylabel("Probability of Churn")
    ax.set_xlabel("Number of Severe Delays (>30 mins)")
    st.pyplot(fig)

# --- TAB 2: Delay Prediction ---
with tab2:
    st.header("Simulate an Order & Predict Delay")
    st.markdown("Enter hypothetical order details to see the predicted delay.")
    
    col_a, col_b = st.columns(2)
    with col_a:
        region = st.selectbox("Region", encoders['Region'].classes_)
        distance = st.slider("Distance (KM)", 1.0, 20.0, 5.0)
        weather = st.selectbox("Weather", encoders['Weather'].classes_)
    with col_b:
        time = st.selectbox("Time of Day", encoders['TimeOfDay'].classes_)
        traffic = st.selectbox("Traffic Condition", encoders['Traffic'].classes_)
        
    if st.button("Predict Delay"):
        # Encode inputs
        input_data = pd.DataFrame({
            'Region': [encoders['Region'].transform([region])[0]],
            'DistanceKM': [distance],
            'Weather': [encoders['Weather'].transform([weather])[0]],
            'TimeOfDay': [encoders['TimeOfDay'].transform([time])[0]],
            'Traffic': [encoders['Traffic'].transform([traffic])[0]]
        })
        
        predicted_delay = delay_model.predict(input_data)[0]
        st.success(f"### Predicted Delay: {predicted_delay:.0f} Minutes")
        
        if predicted_delay > 20:
            st.warning("High delay risk detected! Recommendation: Assign priority rider or increase delivery fee slightly to manage expectations.")

# --- TAB 3: Churn Prediction ---
with tab3:
    st.header("Predict Customer Churn Probability")
    st.markdown("Identify if a customer is likely to leave the platform based on their history.")
    
    cust_region = st.selectbox("Customer Region", encoders['Churn_Region'].classes_, key='churn_reg')
    total_orders = st.number_input("Total Lifetime Orders", min_value=1, max_value=200, value=15)
    avg_delay = st.number_input("Average Delay Experienced (Mins)", min_value=0.0, max_value=60.0, value=15.0)
    severe_delays = st.number_input("Number of Severe Delays", min_value=0, max_value=50, value=2)
    
    if st.button("Predict Churn"):
        input_churn = pd.DataFrame({
            'Region': [encoders['Churn_Region'].transform([cust_region])[0]],
            'TotalOrders': [total_orders],
            'AvgDelay': [avg_delay],
            'SevereDelays': [severe_delays]
        })
        
        churn_prob = churn_model.predict_proba(input_churn)[0][1]
        
        if churn_prob > 0.6:
            st.error(f"### High Churn Risk! (Probability: {churn_prob:.1%})")
            st.markdown("**Business Action:** Send an immediate apology email with a Rs. 500 promo code to retain this customer.")
        elif churn_prob > 0.4:
            st.warning(f"### Medium Churn Risk (Probability: {churn_prob:.1%})")
        else:
            st.success(f"### Customer is Safe (Probability: {churn_prob:.1%})")
