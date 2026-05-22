// Authentication context using Supabase
import { createContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  // Currently authenticated user
  const [user,    setUser]    = useState(null)

  // Extended user profile from database
  const [profile, setProfile] = useState(null)

  // Loading state for initial auth check
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    // Fetch current session on app mount
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()

      const currentUser = data.session?.user || null
      setUser(currentUser)

      // If logged in, fetch profile from DB
      if (currentUser) {
        await fetchProfile(currentUser.id)
      }

      setLoading(false)
    }

    getSession()

    // Listen for login/logout/token refresh events
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null
        setUser(currentUser)

        if (currentUser) {
          fetchProfile(currentUser.id)
        } else {
          setProfile(null)
        }
      }
    )

    // Cleanup auth listener on unmount
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // Fetch user profile from Supabase "profiles" table
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    if (!error) {
      setProfile(data)
    }
  }

  // Derived subscription tier (fallback to free if not set)
  const tier = profile?.tier ?? "free"

  // Refresh profile manually (e.g. after upgrade)
  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, profile, tier, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}