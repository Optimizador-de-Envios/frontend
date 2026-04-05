import type { Location, ShippingPriority, WeightUnit } from './order'
import type { ShippingOption } from './recommendation'

export type UserOrderSummary = {
  id: string
  origin: Location
  destination: Location
  weight: number
  weightUnit: WeightUnit
  priority: ShippingPriority
  distanceKm: number
  selectedOption: ShippingOption
  createdAt: string
}

type UserOrderSummaryDto = UserOrderSummary & {
  confirmationToken?: string
}

export function normalizeUserOrderSummary(order: UserOrderSummaryDto): UserOrderSummary {
  return {
    id: order.id,
    origin: order.origin,
    destination: order.destination,
    weight: order.weight,
    weightUnit: order.weightUnit,
    priority: order.priority,
    distanceKm: order.distanceKm,
    selectedOption: order.selectedOption,
    createdAt: order.createdAt,
  }
}

export function normalizeUserOrderSummaries(orders: UserOrderSummaryDto[]): UserOrderSummary[] {
  return orders.map(normalizeUserOrderSummary)
}