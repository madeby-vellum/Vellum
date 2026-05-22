import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

// Check authentication and role before rendering routes
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useContext(AuthContext)

  // Wait for session check before redirecting
  if (loading) return null

  // Redirect user to auth if not logged in
  if (!user) return <Navigate to="/auth" replace />

  // Redirect if user doesn't have required role [not in use yet, but can be used for admin routes]
  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/shelf" replace />
  }

  // If user is authenticated, render the protected component
  return children
}