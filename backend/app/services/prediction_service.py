from app.models import EnergyConsumption

def predict_energy_usage(building_id, days_to_predict=7):
    historical_data = EnergyConsumption.query.filter_by(building_id=building_id).order_by(EnergyConsumption.date).all()
    
    if len(historical_data) < 7:
        return "Insufficient data for prediction"

    y = [float(entry.units_consumed) for entry in historical_data]

    try:
        import numpy as np
        from sklearn.linear_model import LinearRegression

        X = np.array(range(len(historical_data))).reshape(-1, 1)
        model = LinearRegression()
        model.fit(X, np.array(y))
        future_X = np.array(range(len(historical_data), len(historical_data) + days_to_predict)).reshape(-1, 1)
        return model.predict(future_X).tolist()
    except ImportError:
        return _linear_projection(y, days_to_predict)


def detect_anomalies(building_id):
    historical_data = EnergyConsumption.query.filter_by(building_id=building_id).all()
    if not historical_data:
        return []
    
    units = [float(e.units_consumed) for e in historical_data]
    mean = sum(units) / len(units)
    variance = sum((value - mean) ** 2 for value in units) / len(units)
    std = variance ** 0.5
    
    threshold = 2
    anomalies = [e for e in historical_data if abs(float(e.units_consumed) - mean) > threshold * std]
    
    return anomalies


def _linear_projection(values, days_to_predict):
    first = values[0]
    last = values[-1]
    slope = (last - first) / max(len(values) - 1, 1)
    return [last + slope * (index + 1) for index in range(days_to_predict)]
