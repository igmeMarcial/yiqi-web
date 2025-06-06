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
import {
  generateCollaborationPrompt,
  generateEmbeddingPrompt,
  generateKeyInsightsPrompt,
  processUserMatchesSystemPrompt
} from './prompts'
import { luciaUserSchema } from '@/schemas/userSchema'

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

export async function processUserMatches(
  userId: string,
  eventId: string,
  reprocess?: boolean
) {
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

  if (reprocess) {
    await prisma.networkingMatch.deleteMany({
      where: {
        registrationId: registration.id
      }
    })
  }

  const user = luciaUserSchema.parse(registration.user)
  const event = registration.event

  if (!user.userDetailedProfile || registration.NetworkingMatch.length > 0) {
    console.debug('user already has matches or profile not processed yet')
    return
  }

  // Create embedding search string
  const conversation = createConversation({
    model: AWS_BEDROCK_MODELS.CLAUDE_HAIKU_3_5,
    maxTokens: 1000,
    temperature: 0.1
  })

  if (!event.description) {
    throw new Error('event.description is null')
  }

  const embeddingPrompt = generateEmbeddingPrompt({
    user,
    event
  })

  console.log('embeddingPrompt', embeddingPrompt)
  const searchString = parseSendMessageResult(
    await sendMessage(conversation, embeddingPrompt)
  )

  console.log('searchString', searchString)

  // Generate embedding for the search
  const rawEmbedding = await generateEmbedding(searchString)
  const embedding = pgvector.toSql(rawEmbedding)

  console.log('embedding done')

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

  await Promise.allSettled(
    matches.map(async match => {
      console.log('match starting now')

      if (!user.userDetailedProfile) {
        throw new Error('user.userDetailedProfile is null')
      }

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
      }

      const matchUserData = await prisma.user.findUniqueOrThrow({
        where: { id: match.id, userDetailedProfile: { not: null } }
      })

      const matchUser = luciaUserSchema.parse(matchUserData)

      console.log('matchUser')

      const conversation = createConversation({
        model: AWS_BEDROCK_MODELS.CLAUDE_HAIKU_3_5,
        maxTokens: 500,
        temperature: 0.1
      })

      if (!matchUser.userDetailedProfile) {
        throw new Error('matchUser.userDetailedProfile is null')
      }

      // Generate key insights
      const keyInsightsPrompt = generateKeyInsightsPrompt({
        user,
        matchUser
      })

      const keyInsights = parseSendMessageResult(
        await sendMessage(
          conversation,
          keyInsightsPrompt,
          processUserMatchesSystemPrompt
        )
      )

      const collaborationPrompt = generateCollaborationPrompt({
        user,
        matchUser
      })

      const collaborationReason = parseSendMessageResult(
        await sendMessage(
          conversation,
          collaborationPrompt,
          processUserMatchesSystemPrompt
        )
      )

      console.log('collaborationReason')

      try {
        // Create networking match
        await prisma.networkingMatch.create({
          data: {
            userId: matchUser.id,
            eventId,
            registrationId: registration.id,
            personDescription: keyInsights,
            matchReason: collaborationReason
          }
        })
      } catch (error) {
        console.error('error creating networking match', error)
      }

      console.log('networking match created')
    })
  )
}
