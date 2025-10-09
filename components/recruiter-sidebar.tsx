"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { Mission } from "@/types"

const MapPinIcon = () => (
  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)

const EuroIcon = () => <span>💶</span>
const CheckIcon = () => <span>⚡</span>

interface RecruiterSidebarProps {
  onMissionHighlight: (mission: Mission | null) => void
  highlightedMission: Mission | null
}

export function RecruiterSidebar({
  onMissionHighlight,
  highlightedMission,
}: RecruiterSidebarProps) {
  const [missions, setMissions] = useState<Mission[]>([])
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadMissions()
  }, [])

  useEffect(() => {
    filterMissions()
  }, [missions, searchTerm, statusFilter])

  const loadMissions = async () => {
    try {
      const response = await fetch("/api/missions")
      const data: Mission[] = await response.json()
      setMissions(data)
    } catch (error) {
      console.error("Error loading missions:", error)
    }
  }

  const filterMissions = () => {
    let filtered = missions

    if (searchTerm) {
      filtered = filtered.filter(
        (mission) =>
          mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mission.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((mission) => mission.status === statusFilter)
    }

    setFilteredMissions(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="w-96 bg-card border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">Missions disponibles</h2>

        {/* Search */}
        <div className="relative mb-4">
          <Input
            placeholder="Rechercher une mission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full border rounded-md p-2 text-sm"
        >
          <option value="all">Toutes les missions</option>
          <option value="active">Actives</option>
          <option value="closed">Clôturées</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      {/* Mission List */}
      <div className="flex-1 overflow-y-auto msa-scrollbar p-4 space-y-3">
        {filteredMissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune mission disponible pour le moment
          </p>
        ) : (
          filteredMissions.map((mission) => (
            <Card
              key={mission.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                highlightedMission?.id === mission.id
                  ? "ring-2 ring-primary shadow-lg"
                  : ""
              }`}
              onClick={() => onMissionHighlight(mission)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground capitalize">
                    {mission.title}
                  </h3>
                  <Badge className={getStatusColor(mission.status)}>
                    {mission.status}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {mission.description}
                </p>

                <div className="space-y-2 text-xs text-muted-foreground">
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
                  {mission.requirements && (
                    <div className="flex items-center space-x-1">
                      <CheckIcon />
                      <span>{mission.requirements}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
