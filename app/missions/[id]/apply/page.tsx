"use client"

import { useState, useEffect, FormEvent, ChangeEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface Mission {
  id: string
  title?: string
  description: string
  location: string | { address?: string }
}

interface FormValues {
  first_name: string
  last_name: string
  email: string
  phone: string
  experience: string
  cover_letter: string
}

export default function ApplyMissionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [mission, setMission] = useState<Mission | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<FormValues>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    experience: "",
    cover_letter: "",
  })

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await fetch(`/api/missions/${id}`)
        if (!res.ok) throw new Error("Erreur de chargement de la mission")
        const data = await res.json()
        setMission(data)
      } catch (err) {
        console.error("Erreur lors du chargement de la mission :", err)
      }
    }
    fetchMission()
  }, [id])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file && file.type !== "application/pdf") {
      alert("Veuillez sélectionner un fichier PDF uniquement.")
      return
    }
    setCvFile(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let cv_url: string | null = null
 
      if (cvFile) {
        const fileName = `${Date.now()}_${cvFile.name}`
        const { error: uploadError } = await supabase.storage.from("cvs").upload(fileName, cvFile)
        if (uploadError) throw uploadError

        const { data: publicUrl } = supabase.storage.from("cvs").getPublicUrl(fileName)
        cv_url = publicUrl.publicUrl
      }

      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) {
        alert("Vous devez être connecté pour postuler.")
        return
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mission_id: id,
          applicant_id: userData.user.id,
          ...formData,
          cv_url,
        }),
      })

      if (!response.ok) throw new Error("Erreur lors de l’envoi de la candidature")

      alert("✅ Candidature envoyée avec succès !")
      router.push(`/missions/${id}`)
    } catch (err: any) {
      console.error("Erreur lors de la soumission de la candidature :", err)
      alert("❌ Une erreur est survenue :" + (err.message|| "voir console"))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mission) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Chargement de la mission...
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card className="msa-card">
        <CardHeader>
          <CardTitle>
            Postuler à la mission : {mission.title || mission.description}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {typeof mission.location === "string"
              ? mission.location
              : mission.location?.address}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom et prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prénom</Label>
                <Input name="first_name" value={formData.first_name} onChange={handleChange} required />
              </div>
              <div>
                <Label>Nom</Label>
                <Input name="last_name" value={formData.last_name} onChange={handleChange} required />
              </div>
            </div>

            {/* Email et téléphone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            {/* Expérience */}
            <div>
              <Label>Expérience</Label>
              <Textarea name="experience" value={formData.experience} onChange={handleChange} rows={3} />
            </div>

            {/* Lettre de motivation */}
            <div>
              <Label>Lettre de motivation</Label>
              <Textarea name="cover_letter" value={formData.cover_letter} onChange={handleChange} rows={5} />
            </div>

            {/* Upload CV */}
            <div>
              <Label>CV (PDF uniquement)</Label>
              <Input type="file" accept="application/pdf" onChange={handleFileChange} required />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} className="msa-button-primary">
                {isSubmitting ? "Envoi en cours..." : "Envoyer la candidature"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
