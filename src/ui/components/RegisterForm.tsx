import { useState } from 'react'

type RegisterPayload = {
  name: string
  email: string
  password: string
}

type Props = {
  onSubmit: (payload: RegisterPayload) => void | Promise<void>
  error?: string | null
  loading?: boolean
}

export function RegisterForm({ onSubmit, error = null, loading = false }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ name, email, password })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <label htmlFor="register-name" className="block text-sm font-medium text-on-surface">
          Nombre
        </label>
        <input
          id="register-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-md border border-surface-variant bg-surface-container px-4 py-3"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="register-email" className="block text-sm font-medium text-on-surface">
          Correo electrónico
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-surface-variant bg-surface-container px-4 py-3"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="register-password" className="block text-sm font-medium text-on-surface">
          Contraseña
        </label>
        <input
          id="register-password"
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
        Registrarme
      </button>
    </form>
  )
}