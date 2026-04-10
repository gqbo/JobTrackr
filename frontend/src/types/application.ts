export type ApplicationStatus = 'bookmarked' | 'applied' | 'interviewing' | 'accepted' | 'rejected' | 'ghosted'
export type ApplicationModality = 'remote' | 'hybrid' | 'on_site'

export interface Application {
  id: string
  user_id: string
  url: string
  company: string | null
  role: string | null
  status: ApplicationStatus
  modality: ApplicationModality | null
  location: string | null
  salary: string | null
  source: string | null
  created_at: string
  updated_at: string
}

export interface ApplicationNote {
  id: string
  application_id: string
  content: string
  created_at: string
}

export interface PaginatedApplications {
  items: Application[]
  total: number
  limit: number
  offset: number
}

export interface CreateApplicationPayload {
  url: string
}

export interface UpdateApplicationPayload {
  company?: string
  role?: string
  status?: ApplicationStatus
  modality?: ApplicationModality
  location?: string
  salary?: string
}

export interface CreateNotePayload {
  content: string
}
