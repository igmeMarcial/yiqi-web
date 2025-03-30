export interface CulqiProduct {
  id: string
  name: string
  description: string
  price: number
  currency: string
  imageUrl?: string
}

// Shopping cart item
export interface CartItem {
  product: CulqiProduct
  quantity: number
}

// Order data to send to Culqi
export interface OrderData {
  amount: number
  currencyCode: string
  description: string
  email: string
  metadata?: Record<string, string>
}

// Culqi specific interfaces
export interface CulqiOptions {
  title: string
  currency: string
  description: string
  amount: number
  order?: string
  metadata?: Record<string, string>
}

export interface CulqiCheckoutConfig {
  title: string
  currency: string // e.g., 'PEN', 'USD'
  description: string
  amount: number // in cents
  orderId?: string
  customerEmail: string
  metadata?: Record<string, string>
}

// Culqi token response interface
export interface CulqiTokenResponse {
  object: string
  id: string
  type: string
  email: string
  creation_date: number
  card_number: string
  last_four: string
  active: boolean
  iin: {
    object: string
    bin: string
    card_brand: string
    card_type: string
    card_category: string
    issuer: {
      name: string
      country: string
      country_code: string
      website: string | null
      phone_number: string | null
    }
    installments_allowed: number[]
  }
  client: {
    ip: string
    ip_country: string
    ip_country_code: string
    browser: string
    device_fingerprint: string | null
    device_type: string | null
  }
  metadata?: Record<string, string>
}

// Culqi charge response interface
export interface CulqiChargeResponse {
  object: string
  id: string
  creation_date: number
  amount: number
  amount_refunded: number
  current_amount: number
  installments: number
  installments_amount?: number
  currency_code: string
  email: string
  description: string
  source: {
    object: string
    id: string
    type: string
    creation_date: number
    card_number: string
    last_four: string
    active: boolean
    iin: {
      object: string
      bin: string
      card_brand: string
      card_type: string
      card_category: string
      issuer: {
        name: string
        country: string
        country_code: string
        website: string | null
        phone_number: string | null
      }
      installments_allowed: number[]
    }
  }
  outcome?: {
    type: string
    code: string
    merchant_message: string
    user_message: string
  }
  fraud_score?: number
  antifraud_details: {
    first_name: string | null
    last_name: string | null
    address: string | null
    address_city: string | null
    country_code: string | null
    phone: string | null
    object: string
  }
  transfer_amount?: number
  transfer_id?: string
  capture: boolean
  captured: boolean
  reference_code: string | null
  authorization_code: string | null
  metadata?: Record<string, string>
}

// Response types for API calls
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Culqi API error response
export interface CulqiErrorResponse {
  object: string
  type: string
  merchant_message: string
  user_message: string
  param: string
}

// Global window with Culqi
declare global {
  interface Window {
    culqijs: {
      publicKey: string
      options: (options: CulqiOptions) => void
      open: () => void
    }
    culqi: () => void
  }
}
