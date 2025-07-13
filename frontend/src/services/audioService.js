export function playBase64Audio(base64) {
  const audio = new Audio(`data:audio/mp3;base64,${base64}`)
  audio.play()
}
