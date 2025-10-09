"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const UsersIcon = () => (
  <svg className="h-12 w-12 text-primary mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
)

const WrenchIcon = () => (
  <svg className="h-12 w-12 text-primary mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const CarIcon = () => (
  <svg className="h-8 w-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 6h3l2 7H6l2-7h3" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17h14v-2a1 1 0 00-1-1H6a1 1 0 00-1 1v2z" />
  </svg>
)

export default function Home() {
  const router = useRouter()

  const handleRecruiterClick = () => {
    router.push("/auth/login?type=recruiter")
  }

  const handleTechnicianClick = () => {
    router.push("/auth/login?type=technician")
  }

  return (
    <div className="min-h-screen msa-hero-gradient">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary rounded-2xl p-4 mr-4">
              <CarIcon />
            </div>
            <h1 className="text-4xl font-bold text-foreground">MSA</h1>
          </div>
          <h2 className="text-5xl font-bold text-foreground mb-6 text-balance">
            La plateforme française n°1 des <span className="text-primary">métiers de l'automobile</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            MSA Staffing connecte les meilleurs talents avec les meilleures opportunités dans le secteur automobile,
            partout en France.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card
            className="msa-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
            onClick={handleRecruiterClick}
          >
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <UsersIcon />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Renforcer mes équipes</h3>
              <p className="text-muted-foreground mb-6">
                Trouvez rapidement les techniciens qualifiés pour vos missions automobiles
              </p>
              <Button className="msa-button-primary w-full">Je suis recruteur →</Button>
            </CardContent>
          </Card>

          <Card
            className="msa-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
            onClick={handleTechnicianClick}
          >
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <WrenchIcon />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Trouver un job</h3>
              <p className="text-muted-foreground mb-6">Découvrez les meilleures opportunités près de chez vous</p>
              <Button className="msa-button-primary w-full">Postuler →</Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="msa-stats-card text-center">
            <div className="text-3xl font-bold text-primary mb-2">1000+</div>
            <div className="text-sm text-muted-foreground">Ateliers partenaires</div>
          </div>
          <div className="msa-stats-card text-center">
            <div className="text-3xl font-bold text-primary mb-2">5000+</div>
            <div className="text-sm text-muted-foreground">Techniciens actifs</div>
          </div>
          <div className="msa-stats-card text-center">
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Satisfaction client</div>
          </div>
          <div className="msa-stats-card text-center">
            <div className="text-3xl font-bold text-primary mb-2">24h</div>
            <div className="text-sm text-muted-foreground">Temps de réponse</div>
          </div>
        </div>
      </div>
    </div>
  )
}
