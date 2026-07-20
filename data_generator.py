import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

# Configuration
NUM_CUSTOMERS = 2000
NUM_ORDERS = 15000
REGIONS = ['Colombo 1-15', 'Colombo Suburbs', 'Kandy', 'Gampaha', 'Galle']
REGION_PROBS = [0.4, 0.3, 0.1, 0.1, 0.1] # Mostly Colombo focused

WEATHER = ['Clear', 'Light Rain', 'Heavy Rain (Monsoon)']
WEATHER_PROBS = [0.7, 0.2, 0.1]

TRAFFIC = ['Low', 'Medium', 'High', 'Gridlock']
# Traffic depends heavily on time of day, but we'll assign baseline probs first
TIME_OF_DAY = ['Morning', 'Lunch', 'Afternoon', 'Dinner', 'Late Night']

def generate_customers():
    customer_ids = [f'CUST_{str(i).zfill(5)}' for i in range(1, NUM_CUSTOMERS + 1)]
    regions = np.random.choice(REGIONS, NUM_CUSTOMERS, p=REGION_PROBS)
    
    # We will determine Churn LATER based on their order experience
    customers_df = pd.DataFrame({
        'CustomerID': customer_ids,
        'Region': regions,
        'JoinDate': [datetime(2023, 1, 1) + timedelta(days=random.randint(0, 365)) for _ in range(NUM_CUSTOMERS)]
    })
    return customers_df

def generate_orders(customers_df):
    order_ids = [f'ORD_{str(i).zfill(6)}' for i in range(1, NUM_ORDERS + 1)]
    
    # Assign orders to customers (some order more than others)
    # Using a power distribution so a few customers order a lot
    customer_indices = np.random.power(0.5, NUM_ORDERS) * (NUM_CUSTOMERS - 1)
    customer_indices = customer_indices.astype(int)
    assigned_customers = customers_df.iloc[customer_indices]['CustomerID'].values
    order_regions = customers_df.iloc[customer_indices]['Region'].values
    
    # Order Details
    distances = np.random.lognormal(mean=1.5, sigma=0.5, size=NUM_ORDERS) # Distance in km
    distances = np.clip(distances, 0.5, 20.0)
    
    weather_conditions = np.random.choice(WEATHER, NUM_ORDERS, p=WEATHER_PROBS)
    time_of_day = np.random.choice(TIME_OF_DAY, NUM_ORDERS, p=[0.1, 0.35, 0.15, 0.3, 0.1])
    
    # Traffic is correlated with Time of Day
    traffic_conditions = []
    for t in time_of_day:
        if t in ['Lunch', 'Dinner']:
            traffic = np.random.choice(TRAFFIC, p=[0.05, 0.2, 0.5, 0.25])
        elif t == 'Late Night':
            traffic = np.random.choice(TRAFFIC, p=[0.8, 0.15, 0.05, 0.0])
        else:
            traffic = np.random.choice(TRAFFIC, p=[0.3, 0.4, 0.2, 0.1])
        traffic_conditions.append(traffic)
        
    # Expected Delivery Time (Base time + distance factor)
    expected_times = 15 + (distances * 2) # Base 15 mins prep + 2 mins per km
    
    # Actual Delivery Time (Adding delays based on factors)
    actual_times = expected_times.copy()
    
    # Weather Delays
    weather_delay = np.zeros(NUM_ORDERS)
    weather_delay[weather_conditions == 'Light Rain'] = np.random.uniform(5, 15, size=sum(weather_conditions == 'Light Rain'))
    weather_delay[weather_conditions == 'Heavy Rain (Monsoon)'] = np.random.uniform(20, 60, size=sum(weather_conditions == 'Heavy Rain (Monsoon)'))
    
    # Traffic Delays
    traffic_delay = np.zeros(NUM_ORDERS)
    traffic_array = np.array(traffic_conditions)
    traffic_delay[traffic_array == 'Medium'] = np.random.uniform(5, 10, size=sum(traffic_array == 'Medium'))
    traffic_delay[traffic_array == 'High'] = np.random.uniform(15, 30, size=sum(traffic_array == 'High'))
    traffic_delay[traffic_array == 'Gridlock'] = np.random.uniform(30, 75, size=sum(traffic_array == 'Gridlock'))
    
    actual_times += weather_delay + traffic_delay + np.random.normal(0, 5, NUM_ORDERS) # Add some random noise
    actual_times = np.maximum(actual_times, expected_times - 5) # Can't be too much faster than expected
    
    # Dates spanning 2023-2024
    start_date = datetime(2023, 1, 1)
    dates = [start_date + timedelta(days=random.randint(0, 365), hours=random.randint(0, 23)) for _ in range(NUM_ORDERS)]
    dates.sort() # Sort by time
    
    orders_df = pd.DataFrame({
        'OrderID': order_ids,
        'CustomerID': assigned_customers,
        'Region': order_regions,
        'OrderDate': dates,
        'DistanceKM': distances,
        'Weather': weather_conditions,
        'TimeOfDay': time_of_day,
        'Traffic': traffic_conditions,
        'ExpectedDeliveryMins': expected_times.round(0),
        'ActualDeliveryMins': actual_times.round(0)
    })
    
    return orders_df

def determine_churn(customers_df, orders_df):
    # Calculate average delay and severe delays for each customer
    orders_df['DelayMins'] = orders_df['ActualDeliveryMins'] - orders_df['ExpectedDeliveryMins']
    orders_df['SevereDelay'] = (orders_df['DelayMins'] > 30).astype(int)
    
    customer_stats = orders_df.groupby('CustomerID').agg(
        TotalOrders=('OrderID', 'count'),
        AvgDelay=('DelayMins', 'mean'),
        SevereDelays=('SevereDelay', 'sum')
    ).reset_index()
    
    customers_df = pd.merge(customers_df, customer_stats, on='CustomerID', how='left')
    customers_df.fillna(0, inplace=True)
    
    # Churn probability based on delays
    # Base churn = 5%
    # +2% for every avg minute of delay above 10
    # +15% for every severe delay
    # -2% for every order (loyalty)
    
    churn_prob = 0.05 + \
                 np.maximum(0, (customers_df['AvgDelay'] - 10) * 0.02) + \
                 (customers_df['SevereDelays'] * 0.15) - \
                 (customers_df['TotalOrders'] * 0.02)
                 
    churn_prob = np.clip(churn_prob, 0.01, 0.95)
    
    # Generate actual churn label
    customers_df['Churn'] = np.random.binomial(1, churn_prob)
    
    return customers_df

if __name__ == "__main__":
    print("Generating Sri Lankan Delivery Dataset...")
    customers_df = generate_customers()
    orders_df = generate_orders(customers_df)
    customers_df = determine_churn(customers_df, orders_df)
    
    # Save to CSV
    os.makedirs('data', exist_ok=True)
    customers_df.to_csv('data/customers.csv', index=False)
    orders_df.to_csv('data/orders.csv', index=False)
    
    print(f"Generated {len(customers_df)} customers and {len(orders_df)} orders.")
    print("Files saved to 'data/customers.csv' and 'data/orders.csv'.")
    print(f"Overall Churn Rate: {customers_df['Churn'].mean():.1%}")
