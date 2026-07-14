import numpy as np
from sklearn.linear_model import LinearRegression
from app.models import EnergyConsumption
from datetime import datetime, timedelta

def predict_energy_usage(building_id, days_to_predict=7):
    # Fetch historical data
    historical_data = EnergyConsumption.query.filter_by(building_id=building_id).order_by(EnergyConsumption.date).all()
    
    if len(historical_data) < 7:
        return "Insufficient data for prediction"

    # Prepare data for training
    X = np.array(range(len(historical_data))).reshape(-1, 1)
    y = np.array([float(entry.units_consumed) for entry in historical_data])

    # Train model
    model = LinearRegression()
    model.fit(X, y)

    # Predict
    future_X = np.array(range(len(historical_data), len(historical_data) + days_to_predict)).reshape(-1, 1)
    predictions = model.predict(future_X)

    return predictions.tolist()

def detect_anomalies(building_id):
    historical_data = EnergyConsumption.query.filter_by(building_id=building_id).all()
    if not historical_data:
        return []
    
    units = [float(e.units_consumed) for e in historical_data]
    mean = np.mean(units)
    std = np.std(units)
    
    threshold = 2 # 2 standard deviations
    anomalies = [e for e in historical_data if abs(float(e.units_consumed) - mean) > threshold * std]
    
    return anomalies
