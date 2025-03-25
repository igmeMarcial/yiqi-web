import Mustache from 'mustache'
import { LuciaUserType } from '@/schemas/userSchema'

// Define the templates using Mustache syntax
export const EMBEDDING_TEMPLATE = `
Analiza el perfil del usuario tomando en cuenta los siguientes puntos:
1. Descripción General: Resumen del perfil de {{user.userDetailedProfile}}.
2. Nivel de Estudios: Información sobre su formación académica, universidad, instituto, centro de estudios, año de egresado o termino de estudios.
3. Oportunidades de Conexión: Posibles áreas de colaboración.
4. Emprendimiento Indica si es fundador de un emprendimiento.
5. Razón para Conectar:Argumentos claros de por qué deberíamos hablar con esta persona.
6. Habilidades Técnicas y Blandas:Enumera y describe sus competencias.
7. Proximos Pasos de Colaboración:Sugerencias de acciones futuras.
8. Puntos de Sirgia: Conexiones entre su experiencia y nuestros objetivos.

Utiliza los datos disponibles y las variables: {{user.userDetailedProfile}}, {{user.dataCollected.shortDescription}}, {{user.dataCollected.position}}, y otros relevantes.
Devuelve solo la cadena de búsqueda sin comentarios. responde en español.


Combina estos en una cadena de búsqueda en lenguaje natural para encontrar profesionales con:
1. Experiencia complementaria en [Mi Industria]
2. Conocimiento en [Tecnologías Relevantes]
3. Interés en [Mis Tipos de Proyectos]
4. Estudios o capacitación en [Tecnologías Relevantes]

Perfil: {{user.userDetailedProfile}}
Devuelve solo la cadena de búsqueda sin comentarios. responde en español en primera persona entendible.

`

export const KEY_INSIGHTS_TEMPLATE = `
Analiza estos perfiles y destaca los factores clave de conexión profesional. Enfócate en:
- Habilidades complementarias que resuelven necesidades inmediatas
- Proyectos actuales/recientes donde podrían colaborar
- Conexiones estratégicas relevantes para sus objetivos actuales
- Experiencias laborales pasadas para tener claro su experiencia practica.
- Que estudiaron o educación que recibieron que sea complementario.
- Si fue fundador de un proyecto, startup anteriormente.


Formato:
Sinergia Principal: [Título de 5 palabras que capture la esencia]
   Top Match Drivers:
   • [Habilidad/Experiencia específica del match] → [Cómo resuelve necesidad del usuario]
   • [Experiencia laboral] → [Potencial impacto en conocer las experiencias practicas  actuales]
   • [Recurso único del match] → [Aplicación práctica en proyectos del usuario]
   • [Conexión estratégica] → [Potencial impacto en objetivos actuales]
  • [Educación] → [Potencial impacto de lo estudiado por ambas partes para los objetivos actuales de cada uno]

   Mi Perfil: {{user.userDetailedProfile}}
   Perfil del Match: {{matchUser.userDetailedProfile}}

Mantén un tono directo y orientado a la acción como coach, máximo 180 palabras. Evita listas numeradas. responde en español.
Todos las repuestas sean como en primera persona, que  nosotros como plataforma le este recomendando.

Todo en español entendible.


`

export const COLLABORATION_TEMPLATE = `
  Identifica oportunidades concretas de colaboración inmediata basadas en:
    - Proyectos activos mencionados en ambos perfiles
    - Habilidades técnicas complementarias
    - Recursos/contactos estratégicos compartidos

    Estructura:
    Oportunidad destacada: [Título de 3-7 palabras]
    • Specific Fit: [Habilidad/recurso del match que cubre necesidad específica del usuario]
    • Valor inmediato: [Resultado tangible en los próximos 3-6 meses]
    • Ventaja estrategica: [Ventaja competitiva que esta colaboración crea]

    
  Colaboración de siguiente paso:
    - [Acción específica con entregable claro]
    - [Formato ideal de primera interacción]
    - [Métrica de éxito inicial]

    Mi Perfil: {{user.userDetailedProfile}}
    Perfil del Match: {{matchUser.userDetailedProfile}}

  Enfócate en resultados accionables, recomendaciones de conexion inteligentes, máximo 180 palabras. Con marcadores numéricos. responde en español. 

  Todos las repuestas sean como en primera persona, que  nosotros como plataforma le este recomendando.

  Todo en español.
`

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

export const processUserMatchesSystemPrompt = `
Eres un community manager en Latinoamérica, encargado de ser el conector definitivo. Experiencia en innovación, tecnología, desarrollo de negocios, aceleración, venture capital en startups, mentor de diferentes startups de diferentes rubros. 
Tu misión es simple: utilizar la información proporcionada para crear perfiles de coincidencias
que ayuden a los miembros a entender a quién deben conocer y por qué. Se te entregarán detalles
de coincidencias calculadas, y con base en ellos, deberás elaborar perfiles claros y atractivos
que fomenten conexiones significativas entre los miembros. Recuerda que todas tus respuestas deben estar en español.  Efocalo en innovacion, tecnología e emprendimiento.
Que tenga un enfoque de encontrar un nuevo socio, posible colaboración hacer sinergias.
El objetivo es mencionarle lo importante para que conecten entre los dos perfiles y que objetivos tiene cada uno para poder conectar y hacer sinergias, conexiones.

Todos las repuestas sean como en primera persona, que  nosotros como Yiqi le recomendamos.
Utiliza emojis para diferenciar cada titulo, subtitulo


`
