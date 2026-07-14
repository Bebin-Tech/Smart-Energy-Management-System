CREATE DATABASE IF NOT EXISTS smart_energy_db;
USE smart_energy_db;

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Buildings table
CREATE TABLE IF NOT EXISTS buildings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    num_floors INT,
    num_rooms INT,
    total_area DECIMAL(10, 2),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    building_id INT,
    floor INT,
    head_of_department VARCHAR(100),
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL,
    building_id INT,
    department_id INT,
    room_type VARCHAR(50),
    capacity INT,
    FOREIGN KEY (building_id) REFERENCES buildings(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Tariffs table
CREATE TABLE IF NOT EXISTS tariffs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    cost_per_unit DECIMAL(10, 4) NOT NULL,
    peak_hour_charges DECIMAL(10, 4) DEFAULT 0.00,
    tax_percentage DECIMAL(5, 2) DEFAULT 0.00,
    service_charges DECIMAL(10, 2) DEFAULT 0.00,
    effective_from DATE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Energy Consumption table
CREATE TABLE IF NOT EXISTS energy_consumption (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    building_id INT,
    department_id INT,
    units_consumed DECIMAL(10, 2) NOT NULL,
    peak_demand DECIMAL(10, 2),
    electricity_cost DECIMAL(10, 2),
    FOREIGN KEY (building_id) REFERENCES buildings(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Electricity Bills table
CREATE TABLE IF NOT EXISTS electricity_bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_number VARCHAR(100) NOT NULL UNIQUE,
    provider VARCHAR(100),
    billing_period_start DATE,
    billing_period_end DATE,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE,
    payment_status ENUM('paid', 'unpaid', 'pending') DEFAULT 'unpaid',
    file_path VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50), -- High Consumption, Monthly Limit, Spike, Bill Due
    message TEXT,
    severity ENUM('low', 'medium', 'high', 'critical'),
    status ENUM('unread', 'read') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Predictions table
CREATE TABLE IF NOT EXISTS ai_predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prediction_type ENUM('daily', 'weekly', 'monthly'),
    target_date DATE,
    predicted_units DECIMAL(10, 2),
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(255),
    report_type ENUM('daily', 'weekly', 'monthly', 'annual'),
    file_format ENUM('pdf', 'excel'),
    file_path VARCHAR(255),
    generated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES users(id)
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    activity_details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default roles
INSERT INTO roles (name) VALUES ('Admin'), ('Manager'), ('User');
