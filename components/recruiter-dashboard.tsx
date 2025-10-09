"use client"

import MapView from "@/components/map-view"
import { Sidebar } from "@/components/sidebar"

export function RecruiterDashboard() {
  return (
    <div className="flex h-screen bg-slate-50">
      <div className="w-80 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center mb-4">
            <div className="bg-blue-600 text-white rounded-lg p-2 mr-3">
              <div className="text-sm font-bold">MSA</div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Dashboard Recruteur</h1>
              <p className="text-sm text-slate-600">Gestion des missions et techniciens</p>
            </div>
          </div>
        </div>
        <div className="msa-scrollbar overflow-y-auto h-full">
          <Sidebar />
        </div>
      </div>

      <main className="flex-1 bg-slate-50">
        <div className="h-full p-4">
          <MapView />
        </div>
      </main>
    </div>
  )
}
