"use client"

import type { UserRole } from "@/app/page"

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white rounded-lg p-3 shadow-md mr-4">
              <div className="text-2xl font-bold text-blue-600">MSA</div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Map Staffing</h1>
              <p className="text-slate-600 text-lg">La plateforme de gestion des missions automobiles</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="msa-card p-8 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V6C15 7.1 14.1 8 13 8H11C9.9 8 9 7.1 9 6V4L3 7V9H21ZM21 10H3V22H21V10Z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Renforcer mes équipes</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Gérez vos missions, assignez des techniciens qualifiés et suivez les interventions en temps réel.
            </p>
            <button
              onClick={() => onRoleSelect("recruiter")}
              className="msa-button-primary w-full py-4 px-8 text-lg font-semibold"
            >
              Je suis recruteur
            </button>
            <div className="mt-4 text-sm text-slate-500">Accès complet à la gestion des missions</div>
          </div>

          <div className="msa-card p-8 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V6C15 7.1 14.1 8 13 8H11C9.9 8 9 7.1 9 6V4L3 7V9H21ZM21 10H3V22H21V10Z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Trouver un job</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Découvrez les missions disponibles près de chez vous et postulez directement aux offres qui vous
              intéressent.
            </p>
            <button
              onClick={() => onRoleSelect("technician")}
              className="bg-green-600 hover:bg-green-700 text-white w-full py-4 px-8 text-lg font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Je suis technicien
            </button>
            <div className="mt-4 text-sm text-slate-500">Accès aux missions disponibles</div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-8">Plus de 1000 ateliers, garages et concessionnaires nous font confiance</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-slate-400 font-semibold">PEUGEOT</div>
            <div className="text-slate-400 font-semibold">RENAULT</div>
            <div className="text-slate-400 font-semibold">CITROËN</div>
            <div className="text-slate-400 font-semibold">BMW</div>
          </div>
        </div>
      </div>
    </div>
  )
}
