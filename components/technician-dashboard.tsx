"use client"

import { useState, useEffect } from "react"
import MapView from "@/components/map-view"
import type { Mission } from "@/types"

export function TechnicianDashboard() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)

  useEffect(() => {
    loadAvailableMissions()
  }, [])

  const loadAvailableMissions = async () => {
    try {
      const response = await fetch("/api/missions?status=open")
      const data = await response.json()
      setMissions(data.filter((mission: Mission) => mission.status === "open"))
    } catch (error) {
      console.error("Error loading missions:", error)
    }
  }

  const applyForMission = async (missionId: string) => {
    try {
      const response = await fetch(`/api/missions/${missionId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technicianId: "current-user-id" }),
      })

      if (response.ok) {
        alert("Application submitted successfully!")
        loadAvailableMissions()
      }
    } catch (error) {
      console.error("Error applying for mission:", error)
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="w-80 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center mb-4">
            <div className="bg-green-600 text-white rounded-lg p-2 mr-3">
              <div className="text-sm font-bold">MSA</div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Missions Disponibles</h1>
              <p className="text-sm text-slate-600">Trouvez votre prochaine mission</p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{missions.length}</div>
            <div className="text-sm text-green-700">missions disponibles</div>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-full msa-scrollbar">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`msa-card p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedMission?.id === mission.id ? "border-blue-500 bg-blue-50 shadow-md" : "hover:border-slate-300"
              }`}
              onClick={() => setSelectedMission(mission)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-slate-900 text-balance">{mission.type}</h3>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  {mission.status}
                </span>
              </div>

              <p className="text-sm text-slate-600 mb-4 leading-relaxed text-pretty">{mission.description}</p>

              <div className="space-y-2 text-xs text-slate-500 mb-4">
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>{mission.location.address}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📅</span>
                  <span>{new Date(mission.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  applyForMission(mission.id)
                }}
                className="msa-button-primary w-full py-3 text-sm font-semibold"
              >
                Postuler
              </button>
            </div>
          ))}

          {missions.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V6C15 7.1 14.1 8 13 8H11C9.9 8 9 7.1 9 6V4L3 7V9H21ZM21 10H3V22H21V10Z" />
                </svg>
              </div>
              <p className="font-medium text-slate-700 mb-1">Aucune mission disponible</p>
              <p className="text-sm">Revenez plus tard pour de nouvelles opportunités.</p>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 bg-slate-50">
        <div className="h-full p-4">
          <MapView highlightedMission={selectedMission} />
        </div>
      </main>
    </div>
  )
}
