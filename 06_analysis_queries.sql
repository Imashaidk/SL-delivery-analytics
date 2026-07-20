-- SQL Analysis Queries for SL Delivery Analytics Pro
-- 1. Overall Average Delay
SELECT AVG(ActualDeliveryMins - ExpectedDeliveryMins) as avg_delay_mins FROM orders;

-- 2. Delay by District/Region
SELECT Region, AVG(ActualDeliveryMins - ExpectedDeliveryMins) as avg_delay
FROM orders
GROUP BY Region
ORDER BY avg_delay DESC;

-- 3. Delay by Weather (Monsoon Impact)
SELECT Weather, AVG(ActualDeliveryMins - ExpectedDeliveryMins) as avg_delay
FROM orders
GROUP BY Weather;

-- 4. Churn vs Delay Correlation
SELECT SevereDelays, AVG(Churn) as churn_probability, COUNT(*) as customer_count
FROM customers
GROUP BY SevereDelays
ORDER BY SevereDelays;
