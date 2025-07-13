// Controlador para manejar las operaciones relacionadas con la generación de historias
const AITextService = require('../services/aiTextService');
const AIImageService = require('../services/aiImageService');
const TTSServices = require('../services/ttsService');

class StoryController {
  constructor() {
    // Inicializar servicios de IA
    this.aiTextService = new AITextService();
    this.aiImageService = new AIImageService();
    this.ttsService = new TTSServices();
  }

  /**
   * Genera una nueva parte de la historia con imagen
   * Endpoint: POST /api/generate-story-part
   */
  async generateStoryPart(req, res) {
    try {
      console.log('📚 Iniciando generación de nueva parte de la historia...');
      
      // Extraer datos del cuerpo de la petición
      const { storyHistory = [], userChoices = {} } = req.body;

      // Validar que los datos recibidos sean correctos
      if (!Array.isArray(storyHistory)) {
        return res.status(400).json({
          error: 'Formato inválido',
          message: 'storyHistory debe ser un array'
        });
      }

      // Log para debugging (sin mostrar datos sensibles)
      console.log(`📖 Historial de historia: ${storyHistory.length} mensajes`);
      console.log(`🎯 Elecciones del usuario:`, userChoices);

      // Paso 1: Generar el texto de la historia usando IA
      console.log('🤖 Generando texto de la historia...');
      const storyPart = await this.aiTextService.generateStoryPart(storyHistory, userChoices);

      // Paso 2: Generar prompt para la imagen basado en el texto
      console.log('🎨 Creando prompt para imagen...');
      const imagePrompt = this.aiTextService.generateImagePrompt(storyPart);

      // Paso 3: Generar la imagen usando DALL-E
      console.log('🖼️ Generando imagen...');
      const imageUrl = await this.aiImageService.generateImage(imagePrompt);

      // Paso 4: Generar audio usando TTS si se solicita
      let audioBase64 = null;
      const withAudio = req.body.withAudio || process.env.ENABLE_TTS === 'true';
      if (withAudio) {
        console.log('🔊 Generando narración de audio...');
        audioBase64 = await this.ttsService.generateSpeech(storyPart);
      }

      // Paso 5: Preparar respuesta exitosa
      const response = {
        success: true,
        storyPart: storyPart,
        imageUrl: imageUrl,
        audioBase64,
        metadata: {
          timestamp: new Date().toISOString(),
          wordCount: storyPart.split(' ').length,
          hasImage: !!imageUrl
        }
      };

      console.log('✅ Historia generada exitosamente');
      
      // Enviar respuesta
      res.status(200).json(response);

    } catch (error) {
      console.error('❌ Error en generateStoryPart:', error);

      // Determinar el tipo de error y responder apropiadamente
      let statusCode = 500;
      let errorMessage = 'Error interno del servidor';

      if (error.message.includes('API')) {
        statusCode = 503;
        errorMessage = 'Servicio de IA temporalmente no disponible';
      } else if (error.message.includes('Cuota')) {
        statusCode = 429;
        errorMessage = 'Límite de uso de IA alcanzado';
      } else if (error.message.includes('Clave')) {
        statusCode = 401;
        errorMessage = 'Configuración de API incorrecta';
      }

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        message: 'No se pudo generar la historia en este momento',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Obtiene el estado del servicio de IA
   * Endpoint: GET /api/ai-status
   */
  async getAIStatus(req, res) {
    try {
      // Verificar que las claves de API estén configuradas
      const hasTextAPI = !!process.env.OPENAI_API_KEY;
      const hasImageAPI = !!(process.env.DALLE_API_KEY || process.env.OPENAI_API_KEY);

      const status = {
        textService: {
          available: hasTextAPI,
          model: process.env.OPENAI_MODEL || 'gpt-4'
        },
        imageService: {
          available: hasImageAPI,
          model: process.env.DALLE_MODEL || 'dall-e-3'
        },
        timestamp: new Date().toISOString()
      };

      res.status(200).json(status);

    } catch (error) {
      console.error('❌ Error al verificar estado de IA:', error);
      res.status(500).json({
        error: 'Error al verificar estado',
        message: 'No se pudo verificar el estado de los servicios de IA'
      });
    }
  }

  /**
   * Endpoint de prueba para verificar conectividad
   * Endpoint: GET /api/test-story
   */
  async testStory(req, res) {
    try {
      // Historia de prueba simple
      const testHistory = [
        {
          role: 'user',
          content: 'Comienza una historia sobre Sophie en un jardín mágico'
        }
      ];

      // Generar una historia de prueba
      const storyPart = await this.aiTextService.generateStoryPart(testHistory);
      
      res.status(200).json({
        success: true,
        message: 'Servicio de historias funcionando correctamente',
        testStory: storyPart,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Error en test de historia:', error);
      res.status(500).json({
        success: false,
        error: 'Error en test de historia',
        message: error.message
      });
    }
  }

  /**
   * Valida el formato de entrada para generar historia
   * @param {Object} body - Cuerpo de la petición
   * @returns {Object} - Resultado de validación
   */
  validateStoryRequest(body) {
    const errors = [];

    if (body.storyHistory && !Array.isArray(body.storyHistory)) {
      errors.push('storyHistory debe ser un array');
    }

    if (body.userChoices && typeof body.userChoices !== 'object') {
      errors.push('userChoices debe ser un objeto');
    }

    // Validar estructura de mensajes en el historial
    if (body.storyHistory) {
      body.storyHistory.forEach((message, index) => {
        if (!message.role || !message.content) {
          errors.push(`Mensaje ${index} debe tener 'role' y 'content'`);
        }
        if (!['user', 'assistant', 'system'].includes(message.role)) {
          errors.push(`Mensaje ${index} tiene un rol inválido: ${message.role}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

module.exports = StoryController;

