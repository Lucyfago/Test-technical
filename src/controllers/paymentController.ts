import { Response } from 'express';
import { PaymentService } from '../services';
import { AuthenticatedRequest } from '../types';

export const processPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { vehicleId, vigenciaId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const result = await PaymentService.processPayment({
      vigenciaId,
      userId,
      userRole
    });

    res.status(200).json({
      success: true,
      message: 'Pago procesado exitosamente',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al procesar pago'
    });
  }
};

export const getUserPayments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const payments = await PaymentService.getUserPayments(userId);

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pagos del usuario'
    });
  }
};

export const getAllPayments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user!.role;

    // Solo admin puede ver todos los pagos
    if (userRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden ver todos los pagos'
      });
      return;
    }

    const payments = await PaymentService.getAllPayments();

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener todos los pagos'
    });
  }
};

export const getPaymentById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const payment = await PaymentService.getPaymentById(id);

    if (!payment) {
      res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
      return;
    }

    // Verificar permisos (solo el propietario o admin pueden ver el pago)
    if (userRole !== 'admin' && payment.user_id !== userId) {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este pago'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el pago'
    });
  }
};

export const getPaymentStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user!.role;

    // Solo admin puede ver estadísticas
    if (userRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden ver las estadísticas'
      });
      return;
    }

    const stats = await PaymentService.getPaymentStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de pagos'
    });
  }
};

export const getPaymentsByDateRange = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user!.role;
    const { startDate, endDate } = req.query;

    // Solo admin puede ver pagos por rango de fechas
    if (userRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden ver pagos por rango de fechas'
      });
      return;
    }

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Se requieren startDate y endDate'
      });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Formato de fecha inválido'
      });
      return;
    }

    const payments = await PaymentService.getPaymentsByDateRange(start, end);

    res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pagos por rango de fechas'
    });
  }
};