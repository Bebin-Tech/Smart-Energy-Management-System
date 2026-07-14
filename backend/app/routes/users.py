from flask import Blueprint, jsonify
from app.models import User

bp = Blueprint('users', __name__)

@bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([
        {"id": u.id, "username": u.username, "role": u.role.name if u.role else None}
        for u in users
    ]), 200
