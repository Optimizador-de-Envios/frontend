import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../application/hooks/useAuth'

type Props = {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}