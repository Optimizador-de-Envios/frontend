import type { AuthLoginResponse, AuthUser } from '../../domain/auth'

const AUTH_API_BASE = import.meta.env.VITE_AUTH_API_BASE ?? 'http://localhost:8081'

type LoginCredentials = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
}

type RegisterResponse = AuthUser & {
  createdAt: string
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`auth request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function login(credentials: LoginCredentials): Promise<AuthLoginResponse> {
  const response = await fetch(`${AUTH_API_BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  return parseJsonResponse<AuthLoginResponse>(response)
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await fetch(`${AUTH_API_BASE}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return parseJsonResponse<RegisterResponse>(response)
}