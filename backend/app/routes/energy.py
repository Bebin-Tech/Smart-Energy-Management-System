from flask import Blueprint, request, jsonify
from app.models import EnergyConsumption, db
from datetime import datetime

bp = Blueprint('energy', __name__)

@bp.route('/entry', methods=['POST'])
def add_entry():
    data = request.get_json(silent=True) or {}
    required_fields = ('date', 'building_id', 'units_consumed')
    missing_fields = [field for field in required_fields if data.get(field) in (None, '')]
    if missing_fields:
        return jsonify({"msg": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    try:
        entry_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    except (TypeError, ValueError):
        return jsonify({"msg": "Date must use YYYY-MM-DD format"}), 400

    entry = EnergyConsumption(
        date=entry_date,
        building_id=data['building_id'],
        department_id=data.get('department_id'),
        units_consumed=data['units_consumed'],
        peak_demand=data.get('peak_demand'),
        electricity_cost=data.get('electricity_cost')
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify({"msg": "Consumption entry added"}), 201
