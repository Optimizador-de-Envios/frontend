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
