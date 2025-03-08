import { CULQI_PRIVATE_KEY } from '@/services/culqi/culqienv'
import {
  ApiResponse,
  CulqiChargeResponse,
  CulqiErrorResponse
} from '@/services/culqi/types'
import { NextResponse } from 'next/server'

// Define the request body type
interface PaymentRequestBody {
  token: string
  amount: number
  currency: string
  email: string
  description: string
  metadata?: Record<string, string>
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Parse and validate the request body
    const body = (await request.json()) as PaymentRequestBody
    const { token, amount, currency, email, description, metadata } = body

    // Validate the required fields
    if (!token || !amount || !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields'
        } as ApiResponse<never>,
        { status: 400 }
      )
    }

    // Create the request to Culqi API
    const requestBody = JSON.stringify({
      amount: amount,
      currency_code: currency || 'PEN',
      email: email,
      source_id: token,
      description: description || 'Purchase',
      metadata: metadata
    })

    // Make a request to Culqi API to create a charge using fetch instead of axios
    const culqiResponse = await fetch('https://api.culqi.com/v2/charges', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CULQI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: requestBody
    })

    // Parse the response
    const responseData = await culqiResponse.json()

    // Check if the response was successful
    if (culqiResponse.ok) {
      // Return the successful charge response
      return NextResponse.json({
        success: true,
        data: responseData as CulqiChargeResponse
      } as ApiResponse<CulqiChargeResponse>)
    } else {
      // Handle Culqi error response
      const culqiError = responseData as CulqiErrorResponse
      const errorMessage =
        culqiError?.user_message ||
        culqiError?.merchant_message ||
        'An error occurred while processing your payment'

      return NextResponse.json(
        {
          success: false,
          error: errorMessage
        } as ApiResponse<never>,
        { status: culqiResponse.status }
      )
    }
  } catch (error) {
    // Handle generic errors
    console.error('Payment processing error:', error)

    let errorMessage = 'An unexpected error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      } as ApiResponse<never>,
      { status: 500 }
    )
  }
}
