import { useState } from 'react'

type LoginCredentials = {
  email: string
  password: string
}

type Props = {
  onSubmit: (credentials: LoginCredentials) => void | Promise<void>
  error?: string | null
  loading?: boolean
}

export function LoginForm({ onSubmit, error = null, loading = false }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <label htmlFor="login-email" className="block text-sm font-medium text-on-surface">
          Correo electrónico
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-surface-variant bg-surface-container px-4 py-3"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="login-password" className="block text-sm font-medium text-on-surface">
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-md border border-surface-variant bg-surface-container px-4 py-3"
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-3 font-semibold text-on-primary disabled:opacity-50"
      >
        Iniciar sesión
      </button>
    </form>
  )
}