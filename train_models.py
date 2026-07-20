import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_squared_error, accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
import joblib
import os

print("Loading data...")
orders = pd.read_csv('data/orders.csv')
customers = pd.read_csv('data/customers.csv')

# ---------------------------------------------------------
# Model 1: Predict Delivery Delay Minutes
# ---------------------------------------------------------
print("\n--- Training Delivery Delay Model ---")
# Features: Region, DistanceKM, Weather, TimeOfDay, Traffic
# Target: DelayMins = ActualDeliveryMins - ExpectedDeliveryMins

orders['DelayMins'] = orders['ActualDeliveryMins'] - orders['ExpectedDeliveryMins']

delay_features = ['Region', 'DistanceKM', 'Weather', 'TimeOfDay', 'Traffic']
X_delay = orders[delay_features].copy()
y_delay = orders['DelayMins']

# Encode categorical variables
le_dict = {}
for col in ['Region', 'Weather', 'TimeOfDay', 'Traffic']:
    le = LabelEncoder()
    X_delay[col] = le.fit_transform(X_delay[col])
    le_dict[col] = le

X_train_d, X_test_d, y_train_d, y_test_d = train_test_split(X_delay, y_delay, test_size=0.2, random_state=42)

delay_model = RandomForestRegressor(n_estimators=50, random_state=42, n_jobs=-1)
delay_model.fit(X_train_d, y_train_d)

y_pred_d = delay_model.predict(X_test_d)
rmse = np.sqrt(mean_squared_error(y_test_d, y_pred_d))
print(f"Delay Model RMSE: {rmse:.2f} minutes")

# ---------------------------------------------------------
# Model 2: Predict Customer Churn
# ---------------------------------------------------------
print("\n--- Training Customer Churn Model ---")
# Features: Region, TotalOrders, AvgDelay, SevereDelays
# Target: Churn

churn_features = ['Region', 'TotalOrders', 'AvgDelay', 'SevereDelays']
X_churn = customers[churn_features].copy()
y_churn = customers['Churn']

le_churn = LabelEncoder()
X_churn['Region'] = le_churn.fit_transform(X_churn['Region'])
le_dict['Churn_Region'] = le_churn

X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_churn, y_churn, test_size=0.2, random_state=42)

churn_model = RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1)
churn_model.fit(X_train_c, y_train_c)

y_pred_c = churn_model.predict(X_test_c)
acc = accuracy_score(y_test_c, y_pred_c)
print(f"Churn Model Accuracy: {acc:.2%}")
print("Classification Report:")
print(classification_report(y_test_c, y_pred_c))

# ---------------------------------------------------------
# Save Models & Encoders
# ---------------------------------------------------------
print("\nSaving models...")
os.makedirs('models', exist_ok=True)
joblib.dump(delay_model, 'models/delay_model.pkl')
joblib.dump(churn_model, 'models/churn_model.pkl')
joblib.dump(le_dict, 'models/label_encoders.pkl')
print("Training complete! Models saved to 'models/' directory.")
