from flask import Blueprint, request, jsonify
from app.models import Building, db

bp = Blueprint('buildings', __name__)

@bp.route('/', methods=['GET'])
def get_buildings():
    buildings = Building.query.all()
    return jsonify([{"id": b.id, "name": b.name, "code": b.code} for b in buildings]), 200

@bp.route('/', methods=['POST'])
def add_building():
    data = request.get_json(silent=True) or {}
    required_fields = ('name', 'code')
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return jsonify({"msg": f"Missing required fields: {', '.join(missing_fields)}"}), 400
    if Building.query.filter_by(code=data['code']).first():
        return jsonify({"msg": "Building code already exists"}), 400

    new_building = Building(
        name=data['name'],
        code=data['code'],
        num_floors=data.get('num_floors'),
        num_rooms=data.get('num_rooms'),
        total_area=data.get('total_area')
    )
    db.session.add(new_building)
    db.session.commit()
    return jsonify({"msg": "Building added", "id": new_building.id}), 201
