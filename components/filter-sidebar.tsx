"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Mission, Technician } from "@/types"

interface FilterSidebarProps {
  onMissionHighlight: (mission: Mission | null) => void
  highlightedMission: Mission | null
}

export function FilterSidebar({ onMissionHighlight, highlightedMission }: FilterSidebarProps) {
  const [missions, setMissions] = useState<Mission[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([])
  const [filters, setFilters] = useState({
    missionType: "all",
    location: "all",
    availability: false,
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [missions, filters])

  const loadData = async () => {
    try {
      const [missionsRes, techniciansRes] = await Promise.all([fetch("/api/missions"), fetch("/api/technicians")])
      const missionsData = await missionsRes.json()
      const techniciansData = await techniciansRes.json()
      setMissions(missionsData)
      setTechnicians(techniciansData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const applyFilters = () => {
    let filtered = missions

    if (filters.missionType !== "all") {
      filtered = filtered.filter((mission) => mission.type === filters.missionType)
    }

    if (filters.availability) {
      filtered = filtered.filter((mission) => mission.status === "open")
    }

    setFilteredMissions(filtered)
  }

  const availableTechnicians = technicians.filter((t) => t.availability).length
  const totalMissions = missions.length
  const openMissions = missions.filter((m) => m.status === "open").length

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de mission</label>
            <Select
              value={filters.missionType}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, missionType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="mechanic">Mécanique</SelectItem>
                <SelectItem value="bodywork">Carrosserie</SelectItem>
                <SelectItem value="reception">Accueil</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
            <Select
              value={filters.location}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les zones</SelectItem>
                <SelectItem value="paris">Paris</SelectItem>
                <SelectItem value="lyon">Lyon</SelectItem>
                <SelectItem value="marseille">Marseille</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="availability"
              checked={filters.availability}
              onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, availability: checked as boolean }))}
            />
            <label htmlFor="availability" className="text-sm font-medium text-gray-700">
              Missions ouvertes uniquement
            </label>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Statistiques</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-3">
            <div className="text-2xl font-bold text-msa-blue">{totalMissions}</div>
            <div className="text-xs text-gray-600">Missions totales</div>
          </Card>
          <Card className="p-3">
            <div className="text-2xl font-bold text-green-600">{openMissions}</div>
            <div className="text-xs text-gray-600">Missions ouvertes</div>
          </Card>
          <Card className="p-3 col-span-2">
            <div className="text-2xl font-bold text-orange-600">{availableTechnicians}</div>
            <div className="text-xs text-gray-600">Techniciens disponibles</div>
          </Card>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Missions ({filteredMissions.length})</h3>
        <div className="space-y-3">
          {filteredMissions.map((mission) => (
            <Card
              key={mission.id}
              className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                highlightedMission?.id === mission.id ? "ring-2 ring-msa-blue bg-blue-50" : ""
              }`}
              onClick={() => onMissionHighlight(highlightedMission?.id === mission.id ? null : mission)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 capitalize">{mission.type}</h4>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    mission.status === "open"
                      ? "bg-green-100 text-green-800"
                      : mission.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : mission.status === "completed"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                  }`}
                >
                  {mission.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{mission.description}</p>
              <div className="text-xs text-gray-500">
                📍 {mission.location.lat.toFixed(4)}, {mission.location.lng.toFixed(4)}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
