import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Mission } from "@/types"

/**
 * GET /api/missions/[id]
 * Récupère une mission spécifique depuis la base Supabase
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("missions")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Mission non trouvée" }, { status: 404 })
  }

  return NextResponse.json(data)
}

/**
 * PUT /api/missions/[id]
 * Met à jour une mission existante
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("missions")
      .update({
        type: body.type,
        title: body.title,
        description: body.description,
        location: body.location,
        startDate: body.startDate,
        endDate: body.endDate,
        status: body.status,
        salary: body.salary,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}

/**
 * DELETE /api/missions/[id]
 * Supprime une mission existante
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("missions")
    .delete()
    .eq("id", params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    message: "Mission supprimée avec succès",
    mission: data,
  })
}
