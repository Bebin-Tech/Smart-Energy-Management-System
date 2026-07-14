from flask import Blueprint, request, jsonify
from app.models import Department, db

bp = Blueprint('departments', __name__)

@bp.route('/', methods=['GET'])
def get_departments():
    departments = Department.query.all()
    return jsonify([{"id": d.id, "name": d.name, "building_id": d.building_id} for d in departments]), 200
