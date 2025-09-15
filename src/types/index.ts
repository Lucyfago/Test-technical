import { Request } from 'express';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'user' | 'admin';
  created_at: Date;
}

export interface Vehicle {
  id: string;
  plate: string;
  brand?: string;
  model?: string;
  owner_id: string;
  created_at: Date;
}

export interface Vigencia {
  id: string;
  vehicle_id: string;
  year: number;
  amount: number;
  is_paid: boolean;
  created_at: Date;
}

export interface Payment {
  id: string;
  user_id: string;
  vehicle_id: string;
  vigencia_id: string;
  vigencia_year: number;
  amount_cop: number;
  governor_amount_cop: number;
  platform_fee_cop: number;
  created_at: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password_hash: string;
  role?: 'user' | 'admin';
}

export interface CreateVehicleData {
  plate: string;
  brand?: string;
  model?: string;
  owner_id: string;
}

export interface CreateVigenciaData {
  vehicle_id: string;
  year: number;
  amount: number;
}

export interface CreatePaymentData {
  user_id: string;
  vehicle_id: string;
  vigencia_id: string;
  vigencia_year: number;
  amount_cop: number;
  governor_amount_cop: number;
  platform_fee_cop: number;
}

export interface JWTPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}