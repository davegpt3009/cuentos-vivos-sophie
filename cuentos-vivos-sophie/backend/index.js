// Importación de dependencias necesarias
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Importación de rutas
const storyRoutes = require('./routes/storyRoutes');

// Crear instancia de la aplicación Express
const app = express();

// Configuración del puerto desde variables de entorno o puerto por defecto
const PORT = process.env.PORT || 3001;

// Middlewares de seguridad y configuración
app.use(helmet()); // Añade headers de seguridad
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json({ limit: '10mb' })); // Parser para JSON con límite de tamaño
app.use(express.urlencoded({ extended: true })); // Parser para datos de formularios

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware de logging básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ruta raíz - Interfaz del frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api', storyRoutes);

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: 'La ruta solicitada no existe en este servidor'
  });
});

// Middleware global para manejo de errores
app.use((error, req, res, next) => {
  console.error('Error del servidor:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: 'Ha ocurrido un error inesperado'
  });
});

// Iniciar el servidor solo si no estamos en entorno de pruebas
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor de Cuentos Vivos iniciado en puerto ${PORT}`);
    console.log(`📖 Accede a http://localhost:${PORT} para verificar el estado`);
    console.log(`🌟 ¡Listo para crear cuentos mágicos para Sophie!`);
  });
}

// Manejo graceful de cierre del servidor
process.on('SIGTERM', () => {
  console.log('🛑 Cerrando servidor de Cuentos Vivos...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Cerrando servidor de Cuentos Vivos...');
  process.exit(0);
});

// Exportar la aplicación para pruebas
module.exports = app;

