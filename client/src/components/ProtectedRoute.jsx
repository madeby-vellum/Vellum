import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile } = useContext(AuthContext)

  if (!user) return <Navigate to="/signin" />

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/home" />
  }

  return children
}