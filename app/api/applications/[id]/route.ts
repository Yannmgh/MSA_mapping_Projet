import { type NextRequest, NextResponse } from "next/server"
import type { Application } from "@/types"

// Mock data - same as in route.ts
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
  {
    id: "app-2",
    missionId: "1",
    technicianId: "tech-2",
    technicianName: "Marie Leroy",
    technicianSpecialty: "mechanic",
    status: "pending",
    appliedAt: "2024-01-14T14:15:00Z",
    message: "Mécanicienne expérimentée, je peux intervenir rapidement sur ce type de panne.",
    experience: "5 ans d'expérience, spécialisée dans les diagnostics électroniques",
    availability: "Flexible, peut travailler le weekend si nécessaire",
  },
  {
    id: "app-3",
    missionId: "2",
    technicianId: "tech-3",
    technicianName: "Jean Martin",
    technicianSpecialty: "bodywork",
    status: "accepted",
    appliedAt: "2024-01-15T09:00:00Z",
    message: "Expert en carrosserie Mercedes, j'ai déjà traité ce type de dommage.",
    experience: "12 ans en carrosserie, formation Mercedes-Benz",
    availability: "Disponible cette semaine",
  },
  {
    id: "app-4",
    missionId: "3",
    technicianId: "tech-4",
    technicianName: "Sophie Bernard",
    technicianSpecialty: "reception",
    status: "pending",
    appliedAt: "2024-01-16T11:20:00Z",
    message: "Expérience en service client premium, parfaitement bilingue français-anglais.",
    experience: "3 ans en accueil clientèle automobile",
    availability: "Disponible tous les jours de la semaine",
  },
  {
    id: "app-5",
    missionId: "4",
    technicianId: "tech-5",
    technicianName: "Thomas Petit",
    technicianSpecialty: "maintenance",
    status: "rejected",
    appliedAt: "2024-01-17T16:45:00Z",
    message: "Technicien maintenance avec certification Audi.",
    experience: "4 ans en maintenance préventive",
    availability: "Disponible en semaine uniquement",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const application = mockApplications.find((app) => app.id === params.id)

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  return NextResponse.json(application)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const applicationIndex = mockApplications.findIndex((app) => app.id === params.id)

    if (applicationIndex === -1) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const updatedApplication: Application = {
      ...mockApplications[applicationIndex],
      status: body.status,
    }

    mockApplications[applicationIndex] = updatedApplication

    return NextResponse.json(updatedApplication)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
