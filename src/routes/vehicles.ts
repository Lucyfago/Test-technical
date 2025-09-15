import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} from '../controllers/vehicleController';
import { authenticate } from '../middlewares/auth';
import { requireUser } from '../middlewares/authorization';
import { validateVehicle } from '../middlewares/validation';

const router = Router();

router.use(authenticate);
router.use(requireUser);

router.get('/', getVehicles);
router.post('/', validateVehicle, createVehicle);
router.get('/:id', getVehicleById);
router.put('/:id', validateVehicle, updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;