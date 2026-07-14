from flask import Blueprint, request, jsonify
from app.models import User, Role, db
from flask_jwt_extended import create_access_token

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    user = User.query.filter_by(username=data.get('username')).first()
    if user and user.check_password(data.get('password')):
        access_token = create_access_token(identity=user.id)
        return jsonify(
            access_token=access_token,
            role=user.role.name if user.role else None,
            username=user.username
        ), 200
    return jsonify({"msg": "Bad username or password"}), 401

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(silent=True) or {}
    required_fields = ('username', 'email', 'password')
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return jsonify({"msg": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({"msg": "Username already exists"}), 400
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"msg": "Email already exists"}), 400
    
    role = Role.query.filter_by(name=data.get('role', 'User')).first()
    if role is None:
        role = Role(name=data.get('role', 'User'))
        db.session.add(role)
        db.session.flush()

    user = User(username=data.get('username'), email=data.get('email'), role_id=role.id)
    user.set_password(data.get('password'))
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201
