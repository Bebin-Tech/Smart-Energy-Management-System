from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    users = db.relationship('User', backref='role', lazy='dynamic')

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Building(db.Model):
    __tablename__ = 'buildings'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(50), unique=True, nullable=False)
    num_floors = db.Column(db.Integer)
    num_rooms = db.Column(db.Integer)
    total_area = db.Column(db.Numeric(10, 2))
    status = db.Column(db.Enum('active', 'inactive'), default='active')
    departments = db.relationship('Department', backref='building', lazy='dynamic')
    energy_entries = db.relationship('EnergyConsumption', backref='building', lazy='dynamic')

class Department(db.Model):
    __tablename__ = 'departments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    building_id = db.Column(db.Integer, db.ForeignKey('buildings.id'))
    floor = db.Column(db.Integer)
    head_of_department = db.Column(db.String(100))
    rooms = db.relationship('Room', backref='department', lazy='dynamic')
    energy_entries = db.relationship('EnergyConsumption', backref='department', lazy='dynamic')

class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String(50), nullable=False)
    building_id = db.Column(db.Integer, db.ForeignKey('buildings.id'))
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    room_type = db.Column(db.String(50))
    capacity = db.Column(db.Integer)

class EnergyConsumption(db.Model):
    __tablename__ = 'energy_consumption'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    building_id = db.Column(db.Integer, db.ForeignKey('buildings.id'))
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    units_consumed = db.Column(db.Numeric(10, 2), nullable=False)
    peak_demand = db.Column(db.Numeric(10, 2))
    electricity_cost = db.Column(db.Numeric(10, 2))

class ElectricityBill(db.Model):
    __tablename__ = 'electricity_bills'
    id = db.Column(db.Integer, primary_key=True)
    bill_number = db.Column(db.String(100), unique=True, nullable=False)
    provider = db.Column(db.String(100))
    billing_period_start = db.Column(db.Date)
    billing_period_end = db.Column(db.Date)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    due_date = db.Column(db.Date)
    payment_status = db.Column(db.Enum('paid', 'unpaid', 'pending'), default='unpaid')
    file_path = db.Column(db.String(255))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

class Tariff(db.Model):
    __tablename__ = 'tariffs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    cost_per_unit = db.Column(db.Numeric(10, 4), nullable=False)
    peak_hour_charges = db.Column(db.Numeric(10, 4), default=0.00)
    tax_percentage = db.Column(db.Numeric(5, 2), default=0.00)
    service_charges = db.Column(db.Numeric(10, 2), default=0.00)
    effective_from = db.Column(db.Date)
    is_active = db.Column(db.Boolean, default=True)

class Alert(db.Model):
    __tablename__ = 'alerts'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50))
    message = db.Column(db.Text)
    severity = db.Column(db.Enum('low', 'medium', 'high', 'critical'))
    status = db.Column(db.Enum('unread', 'read'), default='unread')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AIPrediction(db.Model):
    __tablename__ = 'ai_predictions'
    id = db.Column(db.Integer, primary_key=True)
    prediction_type = db.Column(db.Enum('daily', 'weekly', 'monthly'))
    target_date = db.Column(db.Date)
    predicted_units = db.Column(db.Numeric(10, 2))
    recommendation = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Report(db.Model):
    __tablename__ = 'reports'
    id = db.Column(db.Integer, primary_key=True)
    report_name = db.Column(db.String(255))
    report_type = db.Column(db.Enum('daily', 'weekly', 'monthly', 'annual'))
    file_format = db.Column(db.Enum('pdf', 'excel'))
    file_path = db.Column(db.String(255))
    generated_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    action = db.Column(db.String(255))
    activity_details = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
