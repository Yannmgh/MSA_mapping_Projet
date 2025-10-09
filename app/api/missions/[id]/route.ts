import { type NextRequest, NextResponse } from "next/server"
import type { Mission } from "@/types"

// Mock data - same as in route.ts but we need to import it from a shared location
// In a real app, this would be in a database
const mockMissions: Mission[] = [
  {
    id: "1",
    type: "mechanic",
    description: "Réparation moteur BMW X5 - Problème de surchauffe, diagnostic complet nécessaire",
    location: { lat: 48.8566, lng: 2.3522, address: "123 Avenue des Champs-Élysées, 75008 Paris" },
    startDate: "2024-01-15T09:00:00Z",
    endDate: "2024-01-15T17:00:00Z",
    status: "open",
  },
  {
    id: "2",
    type: "bodywork",
    description: "Réparation carrosserie Mercedes C-Class - Rayures profondes côté conducteur",
    location: { lat: 48.8606, lng: 2.3376, address: "45 Rue de Rivoli, 75001 Paris" },
    startDate: "2024-01-16T08:00:00Z",
    endDate: "2024-01-16T16:00:00Z",
    status: "in-progress",
  },
  {
    id: "3",
    type: "reception",
    description: "Accueil client pour récupération véhicule - Service premium requis",
    location: { lat: 48.8738, lng: 2.295, address: "78 Avenue Marceau, 75008 Paris" },
    startDate: "2024-01-17T10:00:00Z",
    endDate: "2024-01-17T12:00:00Z",
    status: "open",
  },
  {
    id: "4",
    type: "maintenance",
    description: "Maintenance préventive Audi A4 - Vidange, filtres, contrôle général",
    location: { lat: 48.8584, lng: 2.2945, address: "12 Place Vendôme, 75001 Paris" },
    startDate: "2024-01-18T14:00:00Z",
    endDate: "2024-01-18T16:00:00Z",
    status: "completed",
  },
  {
    id: "5",
    type: "mechanic",
    description: "Diagnostic électronique Peugeot 308 - Problèmes intermittents",
    location: { lat: 48.8534, lng: 2.3488, address: "25 Boulevard Saint-Germain, 75005 Paris" },
    startDate: "2024-01-19T11:00:00Z",
    endDate: "2024-01-19T15:00:00Z",
    status: "cancelled",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const mission = mockMissions.find((m) => m.id === params.id)

  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 })
  }

  return NextResponse.json(mission)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const missionIndex = mockMissions.findIndex((m) => m.id === params.id)

    if (missionIndex === -1) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 })
    }

    const updatedMission: Mission = {
      ...mockMissions[missionIndex],
      type: body.type,
      description: body.description,
      location: body.location,
      startDate: body.startDate,
      endDate: body.endDate,
      status: body.status,
    }

    mockMissions[missionIndex] = updatedMission

    return NextResponse.json(updatedMission)
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const missionIndex = mockMissions.findIndex((m) => m.id === params.id)

  if (missionIndex === -1) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 })
  }

  const deletedMission = mockMissions[missionIndex]
  mockMissions.splice(missionIndex, 1)

  return NextResponse.json({ message: "Mission deleted successfully", mission: deletedMission })
}
