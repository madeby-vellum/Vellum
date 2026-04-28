import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useContext(AuthContext)

  // Wait for session check before redirecting
  if (loading) return null

  if (!user) return <Navigate to="/auth" replace />

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/shelf" replace />
  }

  return children
}
