"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Application, Mission } from "@/types"

// Custom SVG components
const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const XIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const UserIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
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

const MessageIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
)

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadApplications()
    loadMissions()
  }, [])

  const loadApplications = async () => {
    try {
      const response = await fetch("/api/applications")
      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error("Error loading applications:", error)
    }
  }

  const loadMissions = async () => {
    try {
      const response = await fetch("/api/missions")
      const data = await response.json()
      setMissions(data)
    } catch (error) {
      console.error("Error loading missions:", error)
    }
  }

  const handleApplicationResponse = async (applicationId: string, status: "accepted" | "rejected") => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          responseMessage: responseMessage.trim() || undefined,
        }),
      })

      if (response.ok) {
        await loadApplications()
        setIsDetailDialogOpen(false)
        setSelectedApplication(null)
        setResponseMessage("")
      }
    } catch (error) {
      console.error("Error updating application:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMissionForApplication = (missionId: string) => {
    return missions.find((m) => m.id === missionId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "accepted":
        return "Acceptée"
      case "rejected":
        return "Refusée"
      default:
        return status
    }
  }

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
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

  const getSpecialtyLabel = (specialty: string) => {
    switch (specialty) {
      case "mechanic":
        return "Mécanique"
      case "bodywork":
        return "Carrosserie"
      case "reception":
        return "Accueil"
      case "maintenance":
        return "Maintenance"
      default:
        return specialty
    }
  }

  const pendingApplications = applications.filter((app) => app.status === "pending")
  const acceptedApplications = applications.filter((app) => app.status === "accepted")
  const rejectedApplications = applications.filter((app) => app.status === "rejected")

  const ApplicationCard = ({ application }: { application: Application }) => {
    const mission = getMissionForApplication(application.missionId)

    return (
      <Card className="msa-card hover:shadow-lg transition-all duration-200 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <UserIcon />
              <CardTitle className="text-lg">{application.technicianName}</CardTitle>
            </div>
            <Badge className={getStatusColor(application.status)}>{getStatusLabel(application.status)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className="text-lg">{getSpecialtyIcon(application.technicianSpecialty)}</span>
            <span>{getSpecialtyLabel(application.technicianSpecialty)}</span>
          </div>

          {mission && (
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-1">Mission</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{mission.description}</p>
            </div>
          )}

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <ClockIcon />
            <span>Postulé le {new Date(application.appliedAt).toLocaleDateString("fr-FR")}</span>
          </div>

          {application.status === "pending" && (
            <div className="flex space-x-2 pt-2">
              <Button
                size="sm"
                onClick={() => {
                  setSelectedApplication(application)
                  setIsDetailDialogOpen(true)
                }}
                className="flex-1 msa-button-primary"
              >
                Examiner
              </Button>
            </div>
          )}

          {application.status !== "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedApplication(application)
                setIsDetailDialogOpen(true)
              }}
              className="w-full"
            >
              Voir détails
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Gestion des candidatures</h1>
          <p className="text-muted-foreground mt-2">Examinez et gérez les candidatures des techniciens</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="msa-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{pendingApplications.length}</div>
                <div className="text-sm text-muted-foreground">En attente</div>
              </div>
            </CardContent>
          </Card>
          <Card className="msa-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{acceptedApplications.length}</div>
                <div className="text-sm text-muted-foreground">Acceptées</div>
              </div>
            </CardContent>
          </Card>
          <Card className="msa-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{rejectedApplications.length}</div>
                <div className="text-sm text-muted-foreground">Refusées</div>
              </div>
            </CardContent>
          </Card>
          <Card className="msa-card">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{applications.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">En attente ({pendingApplications.length})</TabsTrigger>
            <TabsTrigger value="accepted">Acceptées ({acceptedApplications.length})</TabsTrigger>
            <TabsTrigger value="rejected">Refusées ({rejectedApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
            {pendingApplications.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Aucune candidature en attente</h3>
                <p className="text-muted-foreground">Toutes les candidatures ont été traitées</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {acceptedApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
            {acceptedApplications.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Aucune candidature acceptée</h3>
                <p className="text-muted-foreground">Les candidatures acceptées apparaîtront ici</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rejectedApplications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
            {rejectedApplications.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Aucune candidature refusée</h3>
                <p className="text-muted-foreground">Les candidatures refusées apparaîtront ici</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Application Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de la candidature</DialogTitle>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Technicien</Label>
                    <p className="text-lg font-semibold">{selectedApplication.technicianName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Spécialité</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSpecialtyIcon(selectedApplication.technicianSpecialty)}</span>
                      <span>{getSpecialtyLabel(selectedApplication.technicianSpecialty)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Mission</Label>
                  {getMissionForApplication(selectedApplication.missionId) && (
                    <div className="p-4 bg-muted rounded-lg mt-2">
                      <p className="text-sm">{getMissionForApplication(selectedApplication.missionId)?.description}</p>
                    </div>
                  )}
                </div>

                {selectedApplication.message && (
                  <div>
                    <Label className="text-sm font-medium">Message du candidat</Label>
                    <div className="p-4 bg-muted rounded-lg mt-2">
                      <p className="text-sm">{selectedApplication.message}</p>
                    </div>
                  </div>
                )}

                {selectedApplication.experience && (
                  <div>
                    <Label className="text-sm font-medium">Expérience</Label>
                    <div className="p-4 bg-muted rounded-lg mt-2">
                      <p className="text-sm">{selectedApplication.experience}</p>
                    </div>
                  </div>
                )}

                {selectedApplication.availability && (
                  <div>
                    <Label className="text-sm font-medium">Disponibilité</Label>
                    <div className="p-4 bg-muted rounded-lg mt-2">
                      <p className="text-sm">{selectedApplication.availability}</p>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Statut actuel</Label>
                  <div className="mt-2">
                    <Badge className={getStatusColor(selectedApplication.status)}>
                      {getStatusLabel(selectedApplication.status)}
                    </Badge>
                  </div>
                </div>

                {selectedApplication.status === "pending" && (
                  <>
                    <div>
                      <Label htmlFor="response">Message de réponse (optionnel)</Label>
                      <Textarea
                        id="response"
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        placeholder="Ajoutez un message pour le technicien..."
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleApplicationResponse(selectedApplication.id, "rejected")}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XIcon />
                        Refuser
                      </Button>
                      <Button
                        onClick={() => handleApplicationResponse(selectedApplication.id, "accepted")}
                        disabled={isLoading}
                        className="msa-button-primary"
                      >
                        <CheckIcon />
                        Accepter
                      </Button>
                    </div>
                  </>
                )}

                {selectedApplication.status !== "pending" && (
                  <div className="flex justify-end pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDetailDialogOpen(false)
                        setSelectedApplication(null)
                      }}
                    >
                      Fermer
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
