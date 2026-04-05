import 'vitest'

declare module 'vitest' {
  interface Assertion<T = any> {
    toBeDisabled(): T
  }
}