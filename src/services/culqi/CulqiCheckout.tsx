'use client'
import { useState, useEffect, useCallback } from 'react'
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
  const { config, onSuccess, onError } = props
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [chargeResponse, setChargeResponse] =
    useState<CulqiChargeResponse | null>(null)

  const processPayment = useCallback(
    async (token: string): Promise<void> => {
      try {
        const response = await fetch('/api/culqi/process-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token,
            amount: config.amount,
            currency: config.currency,
            email: config.customerEmail,
            description: config.description,
            metadata: config.metadata
          })
        })

        const result =
          (await response.json()) as ApiResponse<CulqiChargeResponse>

        if (response.ok && result.success && result.data) {
          setSuccess(true)
          setChargeResponse(result.data)
          if (onSuccess) onSuccess(result.data)
        } else {
          const errorMessage = result.error || 'El pago falló'
          setError(errorMessage)
          if (onError) onError(errorMessage)
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Ocurrió un error al procesar su pago'
        setError(errorMessage)
        if (onError) onError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [
      config.amount,
      config.currency,
      config.customerEmail,
      config.description,
      config.metadata,
      onError,
      onSuccess
    ]
  )

  useEffect(() => {
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
          const errorMessage = 'No se generó un token de pago'
          setError(errorMessage)
          if (onError) onError(errorMessage)
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
  }, [processPayment, onError])

  const handlePayment = useCallback(
    (e: React.FormEvent): void => {
      e.preventDefault()
      setIsLoading(true)
      setError(null)

      // Configure the transaction details
      const culqiOptions: CulqiOptions = {
        title: config.title,
        currency: config.currency,
        description: config.description,
        amount: config.amount,
        metadata: config.metadata
      }

      // Add order if available
      if (config.orderId) {
        culqiOptions.order = config.orderId
      }

      // Configure Culqi checkout
      window.culqijs.options(culqiOptions)

      // Open Culqi checkout
      window.culqijs.open()
    },
    [config]
  )

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {success ? (
        <div className="text-center py-4">
          <h3 className="text-green-700 text-xl font-bold mb-2">
            ¡Pago Exitoso!
          </h3>
          <p className="text-gray-700">Gracias por su compra.</p>
          {chargeResponse && (
            <div className="mt-4 text-sm text-gray-600">
              <p>Referencia: {chargeResponse.id}</p>
              <p>
                Monto: {(chargeResponse.amount / 100).toFixed(2)}{' '}
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
                  ? 'Procesando...'
                  : `Pagar ${config.currency} ${(config.amount / 100).toFixed(2)}`}
              </button>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Será redirigido al formulario de pago seguro de Culqi
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
