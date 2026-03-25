import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PrioritySelector } from '../../src/ui/components/PrioritySelector'
import { SHIPPING_PRIORITY } from '../../src/domain/order'

describe('PrioritySelector (HU-02)', () => {
  it('renders Prioridad Costo option', () => {
    render(<PrioritySelector onConfirm={vi.fn()} />)
    expect(screen.getByTestId('option-cost')).toBeDefined()
  })

  it('renders Prioridad Tiempo option', () => {
    render(<PrioritySelector onConfirm={vi.fn()} />)
    expect(screen.getByTestId('option-time')).toBeDefined()
  })

  it('confirm button is disabled when no option is selected', () => {
    render(<PrioritySelector onConfirm={vi.fn()} />)
    const button = screen.getByRole('button', { name: /confirmar/i })
    expect(button.hasAttribute('disabled')).toBe(true)
  })

  it('calls onConfirm with COST when cost option is selected and confirmed', () => {
    const onConfirm = vi.fn()
    render(<PrioritySelector onConfirm={onConfirm} />)
    fireEvent.click(screen.getByTestId('option-cost'))
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(onConfirm).toHaveBeenCalledWith(SHIPPING_PRIORITY.COST)
  })

  it('calls onConfirm with TIME when time option is selected and confirmed', () => {
    const onConfirm = vi.fn()
    render(<PrioritySelector onConfirm={onConfirm} />)
    fireEvent.click(screen.getByTestId('option-time'))
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(onConfirm).toHaveBeenCalledWith(SHIPPING_PRIORITY.TIME)
  })
})
