"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import MapView from "@/components/map-view"
import { RecruiterSidebar } from "@/components/recruiter-sidebar"
import { MissionForm } from "@/components/mission-form"

const CarIcon = () => (
  <svg className="h-8 w-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6h3l2 7H6l2-7h3" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17h14v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2z" />
  </svg>
)

const MapPinIcon = () => (
  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export default function RecruiterPage() {
  const [highlightedMission, setHighlightedMission] = useState<any>(null)
  const [showMissionForm, setShowMissionForm] = useState(false)
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

      // Check if user is a recruiter
      const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

      if (profile?.user_type !== "recruiter") {
        router.push("/technician")
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

  const handleMissionCreated = () => {
    // Refresh missions list
    window.location.reload()
  }

  if (loading) {
    // 🔥 Correction : garder un texte identique côté serveur & client
    return <div className="h-screen flex items-center justify-center">Chargement...</div>
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="bg-card shadow-lg border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary rounded-xl p-3">
              <CarIcon />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">MSA Staffing</h1>
              <p className="text-sm text-muted-foreground">Tableau de bord recruteur</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowMissionForm(true)} className="msa-button-primary">
              <MapPinIcon />
              Créer une mission
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="msa-button-secondary bg-transparent">
              Se déconnecter
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <RecruiterSidebar onMissionHighlight={setHighlightedMission} highlightedMission={highlightedMission} />
        <div className="flex-1">
          <MapView highlightedMission={highlightedMission} />
        </div>
      </div>

      {showMissionForm && (
        <MissionForm onClose={() => setShowMissionForm(false)} onMissionCreated={handleMissionCreated} />
      )}
    </div>
  )
}
