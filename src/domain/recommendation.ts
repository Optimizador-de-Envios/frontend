export type ShippingOption = {
  providerName: string
  cost: number
  currency: string
  estimatedDays: number
}

export type Recommendation = {
  recommendation: ShippingOption
  alternatives: ShippingOption[]
}

export type OrderConfirmation = {
  id: string
  origin: { name: string; lat: number; lng: number }
  destination: { name: string; lat: number; lng: number }
  weight: number
  weightUnit: string
  priority: string
  distanceKm: number
  selectedOption: ShippingOption
}
