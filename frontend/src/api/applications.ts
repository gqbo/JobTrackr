import { api } from '@/lib/axios'
import type {
  Application, ApplicationNote, PaginatedApplications,
  CreateApplicationPayload, UpdateApplicationPayload, CreateNotePayload,
} from '@/types'

export async function getApplications(params?: { limit?: number; offset?: number }): Promise<PaginatedApplications> {
  const { data } = await api.get('/applications', { params })
  return data
}

export async function createApplication(payload: CreateApplicationPayload): Promise<Application> {
  const { data } = await api.post('/applications', payload)
  return data
}

export async function updateApplication(id: string, payload: UpdateApplicationPayload): Promise<Application> {
  const { data } = await api.patch(`/applications/${id}`, payload)
  return data
}

export async function deleteApplication(id: string): Promise<void> {
  await api.delete(`/applications/${id}`)
}

export async function getNotes(applicationId: string): Promise<ApplicationNote[]> {
  const { data } = await api.get(`/applications/${applicationId}/notes`)
  return data
}

export async function createNote(applicationId: string, payload: CreateNotePayload): Promise<ApplicationNote> {
  const { data } = await api.post(`/applications/${applicationId}/notes`, payload)
  return data
}

export async function deleteNote(applicationId: string, noteId: string): Promise<void> {
  await api.delete(`/applications/${applicationId}/notes/${noteId}`)
}
