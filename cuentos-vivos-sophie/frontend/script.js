const storyDiv = document.getElementById('story');
const storyImage = document.getElementById('storyImage');
const button = document.getElementById('nextBtn');

button.addEventListener('click', async () => {
  storyDiv.textContent = 'Generando historia...';
  storyImage.classList.add('hidden');
  try {
    const res = await fetch('/api/test-story');
    const data = await res.json();
    if (data.success) {
      storyDiv.textContent = data.testStory;
      storyImage.src = 'https://via.placeholder.com/256x256/FFB6C1/FFFFFF?text=Sophie';
      storyImage.classList.remove('hidden');
    } else {
      storyDiv.textContent = data.message || 'No se pudo generar la historia';
    }
  } catch (err) {
    storyDiv.textContent = 'Error al conectar con el servidor';
  }
});
