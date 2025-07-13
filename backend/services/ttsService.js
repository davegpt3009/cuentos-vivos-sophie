const OpenAI = require('openai');

class TTSServices {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.TTS_MODEL || 'tts-1';
    this.voice = process.env.TTS_VOICE || 'alloy';
  }

  async generateSpeech(text) {
    try {
      const response = await this.openai.audio.speech.create({
        model: this.model,
        voice: this.voice,
        input: text,
      });
      const buffer = Buffer.from(await response.arrayBuffer());
      return buffer.toString('base64');
    } catch (error) {
      console.error('❌ Error al generar audio con OpenAI:', error);
      throw new Error('Error al generar audio');
    }
  }
}

module.exports = TTSServices;
