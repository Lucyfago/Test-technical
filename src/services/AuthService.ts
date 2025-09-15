import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories';
import { generateToken } from '../utils/jwt';
import { User, CreateUserData } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
}

export class AuthService {
  async register(request: RegisterRequest): Promise<AuthResponse> {
    // Verificar si el email ya existe
    const existingUser = await UserRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hashear la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(request.password, saltRounds);

    // Crear el usuario
    const userData: CreateUserData = {
      name: request.name,
      email: request.email,
      password_hash: passwordHash,
      role: request.role || 'user'
    };

    const user = await UserRepository.create(userData);

    // Generar token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      },
      token
    };
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    // Buscar usuario por email
    const user = await UserRepository.findByEmail(request.email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(request.password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    // Generar token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      },
      token
    };
  }

  async changePassword(request: ChangePasswordRequest): Promise<Omit<User, 'password_hash'>> {
    // Buscar usuario
    const user = await UserRepository.findById(request.userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(request.currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Hashear nueva contraseña
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(request.newPassword, saltRounds);

    // Actualizar contraseña
    const updatedUser = await UserRepository.updatePassword(user.id, newPasswordHash);
    if (!updatedUser) {
      throw new Error('Error al actualizar la contraseña');
    }

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      created_at: updatedUser.created_at
    };
  }

  async getUserById(userId: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      // El token ya fue validado por el middleware auth
      // Aquí podríamos hacer validaciones adicionales si es necesario
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();