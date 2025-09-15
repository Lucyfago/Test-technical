import { VehicleRepository, UserRepository } from '../repositories';
import { Vehicle, CreateVehicleData } from '../types';

export interface CreateVehicleRequest {
  plate: string;
  brand?: string;
  model?: string;
  ownerId: string;
}

export interface UpdateVehicleRequest {
  plate?: string;
  brand?: string;
  model?: string;
}

export class VehicleService {
  async createVehicle(request: CreateVehicleRequest): Promise<Vehicle> {
    // Verificar que el usuario existe
    const user = await UserRepository.findById(request.ownerId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar que la placa no existe
    const existingVehicle = await VehicleRepository.findByPlate(request.plate);
    if (existingVehicle) {
      throw new Error('Ya existe un vehículo con esta placa');
    }

    // Validar formato de placa colombiana (básico)
    const plateRegex = /^[A-Z]{3}[0-9]{2}[A-Z0-9]$/;
    if (!plateRegex.test(request.plate)) {
      throw new Error('Formato de placa inválido. Use formato ABC123 o ABC12D');
    }

    const vehicleData: CreateVehicleData = {
      plate: request.plate.toUpperCase(),
      brand: request.brand,
      model: request.model,
      owner_id: request.ownerId
    };

    return await VehicleRepository.create(vehicleData);
  }

  async getVehicleById(vehicleId: string): Promise<Vehicle | null> {
    return await VehicleRepository.findById(vehicleId);
  }

  async getUserVehicles(userId: string): Promise<Vehicle[]> {
    return await VehicleRepository.findByOwnerId(userId);
  }

  async updateVehicle(vehicleId: string, request: UpdateVehicleRequest, userId: string, userRole: 'user' | 'admin'): Promise<Vehicle> {
    // Verificar que el vehículo existe
    const vehicle = await VehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }

    // Verificar permisos (solo el propietario o admin puede modificar)
    if (userRole !== 'admin' && vehicle.owner_id !== userId) {
      throw new Error('No tienes permisos para modificar este vehículo');
    }

    // Si se está cambiando la placa, verificar que no existe otra igual
    if (request.plate && request.plate !== vehicle.plate) {
      const existingVehicle = await VehicleRepository.findByPlate(request.plate);
      if (existingVehicle) {
        throw new Error('Ya existe un vehículo con esta placa');
      }

      // Validar formato de placa
      const plateRegex = /^[A-Z]{3}[0-9]{2}[A-Z0-9]$/;
      if (!plateRegex.test(request.plate)) {
        throw new Error('Formato de placa inválido. Use formato ABC123 o ABC12D');
      }

      request.plate = request.plate.toUpperCase();
    }

    const updatedVehicle = await VehicleRepository.update(vehicleId, request);
    if (!updatedVehicle) {
      throw new Error('Error al actualizar el vehículo');
    }

    return updatedVehicle;
  }

  async deleteVehicle(vehicleId: string, userId: string, userRole: 'user' | 'admin'): Promise<boolean> {
    // Verificar que el vehículo existe
    const vehicle = await VehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }

    // Verificar permisos (solo el propietario o admin puede eliminar)
    if (userRole !== 'admin' && vehicle.owner_id !== userId) {
      throw new Error('No tienes permisos para eliminar este vehículo');
    }

    return await VehicleRepository.delete(vehicleId);
  }

  async verifyVehicleOwnership(vehicleId: string, userId: string): Promise<boolean> {
    return await VehicleRepository.verifyOwnership(vehicleId, userId);
  }

  async getVehicleByPlate(plate: string): Promise<Vehicle | null> {
    return await VehicleRepository.findByPlate(plate);
  }

  validatePlateFormat(plate: string): boolean {
    const plateRegex = /^[A-Z]{3}[0-9]{2}[A-Z0-9]$/;
    return plateRegex.test(plate);
  }
}

export default new VehicleService();