import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type { Application, PaginatedApplications } from '@/types'
import * as applicationsApi from '@/api/applications'

vi.mock('@/api/applications', () => ({
  getApplications: vi.fn(),
  createApplication: vi.fn(),
  updateApplication: vi.fn(),
  deleteApplication: vi.fn(),
  getNotes: vi.fn(),
  createNote: vi.fn(),
  deleteNote: vi.fn(),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { wrapper, queryClient }
}

const mockApp: Application = {
  id: '1', user_id: 'u1', url: 'https://example.com',
  company: 'Google', role: 'Engineer', status: 'applied',
  modality: 'remote', location: null, salary: null, source: null,
  created_at: '2026-04-09T00:00:00Z', updated_at: '2026-04-09T00:00:00Z',
}

describe('useApplications', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns items array from PaginatedApplications response', async () => {
    const { useApplications } = await import('@/hooks/useApplications')
    const response: PaginatedApplications = { items: [mockApp], total: 1, limit: 1000, offset: 0 }
    vi.mocked(applicationsApi.getApplications).mockResolvedValue(response)
    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useApplications(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([mockApp])
  })

  it('returns empty array when no applications exist', async () => {
    const { useApplications } = await import('@/hooks/useApplications')
    const response: PaginatedApplications = { items: [], total: 0, limit: 1000, offset: 0 }
    vi.mocked(applicationsApi.getApplications).mockResolvedValue(response)
    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useApplications(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })
})

describe('useCreateApplication', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls API with correct payload and invalidates applications on success', async () => {
    const { useApplications, useCreateApplication } = await import('@/hooks/useApplications')
    const response: PaginatedApplications = { items: [], total: 0, limit: 1000, offset: 0 }
    vi.mocked(applicationsApi.getApplications).mockResolvedValue(response)
    vi.mocked(applicationsApi.createApplication).mockResolvedValue(mockApp)
    const { wrapper, queryClient } = createWrapper()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    renderHook(() => useApplications(), { wrapper })
    const { result } = renderHook(() => useCreateApplication(), { wrapper })
    await act(async () => {
      result.current.mutate({ url: 'https://example.com' })
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(applicationsApi.createApplication).toHaveBeenCalledWith({ url: 'https://example.com' })
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['applications'] })
  })
})

describe('useUpdateApplication', () => {
  beforeEach(() => vi.clearAllMocks())

  it('applies optimistic update to cache before API resolves', async () => {
    const { useApplications, useUpdateApplication } = await import('@/hooks/useApplications')
    const response: PaginatedApplications = { items: [mockApp], total: 1, limit: 1000, offset: 0 }
    vi.mocked(applicationsApi.getApplications).mockResolvedValue(response)
    // Never resolves — we check cache state immediately
    vi.mocked(applicationsApi.updateApplication).mockReturnValue(new Promise(() => {}))
    const { wrapper, queryClient } = createWrapper()
    renderHook(() => useApplications(), { wrapper })
    await waitFor(() => expect(queryClient.getQueryData(['applications'])).toEqual([mockApp]))
    const { result } = renderHook(() => useUpdateApplication(), { wrapper })
    act(() => {
      result.current.mutate({ id: '1', payload: { company: 'Alphabet' } })
    })
    await waitFor(() => {
      const cache = queryClient.getQueryData<Application[]>(['applications'])
      expect(cache?.[0]?.company).toBe('Alphabet')
    })
  })

  it('rolls back cache on API error', async () => {
    const { useApplications, useUpdateApplication } = await import('@/hooks/useApplications')
    const response: PaginatedApplications = { items: [mockApp], total: 1, limit: 1000, offset: 0 }
    vi.mocked(applicationsApi.getApplications).mockResolvedValue(response)
    vi.mocked(applicationsApi.updateApplication).mockRejectedValue(new Error('Server error'))
    const { wrapper, queryClient } = createWrapper()
    renderHook(() => useApplications(), { wrapper })
    await waitFor(() => expect(queryClient.getQueryData(['applications'])).toEqual([mockApp]))
    const { result } = renderHook(() => useUpdateApplication(), { wrapper })
    await act(async () => {
      result.current.mutate({ id: '1', payload: { company: 'Alphabet' } })
    })
    await waitFor(() => expect(result.current.isError).toBe(true))
    const cache = queryClient.getQueryData<Application[]>(['applications'])
    expect(cache?.[0]?.company).toBe('Google')
  })
})

describe('useDeleteApplication', () => {
  beforeEach(() => vi.clearAllMocks())

  it('optimistically removes item from cache', async () => {
    const { useApplications, useDeleteApplication } = await import('@/hooks/useApplications')
    const response: PaginatedApplications = { items: [mockApp], total: 1, limit: 1000, offset: 0 }
    vi.mocked(applicationsApi.getApplications).mockResolvedValue(response)
    vi.mocked(applicationsApi.deleteApplication).mockReturnValue(new Promise(() => {}))
    const { wrapper, queryClient } = createWrapper()
    renderHook(() => useApplications(), { wrapper })
    await waitFor(() => expect(queryClient.getQueryData(['applications'])).toEqual([mockApp]))
    const { result } = renderHook(() => useDeleteApplication(), { wrapper })
    act(() => { result.current.mutate('1') })
    await waitFor(() => {
      const cache = queryClient.getQueryData<Application[]>(['applications'])
      expect(cache).toHaveLength(0)
    })
  })

  it('rolls back on error', async () => {
    const { useApplications, useDeleteApplication } = await import('@/hooks/useApplications')
    const response: PaginatedApplications = { items: [mockApp], total: 1, limit: 1000, offset: 0 }
    vi.mocked(applicationsApi.getApplications).mockResolvedValue(response)
    vi.mocked(applicationsApi.deleteApplication).mockRejectedValue(new Error('fail'))
    const { wrapper, queryClient } = createWrapper()
    renderHook(() => useApplications(), { wrapper })
    await waitFor(() => expect(queryClient.getQueryData(['applications'])).toEqual([mockApp]))
    const { result } = renderHook(() => useDeleteApplication(), { wrapper })
    await act(async () => { result.current.mutate('1') })
    await waitFor(() => expect(result.current.isError).toBe(true))
    const cache = queryClient.getQueryData<Application[]>(['applications'])
    expect(cache).toHaveLength(1)
  })
})
