import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Technician } from "@/types"

// GET /api/technicians
export async function GET() {
  const supabase = await createClient() // 👈 ajout de await

  try {
    const { data, error } = await supabase
      .from("technicians")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erreur lors de la récupération des techniciens :", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data as Technician[])
  } catch (err) {
    console.error("Erreur serveur GET /technicians:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST /api/technicians
export async function POST(req: NextRequest) {
  const supabase = await createClient() // 👈 ajout de await

  try {
    const body = await req.json()

    // Validation minimale
    if (!body.name || !body.specialty || !body.location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("technicians")
      .insert([
        {
          name: body.name,
          specialty: body.specialty,
          location: body.location, // { lat, lng } en JSON
          availability: body.availability ?? true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Erreur lors de l'insertion d'un technicien :", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data as Technician, { status: 201 })
  } catch (err) {
    console.error("Erreur serveur POST /technicians:", err)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
