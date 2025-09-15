import { Router } from 'express';
import {
  register,
  login,
  changePassword,
  getProfile
} from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import {
  validateRegister,
  validateLogin,
  validateChangePassword
} from '../middlewares/validation';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/change-password', authenticate, validateChangePassword, changePassword);
router.get('/profile', authenticate, getProfile);

export default router;