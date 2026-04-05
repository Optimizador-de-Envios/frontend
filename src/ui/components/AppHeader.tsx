import { Link } from 'react-router-dom'
import { useAuth } from '../../application/hooks/useAuth'

export function AppHeader() {
  const { session, isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-surface-variant/40 bg-[#0e0e10]/85 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="font-headline text-xl font-bold tracking-tighter uppercase text-primary">
          Optimizador de Envios
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {isAuthenticated && session ? (
            <>
              <span className="hidden text-on-surface-variant md:inline">
                {session.user.name}
              </span>
              <Link
                to="/history"
                className="rounded-full border border-surface-variant px-4 py-2 font-semibold text-on-surface hover:border-primary hover:text-primary"
              >
                Historial
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-primary px-4 py-2 font-semibold text-on-primary"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-surface-variant px-4 py-2 font-semibold text-on-surface hover:border-primary hover:text-primary"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-primary px-4 py-2 font-semibold text-on-primary"
              >
                Registrarme
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
