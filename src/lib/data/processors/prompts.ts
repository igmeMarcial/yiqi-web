export function generateKeyInsightsPrompt(
  userDetailedProfile: string,
  matchUserDetailedProfile: string
) {
  return `Analiza estos perfiles y destaca 3 factores clave de coincidencia. Enfócate en:
    1. Complementariedad de habilidades/experiencia
    2. Valores compartidos o intereses profesionales
    3. Áreas potenciales de sinergia

    Formato:
    - Factor Clave 1: [Título conciso] 
      • [Razón específica de los perfiles]
    - Factor Clave 2: [Título conciso]
      • [Razón específica de los perfiles] 
    - Factor Clave 3: [Título conciso]
      • [Razón específica de los perfiles]

    Mi Perfil: ${userDetailedProfile}
    Perfil del Match: ${matchUserDetailedProfile}

    Mantén un tono profesional y utiliza términos técnicos adecuados.`
}

export function generateCollaborationPrompt(
  userDetailedProfile: string,
  matchUserDetailedProfile: string
) {
  return `Identifica oportunidades de colaboración entre estos profesionales. Considera:
    - Tendencias de la industria que podrían abordar juntos
    - Potencial de intercambio de recursos/conocimiento
    - Fortalezas complementarias que creen nuevo valor

    Estructura la respuesta como:
    Potencial de Colaboración: [Resumen de 1 oración]
    Áreas de Oportunidad:
    1. [Área 1] - [Razón específica]
    2. [Área 2] - [Razón específica] 
    3. [Área 3] - [Razón específica]

    Próximos Pasos: [Sugerencias accionables para reunión]

    Mi Perfil: ${userDetailedProfile}
    Perfil del Match: ${matchUserDetailedProfile}

    Por favor mantén un formato claro y profesional.`
}

export function generateEmbeddingPrompt(
  eventDescription: string,
  userDetailedProfile: string
) {
  return `Crea una cadena de búsqueda combinando estos elementos:
- Mis principales habilidades: [Extraer del perfil]
- Enfoque del evento: ${eventDescription}
- Tipos de colaboración deseados: [Identificar de los objetivos profesionales]
- Palabras clave de la industria: [Extraer de la experiencia]

Combina estos en una cadena de búsqueda en lenguaje natural para encontrar profesionales con:
1. Experiencia complementaria en [Mi Industria]
2. Conocimiento en [Tecnologías Relevantes]
3. Interés en [Mis Tipos de Proyectos]

Perfil: ${userDetailedProfile}
Devuelve solo la cadena de búsqueda sin comentarios.`
}
