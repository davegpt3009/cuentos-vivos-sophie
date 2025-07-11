// Servicio para interactuar con la API de OpenAI para generación de texto
const OpenAI = require('openai');

class AITextService {
  constructor() {
    // Inicializar cliente de OpenAI con la clave de API desde variables de entorno
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Modelo a utilizar (configurable desde variables de entorno)
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
  }

  /**
   * Genera el prompt del sistema para la IA
   * Este prompt es crucial para que la IA actúe como cuentacuentos para Sophie
   */
  generateSystemPrompt() {
    return `Eres un cuentacuentos mágico especializado en crear historias interactivas para una niña llamada Sophie. 

INSTRUCCIONES IMPORTANTES:
- Crea cuentos apropiados para niños, con un tono positivo, mágico y educativo
- Siempre mantén un lenguaje sencillo pero rico en imaginación
- Cada respuesta debe continuar la historia de manera creativa y coherente
- SIEMPRE termina tu respuesta con una pregunta para Sophie que incluya 2-3 opciones claras
- Las opciones deben estar claramente marcadas (ejemplo: "¿Qué debería hacer Sophie? A) Explorar el jardín secreto B) Seguir el camino principal C) Hablar con el animal mágico")
- Mantén la magia y el misterio en cada parte de la historia
- Incluye elementos educativos sutiles (valores, emociones, resolución de problemas)
- Evita contenido que pueda asustar o ser inapropiado para niños
- Haz que Sophie sea la protagonista de sus propias aventuras

ESTILO:
- Usa descripciones vívidas pero no demasiado largas
- Incluye elementos sensoriales (sonidos, colores, texturas)
- Crea personajes entrañables y situaciones emocionantes
- Mantén un ritmo dinámico en la narración`;
  }

  /**
   * Genera una parte de la historia usando OpenAI
   * @param {Array} storyHistory - Historial de la conversación
   * @param {Object} userChoices - Elecciones del usuario (opcional)
   * @returns {Promise<string>} - Parte generada de la historia
   */
  async generateStoryPart(storyHistory = [], userChoices = {}) {
    try {
      // Construir el array de mensajes para OpenAI
      const messages = [
        {
          role: 'system',
          content: this.generateSystemPrompt()
        }
      ];

      // Añadir contexto de las elecciones del usuario si existen
      if (Object.keys(userChoices).length > 0) {
        messages.push({
          role: 'system',
          content: `Contexto adicional para la historia: ${JSON.stringify(userChoices)}`
        });
      }

      // Añadir el historial de la conversación
      messages.push(...storyHistory);

      // Realizar la llamada a OpenAI
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: messages,
        max_tokens: 500,
        temperature: 0.8, // Un poco de creatividad
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      // Extraer y retornar el contenido generado
      const generatedText = completion.choices[0].message.content.trim();
      
      console.log('✨ Historia generada exitosamente');
      return generatedText;

    } catch (error) {
      console.error('❌ Error al generar historia con OpenAI:', error);
      
      // Manejo específico de errores comunes
      if (error.code === 'insufficient_quota') {
        throw new Error('Cuota de API de OpenAI agotada. Por favor, verifica tu suscripción.');
      } else if (error.code === 'invalid_api_key') {
        throw new Error('Clave de API de OpenAI inválida. Verifica tu configuración.');
      } else if (error.code === 'rate_limit_exceeded') {
        throw new Error('Límite de velocidad excedido. Intenta de nuevo en unos momentos.');
      }
      
      throw new Error(`Error al generar historia: ${error.message}`);
    }
  }

  /**
   * Genera un prompt descriptivo para la generación de imágenes
   * @param {string} storyPart - Parte de la historia generada
   * @returns {string} - Prompt para generación de imagen
   */
  generateImagePrompt(storyPart) {
    // Extraer elementos clave de la historia para crear un prompt visual
    const imagePrompt = `Ilustración mágica y colorida para un cuento infantil. Estilo de libro de cuentos, colores vibrantes y cálidos, apropiado para niños. Basado en: "${storyPart.substring(0, 200)}...". Arte digital, estilo fantástico, iluminación suave, perspectiva amigable para niños.`;
    
    console.log('🎨 Prompt de imagen generado');
    return imagePrompt;
  }
}

module.exports = AITextService;

