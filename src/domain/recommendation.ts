export type ShippingOption = {
  providerName: string
  cost: number
  currency: string
  estimatedDays: number
}

export type Recommendation = {
  recommendation: ShippingOption
  alternatives: ShippingOption[]
  confirmationToken: string
}

export type OrderConfirmation = {
  id: string
  confirmationToken: string
  origin: { name: string; lat: number; lng: number }
  destination: { name: string; lat: number; lng: number }
  weight: number
  weightUnit: string
  priority: string
  distanceKm: number
  selectedOption: ShippingOption
}

export function isAttemptConfirmed(recommendation: Recommendation | null, orderConfirmation: OrderConfirmation | null): boolean {
  if (!recommendation || !orderConfirmation) {
    return false
  }

  return recommendation.confirmationToken === orderConfirmation.confirmationToken
}
