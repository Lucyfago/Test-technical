import { Router } from 'express';
import {
  processPayment,
  getUserPayments,
  getAllPayments,
  getPaymentById,
  getPaymentStats,
  getPaymentsByDateRange
} from '../controllers/paymentController';
import { authenticate } from '../middlewares/auth';
import { requireUser, requireAdmin } from '../middlewares/authorization';
import { validatePagination } from '../middlewares/validation';

const router = Router();

router.use(authenticate);
router.use(requireUser);

// Procesar pago
router.post('/pay/:vigenciaId', processPayment);

// Rutas de usuario
router.get('/me', getUserPayments);
router.get('/:id', getPaymentById);

// Rutas de admin
router.get('/admin/all', requireAdmin, validatePagination, getAllPayments);
router.get('/admin/stats', requireAdmin, getPaymentStats);
router.get('/admin/date-range', requireAdmin, getPaymentsByDateRange);

export default router;