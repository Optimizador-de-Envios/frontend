export type Location = {
  name: string
  lat: number
  lng: number
}

export type Order = {
  origin?: Location
  destination?: Location
  weight?: number
}

export type ValidationResult = {
  valid: boolean
  errors: string[]
}

export function validateOrder(order: Order): ValidationResult {
  // Stub implementation: not yet implemented, returns failing result
  return { valid: false, errors: ['validateOrder: not implemented'] }
}

export default validateOrder
