# 🚀 Colección de Postman - Vehicle Tax Payment API

## 📋 Archivos Incluidos

1. **`Vehicle_Tax_API.postman_collection.json`** - Colección principal con todas las pruebas
2. **`Vehicle_Tax_API.postman_environment.json`** - Variables de entorno
3. **`POSTMAN_README.md`** - Este archivo de instrucciones

## 🛠 Cómo Importar en Postman

### 1. Importar la Colección
1. Abre Postman
2. Haz clic en **"Import"** (esquina superior izquierda)
3. Arrastra el archivo `Vehicle_Tax_API.postman_collection.json` o haz clic en **"Upload Files"**
4. Confirma la importación

### 2. Importar el Entorno
1. En Postman, ve a **"Environments"** (menú lateral izquierdo)
2. Haz clic en **"Import"**
3. Arrastra el archivo `Vehicle_Tax_API.postman_environment.json`
4. Confirma la importación

### 3. Configurar el Entorno
1. Selecciona el entorno **"Vehicle Tax API - Development"** en el dropdown superior derecho
2. Asegúrate de que `baseUrl` esté configurado como `http://localhost:3001`

## 🧪 Orden Recomendado de Pruebas

### 📌 **Fase 1: Verificación Básica**
1. **Health Check** - Verificar que el servidor esté funcionando

### 📌 **Fase 2: Autenticación**
2. **Registro de Usuario Ciudadano** - Crear un nuevo usuario
3. **Login Usuario** - Obtener token de autenticación
4. **Login Admin (Seeded)** - Usar credenciales del admin pre-creado

### 📌 **Fase 3: Gestión de Vehículos**
5. **Crear Vehículo** - Registrar un vehículo nuevo
6. **Listar Mis Vehículos** - Ver vehículos del usuario
7. **Obtener Vehículo por ID** - Detalles de un vehículo específico
8. **Actualizar Vehículo** - Modificar datos del vehículo

### 📌 **Fase 4: Consulta de Vigencias (Deudas)**
9. **Consultar Vigencias de Vehículo** - Ver deudas de un vehículo específico
10. **Consultar Vigencias Pendientes Usuario** - Todas las deudas del usuario
11. **Buscar Vigencias por Placa** - Búsqueda por número de placa

### 📌 **Fase 5: Procesamiento de Pagos**
12. **Procesar Pago de Vigencia** - Realizar un pago
13. **Consultar Mis Pagos** - Historial de pagos del usuario
14. **Obtener Detalles de Pago** - Información detallada de un pago

### 📌 **Fase 6: Funciones de Administrador**
15. **Listar Todos los Pagos (Admin)** - Ver todos los pagos del sistema
16. **Estadísticas de Pagos (Admin)** - Métricas y estadísticas
17. **Listar Todos los Vehículos (Admin)** - Ver todos los vehículos registrados

### 📌 **Fase 7: Rutas Especiales**
18. **GET /vehicles/:vehicleId/vigencias** - Ruta alternativa para vigencias
19. **POST /vehicles/:vehicleId/vigencias/:vigenciaId/pay** - Ruta alternativa para pagos

## 🔐 Credenciales Pre-configuradas

### Usuario Administrador (Seed Data)
- **Email:** `admin@vehicletax.gov.co`
- **Password:** `AdminPassword123!`
- **Rol:** `ADMIN`

### Usuario Ciudadano (Seed Data)
- **Email:** `carlos.ruiz@email.com`
- **Password:** `UserPassword123!`
- **Rol:** `CITIZEN`

## ⚡ Variables Automáticas

La colección está configurada para guardar automáticamente:
- **Tokens de autenticación** (userToken, adminToken)
- **IDs de recursos** (userId, vehicleId, vigenciaId, paymentId)
- **Datos de prueba** (vigenciaAmount)

## 🎯 Características de la Colección

### ✅ **Scripts Automáticos**
- **Pre-request Scripts:** Configuración automática de variables
- **Test Scripts:** Validación de respuestas y extracción de datos
- **Environment Variables:** Almacenamiento automático de tokens e IDs

### ✅ **Validaciones Incluidas**
- Códigos de estado HTTP correctos
- Estructura de respuestas JSON
- Presencia de campos obligatorios
- Tokens de autenticación válidos

### ✅ **Casos de Prueba Cubiertos**
- 🔐 Autenticación y autorización
- 🚗 CRUD completo de vehículos
- 💰 Gestión de vigencias (deudas)
- 💳 Procesamiento de pagos con reparto 95%/5%
- 👨‍💼 Funciones administrativas
- 🛣️ Rutas especiales según especificación

## 🚀 Flujo de Prueba Completa

1. **Ejecutar "Health Check"** para verificar conectividad
2. **Registrar nuevo usuario** o **Login con admin**
3. **Crear un vehículo** para el usuario autenticado
4. **Consultar vigencias** del vehículo creado
5. **Procesar un pago** de alguna vigencia pendiente
6. **Verificar el pago** en el historial
7. **Usar funciones de admin** para ver estadísticas globales

## 📊 Datos de Ejemplo

### Vehículo de Prueba
```json
{
  "plate": "ABC123",
  "brand": "Toyota", 
  "model": "Corolla",
  "year": 2020,
  "engine": "1800",
  "fuelType": "GASOLINE",
  "bodyType": "SEDAN",
  "color": "Blanco",
  "municipalityCode": "05001"
}
```

### Usuario de Prueba
```json
{
  "username": "testuser",
  "email": "test@example.com", 
  "password": "TestPassword123!",
  "fullName": "Usuario de Prueba",
  "phoneNumber": "3001234567"
}
```

## 🔧 Troubleshooting

### Servidor no responde
- Verificar que el servidor esté corriendo en `localhost:3001`
- Ejecutar `npm run dev` en el directorio del proyecto

### Error de autenticación
- Asegurarse de haber ejecutado Login antes de las pruebas autenticadas
- Verificar que el token esté configurado en las variables de entorno

### Variables no se guardan
- Verificar que el entorno correcto esté seleccionado
- Revisar que los scripts de test estén habilitados

---

## 🎉 ¡Listo para Probar!

Con esta colección tienes todo lo necesario para probar completamente la API de gestión de pagos de impuestos vehiculares. La colección está diseñada para ser ejecutada secuencialmente y incluye todas las validaciones necesarias para verificar que el sistema funciona correctamente.

**¡Buena suerte con tu trabajo!** 🚀