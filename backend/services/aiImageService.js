// Servicio para interactuar con la API de DALL-E para generación de imágenes
const OpenAI = require('openai');

class AIImageService {
  constructor() {
    // Inicializar cliente de OpenAI con la clave de API desde variables de entorno
    this.openai = new OpenAI({
      apiKey: process.env.DALLE_API_KEY || process.env.OPENAI_API_KEY,
    });
    
    // Modelo a utilizar (configurable desde variables de entorno)
    this.model = process.env.DALLE_MODEL || 'dall-e-3';
  }

  /**
   * Genera una imagen usando DALL-E basada en el prompt proporcionado
   * @param {string} prompt - Descripción de la imagen a generar
   * @returns {Promise<string>} - URL de la imagen generada
   */
  async generateImage(prompt) {
    try {
      console.log('🎨 Generando imagen con DALL-E...');

      // Mejorar el prompt para obtener mejores resultados
      const enhancedPrompt = this.enhancePromptForChildren(prompt);

      // Validar que el prompt sea apropiado para niños antes de enviarlo a OpenAI
      if (!this.validatePromptForChildren(enhancedPrompt)) {
        console.warn('⚠️ Prompt no apto para niños, usando imagen por defecto');
        return this.getDefaultImage();
      }

      // Realizar la llamada a DALL-E
      const response = await this.openai.images.generate({
        model: this.model,
        prompt: enhancedPrompt,
        n: 1, // Generar solo una imagen
        size: '1024x1024', // Tamaño estándar
        quality: 'standard', // Calidad estándar para reducir costos
        style: 'vivid' // Estilo vívido para cuentos infantiles
      });

      // Extraer la URL de la imagen generada
      const imageUrl = response.data[0].url;
      
      console.log('✅ Imagen generada exitosamente');
      return imageUrl;

    } catch (error) {
      console.error('❌ Error al generar imagen con DALL-E:', error);
      
      // Manejo específico de errores comunes
      if (error.code === 'insufficient_quota') {
        throw new Error('Cuota de API de DALL-E agotada. Por favor, verifica tu suscripción.');
      } else if (error.code === 'invalid_api_key') {
        throw new Error('Clave de API de DALL-E inválida. Verifica tu configuración.');
      } else if (error.code === 'rate_limit_exceeded') {
        throw new Error('Límite de velocidad excedido. Intenta de nuevo en unos momentos.');
      } else if (error.code === 'content_policy_violation') {
        // En caso de violación de políticas, usar imagen por defecto
        console.warn('⚠️ Contenido rechazado por políticas, usando imagen por defecto');
        return this.getDefaultImage();
      }
      
      // En caso de error, retornar imagen por defecto en lugar de fallar
      console.warn('⚠️ Error al generar imagen, usando imagen por defecto');
      return this.getDefaultImage();
    }
  }

  /**
   * Mejora el prompt para obtener imágenes más apropiadas para niños
   * @param {string} originalPrompt - Prompt original
   * @returns {string} - Prompt mejorado
   */
  enhancePromptForChildren(originalPrompt) {
    const childFriendlyEnhancements = [
      'children\'s book illustration',
      'colorful and magical',
      'friendly and warm atmosphere',
      'soft lighting',
      'whimsical style',
      'safe for children',
      'cartoon-like',
      'vibrant colors'
    ];

    // Combinar el prompt original con mejoras para niños
    const enhancedPrompt = `${originalPrompt}. ${childFriendlyEnhancements.join(', ')}.`;
    
    console.log('🔧 Prompt mejorado para niños');
    return enhancedPrompt;
  }

  /**
   * Retorna una URL de imagen por defecto en caso de error
   * @returns {string} - URL de imagen por defecto
   */
  getDefaultImage() {
    // URL de una imagen por defecto apropiada para cuentos infantiles
    // En un entorno de producción, esto debería ser una imagen alojada en tu servidor
    return 'https://via.placeholder.com/1024x1024/FFB6C1/FFFFFF?text=🌟+Cuento+Mágico+🌟';
  }

  /**
   * Valida que el prompt sea apropiado para niños
   * @param {string} prompt - Prompt a validar
   * @returns {boolean} - True si es apropiado, false si no
   */
  validatePromptForChildren(prompt) {
    // Lista de palabras o conceptos que no son apropiados para niños
    const inappropriateWords = [
      'scary', 'frightening', 'horror', 'violence', 'weapon',
      'miedo', 'terror', 'violencia', 'arma', 'peligroso'
    ];

    const lowerPrompt = prompt.toLowerCase();
    
    for (const word of inappropriateWords) {
      if (lowerPrompt.includes(word)) {
        console.warn(`⚠️ Prompt contiene contenido inapropiado: ${word}`);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Genera múltiples opciones de imagen (para uso futuro)
   * @param {string} prompt - Descripción de la imagen a generar
   * @param {number} count - Número de imágenes a generar (máximo 4)
   * @returns {Promise<Array<string>>} - Array de URLs de imágenes generadas
   */
  async generateMultipleImages(prompt, count = 2) {
    try {
      const enhancedPrompt = this.enhancePromptForChildren(prompt);

      // Validar que el prompt sea apropiado para niños
      if (!this.validatePromptForChildren(enhancedPrompt)) {
        console.warn('⚠️ Prompt no apto para niños, usando imagen por defecto');
        return [this.getDefaultImage()];
      }

      const response = await this.openai.images.generate({
        model: this.model,
        prompt: enhancedPrompt,
        n: Math.min(count, 4), // DALL-E 3 permite máximo 4 imágenes
        size: '1024x1024',
        quality: 'standard',
        style: 'vivid'
      });

      return response.data.map(image => image.url);

    } catch (error) {
      console.error('❌ Error al generar múltiples imágenes:', error);
      // Retornar array con imagen por defecto
      return [this.getDefaultImage()];
    }
  }
}

module.exports = AIImageService;

