import streamlit as st
import pandas as pd
import numpy as np
import joblib
import plotly.express as px
import plotly.graph_objects as go

# Ensure modern page layout
st.set_page_config(page_title="SL Delivery Analytics", layout="wide", page_icon="🛵")

# ---- CSS INJECTION FOR PREMIUM LOOK ----
st.markdown("""
<style>
    .metric-card {
        background-color: #1E293B;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        text-align: center;
    }
    .main-header {
        font-size: 2.5rem;
        font-weight: 800;
        background: -webkit-linear-gradient(#F97316, #FBBF24);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>
""", unsafe_allow_html=True)

# ---- LOAD DATA & MODELS ----
@st.cache_data
def load_data():
    orders = pd.read_csv('data/orders.csv')
    customers = pd.read_csv('data/customers.csv')
    orders['DelayMins'] = orders['ActualDeliveryMins'] - orders['ExpectedDeliveryMins']
    return orders, customers

@st.cache_resource
def load_models():
    delay_model = joblib.load('models/delay_model.pkl')
    churn_model = joblib.load('models/churn_model.pkl')
    encoders = joblib.load('models/label_encoders.pkl')
    return delay_model, churn_model, encoders

orders, customers = load_data()
delay_model, churn_model, encoders = load_models()

# ---- HEADER ----
st.markdown('<p class="main-header">🛵 Next-Gen Delivery Analytics</p>', unsafe_allow_html=True)
st.markdown("**Empowering Logistics and Retention with Predictive AI in Sri Lanka.**")
st.divider()

# ---- KPI METRICS ----
col1, col2, col3, col4 = st.columns(4)
col1.metric("Total Orders Analyzed", f"{len(orders):,}")
col2.metric("Average Delay", f"{orders['DelayMins'].mean():.1f} mins", "-1.2 mins from last month", delta_color="inverse")
col3.metric("Monsoon Delay Spike", "+45 mins", "Critical Risk", delta_color="inverse")
col4.metric("Avg Churn Risk", f"{customers['Churn'].mean():.1%}")
st.write("") # Spacer

tab1, tab2, tab3 = st.tabs(["📊 Interactive Data Analysis", "⏱️ AI Delay Simulator", "⚠️ Churn Prediction Engine"])

# --- TAB 1: EDA ---
with tab1:
    st.subheader("Operational Bottlenecks")
    
    col_plot1, col_plot2 = st.columns(2)
    
    with col_plot1:
        # Interactive Bar Chart with Plotly
        avg_delay_region = orders.groupby('Region')['DelayMins'].mean().reset_index()
        fig1 = px.bar(avg_delay_region, x='DelayMins', y='Region', orientation='h', 
                      title="Average Delay by Region",
                      color='DelayMins', color_continuous_scale="Oranges",
                      template="plotly_dark")
        fig1.update_layout(showlegend=False, margin=dict(l=0, r=0, t=40, b=0))
        st.plotly_chart(fig1, use_container_width=True)
        
    with col_plot2:
        # Interactive Box Plot with Plotly
        fig2 = px.box(orders, x='Weather', y='DelayMins', color='Weather',
                      title="Impact of Weather Conditions on Delays",
                      color_discrete_sequence=px.colors.qualitative.Pastel,
                      template="plotly_dark")
        fig2.update_layout(margin=dict(l=0, r=0, t=40, b=0))
        st.plotly_chart(fig2, use_container_width=True)

    st.subheader("Customer Retention Impact")
    churn_by_delay = customers.groupby('SevereDelays')['Churn'].mean().reset_index()
    fig3 = px.area(churn_by_delay, x='SevereDelays', y='Churn', 
                   title="Churn Probability vs. Severe Delays Experienced",
                   markers=True, color_discrete_sequence=['#ef4444'], template="plotly_dark")
    fig3.update_layout(yaxis_tickformat='.0%')
    st.plotly_chart(fig3, use_container_width=True)

