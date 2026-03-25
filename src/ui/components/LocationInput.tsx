import { useState } from 'react'
import type { Location } from '../../domain/order'
import { useAutocomplete } from '../../application/hooks/useAutocomplete'

type Props = {
  label: string
  testId: string
  value: Location | null
  onChange: (location: Location) => void
}

/**
 * Dumb UI component — text input with autocomplete dropdown.
 * Gets data from useAutocomplete (application layer).
 * Never calls the API directly.
 */
export function LocationInput({ label, testId, value, onChange }: Props) {
  const { suggestions, loading, search } = useAutocomplete()
  const [inputValue, setInputValue]      = useState(value?.name ?? '')
  const [open, setOpen]                  = useState(false)

  function handleInput(text: string) {
    setInputValue(text)
    setOpen(true)
    search(text)
  }

  function handleSelect(loc: Location) {
    setInputValue(loc.name)
    setOpen(false)
    onChange(loc)
  }

  return (
    <div style={{ position: 'relative', marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
        {label}
      </label>
      <input
        data-testid={testId}
        type="text"
        value={inputValue}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={`Buscar ${label.toLowerCase()}...`}
        style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
        autoComplete="off"
      />
      {loading && <small style={{ color: '#888' }}>Buscando...</small>}
      {open && suggestions.length > 0 && (
        <ul
          style={{
            listStyle: 'none', margin: 0, padding: '0.25rem 0',
            border: '1px solid #ccc', position: 'absolute',
            background: '#fff', width: '100%', zIndex: 10,
            maxHeight: '200px', overflowY: 'auto',
          }}
        >
          {suggestions.map((loc) => (
            <li
              key={`${loc.lat}-${loc.lng}`}
              onClick={() => handleSelect(loc)}
              style={{ padding: '0.5rem', cursor: 'pointer' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#f0f0f0')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.background = '#fff')}
            >
              {loc.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
