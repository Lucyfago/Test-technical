import { Response } from 'express';
import { VehicleService } from '../services';
import { AuthenticatedRequest } from '../types';

export const createVehicle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { plate, brand, model } = req.body;
    const ownerId = req.user!.id;

    const vehicle = await VehicleService.createVehicle({
      plate,
      brand,
      model,
      ownerId
    });

    res.status(201).json({
      success: true,
      message: 'Vehículo creado exitosamente',
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al crear vehículo'
    });
  }
};

export const getVehicles = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const vehicles = await VehicleService.getUserVehicles(userId);

    res.status(200).json({
      success: true,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener vehículos'
    });
  }
};

export const getVehicleById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const vehicle = await VehicleService.getVehicleById(id);
    
    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
      return;
    }

    // Verificar permisos (solo el propietario o admin pueden ver el vehículo)
    if (userRole !== 'admin' && vehicle.owner_id !== userId) {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este vehículo'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener vehículo'
    });
  }
};

export const updateVehicle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { plate, brand, model } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const vehicle = await VehicleService.updateVehicle(
      id,
      { plate, brand, model },
      userId,
      userRole
    );

    res.status(200).json({
      success: true,
      message: 'Vehículo actualizado exitosamente',
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al actualizar vehículo'
    });
  }
};

export const deleteVehicle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const success = await VehicleService.deleteVehicle(id, userId, userRole);

    if (!success) {
      res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Vehículo eliminado exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al eliminar vehículo'
    });
  }
};