# API de Gestión de Pagos de Vehículos

## Descripción

API RESTful desarrollada en Node.js + TypeScript para la gestión de pagos de impuestos vehiculares. La aplicación permite a los usuarios registrarse, gestionar vehículos, consultar vigencias (deudas) y realizar pagos con reparto automático (95% gobernación, 5% gastos administrativos).

## Características Principales

###  Autenticación y Autorización
- **JWT Authentication**: Tokens seguros para autenticación
- **Roles de Usuario**: `user` y `admin` con permisos diferenciados
- **Hashing de Contraseñas**: bcrypt con salt rounds de 12
- **Middleware de Autorización**: Control de acceso basado en roles

###  Gestión de Vehículos
- **CRUD Completo**: Crear, leer, actualizar y eliminar vehículos
- **Asociación con Usuarios**: Cada vehículo pertenece a un usuario específico
- **Validación de Placas**: Formato colombiano (ABC123, ABC12D)

###  Sistema de Vigencias y Pagos
- **Vigencias por Año**: Deudas anuales con montos específicos
- **Proceso de Pago**: Eliminación/marcado de vigencias al pagar
- **Reparto Automático**: 95% gobernación, 5% gastos administrativos
- **Historial de Pagos**: Registro completo de transacciones

###  Seguridad
- **Rate Limiting**: 100 requests por IP cada 15 minutos
- **Validación de Entrada**: Joi para validación de datos
- **Headers de Seguridad**: Helmet.js para protección
- **Manejo de Errores**: Sistema robusto de manejo de errores

###  DevOps
- **Docker**: Containerización completa
- **CI/CD**: Pipeline automatizado con GitHub Actions
- **MongoDB**: Base de datos NoSQL con Mongoose ODM
- **Swagger**: Documentación automática de API

## Requisitos del Sistema

- **Node.js**: 20+ (LTS)
- **MongoDB**: 6.0+
- **Docker**: 20.10+ (opcional)
- **npm**: 9+

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd vehicle-tax-api
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configuración de Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
MONGODB_URI=mongodb://localhost:27017/vehicle-tax-db

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
JWT_EXPIRES_IN=24h

# Servidor
PORT=3000
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Configuración de MongoDB

#### Opción A: MongoDB Local
1. Instalar MongoDB Community Edition
2. Iniciar el servicio: `brew services start mongodb/brew/mongodb-community` (macOS)
3. La conexión será automática con la URI por defecto

#### Opción B: MongoDB Atlas (Recomendado)
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito
3. Obtener la URI de conexión
4. Actualizar `MONGODB_URI` en `.env`

#### Opción C: Docker Compose
```bash
docker-compose up -d mongodb
```

## Ejecución del Proyecto

### Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (con hot reload)
npm run dev

# La API estará disponible en http://localhost:3000
```

### Producción

```bash
# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start
```

### Docker

```bash
# Construir la imagen
docker build -t vehicle-tax-api .

# Ejecutar con docker-compose (incluye MongoDB)
docker-compose up -d

# Solo la aplicación
docker run -p 3000:3000 --env-file .env vehicle-tax-api
```

## Poblar Base de Datos

Para facilitar las pruebas, se incluye un script de seed:

```bash
# Poblar con datos de prueba
npm run seed

# El script creará:
# - 2 usuarios (user y admin)
# - 3 vehículos
# - 6 vigencias (2 por vehículo)
```

## Documentación de la API

### Swagger UI
Una vez ejecutado el proyecto, la documentación interactiva estará disponible en:
- **Desarrollo**: http://localhost:3000/api-docs
- **Producción**: http://your-domain.com/api-docs

### Endpoints Principales

####  Autenticación
```
POST /auth/register          # Registro de usuario
POST /auth/login             # Inicio de sesión
POST /auth/change-password   # Cambio de contraseña
```

####  Vehículos
```
GET    /vehicles             # Listar vehículos del usuario
POST   /vehicles             # Crear vehículo
GET    /vehicles/:id         # Obtener vehículo específico
PUT    /vehicles/:id         # Actualizar vehículo
DELETE /vehicles/:id         # Eliminar vehículo
```

####  Vigencias y Pagos
```
GET  /vehicles/:vehicleId/vigencias                    # Vigencias del vehículo
POST /vehicles/:vehicleId/vigencias/:vigenciaId/pay    # Pagar vigencia
GET  /payments/me                                      # Pagos del usuario
GET  /admin/payments                                   # Todos los pagos (admin)
```

## Estructura del Proyecto

```
src/
├── controllers/          # Controladores de rutas
│   ├── authController.ts
│   ├── vehicleController.ts
│   ├── vigenciaController.ts
│   └── paymentController.ts
├── middleware/           # Middleware personalizado
│   ├── auth.ts
│   ├── authorize.ts
│   ├── rateLimiter.ts
│   └── validation.ts
├── models/              # Modelos de Mongoose
│   ├── User.ts
│   ├── Vehicle.ts
│   ├── Vigencia.ts
│   └── Payment.ts
├── routes/              # Definición de rutas
│   ├── auth.ts
│   ├── vehicles.ts
│   ├── vigencias.ts
│   └── payments.ts
├── services/            # Lógica de negocio
│   ├── authService.ts
│   ├── vehicleService.ts
│   ├── vigenciaService.ts
│   └── paymentService.ts
├── utils/               # Utilidades
│   ├── database.ts
│   ├── logger.ts
│   └── swagger.ts
├── types/               # Tipos TypeScript
│   └── express.d.ts
└── app.ts              # Configuración principal
```

## Scripts Disponibles

```json
{
  "dev": "nodemon src/app.ts",           # Desarrollo con hot reload
  "build": "tsc",                        # Compilar TypeScript
  "start": "node dist/app.js",           # Ejecutar en producción
  "seed": "tsx scripts/seed.ts",         # Poblar base de datos
  "test": "jest",                        # Ejecutar tests (futuro)
  "lint": "eslint src/**/*.ts",          # Linter
  "format": "prettier --write src/**/*.ts" # Formatear código
}
```

## Configuración de Desarrollo

### Variables de Entorno para Desarrollo

```env
MONGODB_URI=mongodb://localhost:27017/vehicle-tax-db-dev
JWT_SECRET=dev_secret_change_in_production
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Configuración de Base de Datos

