"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import type { Mission } from "@/types"

export default function MissionDetailsPage() {
  const router = useRouter()
  const { id } = useParams()
  const [mission, setMission] = useState<Mission | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchMission = async () => {
      try {
        const response = await fetch(`/api/missions/${id}`)
        const data = await response.json()
        setMission(data)
      } catch (error) {
        console.error("Erreur lors du chargement de la mission :", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMission()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    )
  }

  if (!mission) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-foreground">Mission introuvable</h2>
        <p className="text-muted-foreground mt-2">Aucune mission ne correspond à cet identifiant.</p>
        <Button onClick={() => router.push("/technician")}>Retour</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <Card className="msa-card shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{mission.title}</h1>
            <Badge className="bg-green-100 text-green-800 border-green-200 capitalize">{mission.status}</Badge>
          </div>

          <p className="text-muted-foreground">{mission.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <strong>Type :</strong> {mission.type}
            </div>
            <div>
              <strong>Lieu :</strong> {mission.location?.address || mission.location}
            </div>
            {mission.salary && (
              <div>
                <strong>Salaire :</strong> {mission.salary} €/jour
              </div>
            )}
            {mission.requirements && (
              <div className="col-span-2">
                <strong>Exigences :</strong> {mission.requirements}
              </div>
            )}
            {mission.startDate && (
              <div>
                <strong>Début :</strong> {new Date(mission.startDate).toLocaleDateString("fr-FR")}
              </div>
            )}
            {mission.endDate && (
              <div>
                <strong>Fin :</strong> {new Date(mission.endDate).toLocaleDateString("fr-FR")}
              </div>
            )}
          </div>

          <div className="pt-6 flex justify-end">
            <Button
              className="msa-button-primary"
              onClick={() => router.push(`/missions/${mission.id}/apply`)}
            >
              Postuler à cette mission
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
