import { type NextRequest, NextResponse } from "next/server"
import type { Technician } from "@/types"

// Mock data - same as in route.ts
const mockTechnicians: Technician[] = [
  {
    id: "1",
    name: "Jean Dupont",
    specialty: "mechanic",
    location: { lat: 48.8584, lng: 2.347 },
    availability: true,
  },
  {
    id: "2",
    name: "Marie Martin",
    specialty: "bodywork",
    location: { lat: 48.8534, lng: 2.3488 },
    availability: true,
  },
  {
    id: "3",
    name: "Pierre Durand",
    specialty: "reception",
    location: { lat: 48.862, lng: 2.356 },
    availability: false,
  },
  {
    id: "4",
    name: "Sophie Moreau",
    specialty: "mechanic",
    location: { lat: 48.87, lng: 2.32 },
    availability: true,
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const technician = mockTechnicians.find((t) => t.id === params.id)

  if (!technician) {
    return NextResponse.json({ error: "Technician not found" }, { status: 404 })
  }

  return NextResponse.json(technician)
}
