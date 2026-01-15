"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Mission } from "@/types"

// Custom SVG components
const MapPinIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const EuroIcon = () => <span>💶</span>
const SearchIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const SendIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
)

export function TechnicianSidebar() {
  const router = useRouter()
  const [missions, setMissions] = useState<Mission[]>([])
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    loadAvailableMissions()
  }, [])

  useEffect(() => {
    filterMissions()
  }, [missions, searchTerm, typeFilter])

  const loadAvailableMissions = async () => {
    try {
      const response = await fetch("/api/missions")
      const data: Mission[] = await response.json()

      // ✅ On filtre dès la récupération
      const activeMissions = data.filter((m) => m.status === "active")
      setMissions(activeMissions)
    } catch (error) {
      console.error("Error loading missions:", error)
    }
  }

  const filterMissions = () => {
    let filtered = missions

    if (searchTerm) {
      filtered = filtered.filter(
        (mission) =>
          mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mission.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((mission) => mission.type === typeFilter)
    }

    setFilteredMissions(filtered)
  }

  // 🧭 Nouvelle version : redirige vers la page descriptive
  const handleApply = (missionId: string) => {
    router.push(`/missions/${missionId}`)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mechanic":
        return "🔧"
      case "bodywork":
        return "🚗"
      case "reception":
        return "👥"
      case "maintenance":
        return "⚙️"
      default:
        return "📋"
    }
  }

  return (
    <div className="w-96 bg-card border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">Missions disponibles</h2>

        {/* Stats */}
        <div className="msa-stats-card mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{filteredMissions.length}</div>
            <div className="text-xs text-muted-foreground">Missions actives près de vous</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4 flex items-center">
          <SearchIcon />
          <Input
            placeholder="Rechercher une mission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par spécialité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les spécialités</SelectItem>
            <SelectItem value="mechanic">Mécanique</SelectItem>
            <SelectItem value="bodywork">Carrosserie</SelectItem>
            <SelectItem value="reception">Accueil</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mission List */}
      <div className="flex-1 overflow-y-auto msa-scrollbar p-4 space-y-4">
        {filteredMissions.map((mission) => (
          <Card key={mission.id} className="msa-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getTypeIcon(mission.type)}</span>
                  <h3 className="font-semibold text-foreground capitalize">{mission.title}</h3>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{mission.description}</p>

              <div className="space-y-2 text-xs text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <MapPinIcon />
                  <span className="truncate">{mission.location}</span>
                </div>
                {mission.salary && (
                  <div className="flex items-center space-x-1">
                    <EuroIcon />
                    <span>{mission.salary} €/jour</span>
                  </div>
                )}
                {mission.startDate && (
                  <div className="flex items-center space-x-1">
                    <ClockIcon />
                    <span>{new Date(mission.startDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* 🔗 Redirection vers la page descriptive */}
              <Button onClick={() => handleApply(mission.id)} className="w-full msa-button-primary text-sm py-2">
                <SendIcon />
                Postuler
              </Button>
            </CardContent>
          </Card>
        ))}

        {filteredMissions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucune mission disponible pour le moment</p>
            <p className="text-sm mt-2">Essayez de modifier vos filtres</p>
          </div>
        )}
      </div>
    </div>
  )
}
