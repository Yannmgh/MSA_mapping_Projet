"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

interface MissionFormProps {
  onClose: () => void
  onMissionCreated?: () => void
}

export function MissionForm({ onClose, onMissionCreated }: MissionFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    salary: "",
    duration: "",
    requirements: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          salary: formData.salary ? parseFloat(formData.salary) : null,
          duration: formData.duration || null,
          requirements: formData.requirements || null,
        }),
      })

      if (response.ok) {
        onClose()
        onMissionCreated?.()
      } else {
        console.error("❌ Erreur lors de la création de la mission")
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <Card className="w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Créer une mission</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              placeholder="Ex: Mécanicien automobile H/F"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Description détaillée de la mission..."
              required
              rows={3}
            />
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
              placeholder="Ex: Paris, Lyon..."
              required
            />
          </div>

          {/* Latitude / Longitude */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <Input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData((p) => ({ ...p, latitude: e.target.value }))}
                placeholder="48.8566"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <Input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData((p) => ({ ...p, longitude: e.target.value }))}
                placeholder="2.3522"
              />
            </div>
          </div>

          {/* Salaire & Durée */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salaire (€/jour)</label>
              <Input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData((p) => ({ ...p, salary: e.target.value }))}
                placeholder="150"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData((p) => ({ ...p, duration: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 jour">1 jour</SelectItem>
                  <SelectItem value="1 semaine">1 semaine</SelectItem>
                  <SelectItem value="1 mois">1 mois</SelectItem>
                  <SelectItem value="3 mois">3 mois</SelectItem>
                  <SelectItem value="6 mois">6 mois</SelectItem>
                  <SelectItem value="CDI">CDI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Exigences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exigences</label>
            <Textarea
              value={formData.requirements}
              onChange={(e) => setFormData((p) => ({ ...p, requirements: e.target.value }))}
              placeholder="Compétences requises, certifications..."
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Annuler</Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Création..." : "Créer la mission"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
