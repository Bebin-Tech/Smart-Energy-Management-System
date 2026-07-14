from flask import Blueprint, jsonify
from app.models import EnergyConsumption

bp = Blueprint('analytics', __name__)

@bp.route('/summary', methods=['GET'])
def get_summary():
    # Placeholder for actual analytics logic
    return jsonify({"total_consumption": 1000, "average_usage": 50}), 200
