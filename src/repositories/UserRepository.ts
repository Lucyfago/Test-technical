import { query } from '../utils/database';
import { User, CreateUserData } from '../types';

export class UserRepository {
  async create(userData: CreateUserData): Promise<User> {
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userData.name, userData.email, userData.password_hash, userData.role || 'user']
    );
    return result.rows[0];
  }

  async findById(id: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async updatePassword(id: string, passwordHash: string): Promise<User | null> {
    const result = await query(
      'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *',
      [passwordHash, id]
    );
    return result.rows[0] || null;
  }

  async findAll(): Promise<User[]> {
    const result = await query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount! > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await query('SELECT 1 FROM users WHERE email = $1', [email]);
    return result.rows.length > 0;
  }
}

export default new UserRepository();