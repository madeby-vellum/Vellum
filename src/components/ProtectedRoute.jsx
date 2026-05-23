import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

// A wrapper for <Route> that redirects to the login
export default function ProtectedRoute({ children, requiredRole }) {
  // Get user and profile from AuthContext
  const { user, profile, loading } = useContext(AuthContext)

  // Wait for session check before redirecting
  if (loading) return null

  // If no user, redirect to auth page
  if (!user) return <Navigate to="/auth" replace />

  // If a required role is specified and the user's role doesn't match, redirect to shelf
  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/shelf" replace />
  }

  return children
}
