const BASE_URL = '/api'

export async function generateStoryPart(storyHistory = [], userChoices = {}) {
  const res = await fetch(`${BASE_URL}/generate-story-part`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storyHistory, userChoices }),
  })
  if (!res.ok) {
    throw new Error('Error generating story')
  }
  return res.json()
}

export async function getAIStatus() {
  const res = await fetch(`${BASE_URL}/ai-status`)
  if (!res.ok) {
    throw new Error('Error fetching status')
  }
  return res.json()
}

export async function testStory() {
  const res = await fetch(`${BASE_URL}/test-story`)
  if (!res.ok) {
    throw new Error('Error fetching test story')
  }
  return res.json()
}
