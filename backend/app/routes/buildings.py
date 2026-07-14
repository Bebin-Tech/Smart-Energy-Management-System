from flask import Blueprint, request, jsonify
from app.models import Building, db

bp = Blueprint('buildings', __name__)

@bp.route('/', methods=['GET'])
def get_buildings():
    buildings = Building.query.all()
    return jsonify([{"id": b.id, "name": b.name, "code": b.code} for b in buildings]), 200

@bp.route('/', methods=['POST'])
def add_building():
    data = request.get_json()
    new_building = Building(name=data['name'], code=data['code'], num_floors=data.get('num_floors'), num_rooms=data.get('num_rooms'), total_area=data.get('total_area'))
    db.session.add(new_building)
    db.session.commit()
    return jsonify({"msg": "Building added"}), 201
