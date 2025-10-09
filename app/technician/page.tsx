"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import MapView from "@/components/map-view"
import { TechnicianSidebar } from "@/components/technician-sidebar"

const WrenchIcon = () => (
  <svg className="h-8 w-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export default function TechnicianPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if user is a technician
      const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

      if (profile?.user_type !== "technician") {
        router.push("/recruiter")
        return
      }

      setUser(user)
      setLoading(false)
    }

    checkUser()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="bg-card shadow-lg border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary rounded-xl p-3">
              <WrenchIcon />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">MSA Jobs</h1>
              <p className="text-sm text-muted-foreground">Missions disponibles</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="msa-button-secondary bg-transparent">
            Se déconnecter
          </Button>
        </div>
      </header>

      <div className="flex-1 flex">
        <TechnicianSidebar />
        <div className="flex-1">
          <MapView />
        </div>
      </div>
    </div>
  )
}
