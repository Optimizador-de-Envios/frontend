export function logoutSessionService(
  logoutAuth: () => void,
  clearOrder: () => void,
  clearRecommendation: () => void,
): void {
  logoutAuth()
  clearOrder()
  clearRecommendation()
}

export default { logoutSessionService }