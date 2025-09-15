import { query } from '../utils/database';
import { Payment, CreatePaymentData } from '../types';

export class PaymentRepository {
  async create(paymentData: CreatePaymentData): Promise<Payment> {
    const result = await query(
      `INSERT INTO payments (user_id, vehicle_id, vigencia_id, vigencia_year, amount_cop, governor_amount_cop, platform_fee_cop) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        paymentData.user_id,
        paymentData.vehicle_id,
        paymentData.vigencia_id,
        paymentData.vigencia_year,
        paymentData.amount_cop,
        paymentData.governor_amount_cop,
        paymentData.platform_fee_cop
      ]
    );
    return result.rows[0];
  }

  async findById(id: string): Promise<Payment | null> {
    const result = await query('SELECT * FROM payments WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    const result = await query(
      `SELECT p.*, v.plate, v.brand, v.model 
       FROM payments p
       JOIN vehicles v ON p.vehicle_id = v.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  async findByVehicleId(vehicleId: string): Promise<Payment[]> {
    const result = await query(
      'SELECT * FROM payments WHERE vehicle_id = $1 ORDER BY created_at DESC',
      [vehicleId]
    );
    return result.rows;
  }

  async findAll(): Promise<Payment[]> {
    const result = await query(
      `SELECT p.*, u.name as user_name, u.email as user_email, v.plate, v.brand, v.model
       FROM payments p
       JOIN users u ON p.user_id = u.id
       JOIN vehicles v ON p.vehicle_id = v.id
       ORDER BY p.created_at DESC`
    );
    return result.rows;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    const result = await query(
      `SELECT p.*, u.name as user_name, u.email as user_email, v.plate, v.brand, v.model
       FROM payments p
       JOIN users u ON p.user_id = u.id
       JOIN vehicles v ON p.vehicle_id = v.id
       WHERE p.created_at >= $1 AND p.created_at <= $2
       ORDER BY p.created_at DESC`,
      [startDate, endDate]
    );
    return result.rows;
  }

  async getTotalRevenue(): Promise<number> {
    const result = await query('SELECT SUM(amount_cop) as total FROM payments');
    return parseInt(result.rows[0].total || '0');
  }

  async getGovernorRevenue(): Promise<number> {
    const result = await query('SELECT SUM(governor_amount_cop) as total FROM payments');
    return parseInt(result.rows[0].total || '0');
  }

  async getPlatformRevenue(): Promise<number> {
    const result = await query('SELECT SUM(platform_fee_cop) as total FROM payments');
    return parseInt(result.rows[0].total || '0');
  }

  async getPaymentStats(): Promise<{
    totalPayments: number;
    totalRevenue: number;
    governorRevenue: number;
    platformRevenue: number;
  }> {
    const result = await query(`
      SELECT 
        COUNT(*) as total_payments,
        SUM(amount_cop) as total_revenue,
        SUM(governor_amount_cop) as governor_revenue,
        SUM(platform_fee_cop) as platform_revenue
      FROM payments
    `);
    
    const row = result.rows[0];
    return {
      totalPayments: parseInt(row.total_payments || '0'),
      totalRevenue: parseInt(row.total_revenue || '0'),
      governorRevenue: parseInt(row.governor_revenue || '0'),
      platformRevenue: parseInt(row.platform_revenue || '0')
    };
  }
}

export default new PaymentRepository();