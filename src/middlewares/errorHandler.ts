import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const createError = (message: string, statusCode: number): CustomError => {
  const error: CustomError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message } = error;

  // MongoDB duplicate key error
  if (error.name === 'MongoError' && (error as any).code === 11000) {
    statusCode = 400;
    message = 'Recurso duplicado';
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Datos de entrada inválidos';
  }

  // PostgreSQL errors
  if (error.name === 'PostgresError' || (error as any).code) {
    const pgError = error as any;
    switch (pgError.code) {
      case '23505': // unique_violation
        statusCode = 400;
        message = 'El recurso ya existe';
        break;
      case '23503': // foreign_key_violation
        statusCode = 400;
        message = 'Referencia inválida';
        break;
      case '23502': // not_null_violation
        statusCode = 400;
        message = 'Campo requerido faltante';
        break;
      default:
        statusCode = 500;
        message = 'Error de base de datos';
    }
  }

  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    statusCode,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Error interno del servidor' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};