'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import pgvector from 'pgvector'
import { generateEmbedding } from '@/lib/data/processors/generateEmbedding'
import {
  createConversation,
  sendMessage
} from '@/lib/llm/messages-api/bedrockWrapper'
import { AWS_BEDROCK_MODELS } from '@/lib/llm/models'

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

// Get all users for an event
export async function getEventUsers(eventId: string) {
  const users = await prisma.user.findMany({
    where: {
      registeredEvents: {
        some: {
          eventId
        }
      },
      userDetailedProfile: {
        not: null
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      userDetailedProfile: true
    }
  })

  return users
}

// Generate embedding and find matches based on custom prompt
export async function simulateMatches({
  userId,
  eventId,
  customPrompt
}: {
  userId: string
  eventId: string
  customPrompt: string
}) {
  try {
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
        event: true
      }
    })

    const [user, event] = [registration.user, registration.event]

    if (!user.userDetailedProfile) {
      throw new Error('User detailed profile not available')
    }

    if (!event.description) {
      throw new Error('Event description is null')
    }

    // Create embedding search string
    const conversation = createConversation({
      model: AWS_BEDROCK_MODELS.CLAUDE_HAIKU_3_5,
      maxTokens: 1000,
      temperature: 0.1
    })

    // Use custom prompt or generate default prompt
    const embeddingPrompt =
      customPrompt ||
      `Crea una cadena de búsqueda combinando estos elementos:
        - Mis principales habilidades: [Extraer del perfil]
        - Enfoque del evento: ${event.description}
        - Tipos de colaboración deseados: [Identificar de los objetivos profesionales]
        - Palabras clave de la industria: [Extraer de la experiencia]
        
        Combina estos en una cadena de búsqueda en lenguaje natural para encontrar profesionales con:
        1. Experiencia complementaria en [Mi Industria]
        2. Conocimiento en [Tecnologías Relevantes]
        3. Interés en [Mis Tipos de Proyectos]
        
        Perfil: ${user.userDetailedProfile}
        Devuelve solo la cadena de búsqueda sin comentarios. responde en español.`

    const searchString = parseSendMessageResult(
      await sendMessage(conversation, embeddingPrompt)
    )

    // Generate embedding for the search
    const rawEmbedding = await generateEmbedding(searchString)
    const embedding = pgvector.toSql(rawEmbedding)

    // Find top matches
    const matchIds = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT u.id 
      FROM "User" u
      INNER JOIN "EventRegistration" er 
        ON u.id = er."userId"
        AND er."eventId" = ${eventId}
      WHERE u.id != ${userId}
        AND u.embedding IS NOT NULL
      ORDER BY u.embedding <=> ${embedding}::vector
      LIMIT 5
    `

    // Get the full match user data
    const matchUsers = await Promise.all(
      matchIds.map(async ({ id }) => {
        const matchUser = await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
            userDetailedProfile: true
          }
        })
        return matchUser
      })
    )

    return {
      searchString,
      matchUsers
    }
  } catch (error) {
    console.error('Error in simulateMatches:', error)
    throw error
  }
}
