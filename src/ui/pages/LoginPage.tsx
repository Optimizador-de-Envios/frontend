import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { LoginForm } from '../components/LoginForm'
import { useLogin } from '../../application/hooks/useLogin'

export function LoginPage() {
  const location = useLocation()
  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'
  const { status, error, login } = useLogin(redirectTo)

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <section className="w-full max-w-lg rounded-3xl border border-surface-variant bg-surface-container px-8 py-10 shadow-xl space-y-8">
          <header className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-on-surface-variant">
              Acceso autenticado
            </p>
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-primary">
              Iniciar sesión
            </h1>
            <p className="text-sm text-on-surface-variant">
              Entra para cotizar, confirmar y revisar tu historial de pedidos.
            </p>
          </header>

          <LoginForm onSubmit={login} loading={status === 'loading'} error={error} />

          <p className="text-sm text-center text-on-surface-variant">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Crear cuenta
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}