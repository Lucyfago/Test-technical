import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDatabase } from './utils/database';
import { setupSwagger } from './utils/swagger';
import { errorHandler } from './middlewares/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import vehicleRoutes from './routes/vehicles';
import vigenciaRoutes from './routes/vigencias';
import paymentRoutes from './routes/payments';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Compression
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Setup API documentation
setupSwagger(app);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vigencias', vigenciaRoutes);
app.use('/api/payments', paymentRoutes);

// Special routes according to specification
// GET /vehicles/:vehicleId/vigencias
app.use('/api/vehicles/:vehicleId/vigencias', (req, res, next) => {
  req.url = `/vehicle/${req.params.vehicleId}`;
  vigenciaRoutes(req, res, next);
});

// POST /vehicles/:vehicleId/vigencias/:vigenciaId/pay
app.use('/api/vehicles/:vehicleId/vigencias/:vigenciaId/pay', (req, res, next) => {
  req.body.vigenciaId = req.params.vigenciaId;
  req.url = '/pay';
  paymentRoutes(req, res, next);
});

// GET /admin/payments
app.use('/api/admin/payments', (req, res, next) => {
  req.url = '/admin/all';
  paymentRoutes(req, res, next);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();

export default app;