from flask import Blueprint, jsonify, request
from app.services.prediction_service import predict_energy_usage

bp = Blueprint('predictions', __name__)

@bp.route('/predict/<int:building_id>', methods=['GET'])
def predict(building_id):
    days = request.args.get('days', 7, type=int)
    predictions = predict_energy_usage(building_id, days)
    return jsonify({"building_id": building_id, "predictions": predictions}), 200
