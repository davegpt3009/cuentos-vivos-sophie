// Rutas para la API de generación de historias
const express = require('express');
const StoryController = require('../controllers/storyController');

// Crear router de Express
const router = express.Router();

// Inicializar controlador
const storyController = new StoryController();

// Middleware para logging de requests a la API
router.use((req, res, next) => {
  console.log(`🔗 API Request: ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

// Middleware para validación básica de JSON
router.use(express.json({ limit: '10mb' }));

/**
 * POST /api/generate-story-part
 * Endpoint principal para generar nuevas partes de la historia
 * 
 * Body esperado:
 * {
 *   "storyHistory": [
 *     {"role": "assistant", "content": "Había una vez..."},
 *     {"role": "user", "content": "El personaje abrió la puerta."}
 *   ],
 *   "userChoices": { "hero": "Zorro", "place": "Bosque de Cristal" }
 * }
 * 
 * Respuesta:
 * {
 *   "success": true,
 *   "storyPart": "El zorro, al abrir la puerta...",
 *   "imageUrl": "https://url.de.la.imagen.generada/...",
 *   "metadata": { ... }
 * }
 */
router.post('/generate-story-part', async (req, res) => {
  await storyController.generateStoryPart(req, res);
});

/**
 * GET /api/ai-status
 * Verifica el estado de los servicios de IA
 */
router.get('/ai-status', async (req, res) => {
  await storyController.getAIStatus(req, res);
});

/**
 * GET /api/test-story
 * Endpoint de prueba para verificar que el servicio funciona
 */
router.get('/test-story', async (req, res) => {
  await storyController.testStory(req, res);
});

/**
 * GET /api/health
 * Endpoint de salud específico para la API
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Cuentos Vivos de Sophie API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/generate-story-part',
      'GET /api/ai-status',
      'GET /api/test-story',
      'GET /api/health'
    ]
  });
});

/**
 * Middleware para manejar rutas no encontradas en la API
 */
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.originalUrl} no existe en esta API`,
    availableEndpoints: [
      'POST /api/generate-story-part',
      'GET /api/ai-status',
      'GET /api/test-story',
      'GET /api/health'
    ]
  });
});

module.exports = router;

