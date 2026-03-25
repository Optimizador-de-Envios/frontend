import { OrderForm } from '../components/OrderForm'

/**
 * OrderPage — page-level component.
 * Equivalent to a @Controller in Spring Boot.
 * Only responsibility: compose the page layout and mount OrderForm.
 */
export function OrderPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Optimizador de Envíos</h1>
      <OrderForm />
    </main>
  )
}
