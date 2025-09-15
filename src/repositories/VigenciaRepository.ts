import { query } from '../utils/database';
import { Vigencia, CreateVigenciaData } from '../types';

export class VigenciaRepository {
  async create(vigenciaData: CreateVigenciaData): Promise<Vigencia> {
    const result = await query(
      `INSERT INTO vigencias (vehicle_id, year, amount) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [vigenciaData.vehicle_id, vigenciaData.year, vigenciaData.amount]
    );
    return result.rows[0];
  }

  async findById(id: string): Promise<Vigencia | null> {
    const result = await query('SELECT * FROM vigencias WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByVehicleId(vehicleId: string): Promise<Vigencia[]> {
    const result = await query(
      'SELECT * FROM vigencias WHERE vehicle_id = $1 ORDER BY year DESC',
      [vehicleId]
    );
    return result.rows;
  }

  async findUnpaidByVehicleId(vehicleId: string): Promise<Vigencia[]> {
    const result = await query(
      'SELECT * FROM vigencias WHERE vehicle_id = $1 AND is_paid = false ORDER BY year DESC',
      [vehicleId]
    );
    return result.rows;
  }

  async findByVehicleAndYear(vehicleId: string, year: number): Promise<Vigencia | null> {
    const result = await query(
      'SELECT * FROM vigencias WHERE vehicle_id = $1 AND year = $2',
      [vehicleId, year]
    );
    return result.rows[0] || null;
  }

  async markAsPaid(id: string): Promise<Vigencia | null> {
    const result = await query(
      'UPDATE vigencias SET is_paid = true WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  }

  async update(id: string, updateData: Partial<CreateVigenciaData>): Promise<Vigencia | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updateData.year !== undefined) {
      fields.push(`year = $${paramCount++}`);
      values.push(updateData.year);
    }
    if (updateData.amount !== undefined) {
      fields.push(`amount = $${paramCount++}`);
      values.push(updateData.amount);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE vigencias SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM vigencias WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  async findByUserId(userId: string): Promise<Vigencia[]> {
    const result = await query(
      `SELECT v.* FROM vigencias v
       JOIN vehicles ve ON v.vehicle_id = ve.id
       WHERE ve.owner_id = $1
       ORDER BY v.year DESC, v.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  async findUnpaidByUserId(userId: string): Promise<Vigencia[]> {
    const result = await query(
      `SELECT v.* FROM vigencias v
       JOIN vehicles ve ON v.vehicle_id = ve.id
       WHERE ve.owner_id = $1 AND v.is_paid = false
       ORDER BY v.year DESC, v.created_at DESC`,
      [userId]
    );
    return result.rows;
  }
}

export default new VigenciaRepository();