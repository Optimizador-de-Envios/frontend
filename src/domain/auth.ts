export type AuthUser = {
  id: string
  name: string
  email: string
}

export type AuthLoginResponse = {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: AuthUser
}

export type AuthSession = {
  user: AuthUser
  accessToken: string
  tokenType: string
  expiresAt: string
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function isAuthUser(value: unknown): value is AuthUser {
  return (
    typeof value === 'object' &&
    value !== null &&
    isNonEmptyString((value as AuthUser).id) &&
    isNonEmptyString((value as AuthUser).name) &&
    isNonEmptyString((value as AuthUser).email)
  )
}

export function createAuthSession(response: AuthLoginResponse, issuedAt: Date = new Date()): AuthSession {
  const expiresAt = new Date(issuedAt.getTime() + response.expiresIn * 1000)

  return {
    user: response.user,
    accessToken: response.accessToken,
    tokenType: response.tokenType,
    expiresAt: expiresAt.toISOString(),
  }
}

export function isAuthSessionActive(session: AuthSession | null | undefined, now: Date = new Date()): boolean {
  if (!session) {
    return false
  }

  const expiresAt = new Date(session.expiresAt)
  return Number.isFinite(expiresAt.getTime()) && now.getTime() < expiresAt.getTime()
}