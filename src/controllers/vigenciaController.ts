import { Response } from 'express';
import { VigenciaService } from '../services';
import { AuthenticatedRequest } from '../types';

export const getVehicleVigencias = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { vehicleId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const vigencias = await VigenciaService.getVehicleVigencias(vehicleId, userId, userRole);

    res.status(200).json({
      success: true,
      data: vigencias
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al obtener vigencias'
    });
  }
};

export const getUnpaidVehicleVigencias = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { vehicleId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const vigencias = await VigenciaService.getUnpaidVehicleVigencias(vehicleId, userId, userRole);

    res.status(200).json({
      success: true,
      data: vigencias
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al obtener vigencias pendientes'
    });
  }
};

export const createVigencia = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { vehicleId } = req.params;
    const { year, amount } = req.body;
    const userRole = req.user!.role;

    // Solo admin puede crear vigencias
    if (userRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden crear vigencias'
      });
      return;
    }

    const vigencia = await VigenciaService.createVigencia({
      vehicleId,
      year,
      amount
    });

    res.status(201).json({
      success: true,
      message: 'Vigencia creada exitosamente',
      data: vigencia
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al crear vigencia'
    });
  }
};

export const updateVigencia = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { year, amount } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const vigencia = await VigenciaService.updateVigencia(
      id,
      { year, amount },
      userId,
      userRole
    );

    res.status(200).json({
      success: true,
      message: 'Vigencia actualizada exitosamente',
      data: vigencia
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al actualizar vigencia'
    });
  }
};

export const deleteVigencia = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const success = await VigenciaService.deleteVigencia(id, userId, userRole);

    if (!success) {
      res.status(404).json({
        success: false,
        message: 'Vigencia no encontrada'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Vigencia eliminada exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al eliminar vigencia'
    });
  }
};

export const getUserVigencias = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const vigencias = await VigenciaService.getUserVigencias(userId);

    res.status(200).json({
      success: true,
      data: vigencias
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener vigencias del usuario'
    });
  }
};

export const getUserUnpaidVigencias = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const vigencias = await VigenciaService.getUserUnpaidVigencias(userId);

    res.status(200).json({
      success: true,
      data: vigencias
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener vigencias pendientes del usuario'
    });
  }
};