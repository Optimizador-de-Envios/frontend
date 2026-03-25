import { useState } from 'react'
import type { Location } from '../../domain/order'
import { useAutocomplete } from '../../application/hooks/useAutocomplete'

type Props = {
  label: string
  testId: string
  value: Location | null
  onChange: (location: Location) => void
  icon?: string
  error?: string
}

/**
 * Dumb UI component — text input with autocomplete dropdown.
 * Gets data from useAutocomplete (application layer).
 * Never calls the API directly.
 */
export function LocationInput({ label, testId, value, onChange, icon, error }: Props) {
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
    <div className="space-y-3">
      <label className="block font-headline text-xs font-bold uppercase tracking-widest text-primary-fixed-dim">
        {label}
      </label>
      <div className="relative">
        <input
          data-testid={testId}
          type="text"
          value={inputValue}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={`Buscar ${label.toLowerCase()}...`}
          className="w-full bg-surface-container-high border border-error-dim/40 rounded-md px-4 py-4 pr-12 text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-primary/50 transition-all"
          autoComplete="off"
        />
        {icon && (
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline select-none pointer-events-none">
            {icon}
          </span>
        )}
        {open && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 z-10 w-full mt-1 bg-surface-container-high border border-outline-variant rounded-md overflow-y-auto max-h-52 list-none p-0 m-0">
            {suggestions.map((loc) => (
              <li
                key={`${loc.lat}-${loc.lng}`}
                onClick={() => handleSelect(loc)}
                className="px-4 py-3 cursor-pointer text-on-surface hover:bg-surface-container-highest text-sm"
              >
                {loc.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {loading && <small className="text-outline text-xs">Buscando...</small>}
      {error && (
        <p className="text-error text-[11px] font-medium flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm select-none">error</span>
          {error}
        </p>
      )}
    </div>
  )
}
