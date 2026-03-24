export type Location = {
  name: string
  lat: number
  lng: number
}

export const WEIGHT_UNIT = {
  GRAMS: 'GRAMS',
  KILOGRAMS: 'KILOGRAMS',
  POUNDS: 'POUNDS',
} as const

export type WeightUnit = keyof typeof WEIGHT_UNIT

export type Order = {
  origin?: Location
  destination?: Location
  weight?: number
  weightUnit?: WeightUnit
}

export type ValidationResult = {
  valid: boolean
  errors: string[]
}

const MIN_WEIGHT_KG = 0.001
const MAX_WEIGHT_KG = 70

export function toKilograms(weight: number, unit: WeightUnit): number {
  switch (unit) {
    case 'GRAMS':     return weight / 1000
    case 'POUNDS':    return weight * 0.453592
    case 'KILOGRAMS': return weight
  }
}

// Colombia coverage is enforced at infrastructure layer via OpenRouteService
// (boundary.country=CO). Domain only validates presence and weight range.
export function validateOrder(order: Order): ValidationResult {
  const errors: string[] = []

  const isValidLocation = (loc: any) =>
    loc &&
    typeof loc.name === 'string' &&
    typeof loc.lat === 'number' &&
    typeof loc.lng === 'number'

  if (!isValidLocation(order.origin)) {
    errors.push('origin is required and must include name, lat and lng')
  }

  if (!isValidLocation(order.destination)) {
    errors.push('destination is required and must include name, lat and lng')
  }

  if (order.weightUnit == null) {
    errors.push('weightUnit is required (GRAMS, KILOGRAMS or POUNDS)')
  }

  if (order.weight == null || Number.isNaN(Number(order.weight))) {
    errors.push('weight is required')
  } else if (order.weightUnit != null) {
    const weightInKg = toKilograms(Number(order.weight), order.weightUnit)
    if (weightInKg < MIN_WEIGHT_KG || weightInKg > MAX_WEIGHT_KG) {
      errors.push(`weight is out of allowed range (${MIN_WEIGHT_KG} - ${MAX_WEIGHT_KG} Kg)`)
    }
  }

  return { valid: errors.length === 0, errors }
}

export default validateOrder
