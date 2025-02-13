'use server'

import prisma from '@/lib/prisma'
import { generateEmbedding } from './generateEmbedding'
import pgvector from 'pgvector'
import {
  createConversation,
  sendMessage
} from '@/lib/llm/messages-api/bedrockWrapper'
import { AWS_BEDROCK_MODELS } from '@/lib/llm/models'
import { z } from 'zod'

const parseSchema = z.array(
  z.object({
    type: z.any(),
    text: z.string().min(1)
  })
)

function parseSendMessageResult(result: unknown): string {
  const parsed = parseSchema.parse(result)
  return parsed[0].text
}

export async function processUserMatches(userId: string, eventId: string) {
  // Get user and event data

  const registration = await prisma.eventRegistration.findUniqueOrThrow({
    where: {
      eventId_userId: {
        eventId,
        userId
      }
    },
    include: {
      user: true,
      event: true,
      NetworkingMatch: true
    }
  })

  const [user, event] = [registration.user, registration.event]

  if (!user.userDetailedProfile || registration.NetworkingMatch.length > 0) {
    console.debug('user already has matches or profile not processed yet')
    return
  }

  // Create embedding search string
  const conversation = createConversation({
    model: AWS_BEDROCK_MODELS.CLAUDE_HAIKU_3_5,
    maxTokens: 1000,
    temperature: 0.5
  })

  const embeddingPrompt = `Crea una cadena de búsqueda combinando estos elementos:
- Mis principales habilidades: [Extraer del perfil]
- Enfoque del evento: ${event.description}
- Tipos de colaboración deseados: [Identificar de los objetivos profesionales]
- Palabras clave de la industria: [Extraer de la experiencia]

Combina estos en una cadena de búsqueda en lenguaje natural para encontrar profesionales con:
1. Experiencia complementaria en [Mi Industria]
2. Conocimiento en [Tecnologías Relevantes]
3. Interés en [Mis Tipos de Proyectos]

Perfil: ${user.userDetailedProfile}
Devuelve solo la cadena de búsqueda sin comentarios.`

  console.log('embeddingPrompt', embeddingPrompt)
  const searchString = parseSendMessageResult(
    await sendMessage(conversation, embeddingPrompt)
  )

  console.log('searchString', searchString)

  // Generate embedding for the search
  const rawEmbedding = await generateEmbedding(searchString)
  const embedding = pgvector.toSql(rawEmbedding)

  console.log('embedding done')

  const test = await prisma.eventRegistration.findMany({
    where: { eventId: eventId }
  })

  console.log(
    'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    test.map(v => v.userId)
  )
  const userWhitelist = test.filter(v => v.userId !== userId).map(v => v.userId)
  console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBb', userWhitelist)

  // Find top 3 matches
  const matches = await prisma.$queryRaw<Array<{ id: string }>>`
  SELECT u.id 
  FROM "User" u
  INNER JOIN "EventRegistration" er 
    ON u.id = er."userId"
    AND er."eventId" = ${eventId}
  WHERE u.id != ${userId}
    AND u.embedding IS NOT NULL
  ORDER BY u.embedding <=> ${embedding}::vector
  LIMIT 3
`

  console.log('matches done')

  if (matches.length === 0) {
    console.log('no matches found')
    return
  }

  // Process each match with LLM
  for (const match of matches) {
    console.log('match starting now')

    const existingMatch = await prisma.networkingMatch.findUnique({
      where: {
        userId_registrationId: {
          userId,
          registrationId: registration.id
        }
      }
    })

    if (existingMatch) {
      console.log('match already exists')
      continue
    }

    const matchUser = await prisma.user.findUniqueOrThrow({
      where: { id: match.id },
      select: { userDetailedProfile: true }
    })

    console.log('matchUser')

    const conversation = createConversation({
      model: AWS_BEDROCK_MODELS.CLAUDE_HAIKU_3_5,
      maxTokens: 500,
      temperature: 0.6
    })

    // Generate key insights
    const keyInsightsPrompt = `Analiza estos perfiles y destaca 3 factores clave de coincidencia. Enfócate en:
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

    Mi Perfil: ${user.userDetailedProfile}
    Perfil del Match: ${matchUser.userDetailedProfile}

    Mantén un tono profesional y utiliza términos técnicos adecuados.`
    await new Promise(resolve => setTimeout(resolve, 1000))

    const keyInsights = parseSendMessageResult(
      await sendMessage(conversation, keyInsightsPrompt)
    )

    console.log('keyInsights')

    // Generate collaboration reasons
    const collaborationPrompt = `Identifica oportunidades de colaboración entre estos profesionales. Considera:
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

    Mi Perfil: ${user.userDetailedProfile}
    Perfil del Match: ${matchUser.userDetailedProfile}

    Por favor mantén un formato claro y profesional.`
    await new Promise(resolve => setTimeout(resolve, 10000))

    const collaborationReason = parseSendMessageResult(
      await sendMessage(conversation, collaborationPrompt)
    )

    console.log('collaborationReason')

    try {
      // Create networking match
      await prisma.networkingMatch.create({
        data: {
          userId,
          eventId,
          registrationId: registration.id,
          personDescription: keyInsights,
          matchReason: collaborationReason
        }
      })
    } catch (error) {
      console.error('error creating networking match', error)
      continue
    }

    console.log('networking match created')

    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}
