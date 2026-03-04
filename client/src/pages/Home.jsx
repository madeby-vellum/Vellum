import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { supabase } from "../lib/supabase"

export default function Home() {
  const { user } = useContext(AuthContext)

  const handleSignout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">
            Vellum
          </h1>
          <button
            onClick={handleSignout}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <p className="text-sm text-gray-600">
            Signed in as:
          </p>
          <p className="font-medium break-all">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  )
}