El proyecto utiliza MongoDB con las siguientes colecciones:
- `users`: Usuarios del sistema
- `vehicles`: Vehículos registrados
- `vigencias`: Deudas anuales
- `payments`: Registro de pagos

## Testing

### Datos de Prueba (después de ejecutar seed)

#### Usuario Regular
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Usuario Administrador
```json
{
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

### Flujo de Prueba Recomendado

1. **Registro/Login**: Registrar usuario o usar credenciales de seed
2. **Crear Vehículo**: Agregar un vehículo nuevo
3. **Consultar Vigencias**: Ver deudas pendientes
4. **Realizar Pago**: Pagar una vigencia específica
5. **Consultar Historial**: Verificar el registro de pagos

## Despliegue

### GitHub Actions

El proyecto incluye un pipeline CI/CD que:
1. Ejecuta tests de seguridad (npm audit)
2. Compila el código TypeScript
3. Construye la imagen Docker
4. Despliega automáticamente (configurar según necesidades)

### Variables de Entorno para Producción

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vehicle-tax-db
JWT_SECRET=super_secure_jwt_secret_in_production
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Comandos de Despliegue

```bash
# Construir para producción
npm run build

# Ejecutar en producción
NODE_ENV=production npm start

# Con Docker
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoreo y Logs

### Logs de Aplicación
- Los logs se muestran en la consola en desarrollo
- En producción, se recomienda usar un servicio de logging como Winston

### Health Check
```
GET /health    # Estado de la aplicación
```

### Métricas Disponibles
- Rate limiting por IP
- Tiempo de respuesta de endpoints
- Errores de autenticación
- Fallos de conexión a base de datos

## Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
- **Controladores**: Solo manejan HTTP requests/responses
- **Servicios**: Contienen lógica de negocio específica
- **Modelos**: Solo definen estructura de datos
- **Middleware**: Funciones específicas (auth, validation, etc.)

### Open/Closed Principle (OCP)
- **Servicios**: Extensibles para nuevas funcionalidades
- **Middleware**: Composable y reutilizable
- **Validaciones**: Esquemas Joi modulares

### Liskov Substitution Principle (LSP)
- **Interfaces**: Consistentes para servicios similares
- **Middleware**: Intercambiables sin romper funcionalidad

### Interface Segregation Principle (ISP)
- **Tipos TypeScript**: Interfaces específicas por contexto
- **Servicios**: Métodos cohesivos y enfocados

### Dependency Inversion Principle (DIP)
- **Inyección de Dependencias**: Database, servicios externos
- **Abstracciones**: Interfaces para servicios principales

## Arquitectura de Seguridad

### Autenticación
- **JWT Tokens**: Firmados con secreto seguro
- **Expiración**: Tokens con tiempo de vida limitado
- **Password Hashing**: bcrypt con salt rounds de 12

### Autorización
- **Role-Based**: Permisos por roles (user/admin)
- **Resource-Based**: Usuarios solo acceden a sus recursos
- **Middleware Chain**: Validación en múltiples capas

### Protección contra Ataques
- **Rate Limiting**: Prevención de ataques de fuerza bruta
- **Input Validation**: Sanitización de datos de entrada
- **Security Headers**: Helmet.js para headers seguros
- **CORS**: Configuración restrictiva de CORS

## Troubleshooting

### Problemas Comunes

#### Error de Conexión a MongoDB
```bash
# Verificar que MongoDB esté ejecutándose
brew services list | grep mongodb

# Reiniciar MongoDB
brew services restart mongodb/brew/mongodb-community
```

#### Error de JWT
```bash
# Verificar que JWT_SECRET esté configurado
echo $JWT_SECRET

# Regenerar token de autenticación
# Hacer login nuevamente
```

#### Error de Puerto en Uso
```bash
# Verificar qué proceso usa el puerto 3000
lsof -ti:3000

# Matar el proceso
kill -9 $(lsof -ti:3000)
```

#### Error de Permisos Docker
```bash
# En macOS/Linux, agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar
newgrp docker
```

### Logs de Debug

Para habilitar logs detallados:

```bash
# Desarrollo
DEBUG=* npm run dev

# Solo logs de la aplicación
DEBUG=app:* npm run dev
```

## Contribución

### Convenciones de Código
- **Idioma**: Español para comentarios, inglés para código
- **Formato**: Prettier con configuración del proyecto
- **Linting**: ESLint con reglas TypeScript
- **Commits**: Conventional Commits en español

### Proceso de Desarrollo
1. Fork del repositorio
2. Crear branch para feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit con mensajes descriptivos: `feat: agregar endpoint de notificaciones`
4. Push y crear Pull Request
5. Code review y merge

## Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## Contacto y Soporte

Para preguntas técnicas o reportar issues:
- **Issues**: GitHub Issues del repositorio
- **Documentación**: Swagger UI en `/api-docs`
- **Email**: soporte@vehicletax-api.com

---

**Versión**: 1.0.0  
**Última Actualización**: $(date +%Y-%m-%d)  
**Node.js**: 20+  
**MongoDB**: 6.0+  
**TypeScript**: 5.0+