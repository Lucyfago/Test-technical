import { PaymentRepository, VigenciaRepository, VehicleRepository, UserRepository } from '../repositories';
import { CreatePaymentData, Payment, Vigencia } from '../types';

export interface PaymentRequest {
  vigenciaId: string;
  userId: string;
  userRole: 'user' | 'admin';
}

export interface PaymentResult {
  payment: Payment;
  vigencia: Vigencia;
}

export class PaymentService {
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Verificar que la vigencia existe y no está pagada
    const vigencia = await VigenciaRepository.findById(request.vigenciaId);
    if (!vigencia) {
      throw new Error('Vigencia no encontrada');
    }

    if (vigencia.is_paid) {
      throw new Error('Esta vigencia ya ha sido pagada');
    }

    // Verificar que el vehículo pertenece al usuario (excepto admin)
    if (request.userRole !== 'admin') {
      const vehicle = await VehicleRepository.findById(vigencia.vehicle_id);
      if (!vehicle || vehicle.owner_id !== request.userId) {
        throw new Error('No tienes permisos para pagar esta vigencia');
      }
    }

    // Calcular la división del pago: 95% gobernación, 5% plataforma
    const totalAmount = vigencia.amount;
    const governorAmount = Math.floor(totalAmount * 0.95);
    const platformFee = totalAmount - governorAmount;

    // Crear el registro de pago
    const paymentData: CreatePaymentData = {
      user_id: request.userId,
      vehicle_id: vigencia.vehicle_id,
      vigencia_id: vigencia.id,
      vigencia_year: vigencia.year,
      amount_cop: totalAmount,
      governor_amount_cop: governorAmount,
      platform_fee_cop: platformFee
    };

    const payment = await PaymentRepository.create(paymentData);

    // Marcar la vigencia como pagada
    const updatedVigencia = await VigenciaRepository.markAsPaid(vigencia.id);

    return {
      payment,
      vigencia: updatedVigencia!
    };
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return await PaymentRepository.findByUserId(userId);
  }

  async getAllPayments(): Promise<Payment[]> {
    return await PaymentRepository.findAll();
  }

  async getPaymentById(paymentId: string): Promise<Payment | null> {
    return await PaymentRepository.findById(paymentId);
  }

  async getPaymentStats() {
    return await PaymentRepository.getPaymentStats();
  }

  async getPaymentsByDateRange(startDate: Date, endDate: Date): Promise<Payment[]> {
    return await PaymentRepository.findByDateRange(startDate, endDate);
  }

  async getVehiclePayments(vehicleId: string): Promise<Payment[]> {
    return await PaymentRepository.findByVehicleId(vehicleId);
  }

  calculatePaymentSplit(amount: number) {
    const governorAmount = Math.floor(amount * 0.95);
    const platformFee = amount - governorAmount;
    
    return {
      total: amount,
      governorAmount,
      platformFee,
      governorPercentage: 95,
      platformPercentage: 5
    };
  }
}

export default new PaymentService();