import bcrypt from 'bcryptjs';
import { connectDatabase, query } from '../src/utils/database';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Conectar a la base de datos
    await connectDatabase();
    
    // Limpiar datos existentes (opcional, comentar en producción)
    console.log('🧹 Cleaning existing data...');
    await query('DELETE FROM payments');
    await query('DELETE FROM vigencias');
    await query('DELETE FROM vehicles');
    await query('DELETE FROM users');
    
    console.log('👤 Creating users...');
    
    // Hash de contraseñas
    const userPasswordHash = await bcrypt.hash('password123', 12);
    const adminPasswordHash = await bcrypt.hash('admin123', 12);
    
    // Crear usuarios
    const userResult = await query(
      `INSERT INTO users (name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Juan Pérez', 'user@example.com', userPasswordHash, 'user']
    );
    const userId = userResult.rows[0].id;
    
    const adminResult = await query(
      `INSERT INTO users (name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Admin User', 'admin@example.com', adminPasswordHash, 'admin']
    );
    const adminId = adminResult.rows[0].id;
    
    console.log('🚗 Creating vehicles...');
    
    // Crear vehículos
    const vehicle1Result = await query(
      `INSERT INTO vehicles (plate, brand, model, owner_id) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['ABC123', 'Toyota', 'Corolla', userId]
    );
    const vehicle1Id = vehicle1Result.rows[0].id;
    
    const vehicle2Result = await query(
      `INSERT INTO vehicles (plate, brand, model, owner_id) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['XYZ789', 'Honda', 'Civic', userId]
    );
    const vehicle2Id = vehicle2Result.rows[0].id;
    
    const vehicle3Result = await query(
      `INSERT INTO vehicles (plate, brand, model, owner_id) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['DEF456', 'Chevrolet', 'Spark', adminId]
    );
    const vehicle3Id = vehicle3Result.rows[0].id;
    
    console.log('💰 Creating vigencias...');
    
    // Crear vigencias
    await query(
      `INSERT INTO vigencias (vehicle_id, year, amount) 
       VALUES ($1, $2, $3)`,
      [vehicle1Id, 2023, 850000]
    );
    
    await query(
      `INSERT INTO vigencias (vehicle_id, year, amount) 
       VALUES ($1, $2, $3)`,
      [vehicle1Id, 2024, 900000]
    );
    
    await query(
      `INSERT INTO vigencias (vehicle_id, year, amount) 
       VALUES ($1, $2, $3)`,
      [vehicle2Id, 2023, 750000]
    );
    
    await query(
      `INSERT INTO vigencias (vehicle_id, year, amount) 
       VALUES ($1, $2, $3)`,
      [vehicle2Id, 2024, 800000]
    );
    
    await query(
      `INSERT INTO vigencias (vehicle_id, year, amount) 
       VALUES ($1, $2, $3)`,
      [vehicle3Id, 2023, 650000]
    );
    
    await query(
      `INSERT INTO vigencias (vehicle_id, year, amount) 
       VALUES ($1, $2, $3)`,
      [vehicle3Id, 2024, 700000]
    );
    
    console.log('✅ Database seeding completed successfully!');
    
    console.log('\n📋 Seed Data Summary:');
    console.log('Users created:');
    console.log('  - user@example.com (password: password123) - Role: user');
    console.log('  - admin@example.com (password: admin123) - Role: admin');
    console.log('\nVehicles created:');
    console.log('  - ABC123 (Toyota Corolla) - Owner: Juan Pérez');
    console.log('  - XYZ789 (Honda Civic) - Owner: Juan Pérez');
    console.log('  - DEF456 (Chevrolet Spark) - Owner: Admin User');
    console.log('\nVigencias created:');
    console.log('  - 6 vigencias total (2 por vehículo para años 2023 y 2024)');
    console.log('  - Montos entre $650,000 y $900,000 COP');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Ejecutar seed si este archivo se ejecuta directamente
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;