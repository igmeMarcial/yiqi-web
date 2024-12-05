'use server'

import client from '@/lib/llm/openAI'

const EMBEDDING_MODEL = 'text-embedding-3-large'

export async function generateEmbedding(raw: string) {
  // OpenAI recommends replacing newlines with spaces for best results
  const input = raw.replace(/\n/g, ' ')
  const embeddingData = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input
  })

  const [{ embedding }] = embeddingData.data
  return embedding
}
