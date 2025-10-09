import { type NextRequest, NextResponse } from "next/server"
import type { Application } from "@/types"

// Mock applications data - in a real app, this would be in a database
const mockApplications: Application[] = [
  {
    id: "app-1",
    missionId: "1",
    technicianId: "tech-1",
    technicianName: "Pierre Dubois",
    technicianSpecialty: "mechanic",
    status: "pending",
    appliedAt: "2024-01-14T10:30:00Z",
    message: "Je suis spécialisé dans les moteurs BMW et j'ai 8 ans d'expérience. Disponible immédiatement.",
    experience: "8 ans d'expérience en mécanique automobile, certifié BMW et Mercedes",
    availability: "Disponible du lundi au vendredi, 8h-18h",
  },
]

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { technicianId, message, experience, availability } = await request.json()

    const newApplication: Application = {
      id: `app-${Date.now()}`,
      missionId: params.id,
      technicianId,
      technicianName: `Technicien ${technicianId}`, // In real app, fetch from user database
      technicianSpecialty: "mechanic", // In real app, fetch from user profile
      status: "pending",
      appliedAt: new Date().toISOString(),
      message,
      experience,
      availability,
    }

    mockApplications.push(newApplication)

    return NextResponse.json({
      success: true,
      message: "Candidature envoyée avec succès",
      application: newApplication,
    })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de l'envoi de la candidature" }, { status: 500 })
  }
}
