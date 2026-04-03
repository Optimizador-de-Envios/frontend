import type { Location } from './order'

export type LeafletCoordinate = [number, number]
export type RoutePath = LeafletCoordinate[]

function isValidCoordinate(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function hasCoordinates(location?: Location): location is Location {
  return location != null && isValidCoordinate(location.lat) && isValidCoordinate(location.lng)
}

export function hasRouteEndpoints(origin?: Location, destination?: Location): boolean {
  return hasCoordinates(origin) && hasCoordinates(destination)
}

export function toLeafletCoordinates(coordinates: number[][]): RoutePath {
  return coordinates.map(([lng, lat]) => [lat, lng])
}