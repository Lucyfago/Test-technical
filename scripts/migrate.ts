import { readFileSync } from 'fs';
import { join } from 'path';
import { connectDatabase, query } from '../src/utils/database';

async function runMigration() {
  try {
    console.log('🔄 Starting database migration...');
    
    // Conectar a la base de datos
    await connectDatabase();
    
    // Leer el archivo SQL de inicialización
    const sqlFile = readFileSync(join(__dirname, 'init.sql'), 'utf8');
    
    // Ejecutar el script SQL
    await query(sqlFile);
    
    console.log('✅ Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Ejecutar migración si este archivo se ejecuta directamente
if (require.main === module) {
  runMigration();
}

export default runMigration;