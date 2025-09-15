// MongoDB initialization script
print('Starting database initialization...');

// Switch to admin database
db = db.getSiblingDB('admin');

// Create application database
db = db.getSiblingDB('vehicle_management');

// Create collections
db.createCollection('users');
db.createCollection('vehicles');
db.createCollection('vigencias');
db.createCollection('payments');

// Create indexes for better performance
print('Creating indexes...');

// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Vehicle indexes
db.vehicles.createIndex({ owner: 1 });
db.vehicles.createIndex({ plateNumber: 1 }, { unique: true });
db.vehicles.createIndex({ owner: 1, plateNumber: 1 });

// Vigencia indexes
db.vigencias.createIndex({ vehicle: 1 });
db.vigencias.createIndex({ year: 1 });
db.vigencias.createIndex({ isPaid: 1 });
db.vigencias.createIndex({ vehicle: 1, year: 1 }, { unique: true });
db.vigencias.createIndex({ dueDate: 1 });

// Payment indexes
db.payments.createIndex({ user: 1 });
db.payments.createIndex({ vigencia: 1 }, { unique: true });
db.payments.createIndex({ vehicle: 1 });
db.payments.createIndex({ paidAt: -1 });
db.payments.createIndex({ user: 1, paidAt: -1 });

print('Database initialization completed successfully!');