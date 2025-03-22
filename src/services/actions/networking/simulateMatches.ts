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
import {
  EMBEDDING_TEMPLATE,
  processUserMatchesSystemPrompt
} from '@/lib/data/processors/prompts'
import Mustache from 'mustache'
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
    }
  })

  return users.map(user => luciaUserSchema.parse(user))
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

    const user = luciaUserSchema.parse(registration.user)
    const event = registration.event

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

    // Process the prompt with Mustache
    const promptTemplate = customPrompt || EMBEDDING_TEMPLATE
    const processedPrompt = Mustache.render(promptTemplate, { user, event })

    const searchString = parseSendMessageResult(
      await sendMessage(conversation, processedPrompt)
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
          where: { id }
        })
        return matchUser ? luciaUserSchema.parse(matchUser) : null
      })
    )

    return {
      searchString,
      processedPrompt,
      matchUsers
    }
  } catch (error) {
    console.error('Error in simulateMatches:', error)
    throw error
  }
}

// Test prompt generation for a specific match
export async function testPromptGeneration({
  userId,
  matchId,
  prompts
}: {
  userId: string
  matchId: string
  prompts: Array<{
    id: string
    label: string
    prompt: string
  }>
}) {
  try {
    // Get user and match data
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    const matchUser = await prisma.user.findUnique({
      where: { id: matchId }
    })

    if (!user || !matchUser) {
      throw new Error('User or match user not found')
    }

    const parsedUser = luciaUserSchema.parse(user)
    const parsedMatchUser = luciaUserSchema.parse(matchUser)

    if (
      !parsedUser.userDetailedProfile ||
      !parsedMatchUser.userDetailedProfile
    ) {
      throw new Error('User or match user detailed profile not available')
    }

    // Create conversation for LLM
    const conversation = createConversation({
      model: AWS_BEDROCK_MODELS.CLAUDE_HAIKU_3_5,
      maxTokens: 1000,
      temperature: 0.1
    })

    // Process each prompt
    const results = await Promise.all(
      prompts.map(async ({ id, label, prompt }) => {
        // Use Mustache to render the template
        const processedPrompt = Mustache.render(prompt, {
          user: parsedUser,
          matchUser: parsedMatchUser
        })

        // Send to LLM
        const response = parseSendMessageResult(
          await sendMessage(
            conversation,
            processedPrompt,
            processUserMatchesSystemPrompt
          )
        )

        return {
          id,
          label,
          processedPrompt,
          output: response
        }
      })
    )

    return results
  } catch (error) {
    console.error('Error in testPromptGeneration:', error)
    throw error
  }
}
