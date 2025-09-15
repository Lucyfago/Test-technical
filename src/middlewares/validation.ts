import { Request, Response, NextFunction } from 'express';

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, password } = req.body;

  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email inválido');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors
    });
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  const errors: string[] = [];

  if (!email || typeof email !== 'string') {
    errors.push('Email requerido');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Contraseña requerida');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors
    });
    return;
  }

  next();
};

export const validateChangePassword = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { currentPassword, newPassword } = req.body;

  const errors: string[] = [];

  if (!currentPassword || typeof currentPassword !== 'string') {
    errors.push('Contraseña actual requerida');
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    errors.push('La nueva contraseña debe tener al menos 6 caracteres');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors
    });
    return;
  }

  next();
};

export const validateVehicle = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { plate, brand, model } = req.body;

  const errors: string[] = [];

  if (!plate || typeof plate !== 'string' || !/^[A-Z]{3}[0-9]{2}[A-Z0-9]$/.test(plate)) {
    errors.push('Placa inválida. Use formato ABC123 o ABC12D');
  }

  if (brand && (typeof brand !== 'string' || brand.trim().length < 2)) {
    errors.push('La marca debe tener al menos 2 caracteres');
  }

  if (model && (typeof model !== 'string' || model.trim().length < 2)) {
    errors.push('El modelo debe tener al menos 2 caracteres');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors
    });
    return;
  }

  next();
};

export const validateVigencia = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { year, amount } = req.body;

  const errors: string[] = [];

  if (!year || typeof year !== 'number' || year < 2000 || year > new Date().getFullYear() + 1) {
    errors.push('Año inválido');
  }

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    errors.push('El monto debe ser mayor a cero');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors
    });
    return;
  }

  next();
};

export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { page, limit } = req.query;

  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    res.status(400).json({
      success: false,
      message: 'Número de página inválido'
    });
    return;
  }

  if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    res.status(400).json({
      success: false,
      message: 'Límite inválido (1-100)'
    });
    return;
  }

  next();
};