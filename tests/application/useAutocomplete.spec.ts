import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAutocomplete } from '../../src/application/hooks/useAutocomplete'

// Mock the infra adapter — application layer must NEVER call the API directly
vi.mock('../../src/infrastructure/api/openRouteService', () => ({
  autocomplete: vi.fn(),
}))

import { autocomplete } from '../../src/infrastructure/api/openRouteService'

const mockBogota   = { name: 'Bogotá, Colombia',   lat: 4.6097, lng: -74.0818 }
const mockMedellin = { name: 'Medellín, Colombia', lat: 6.2518, lng: -75.5636 }

describe('useAutocomplete (HU-01)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('starts with empty suggestions and loading = false', () => {
    const { result } = renderHook(() => useAutocomplete())
    expect(result.current.suggestions).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('calls autocomplete adapter and populates suggestions', async () => {
    vi.mocked(autocomplete).mockResolvedValue([mockBogota, mockMedellin])

    const { result } = renderHook(() => useAutocomplete())
    await act(async () => { await result.current.search('Bogo') })

    expect(autocomplete).toHaveBeenCalledWith('Bogo')
    expect(result.current.suggestions).toEqual([mockBogota, mockMedellin])
    expect(result.current.loading).toBe(false)
  })

  it('sets loading=true while fetching, false after resolving', async () => {
    let resolve!: (v: any) => void
    vi.mocked(autocomplete).mockReturnValue(new Promise((r) => { resolve = r }))

    const { result } = renderHook(() => useAutocomplete())
    act(() => { result.current.search('Med') })
    expect(result.current.loading).toBe(true)

    await act(async () => { resolve([mockMedellin]) })
    expect(result.current.loading).toBe(false)
  })

  it('clears suggestions and skips API call when query is empty', async () => {
    vi.mocked(autocomplete).mockResolvedValue([mockBogota])

    const { result } = renderHook(() => useAutocomplete())
    await act(async () => { await result.current.search('Bogo') })
    await act(async () => { await result.current.search('') })

    expect(result.current.suggestions).toEqual([])
    expect(autocomplete).toHaveBeenCalledTimes(1) // no call for empty string
  })
})
