import { createContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

// AuthContext provides user and profile data to the app, and listens for auth changes
export const AuthContext = createContext()

// AuthProvider wraps the app and manages auth state, fetching user and profile data
export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, get the current session and listen for auth state changes
  useEffect(() => {
    // Get current session on mount
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()

      const currentUser = data.session?.user || null
      setUser(currentUser)

      if (currentUser) {
        await fetchProfile(currentUser.id)
      }

      setLoading(false)
    }

    getSession()

    // Listen for auth state changes (, sign out, token refresh)
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

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // Fetch the user's profile from the "profiles" table using their user ID
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

  // tier is derived from profile; fall back to "free"
  const tier = profile?.tier ?? "free"

  // Call this after a successful upgrade write to reload the profile
  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  // Provide user, profile, tier, loading state, and refreshProfile function to the app
  return (
    <AuthContext.Provider value={{ user, profile, tier, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
