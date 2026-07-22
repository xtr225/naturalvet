CREATE DATABASE IF NOT EXISTS veterinaria_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE veterinaria_system;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'reception') NOT NULL DEFAULT 'reception',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  document VARCHAR(20) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(160) NOT NULL,
  address VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  notes TEXT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  species VARCHAR(60) NOT NULL,
  breed VARCHAR(100) NOT NULL,
  sex ENUM('female', 'male') NOT NULL,
  birth_date DATE NOT NULL,
  weight DECIMAL(8,2) NOT NULL DEFAULT 0,
  color VARCHAR(80) NOT NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  notes TEXT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pets_clients FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE IF NOT EXISTS appointments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id BIGINT UNSIGNED NOT NULL,
  pet_id BIGINT UNSIGNED NOT NULL,
  service VARCHAR(120) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status ENUM('scheduled', 'confirmed', 'pending', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  veterinarian VARCHAR(120) NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_appointments_clients FOREIGN KEY (client_id) REFERENCES clients(id),
  CONSTRAINT fk_appointments_pets FOREIGN KEY (pet_id) REFERENCES pets(id)
);

CREATE TABLE IF NOT EXISTS medical_records (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pet_id BIGINT UNSIGNED NOT NULL,
  record_date DATE NOT NULL,
  reason VARCHAR(180) NOT NULL,
  diagnosis TEXT NOT NULL,
  treatment TEXT NOT NULL,
  vaccines TEXT NULL,
  attachments VARCHAR(255) NULL,
  observations TEXT NULL,
  veterinarian VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_medical_records_pets FOREIGN KEY (pet_id) REFERENCES pets(id)
);

CREATE TABLE IF NOT EXISTS inventory_products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(140) NOT NULL,
  category VARCHAR(100) NOT NULL,
  sku VARCHAR(80) NOT NULL UNIQUE,
  stock INT NOT NULL DEFAULT 0,
  min_stock INT NOT NULL DEFAULT 0,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED NOT NULL,
  type ENUM('in', 'out') NOT NULL,
  quantity INT NOT NULL,
  reason VARCHAR(180) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventory_movements_products FOREIGN KEY (product_id) REFERENCES inventory_products(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_id BIGINT UNSIGNED NOT NULL,
  concept VARCHAR(160) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('cash', 'card', 'transfer') NOT NULL,
  status ENUM('paid', 'pending', 'cancelled') NOT NULL DEFAULT 'paid',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_clients FOREIGN KEY (client_id) REFERENCES clients(id)
);

INSERT INTO users (name, email, password, role)
VALUES ('Admin Veterinaria', 'admin@vetsystem.test', '$2y$10$example.hash.pending.laravel', 'admin')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO clients (first_name, last_name, document, phone, email, address, status, notes)
VALUES
  ('Mariana', 'Torres', '45871236', '987654321', 'mariana.torres@mail.test', 'Av. Arequipa 1245, Lima', 'active', 'Prefiere recordatorios por WhatsApp.'),
  ('Carlos', 'Vega', '10293847', '956123789', 'carlos.vega@mail.test', 'Jr. Los Cedros 455, Miraflores', 'active', 'Cliente frecuente de vacunacion.'),
  ('Ana', 'Castillo', '77889944', '912456789', 'ana.castillo@mail.test', 'Calle Las Gardenias 220, Surco', 'active', 'Tiene preferencia por horarios de tarde.')
ON DUPLICATE KEY UPDATE phone = VALUES(phone);

INSERT INTO pets (client_id, name, species, breed, sex, birth_date, weight, color, status, notes)
SELECT c.id, 'Luna', 'Canino', 'Labrador', 'female', '2021-04-12', 24.5, 'Dorado', 'active', 'Alergia leve a ciertos shampoos.'
FROM clients c WHERE c.document = '45871236'
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO inventory_products (name, category, sku, stock, min_stock, price, status)
VALUES
  ('Vacuna multiple', 'Vacunas', 'VAC-MULT-001', 4, 12, 75.00, 'active'),
  ('Antipulgas 10kg', 'Farmacia', 'ANT-10KG-002', 0, 8, 48.00, 'active'),
  ('Jeringas 5ml', 'Insumos', 'JER-5ML-003', 7, 20, 1.50, 'active')
ON DUPLICATE KEY UPDATE stock = VALUES(stock);
