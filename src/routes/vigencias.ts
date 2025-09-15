import { Router } from 'express';
import {
  getVehicleVigencias,
  getUnpaidVehicleVigencias,
  createVigencia,
  updateVigencia,
  deleteVigencia,
  getUserVigencias,
  getUserUnpaidVigencias
} from '../controllers/vigenciaController';
import { authenticate } from '../middlewares/auth';
import { requireUser, requireAdmin } from '../middlewares/authorization';
import { validateVigencia } from '../middlewares/validation';

const router = Router();

router.use(authenticate);
router.use(requireUser);

// Rutas de usuario
router.get('/user/all', getUserVigencias);
router.get('/user/unpaid', getUserUnpaidVigencias);

// Rutas por vehículo
router.get('/vehicle/:vehicleId', getVehicleVigencias);
router.get('/vehicle/:vehicleId/unpaid', getUnpaidVehicleVigencias);

// Rutas de admin
router.post('/vehicle/:vehicleId', requireAdmin, validateVigencia, createVigencia);
router.put('/:id', requireAdmin, validateVigencia, updateVigencia);
router.delete('/:id', requireAdmin, deleteVigencia);

export default router;