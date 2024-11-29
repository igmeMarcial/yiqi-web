import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// Ensure fetch is available in Node.js
import 'node-fetch'

/**
 * Lambda handler function
 * @param event APIGatewayProxyEvent
 * @returns APIGatewayProxyResult
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Get the target URL from the environment variable
  const targetUrl = process.env.MAIL_RECEIVER_URL

  if (!targetUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'MAIL_RECEIVER_URL is not defined in the environment.'
      })
    }
  }

  try {
    // Forward the request using fetch
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: event.headers as Record<string, string>,
      body: event.body
    })

    // Extract the response from the target server
    const responseBody = await response.text()

    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Request successfully proxied.',
        forwardedTo: targetUrl,
        response: responseBody
      })
    }
  } catch (error) {
    console.error('Error forwarding request:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'An error occurred while forwarding the request.',
        details: error instanceof Error ? error.message : String(error)
      })
    }
  }
}
