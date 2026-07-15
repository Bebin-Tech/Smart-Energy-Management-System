from flask import Blueprint, request, jsonify
from app.models import Department, db

bp = Blueprint('departments', __name__)

@bp.route('/', methods=['GET'])
def get_departments():
    departments = Department.query.all()
    return jsonify([{"id": d.id, "name": d.name, "building_id": d.building_id} for d in departments]), 200

@bp.route('/', methods=['POST'])
def add_department():
    data = request.get_json(silent=True) or {}
    if not data.get('name'):
        return jsonify({"msg": "Department name is required"}), 400

    department = Department(
        name=data['name'],
        building_id=data.get('building_id'),
        floor=data.get('floor'),
        head_of_department=data.get('head_of_department')
    )
    db.session.add(department)
    db.session.commit()
    return jsonify({"msg": "Department added", "id": department.id}), 201
