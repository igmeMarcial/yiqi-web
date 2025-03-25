import Mustache from 'mustache'
import { LuciaUserType } from '@/schemas/userSchema'

// Define the templates using Mustache syntax
export const EMBEDDING_TEMPLATE = `
Crea una cadena de búsqueda combinando estos elementos:
- Mis principales habilidades: [Extraer del perfil]
- Enfoque del evento: {{event.description}}
- Tipos de colaboración deseados: [Identificar de los objetivos profesionales]
- Palabras clave de la industria: [Extraer de la experiencia]

Combina estos en una cadena de búsqueda en lenguaje natural para encontrar profesionales con:
1. Experiencia complementaria en [Mi Industria]
2. Conocimiento en [Tecnologías Relevantes]
3. Interés en [Mis Tipos de Proyectos]

Perfil: {{user.userDetailedProfile}}
Devuelve solo la cadena de búsqueda sin comentarios. responde en español.`

export const KEY_INSIGHTS_TEMPLATE = `Analiza estos perfiles y destaca los factores clave de conexión profesional. Enfócate en:
    - Habilidades complementarias que resuelven necesidades inmediatas
    - Proyectos actuales/recientes donde podrían colaborar
    - Conexiones estratégicas relevantes para sus objetivos actuales

    Formato:
    Core Synergy: [Título de 5 palabras que capture la esencia]
    Top Match Drivers:
    • [Habilidad/Experiencia específica del match] → [Cómo resuelve necesidad del usuario]
    • [Recurso único del match] → [Aplicación práctica en proyectos del usuario]
    • [Conexión estratégica] → [Potencial impacto en objetivos actuales]

    Mi Perfil: {{user.userDetailedProfile}}
    Perfil del Match: {{matchUser.userDetailedProfile}}

    Mantén un tono directo y orientado a la acción, máximo 150 palabras. Evita listas numeradas. responde en español.`

export const COLLABORATION_TEMPLATE = `Identifica oportunidades concretas de colaboración inmediata basadas en:
    - Proyectos activos mencionados en ambos perfiles
    - Habilidades técnicas complementarias
    - Recursos/contactos estratégicos compartidos

    Estructura:
    Opportunity Spotlight: [Título de 3-5 palabras]
    • Specific Fit: [Habilidad/recurso del match que cubre necesidad específica del usuario]
    • Immediate Value: [Resultado tangible en los próximos 3-6 meses]
    • Strategic Edge: [Ventaja competitiva que esta colaboración crea]

    Next-Step Collaboration:
    - [Acción específica con entregable claro]
    - [Formato ideal de primera interacción]
    - [Métrica de éxito inicial]

    Mi Perfil: {{user.userDetailedProfile}}
    Perfil del Match: {{matchUser.userDetailedProfile}}

    Enfócate en resultados accionables, máximo 120 palabras. Sin marcadores numéricos. responde en español.`

type TemplateData = {
  user: LuciaUserType
  matchUser?: LuciaUserType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event?: any // Using any to handle complex Event type which has many properties
}

// Render the embedding prompt with Mustache
export function generateEmbeddingPrompt(data: TemplateData): string {
  return Mustache.render(EMBEDDING_TEMPLATE, data)
}

// Render the key insights prompt with Mustache
export function generateKeyInsightsPrompt(data: TemplateData): string {
  if (!data.matchUser) {
    throw new Error('Match user data is required for key insights prompt')
  }
  return Mustache.render(KEY_INSIGHTS_TEMPLATE, data)
}

// Render the collaboration prompt with Mustache
export function generateCollaborationPrompt(data: TemplateData): string {
  if (!data.matchUser) {
    throw new Error('Match user data is required for collaboration prompt')
  }
  return Mustache.render(COLLABORATION_TEMPLATE, data)
}

// System prompts - these don't need templating as they're fixed strings
export const processUserFirstPartyDataSystemPrompt = `Eres un gestor de comunidad en latinoamerica, encargado de crear un entendimiento profundo de tu red profesional 
    para mejorar la calidad de las conexiones para tu comunidad. Se te proporcionarán datos de 
    LinkedIn de un usuario y tu tarea es generar un perfil detallado que pueda ayudar a 
    emparejarlo con potenciales cofundadores u oportunidades de networking alineadas con sus objetivos e intereses. 
    El perfil debe ser en español. `

export const processUserMatchesSystemPrompt = `Eres un community manager en Latinoamérica, encargado de ser el conector definitivo. 
Tu misión es simple: utilizar la información proporcionada para crear perfiles de coincidencias 
que ayuden a los miembros a entender a quién deben conocer y por qué. Se te entregarán detalles 
de coincidencias calculadas, y con base en ellos, deberás elaborar perfiles claros y atractivos 
que fomenten conexiones significativas entre los miembros. Recuerda que todas tus respuestas deben estar en español. `
