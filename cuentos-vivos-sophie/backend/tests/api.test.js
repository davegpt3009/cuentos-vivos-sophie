const request = require('supertest');

// Definir una clave de API ficticia para evitar errores al cargar servicios
process.env.OPENAI_API_KEY = 'test-key';

// Mock AITextService usado dentro de StoryController
const mockGenerateStoryPart = jest.fn();

jest.mock('../services/aiTextService', () => {
  return jest.fn().mockImplementation(() => {
    return {
      generateStoryPart: mockGenerateStoryPart,
      generateImagePrompt: jest.fn(),
    };
  });
});

const app = require('../index');

describe('GET /api/test-story', () => {
  beforeEach(() => {
    mockGenerateStoryPart.mockReset();
  });

  test('successful call returns test story', async () => {
    mockGenerateStoryPart.mockResolvedValue('Historia de prueba');

    const res = await request(app).get('/api/test-story');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.testStory).toBe('Historia de prueba');
  });

  test('handles error when OpenAI API is unreachable', async () => {
    mockGenerateStoryPart.mockRejectedValue(new Error('network error'));

    const res = await request(app).get('/api/test-story');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});
