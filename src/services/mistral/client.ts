import { Mistral } from '@mistralai/mistralai'

const apiKey = process.env.MISTRAL_API_KEY

if (!apiKey) {
  throw new Error('No mistral apikey was set')
}

const mistralClient = new Mistral({ apiKey: apiKey })

export default mistralClient
