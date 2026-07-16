from flask import Blueprint, jsonify, request
from app.models import User, Role, db

bp = Blueprint('users', __name__)

@bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([
        {"id": u.id, "username": u.username, "email": u.email, "role": u.role.name if u.role else None}
        for u in users
    ]), 200

@bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json(silent=True) or {}
    required_fields = ('username', 'email', 'password', 'role')
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return jsonify({"msg": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    if data['role'] not in ('Admin', 'Manager', 'User'):
        return jsonify({"msg": "Role must be Admin, Manager, or User"}), 400
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Username already exists"}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already exists"}), 400

    role = Role.query.filter_by(name=data['role']).first()
    if role is None:
        role = Role(name=data['role'])
        db.session.add(role)
        db.session.flush()

    user = User(username=data['username'], email=data['email'], role_id=role.id)
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "msg": "User created successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": role.name
        }
    }), 201
