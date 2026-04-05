import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { RegisterForm } from '../components/RegisterForm'
import { useRegister } from '../../application/hooks/useRegister'

export function RegisterPage() {
  const { status, error, register } = useRegister()

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <section className="w-full max-w-lg rounded-3xl border border-surface-variant bg-surface-container px-8 py-10 shadow-xl space-y-8">
          <header className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-on-surface-variant">
              Nueva cuenta
            </p>
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-primary">
              Registrarme
            </h1>
            <p className="text-sm text-on-surface-variant">
              Crea tu cuenta para asociar tus pedidos al historial de usuario.
            </p>
          </header>

          <RegisterForm onSubmit={register} loading={status === 'loading'} error={error} />

          <p className="text-sm text-center text-on-surface-variant">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}