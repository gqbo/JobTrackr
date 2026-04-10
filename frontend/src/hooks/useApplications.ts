import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getApplications, createApplication, updateApplication,
  deleteApplication, getNotes, createNote, deleteNote,
} from '@/api/applications'
import type { Application, ApplicationNote, UpdateApplicationPayload, CreateApplicationPayload, CreateNotePayload } from '@/types'

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const data = await getApplications({ limit: 1000 })
      return data.items
    },
  })
}

export function useCreateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateApplicationPayload) => createApplication(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}

export function useUpdateApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateApplicationPayload }) =>
      updateApplication(id, payload),
    onMutate: ({ id, payload }) => {
      queryClient.cancelQueries({ queryKey: ['applications'] })
      const snapshot = queryClient.getQueryData<Application[]>(['applications'])
      queryClient.setQueryData<Application[]>(['applications'], old =>
        old?.map(app => app.id === id ? { ...app, ...payload } : app) ?? []
      )
      return { snapshot }
    },
    onError: (_err, _vars, context) => {
      if (context?.snapshot) queryClient.setQueryData(['applications'], context.snapshot)
    },
  })
}

export function useDeleteApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] })
      const snapshot = queryClient.getQueryData<Application[]>(['applications'])
      queryClient.setQueryData<Application[]>(['applications'], old =>
        old?.filter(app => app.id !== id) ?? []
      )
      return { snapshot }
    },
    onError: (_err, _vars, context) => {
      if (context?.snapshot) queryClient.setQueryData(['applications'], context.snapshot)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  })
}

export function useNotes(applicationId: string | null) {
  return useQuery({
    queryKey: ['applications', applicationId, 'notes'],
    queryFn: () => getNotes(applicationId!),
    enabled: !!applicationId,
    select: (data: ApplicationNote[]) =>
      [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  })
}

export function useCreateNote(applicationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(applicationId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications', applicationId, 'notes'] }),
  })
}

export function useDeleteNote(applicationId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (noteId: string) => deleteNote(applicationId, noteId),
    onMutate: async (noteId) => {
      await queryClient.cancelQueries({ queryKey: ['applications', applicationId, 'notes'] })
      const snapshot = queryClient.getQueryData<ApplicationNote[]>(['applications', applicationId, 'notes'])
      queryClient.setQueryData<ApplicationNote[]>(['applications', applicationId, 'notes'], old =>
        old?.filter(note => note.id !== noteId) ?? []
      )
      return { snapshot }
    },
    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(['applications', applicationId, 'notes'], context.snapshot)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['applications', applicationId, 'notes'] }),
  })
}
 