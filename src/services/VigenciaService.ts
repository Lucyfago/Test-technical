import { VigenciaRepository, VehicleRepository } from '../repositories';
import { Vigencia, CreateVigenciaData } from '../types';

export interface CreateVigenciaRequest {
  vehicleId: string;
  year: number;
  amount: number;
}

export interface UpdateVigenciaRequest {
  year?: number;
  amount?: number;
}

export class VigenciaService {
  async createVigencia(request: CreateVigenciaRequest): Promise<Vigencia> {
    // Verificar que el vehículo existe
    const vehicle = await VehicleRepository.findById(request.vehicleId);
    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }

    // Verificar que no existe una vigencia para ese vehículo y año
    const existingVigencia = await VigenciaRepository.findByVehicleAndYear(request.vehicleId, request.year);
    if (existingVigencia) {
      throw new Error(`Ya existe una vigencia para el año ${request.year} en este vehículo`);
    }

    // Validar año
    const currentYear = new Date().getFullYear();
    if (request.year < 2000 || request.year > currentYear + 1) {
      throw new Error('Año inválido');
    }

    // Validar monto
    if (request.amount <= 0) {
      throw new Error('El monto debe ser mayor a cero');
    }

    const vigenciaData: CreateVigenciaData = {
      vehicle_id: request.vehicleId,
      year: request.year,
      amount: request.amount
    };

    return await VigenciaRepository.create(vigenciaData);
  }

  async getVigenciaById(vigenciaId: string): Promise<Vigencia | null> {
    return await VigenciaRepository.findById(vigenciaId);
  }

  async getVehicleVigencias(vehicleId: string, userId: string, userRole: 'user' | 'admin'): Promise<Vigencia[]> {
    // Verificar que el vehículo existe
    const vehicle = await VehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }

    // Verificar permisos (solo el propietario o admin puede ver las vigencias)
    if (userRole !== 'admin' && vehicle.owner_id !== userId) {
      throw new Error('No tienes permisos para ver las vigencias de este vehículo');
    }

    return await VigenciaRepository.findByVehicleId(vehicleId);
  }

  async getUnpaidVehicleVigencias(vehicleId: string, userId: string, userRole: 'user' | 'admin'): Promise<Vigencia[]> {
    // Verificar que el vehículo existe
    const vehicle = await VehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }

    // Verificar permisos (solo el propietario o admin puede ver las vigencias)
    if (userRole !== 'admin' && vehicle.owner_id !== userId) {
      throw new Error('No tienes permisos para ver las vigencias de este vehículo');
    }

    return await VigenciaRepository.findUnpaidByVehicleId(vehicleId);
  }

  async getUserVigencias(userId: string): Promise<Vigencia[]> {
    return await VigenciaRepository.findByUserId(userId);
  }

  async getUserUnpaidVigencias(userId: string): Promise<Vigencia[]> {
    return await VigenciaRepository.findUnpaidByUserId(userId);
  }

  async updateVigencia(vigenciaId: string, request: UpdateVigenciaRequest, userId: string, userRole: 'user' | 'admin'): Promise<Vigencia> {
    // Verificar que la vigencia existe
    const vigencia = await VigenciaRepository.findById(vigenciaId);
    if (!vigencia) {
      throw new Error('Vigencia no encontrada');
    }

    // Verificar que no está pagada
    if (vigencia.is_paid) {
      throw new Error('No se puede modificar una vigencia que ya ha sido pagada');
    }

    // Verificar permisos
    if (userRole !== 'admin') {
      const vehicle = await VehicleRepository.findById(vigencia.vehicle_id);
      if (!vehicle || vehicle.owner_id !== userId) {
        throw new Error('No tienes permisos para modificar esta vigencia');
      }
    }

    // Validar datos si se proporcionan
    if (request.year !== undefined) {
      const currentYear = new Date().getFullYear();
      if (request.year < 2000 || request.year > currentYear + 1) {
        throw new Error('Año inválido');
      }

      // Verificar que no existe otra vigencia para ese año en el mismo vehículo
      if (request.year !== vigencia.year) {
        const existingVigencia = await VigenciaRepository.findByVehicleAndYear(vigencia.vehicle_id, request.year);
        if (existingVigencia) {
          throw new Error(`Ya existe una vigencia para el año ${request.year} en este vehículo`);
        }
      }
    }

    if (request.amount !== undefined && request.amount <= 0) {
      throw new Error('El monto debe ser mayor a cero');
    }

    const updatedVigencia = await VigenciaRepository.update(vigenciaId, request);
    if (!updatedVigencia) {
      throw new Error('Error al actualizar la vigencia');
    }

    return updatedVigencia;
  }

  async deleteVigencia(vigenciaId: string, userId: string, userRole: 'user' | 'admin'): Promise<boolean> {
    // Verificar que la vigencia existe
    const vigencia = await VigenciaRepository.findById(vigenciaId);
    if (!vigencia) {
      throw new Error('Vigencia no encontrada');
    }

    // Verificar que no está pagada
    if (vigencia.is_paid) {
      throw new Error('No se puede eliminar una vigencia que ya ha sido pagada');
    }

    // Verificar permisos
    if (userRole !== 'admin') {
      const vehicle = await VehicleRepository.findById(vigencia.vehicle_id);
      if (!vehicle || vehicle.owner_id !== userId) {
        throw new Error('No tienes permisos para eliminar esta vigencia');
      }
    }

    return await VigenciaRepository.delete(vigenciaId);
  }

  async markVigenciaAsPaid(vigenciaId: string): Promise<Vigencia | null> {
    return await VigenciaRepository.markAsPaid(vigenciaId);
  }
}

export default new VigenciaService();