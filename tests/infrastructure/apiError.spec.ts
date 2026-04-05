import { describe, expect, it } from 'vitest'
import { createApiErrorMessage, readApiErrorMessage } from '../../src/infrastructure/api/apiError'

describe('apiError helper', () => {
  it('maps 400 to a user-friendly validation message', () => {
    expect(createApiErrorMessage(400)).toBe(
      'La solicitud contiene datos inválidos. Revisa la información e inténtalo de nuevo.'
    )
  })

  it('maps 401 to a user-friendly auth message', () => {
    expect(createApiErrorMessage(401)).toBe(
      'No tienes una sesión válida. Inicia sesión nuevamente.'
    )
  })

  it('maps 404 to a user-friendly not found message', () => {
    expect(createApiErrorMessage(404)).toBe('No encontramos el recurso solicitado.')
  })

  it('maps 409 to a user-friendly conflict message', () => {
    expect(createApiErrorMessage(409)).toBe(
      'Hay un conflicto con los datos enviados. Revisa la información e inténtalo de nuevo.'
    )
  })

  it('combines backend message and validation details', () => {
    expect(
      createApiErrorMessage(400, {
        message: 'La solicitud contiene datos inválidos',
        errors: ['email: debe ser un correo válido'],
      })
    ).toBe('La solicitud contiene datos inválidos: email: debe ser un correo válido')
  })

  it('uses raw body text when the response body is plain text', () => {
    expect(createApiErrorMessage(500, 'Error interno')).toBe('Error interno')
  })

  it('reads a JSON response body and converts it into a friendly message', async () => {
    const response = new Response(
      JSON.stringify({
        message: 'La solicitud contiene datos inválidos',
        errors: ['password: debe tener al menos 8 caracteres'],
      }),
      { status: 400 }
    )

    await expect(readApiErrorMessage(response)).resolves.toBe(
      'La solicitud contiene datos inválidos: password: debe tener al menos 8 caracteres'
    )
  })
})