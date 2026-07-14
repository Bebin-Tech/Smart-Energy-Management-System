from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
from config import Config

db = SQLAlchemy()
login = LoginManager()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    CORS(app)
    login.init_app(app)
    jwt.init_app(app)

    from app.routes import auth, buildings, departments, energy, analytics, predictions, reports, users
    app.register_blueprint(auth.bp, url_prefix='/api/auth')
    app.register_blueprint(buildings.bp, url_prefix='/api/buildings')
    app.register_blueprint(departments.bp, url_prefix='/api/departments')
    app.register_blueprint(energy.bp, url_prefix='/api/energy')
    app.register_blueprint(analytics.bp, url_prefix='/api/analytics')
    app.register_blueprint(predictions.bp, url_prefix='/api/predictions')
    app.register_blueprint(reports.bp, url_prefix='/api/reports')
    app.register_blueprint(users.bp, url_prefix='/api/users')

    return app
