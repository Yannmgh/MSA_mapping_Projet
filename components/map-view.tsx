"use client"

import { useEffect, useRef, useState } from "react"
import type { Mission, Technician } from "@/types"

// Import types leaflet
import type * as Leaflet from "leaflet"

interface MapViewProps {
  highlightedMission?: Mission | null
}

export default function MapView({ highlightedMission }: MapViewProps = {}) {
  const mapRef = useRef<HTMLDivElement>(null)

  const [missions, setMissions] = useState<Mission[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])

  const [map, setMap] = useState<Leaflet.Map | null>(null) // ✅ typé correctement
  const [L, setL] = useState<typeof Leaflet | null>(null) // ✅ typé correctement

  useEffect(() => {
    const initMap = async () => {
      const LeafletLib: typeof Leaflet = await import("leaflet")
      setL(LeafletLib)

      // Fix des icônes par défaut
      delete (LeafletLib.Icon.Default.prototype as any)._getIconUrl
      LeafletLib.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      if (mapRef.current) {
        // reset si déjà une map
        if ((mapRef.current as any)._leaflet_id) {
          (mapRef.current as any)._leaflet_id = null
        }

        const leafletMap = LeafletLib.map(mapRef.current).setView([48.8566, 2.3522], 10)

        LeafletLib.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(leafletMap)

        setMap(leafletMap)

        loadMissions()
        loadTechnicians()
      }
    }

    initMap()
  }, [])

  // ✅ On filtre pour ne garder que les missions actives
  const loadMissions = async () => {
    try {
      const response = await fetch("/api/missions")
      const data: Mission[] = await response.json()
      const activeMissions = data.filter((m) => m.status === "active")
      setMissions(activeMissions)
    } catch (error) {
      console.error("Error loading missions:", error)
    }
  }

  const loadTechnicians = async () => {
    try {
      const response = await fetch("/api/technicians")
      const data = await response.json()
      setTechnicians(data)
    } catch (error) {
      console.error("Error loading technicians:", error)
    }
  }

  useEffect(() => {
    if (map && L) {
      // Nettoyer anciens marqueurs
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })

      // ➝ Missions (actives uniquement car filtrées au chargement)
      missions.forEach((mission) => {
        if (!mission.latitude || !mission.longitude) return

        const isHighlighted = highlightedMission?.id === mission.id

        const marker = L.marker([mission.latitude, mission.longitude], {
          icon: isHighlighted
            ? L.divIcon({
                className: "custom-div-icon",
                html: `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              })
            : new L.Icon.Default(),
        })
          .addTo(map)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold">${mission.title}</h3>
              <p class="text-sm text-gray-600">${mission.description}</p>
              <p class="text-xs text-gray-500">📍 ${mission.location}</p>
              ${mission.salary ? `<p class="text-xs text-gray-500">💰 ${mission.salary} €/jour</p>` : ""}
              ${mission.requirements ? `<p class="text-xs text-gray-500">⚡ ${mission.requirements}</p>` : ""}
              <p class="text-xs text-gray-500">Statut: ${mission.status}</p>
            </div>
          `)

        if (isHighlighted) {
          marker.openPopup()
          map.setView([mission.latitude, mission.longitude], 13)
        }
      })

      // ➝ Techniciens
      technicians.forEach((technician) => {
        if (!technician.location?.lat || !technician.location?.lng) return

        L.marker([technician.location.lat, technician.location.lng], {
          icon: L.divIcon({
            className: "custom-div-icon",
            html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
        })
          .addTo(map)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold">${technician.name}</h3>
              <p class="text-sm text-gray-600">Spécialité: ${technician.specialty}</p>
              <p class="text-xs ${technician.availability ? "text-green-600" : "text-red-600"}">
                ${technician.availability ? "Disponible" : "Indisponible"}
              </p>
            </div>
          `)
      })
    }
  }, [map, L, missions, technicians, highlightedMission])

  return (
    <div className="relative h-full">
      <div ref={mapRef} className="h-full w-full" />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
    </div>
  )
}
