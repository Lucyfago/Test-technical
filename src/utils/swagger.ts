import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vehicle Management API',
      version: '1.0.0',
      description: 'API RESTful para gestión de vehículos y pagos de impuestos vehiculares',
      contact: {
        name: 'Brayan Villamizar',
        email: 'contact@vehiclemanagement.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://your-production-domain.com/api',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT para autenticación'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único del usuario'
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'Nombre completo del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico único'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'Rol del usuario'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            }
          }
        },
        Vehicle: {
          type: 'object',
          required: ['plateNumber', 'brand', 'vehicleModel', 'year'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único del vehículo'
            },
            owner: {
              type: 'string',
              format: 'uuid',
              description: 'ID del propietario'
            },
            plateNumber: {
              type: 'string',
              pattern: '^[A-Z0-9-]+$',
              description: 'Placa del vehículo'
            },
            brand: {
              type: 'string',
              maxLength: 30,
              description: 'Marca del vehículo'
            },
            vehicleModel: {
              type: 'string',
              maxLength: 30,
              description: 'Modelo del vehículo'
            },
            year: {
              type: 'integer',
              minimum: 1900,
              maximum: 2026,
              description: 'Año del vehículo'
            },
            color: {
              type: 'string',
              maxLength: 20,
              description: 'Color del vehículo'
            }
          }
        },
        Vigencia: {
          type: 'object',
          required: ['vehicle', 'year', 'amount', 'dueDate'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único de la vigencia'
            },
            vehicle: {
              type: 'string',
              format: 'uuid',
              description: 'ID del vehículo'
            },
            year: {
              type: 'integer',
              minimum: 2000,
              maximum: 2030,
              description: 'Año de la vigencia'
            },
            amount: {
              type: 'number',
              minimum: 0,
              description: 'Monto a pagar'
            },
            description: {
              type: 'string',
              maxLength: 200,
              description: 'Descripción de la vigencia'
            },
            dueDate: {
              type: 'string',
              format: 'date',
              description: 'Fecha de vencimiento'
            },
            isPaid: {
              type: 'boolean',
              description: 'Estado de pago'
            }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único del pago'
            },
            user: {
              type: 'string',
              format: 'uuid',
              description: 'ID del usuario'
            },
            vigencia: {
              type: 'string',
              format: 'uuid',
              description: 'ID de la vigencia pagada'
            },
            amount: {
              type: 'number',
              minimum: 0,
              description: 'Monto total pagado'
            },
            governmentShare: {
              type: 'number',
              description: 'Parte de la gobernación (95%)'
            },
            adminShare: {
              type: 'number',
              description: 'Gastos administrativos (5%)'
            },
            paymentMethod: {
              type: 'string',
              enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'other'],
              description: 'Método de pago'
            },
            paidAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de pago'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              },
              description: 'Detalles específicos del error'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Vehicle Management API Docs'
  }));
  
  // Serve swagger.json
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export default specs;