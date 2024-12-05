import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' // for the next guy here please mantain it to 2024-11-20.acacia if not it gives built errors
})
