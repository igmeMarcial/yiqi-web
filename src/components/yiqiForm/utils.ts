export function generateUniqueId(): string {
  // Genera un timestamp en milisegundos y un número aleatorio
  const timestamp = Date.now().toString(36) // Convierte el tiempo a base 36
  const randomNum = Math.random().toString(36).substring(2, 8) // Número aleatorio en base 36
  // Combina ambos para formar un ID único
  return `${timestamp}-${randomNum}`
}