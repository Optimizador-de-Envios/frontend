import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAutocomplete } from '../../src/application/hooks/useAutocomplete'

// Mock the infra adapter — application layer must NEVER call the API directly
vi.mock('../../src/infrastructure/api/openRouteService', () => ({
  autocomplete: vi.fn(),
}))

import { autocomplete } from '../../src/infrastructure/api/openRouteService'

const mockBogota   = { name: 'Bogotá, Colombia',   lat: 4.6097, lng: -74.0818 }
const mockMedellin = { name: 'Medellín, Colombia', lat: 6.2518, lng: -75.5636 }

const DEBOUNCE_MS = 1000

describe('useAutocomplete (HU-01)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })
  afterEach(() => vi.useRealTimers())

  it('starts with empty suggestions and loading = false', () => {
    const { result } = renderHook(() => useAutocomplete())
    expect(result.current.suggestions).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('does not call autocomplete before debounce delay elapses', () => {
    vi.mocked(autocomplete).mockResolvedValue([mockBogota])

    const { result } = renderHook(() => useAutocomplete())
    act(() => { result.current.search('Bogo') })

    expect(autocomplete).not.toHaveBeenCalled()
  })

  it('calls autocomplete adapter and populates suggestions after debounce', async () => {
    vi.mocked(autocomplete).mockResolvedValue([mockBogota, mockMedellin])

    const { result } = renderHook(() => useAutocomplete())
    act(() => { result.current.search('Bogo') })

    await act(async () => { vi.advanceTimersByTime(DEBOUNCE_MS) })

    expect(autocomplete).toHaveBeenCalledWith('Bogo')
    expect(result.current.suggestions).toEqual([mockBogota, mockMedellin])
    expect(result.current.loading).toBe(false)
  })

  it('sets loading=true after debounce fires, false after resolving', async () => {
    let resolve!: (v: any) => void
    vi.mocked(autocomplete).mockReturnValue(new Promise((r) => { resolve = r }))

    const { result } = renderHook(() => useAutocomplete())
    act(() => { result.current.search('Med') })

    await act(async () => { vi.advanceTimersByTime(DEBOUNCE_MS) })
    expect(result.current.loading).toBe(true)

    await act(async () => { resolve([mockMedellin]) })
    expect(result.current.loading).toBe(false)
  })

  it('clears suggestions and skips API call when query is empty', async () => {
    vi.mocked(autocomplete).mockResolvedValue([mockBogota])

    const { result } = renderHook(() => useAutocomplete())
    act(() => { result.current.search('Bogo') })
    await act(async () => { vi.advanceTimersByTime(DEBOUNCE_MS) })

    act(() => { result.current.search('') })
    await act(async () => { vi.advanceTimersByTime(DEBOUNCE_MS) })

    expect(result.current.suggestions).toEqual([])
    expect(autocomplete).toHaveBeenCalledTimes(1) // no call for empty string
  })
})
