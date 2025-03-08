'use client'
import { useState, useEffect } from 'react'
import {
  CulqiCheckoutConfig,
  CulqiOptions,
  ApiResponse,
  CulqiChargeResponse
} from './types'
import { NEXT_PUBLIC_CULQI_KEY } from './culqienv'

interface CulqiCheckoutProps {
  config: CulqiCheckoutConfig
  onSuccess?: (response: CulqiChargeResponse) => void
  onError?: (error: string) => void
}

export default function CulqiCheckout(props: CulqiCheckoutProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [chargeResponse, setChargeResponse] =
    useState<CulqiChargeResponse | null>(null)

  useEffect(
    function () {
      // Load Culqi JS library dynamically
      const script = document.createElement('script')
      script.src = 'https://js.culqi.com/checkout-js'
      script.async = true

      function handleScriptLoad() {
        // Initialize Culqi with your public key
        window.culqijs.publicKey = NEXT_PUBLIC_CULQI_KEY

        // Define the global culqi function that will be called after token creation
        window.culqi = function () {
          const token = localStorage.getItem('culqi_token')
          if (token) {
            processPayment(token)
          } else {
            const errorMessage = 'No payment token was generated'
            setError(errorMessage)
            if (props.onError) props.onError(errorMessage)
            setIsLoading(false)
          }
        }
      }

      script.addEventListener('load', handleScriptLoad)
      document.body.appendChild(script)

      return function () {
        script.removeEventListener('load', handleScriptLoad)

        // Try to remove the script if it exists
        const existingScript = document.querySelector(
          'script[src="https://js.culqi.com/checkout-js"]'
        )
        if (existingScript && existingScript.parentNode) {
          existingScript.parentNode.removeChild(existingScript)
        }

        // Clean up the global culqi function
        if (window.culqi) {
          window.culqi = function () {}
        }
      }
    },
    [props.onError]
  )

  function handlePayment(e: React.FormEvent): void {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Configure the transaction details
    const culqiOptions: CulqiOptions = {
      title: props.config.title,
      currency: props.config.currency,
      description: props.config.description,
      amount: props.config.amount,
      metadata: props.config.metadata
    }

    // Add order if available
    if (props.config.orderId) {
      culqiOptions.order = props.config.orderId
    }

    // Configure Culqi checkout
    window.culqijs.options(culqiOptions)

    // Open Culqi checkout
    window.culqijs.open()
  }

  async function processPayment(token: string): Promise<void> {
    try {
      const response = await fetch('/api/culqi/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          amount: props.config.amount,
          currency: props.config.currency,
          email: props.config.customerEmail,
          description: props.config.description,
          metadata: props.config.metadata
        })
      })

      const result = (await response.json()) as ApiResponse<CulqiChargeResponse>

      if (response.ok && result.success && result.data) {
        setSuccess(true)
        setChargeResponse(result.data)
        if (props.onSuccess) props.onSuccess(result.data)
      } else {
        const errorMessage = result.error || 'Payment failed'
        setError(errorMessage)
        if (props.onError) props.onError(errorMessage)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An error occurred while processing your payment'
      setError(errorMessage)
      if (props.onError) props.onError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {success ? (
        <div className="text-center py-4">
          <h3 className="text-green-700 text-xl font-bold mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-700">Thank you for your purchase.</p>
          {chargeResponse && (
            <div className="mt-4 text-sm text-gray-600">
              <p>Reference: {chargeResponse.id}</p>
              <p>
                Amount: {(chargeResponse.amount / 100).toFixed(2)}{' '}
                {chargeResponse.currency_code}
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          <form onSubmit={handlePayment}>
            <div className="mb-4">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Processing...'
                  : `Pay ${props.config.currency} ${(props.config.amount / 100).toFixed(2)}`}
              </button>
              <p className="mt-2 text-sm text-gray-600 text-center">
                You'll be redirected to Culqi's secure payment form
              </p>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  )
}
