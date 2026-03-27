// ─── Types ───────────────────────────────────────────────────────────────────

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

export const SHIPPING_PRIORITY = {
  COST: 'COST',
  TIME: 'TIME',
} as const

export type ShippingPriority = keyof typeof SHIPPING_PRIORITY

export type Order = {
  origin?: Location
  destination?: Location
  weight?: number
  weightUnit?: WeightUnit
  priority?: ShippingPriority
}

export type ValidationResult = {
  valid: boolean
  errors: string[]
}

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

// ─── Constants ───────────────────────────────────────────────────────────────

const MIN_WEIGHT_KG = 0.001
const MAX_WEIGHT_KG = 70
const POUND_TO_KG = 0.453592

export const ORDER_ERRORS = {
  ORIGIN_REQUIRED: 'origin is required and must include name, lat and lng',
  DESTINATION_REQUIRED: 'destination is required and must include name, lat and lng',
  WEIGHT_UNIT_REQUIRED: 'weightUnit is required (GRAMS, KILOGRAMS or POUNDS)',
  WEIGHT_REQUIRED: 'weight is required',
  WEIGHT_OUT_OF_RANGE: `weight is out of allowed range (${MIN_WEIGHT_KG} - ${MAX_WEIGHT_KG} Kg)`,
} as const

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isValidLocation(loc: unknown): loc is Location {
  return (
    typeof loc === 'object' &&
    loc !== null &&
    typeof (loc as Location).name === 'string' &&
    typeof (loc as Location).lat === 'number' &&
    typeof (loc as Location).lng === 'number'
  )
}

// ─── Domain functions ────────────────────────────────────────────────────────

// Colombia coverage is enforced at infrastructure layer via OpenRouteService
// (boundary.country=CO). Domain only validates presence and weight range.
export function toKilograms(weight: number, unit: WeightUnit): number {
  switch (unit) {
    case 'GRAMS': return weight / 1000
    case 'POUNDS': return weight * POUND_TO_KG
    case 'KILOGRAMS': return weight
  }
}

export function validateOrder(order: Order): ValidationResult {
  const errors: string[] = []

  if (!isValidLocation(order.origin)) {
    errors.push(ORDER_ERRORS.ORIGIN_REQUIRED)
  }

  if (!isValidLocation(order.destination)) {
    errors.push(ORDER_ERRORS.DESTINATION_REQUIRED)
  }

  if (order.weightUnit == null) {
    errors.push(ORDER_ERRORS.WEIGHT_UNIT_REQUIRED)
  }

  if (order.weight == null || Number.isNaN(Number(order.weight))) {
    errors.push(ORDER_ERRORS.WEIGHT_REQUIRED)
  } else if (order.weightUnit != null) {
    const weightInKg = toKilograms(Number(order.weight), order.weightUnit)
    if (weightInKg < MIN_WEIGHT_KG || weightInKg > MAX_WEIGHT_KG) {
      errors.push(ORDER_ERRORS.WEIGHT_OUT_OF_RANGE)
    }
  }

  return { valid: errors.length === 0, errors }
}

export function isValidShippingOption(option: ShippingOption): boolean {
  return (
    typeof option.providerName === 'string' &&
    option.providerName.trim().length > 0 &&
    typeof option.cost === 'number' &&
    option.cost > 0 &&
    typeof option.currency === 'string' &&
    option.currency.trim().length > 0 &&
    typeof option.estimatedDays === 'number' &&
    option.estimatedDays > 0
  )
}
