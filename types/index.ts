export interface Mission {
  id: string
  title: string
  description: string
  location: string
  latitude?: number | null
  longitude?: number | null
  salary?: number | null
  duration?: string | null
  requirements?: string | null
  recruiter_id: string
  status: "active" | "closed" | "draft"
  created_at: string
  updated_at: string
}

export interface Technician {
  id: string
  name: string
  specialty: string
  location: {
    lat: number
    lng: number
  }
  availability: boolean
}

export interface Application {
  id: string
  mission_id: string
  applicant_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  experience?: string
  cv_url?: string
  cover_letter?: string
  status: "pending" | "accepted" | "rejected"
  created_at: string
  updated_at: string
}
