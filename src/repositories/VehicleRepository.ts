import { query } from '../utils/database';
import { Vehicle, CreateVehicleData } from '../types';

export class VehicleRepository {
  async create(vehicleData: CreateVehicleData): Promise<Vehicle> {
    const result = await query(
      `INSERT INTO vehicles (plate, brand, model, owner_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [vehicleData.plate, vehicleData.brand, vehicleData.model, vehicleData.owner_id]
    );
    return result.rows[0];
  }

  async findById(id: string): Promise<Vehicle | null> {
    const result = await query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByOwnerId(ownerId: string): Promise<Vehicle[]> {
    const result = await query(
      'SELECT * FROM vehicles WHERE owner_id = $1 ORDER BY created_at DESC',
      [ownerId]
    );
    return result.rows;
  }

  async findByPlate(plate: string): Promise<Vehicle | null> {
    const result = await query('SELECT * FROM vehicles WHERE plate = $1', [plate]);
    return result.rows[0] || null;
  }

  async update(id: string, updateData: Partial<CreateVehicleData>): Promise<Vehicle | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updateData.plate) {
      fields.push(`plate = $${paramCount++}`);
      values.push(updateData.plate);
    }
    if (updateData.brand) {
      fields.push(`brand = $${paramCount++}`);
      values.push(updateData.brand);
    }
    if (updateData.model) {
      fields.push(`model = $${paramCount++}`);
      values.push(updateData.model);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE vehicles SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM vehicles WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  async existsByPlate(plate: string): Promise<boolean> {
    const result = await query('SELECT 1 FROM vehicles WHERE plate = $1', [plate]);
    return result.rows.length > 0;
  }

  async verifyOwnership(vehicleId: string, ownerId: string): Promise<boolean> {
    const result = await query(
      'SELECT 1 FROM vehicles WHERE id = $1 AND owner_id = $2',
      [vehicleId, ownerId]
    );
    return result.rows.length > 0;
  }
}

export default new VehicleRepository();