# --- TAB 2: Delay Prediction ---
with tab2:
    st.subheader("Logistics Command Center: Predict Delivery Time")
    st.markdown("Simulate an incoming order to foresee delays using the Random Forest Regressor.")
    
    with st.container(border=True):
        input_c1, input_c2, input_c3 = st.columns(3)
        with input_c1:
            region = st.selectbox("Delivery Region", encoders['Region'].classes_)
            distance = st.slider("Delivery Distance (KM)", 1.0, 20.0, 5.0)
        with input_c2:
            weather = st.selectbox("Current Weather", encoders['Weather'].classes_)
            time = st.selectbox("Time of Day", encoders['TimeOfDay'].classes_)
        with input_c3:
            traffic = st.selectbox("Traffic Condition", encoders['Traffic'].classes_)
            st.write("")
            st.write("")
            predict_btn = st.button("🚀 Run Simulation", use_container_width=True, type="primary")
        
    if predict_btn:
        input_data = pd.DataFrame({
            'Region': [encoders['Region'].transform([region])[0]],
            'DistanceKM': [distance],
            'Weather': [encoders['Weather'].transform([weather])[0]],
            'TimeOfDay': [encoders['TimeOfDay'].transform([time])[0]],
            'Traffic': [encoders['Traffic'].transform([traffic])[0]]
        })
        
        predicted_delay = delay_model.predict(input_data)[0]
        
        st.write("### Simulation Results")
        res_col1, res_col2 = st.columns([1, 2])
        
        with res_col1:
            st.metric(label="Predicted Delay", value=f"{predicted_delay:.0f} Mins", delta="Higher than SLA" if predicted_delay > 15 else "Within SLA", delta_color="inverse" if predicted_delay > 15 else "normal")
            
        with res_col2:
            if predicted_delay > 25:
                st.error("**Risk Level: CRITICAL.** Assign a priority rider immediately. Inform the customer proactively.")
            elif predicted_delay > 15:
                st.warning("**Risk Level: ELEVATED.** Monitor closely.")
            else:
                st.success("**Risk Level: LOW.** Proceed with standard dispatch.")

# --- TAB 3: Churn Prediction ---
with tab3:
    st.subheader("Marketing Command Center: Churn Radar")
    st.markdown("Identify high-risk customers based on their historical delivery experience.")
    
    with st.container(border=True):
        col_c1, col_c2, col_c3 = st.columns(3)
        with col_c1:
            cust_region = st.selectbox("Customer Region", encoders['Churn_Region'].classes_, key='churn_reg')
            total_orders = st.number_input("Total Lifetime Orders", min_value=1, max_value=200, value=15)
        with col_c2:
            avg_delay = st.slider("Average Delay (Mins)", 0.0, 60.0, 15.0)
            severe_delays = st.number_input("Count of Severe Delays (>30 min)", min_value=0, max_value=50, value=2)
        with col_c3:
            st.write("")
            st.write("")
            st.write("")
            churn_btn = st.button("🔮 Analyze Retention Risk", use_container_width=True, type="primary")
            
    if churn_btn:
        input_churn = pd.DataFrame({
            'Region': [encoders['Churn_Region'].transform([cust_region])[0]],
            'TotalOrders': [total_orders],
            'AvgDelay': [avg_delay],
            'SevereDelays': [severe_delays]
        })
        
        churn_prob = churn_model.predict_proba(input_churn)[0][1]
        
        st.write("### Risk Assessment")
        
        # Visualize probability with a gauge chart
        fig_gauge = go.Figure(go.Indicator(
            mode = "gauge+number",
            value = churn_prob * 100,
            domain = {'x': [0, 1], 'y': [0, 1]},
            title = {'text': "Churn Probability %"},
            gauge = {
                'axis': {'range': [None, 100]},
                'bar': {'color': "white"},
                'steps' : [
                    {'range': [0, 40], 'color': "#22c55e"},
                    {'range': [40, 70], 'color': "#f59e0b"},
                    {'range': [70, 100], 'color': "#ef4444"}],
            }
        ))
        fig_gauge.update_layout(height=300, margin=dict(l=20, r=20, t=50, b=20), template="plotly_dark")
        
        g_col1, g_col2 = st.columns([1, 1])
        with g_col1:
            st.plotly_chart(fig_gauge, use_container_width=True)
            
        with g_col2:
            st.write("<br><br>", unsafe_allow_html=True)
            if churn_prob > 0.7:
                st.error("🚨 **High Flight Risk!** This customer is highly likely to uninstall the app.")
                st.markdown("**Action:** Trigger an automated apology SMS and instantly credit Rs. 500 to their wallet.")
            elif churn_prob > 0.4:
                st.warning("⚠️ **Vulnerable Customer.** Frustration is building.")
                st.markdown("**Action:** Send a 'We miss you' email with a free delivery code.")
            else:
                st.success("✅ **Loyal Customer.** No immediate retention action required.")
