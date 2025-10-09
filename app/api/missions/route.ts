import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Mission } from "@/types"

// GET /api/missions?status=active
export async function GET(request: NextRequest) {
  const supabase = await createClient() // 👈 ajout de await
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  let query = supabase.from("missions").select("*").order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data as Mission[])
}

// POST /api/missions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient() // 👈 ajout de await

    // Vérifie l’utilisateur connecté
    const { data: userData, error: authError } = await supabase.auth.getUser()
    if (authError || !userData?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Validation minimale
    if (!body.title || !body.description || !body.location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("missions")
      .insert([
        {
          title: body.title,
          description: body.description,
          location: body.location,
          latitude: body.latitude ?? null,
          longitude: body.longitude ?? null,
          salary: body.salary ?? null,
          duration: body.duration ?? null,
          requirements: body.requirements ?? null,
          recruiter_id: userData.user.id,
          status: body.status || "active",
        },
      ])
      .select()
      .single() // ✅ récupère directement l’objet inséré

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data as Mission, { status: 201 })
  } catch (e) {
    console.error("POST /api/missions error:", e)
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
