"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Mission } from "@/types"

// Custom SVG components
const PlusIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const EditIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const MapPinIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

interface MissionFormData {
  type: "mechanic" | "bodywork" | "reception" | "maintenance"
  description: string
  address: string
  startDate: string
  endDate: string
  status: "open" | "in-progress" | "completed" | "cancelled"
}

const initialFormData: MissionFormData = {
  type: "mechanic",
  description: "",
  address: "",
  startDate: "",
  endDate: "",
  status: "open",
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMission, setEditingMission] = useState<Mission | null>(null)
  const [formData, setFormData] = useState<MissionFormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadMissions()
  }, [])

  const loadMissions = async () => {
    try {
      const response = await fetch("/api/missions")
      const data = await response.json()
      setMissions(data)
    } catch (error) {
      console.error("Error loading missions:", error)
    }
  }

  const handleCreateMission = async () => {
    setIsLoading(true)
    try {
      // Mock geocoding - in real app, use Google Maps API
      const mockCoordinates = {
        lat: 48.8566 + (Math.random() - 0.5) * 0.1,
        lng: 2.3522 + (Math.random() - 0.5) * 0.1,
      }

      const missionData = {
        ...formData,
        location: {
          ...mockCoordinates,
          address: formData.address,
        },
      }

      const response = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(missionData),
      })

      if (response.ok) {
        await loadMissions()
        setIsCreateDialogOpen(false)
        setFormData(initialFormData)
      }
    } catch (error) {
      console.error("Error creating mission:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditMission = async () => {
    if (!editingMission) return

    setIsLoading(true)
    try {
      const missionData = {
        ...formData,
        location: {
          ...editingMission.location,
          address: formData.address,
        },
      }

      const response = await fetch(`/api/missions/${editingMission.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(missionData),
      })

      if (response.ok) {
        await loadMissions()
        setIsEditDialogOpen(false)
        setEditingMission(null)
        setFormData(initialFormData)
      }
    } catch (error) {
      console.error("Error updating mission:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMission = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette mission ?")) return

    try {
      const response = await fetch(`/api/missions/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadMissions()
      }
    } catch (error) {
      console.error("Error deleting mission:", error)
    }
  }

  const openEditDialog = (mission: Mission) => {
    setEditingMission(mission)
    setFormData({
      type: mission.type,
      description: mission.description,
      address: mission.location.address || "",
      startDate: mission.startDate.slice(0, 16), // Format for datetime-local input
      endDate: mission.endDate.slice(0, 16),
      status: mission.status,
    })
    setIsEditDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Ouvert"
      case "in-progress":
        return "En cours"
      case "completed":
        return "Terminé"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "mechanic":
        return "Mécanique"
      case "bodywork":
        return "Carrosserie"
      case "reception":
        return "Accueil"
      case "maintenance":
        return "Maintenance"
      default:
        return type
    }
  }

  const MissionForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">Type de mission</Label>
        <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mechanic">Mécanique</SelectItem>
            <SelectItem value="bodywork">Carrosserie</SelectItem>
            <SelectItem value="reception">Accueil</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Décrivez la mission en détail..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="123 Rue de la Paix, Paris"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Date de début</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="endDate">Date de fin</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      {isEdit && (
        <div>
          <Label htmlFor="status">Statut</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Ouvert</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false)
              setEditingMission(null)
            } else {
              setIsCreateDialogOpen(false)
            }
            setFormData(initialFormData)
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={isEdit ? handleEditMission : handleCreateMission}
          disabled={isLoading || !formData.description || !formData.address || !formData.startDate || !formData.endDate}
          className="msa-button-primary"
        >
          {isLoading ? "..." : isEdit ? "Modifier" : "Créer"}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des missions</h1>
            <p className="text-muted-foreground mt-2">Créez, modifiez et gérez toutes vos missions</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="msa-button-primary">
                <PlusIcon />
                Nouvelle mission
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle mission</DialogTitle>
              </DialogHeader>
              <MissionForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="msa-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {missions.filter((m) => m.status === "open").length}
                </div>
                <div className="text-sm text-muted-foreground">Missions ouvertes</div>
              </div>
            </CardContent>
          </Card>
          <Card className="msa-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {missions.filter((m) => m.status === "in-progress").length}
                </div>
                <div className="text-sm text-muted-foreground">En cours</div>
              </div>
            </CardContent>
          </Card>
          <Card className="msa-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {missions.filter((m) => m.status === "completed").length}
                </div>
                <div className="text-sm text-muted-foreground">Terminées</div>
              </div>
            </CardContent>
          </Card>
          <Card className="msa-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{missions.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <Card key={mission.id} className="msa-card hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getTypeIcon(mission.type)}</span>
                    <CardTitle className="text-lg">{getTypeLabel(mission.type)}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(mission.status)}>{getStatusLabel(mission.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{mission.description}</p>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <MapPinIcon />
                    <span className="truncate">{mission.location.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon />
                    <span>
                      {new Date(mission.startDate).toLocaleDateString("fr-FR")} -{" "}
                      {new Date(mission.endDate).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(mission)}>
                    <EditIcon />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMission(mission.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {missions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Aucune mission</h3>
            <p className="text-muted-foreground mb-6">Commencez par créer votre première mission</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="msa-button-primary">
              <PlusIcon />
              Créer une mission
            </Button>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la mission</DialogTitle>
            </DialogHeader>
            <MissionForm isEdit />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
