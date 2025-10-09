"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Simple SVG icon components
const MapPinIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
)

const PlusIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

export function Sidebar() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [filters, setFilters] = useState({
    missionType: "",
    availability: false,
    location: "",
  })

  const handleCreateMission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const missionData = {
      type: formData.get("type"),
      description: formData.get("description"),
      location: {
        lat: Number.parseFloat(formData.get("lat") as string),
        lng: Number.parseFloat(formData.get("lng") as string),
      },
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      status: "open",
    }

    try {
      const response = await fetch("/api/missions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(missionData),
      })

      if (response.ok) {
        setShowCreateForm(false)
        // Refresh the map data
        window.location.reload()
      }
    } catch (error) {
      console.error("Error creating mission:", error)
    }
  }

  return (
    <div className="w-80 bg-background border-r border-border p-4 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">MSA Map Staffing</h1>
          <p className="text-sm text-muted-foreground">Manage missions and technicians</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinIcon />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mission-type">Mission Type</Label>
              <Select
                value={filters.missionType}
                onValueChange={(value) => setFilters({ ...filters, missionType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mechanic">Mechanic</SelectItem>
                  <SelectItem value="bodywork">Bodywork</SelectItem>
                  <SelectItem value="reception">Reception</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter city or area"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="availability"
                checked={filters.availability}
                onCheckedChange={(checked) => setFilters({ ...filters, availability: checked as boolean })}
              />
              <Label htmlFor="availability">Available technicians only</Label>
            </div>
          </CardContent>
        </Card>

        {/* Create Mission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusIcon />
              Create Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showCreateForm ? (
              <Button onClick={() => setShowCreateForm(true)} className="w-full">
                New Mission
              </Button>
            ) : (
              <form onSubmit={handleCreateMission} className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mechanic">Mechanic</SelectItem>
                      <SelectItem value="bodywork">Bodywork</SelectItem>
                      <SelectItem value="reception">Reception</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea name="description" placeholder="Mission description" required />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input name="lat" type="number" step="any" placeholder="48.8566" required />
                  </div>
                  <div>
                    <Label htmlFor="lng">Longitude</Label>
                    <Input name="lng" type="number" step="any" placeholder="2.3522" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input name="startDate" type="datetime-local" required />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input name="endDate" type="datetime-local" required />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Create
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Active Missions:</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span>Available Technicians:</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Today:</span>
                <span className="font-semibold">5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
