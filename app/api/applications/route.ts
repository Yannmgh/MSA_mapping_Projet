import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// 🔹 Récupérer toutes les candidatures
export async function GET() {
const supabase = await createClient() // ✅ Ajout de await

const { data, error } = await supabase
.from("applications")
.select("*")
.order("created_at", { ascending: false })

if (error) {
console.error("Erreur GET /applications:", error.message)
return NextResponse.json({ error: error.message }, { status: 500 })
}

return NextResponse.json(data)
}

// 🔹 Créer une nouvelle candidature
export async function POST(req: NextRequest) {
const supabase = await createClient() // ✅ Ajout de await

try {
const body = await req.json()

```
// Vérifie l'utilisateur connecté
const { data: userData, error: authError } = await supabase.auth.getUser()
if (authError || !userData?.user) {
  return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
}

// Validation minimale
if (!body.mission_id || !body.first_name || !body.last_name || !body.email) {
  return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
}

// Insertion dans la table Supabase
const { data, error } = await supabase
  .from("applications")
  .insert([
    {
      mission_id: body.mission_id,
      applicant_id: userData.user.id,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone ?? null,
      experience: body.experience ?? null,
      cover_letter: body.cover_letter ?? null,
      cv_url: body.cv_url ?? null,
      status: "pending",
    },
  ])
  .select()
  .single()

if (error) {
  console.error("Erreur POST /applications:", error.message)
  return NextResponse.json({ error: error.message }, { status: 500 })
}

return NextResponse.json(data, { status: 201 })
```

} catch (err) {
console.error("Erreur POST /applications:", err)
return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
}
}
