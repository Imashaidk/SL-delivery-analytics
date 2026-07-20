from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(title="SL Delivery Analytics API")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and encoders
print("Loading models into FastAPI...")
delay_model = joblib.load('models/delay_model.pkl')
churn_model = joblib.load('models/churn_model.pkl')
encoders = joblib.load('models/label_encoders.pkl')

class DelayRequest(BaseModel):
    region: str
    distance_km: float
    weather: str
    time_of_day: str
    traffic: str

class ChurnRequest(BaseModel):
    region: str
    total_orders: int
    avg_delay: float
    severe_delays: int

@app.get("/api/data-summary")
def get_data_summary():
    """Returns summary stats for the dashboard"""
    orders = pd.read_csv('data/orders.csv')
    orders['DelayMins'] = orders['ActualDeliveryMins'] - orders['ExpectedDeliveryMins']
    avg_delays = orders.groupby('Region')['DelayMins'].mean().reset_index().to_dict(orient='records')
    weather_delays = orders.groupby('Weather')['DelayMins'].mean().reset_index().to_dict(orient='records')
    return {
        "avg_delays_by_region": avg_delays,
        "avg_delays_by_weather": weather_delays,
        "total_orders": len(orders)
    }

@app.post("/api/predict-delay")
def predict_delay(req: DelayRequest):
    try:
        input_data = pd.DataFrame({
            'Region': [encoders['Region'].transform([req.region])[0]],
            'DistanceKM': [req.distance_km],
            'Weather': [encoders['Weather'].transform([req.weather])[0]],
            'TimeOfDay': [encoders['TimeOfDay'].transform([req.time_of_day])[0]],
            'Traffic': [encoders['Traffic'].transform([req.traffic])[0]]
        })
        predicted_delay = delay_model.predict(input_data)[0]
        return {"predicted_delay_mins": round(float(predicted_delay), 1)}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/predict-churn")
def predict_churn(req: ChurnRequest):
    try:
        input_churn = pd.DataFrame({
            'Region': [encoders['Churn_Region'].transform([req.region])[0]],
            'TotalOrders': [req.total_orders],
            'AvgDelay': [req.avg_delay],
            'SevereDelays': [req.severe_delays]
        })
        churn_prob = churn_model.predict_proba(input_churn)[0][1]
        return {"churn_probability": round(float(churn_prob), 4)}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
