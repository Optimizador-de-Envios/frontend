function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function normalizeErrors(errors: unknown): string[] {
  if (!Array.isArray(errors)) {
    return []
  }

  return errors.filter(isNonEmptyString).map((error) => error.trim())
}

function getFallbackMessage(status: number): string {
  switch (status) {
    case 400:
      return 'La solicitud contiene datos inválidos. Revisa la información e inténtalo de nuevo.'
    case 401:
      return 'No tienes una sesión válida. Inicia sesión nuevamente.'
    case 404:
      return 'No encontramos el recurso solicitado.'
    case 409:
      return 'Hay un conflicto con los datos enviados. Revisa la información e inténtalo de nuevo.'
    default:
      return `Ocurrió un error inesperado en el servidor (${status}). Inténtalo de nuevo más tarde.`
  }
}

export function createApiErrorMessage(status: number, body?: unknown): string {
  if (typeof body === 'string' && body.trim().length > 0) {
    return body.trim()
  }

  if (body != null && typeof body === 'object') {
    const typedBody = body as { message?: unknown; errors?: unknown; error?: unknown }
    const message = isNonEmptyString(typedBody.message) ? typedBody.message.trim() : ''
    const errors = normalizeErrors(typedBody.errors)
    const error = isNonEmptyString(typedBody.error) ? typedBody.error.trim() : ''

    if (message && errors.length > 0) {
      return `${message}: ${errors.join('; ')}`
    }

    if (errors.length > 0) {
      return errors.join('; ')
    }

    if (message) {
      return message
    }

    if (error) {
      return error
    }
  }

  return getFallbackMessage(status)
}

async function readResponseBody(response: Response): Promise<unknown> {
  const rawBody = await response.text()

  if (rawBody.trim().length === 0) {
    return undefined
  }

  try {
    return JSON.parse(rawBody)
  } catch {
    return rawBody
  }
}

export async function readApiErrorMessage(response: Response): Promise<string> {
  const body = await readResponseBody(response)
  return createApiErrorMessage(response.status, body)
}