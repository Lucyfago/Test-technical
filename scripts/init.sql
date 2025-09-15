-- Crear extension para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(150) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    password_hash varchar(255) NOT NULL,
    role varchar(20) NOT NULL DEFAULT 'user',
    created_at timestamptz DEFAULT now()
);

-- Tabla de vehículos
CREATE TABLE IF NOT EXISTS vehicles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plate varchar(20) UNIQUE NOT NULL,
    brand varchar(100),
    model varchar(100),
    owner_id uuid REFERENCES users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now()
);

-- Tabla de vigencias (deudas anuales)
CREATE TABLE IF NOT EXISTS vigencias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
    year int NOT NULL,
    amount bigint NOT NULL,
    is_paid boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    UNIQUE(vehicle_id, year)
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id),
    vehicle_id uuid REFERENCES vehicles(id),
    vigencia_id uuid REFERENCES vigencias(id),
    vigencia_year int NOT NULL,
    amount_cop bigint NOT NULL,
    governor_amount_cop bigint NOT NULL,
    platform_fee_cop bigint NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_vehicles_owner_id ON vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);
CREATE INDEX IF NOT EXISTS idx_vigencias_vehicle_id ON vigencias(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vigencias_year ON vigencias(year);
CREATE INDEX IF NOT EXISTS idx_vigencias_is_paid ON vigencias(is_paid);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_vehicle_id ON payments(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Constraints adicionales
ALTER TABLE users ADD CONSTRAINT check_role CHECK (role IN ('user', 'admin'));
ALTER TABLE vigencias ADD CONSTRAINT check_year CHECK (year >= 2000 AND year <= 2100);
ALTER TABLE vigencias ADD CONSTRAINT check_amount_positive CHECK (amount > 0);
ALTER TABLE payments ADD CONSTRAINT check_amount_positive CHECK (amount_cop > 0);
ALTER TABLE payments ADD CONSTRAINT check_governor_amount_positive CHECK (governor_amount_cop > 0);
ALTER TABLE payments ADD CONSTRAINT check_platform_fee_positive CHECK (platform_fee_cop > 0);