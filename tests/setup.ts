import '@testing-library/react'
import { expect } from 'vitest'

expect.extend({
	toBeDisabled(received: HTMLElement) {
		const isDisabled =
			received.hasAttribute('disabled') ||
			(received instanceof HTMLButtonElement && received.disabled) ||
			received.getAttribute('aria-disabled') === 'true'

		return {
			pass: isDisabled,
			message: () =>
				`expected element${isDisabled ? ' not' : ''} to be disabled`,
		}
	},
})
