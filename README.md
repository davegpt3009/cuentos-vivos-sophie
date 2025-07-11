# 📚 Cuentos Vivos de Sophie

Una aplicación web interactiva que genera cuentos personalizados para Sophie usando inteligencia artificial.

## 🌟 Características

- Generación de cuentos interactivos con IA
- Imágenes generadas automáticamente para cada parte del cuento
- Interfaz amigable para niños
- Biblioteca personal de cuentos guardados
- Experiencia completamente personalizada

## 🛠️ Tecnologías

- **Backend**: Node.js + Express
- **Frontend**: React + Vite + Tailwind CSS
- **IA de Texto**: OpenAI GPT-4 / Google Gemini
- **IA de Imágenes**: DALL-E 3

## 📁 Estructura del Proyecto

```
.
├── backend/          # Servidor Node.js/Express
├── frontend/         # Aplicación React
└── README.md         # Este archivo
```

## 🚀 Instalación y Uso

### Backend

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Copia el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Edita el archivo `.env` con tus claves de API

5. Inicia el servidor:
   ```bash
   npm run dev
   ```

### Frontend

La interfaz se desarrolla con React, Vite y Tailwind CSS. Para ponerla en
funcionamiento sigue estos pasos:

1. Instala las dependencias:
   ```bash
   cd frontend
   npm install
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Esto abrirá la aplicación en `http://localhost:5173/`.

3. Para generar una versión lista para producción ejecuta:
   ```bash
   npm run build
   ```
4. Asegúrate de tener el backend en marcha con `npm run dev` dentro de la carpeta `backend`.

## 📝 Estado del Desarrollo

- ✅ Fase 1: Configuración del Backend
- ✅ Fase 2: Lógica de IA en el Backend (COMPLETADO)
- ✅ Fase 3: Configuración del Frontend (React + Tailwind)
- ✅ Fase 4: Conexión Frontend-Backend
- ✅ Fase 5: Biblioteca de Cuentos

## 🔧 API Endpoints

### POST /api/generate-story-part
Genera una nueva parte de la historia con imagen.

**Request Body:**
```json
{
  "storyHistory": [
    {"role": "assistant", "content": "Había una vez..."},
    {"role": "user", "content": "El personaje abrió la puerta."}
  ],
  "userChoices": { "hero": "Zorro", "place": "Bosque de Cristal" }
}
```

**Response:**
```json
{
  "success": true,
  "storyPart": "El zorro, al abrir la puerta, encontró un jardín secreto...",
  "imageUrl": "https://url.de.la.imagen.generada/...",
  "metadata": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "wordCount": 45,
    "hasImage": true
  }
}
```

### GET /api/ai-status
Verifica el estado de los servicios de IA.

### GET /api/test-story
Endpoint de prueba para verificar conectividad.

### GET /api/health
Estado de salud de la API.

## 👥 Equipo

Desarrollado con ❤️ para Sophie

