import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getSortedRowModel, getPaginationRowModel,
  type SortingState, type ColumnFiltersState, type PaginationState,
} from '@tanstack/react-table'
import { useApplications, useUpdateApplication, useDeleteApplication } from '@/hooks/useApplications'
import { EmptyState } from '@/components/EmptyState'
import { ApplicationsTable, createColumns, applicationSearchFilter, multiSelectFilter } from '@/components/ApplicationsTable'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { AddApplicationModal } from '@/components/AddApplicationModal'
import { NotesModal } from '@/components/NotesModal'
import { SearchBar } from '@/components/SearchBar'
import { FilterDropdown } from '@/components/FilterDropdown'
import { TablePagination } from '@/components/TablePagination'
import { ORDERED_STATUSES } from '@/config/applicationStatuses'
import { MODALITY_OPTIONS } from '@/config/applicationModalities'
import type { Application, UpdateApplicationPayload } from '@/types'

export function ApplicationsPage() {
  const { data: applications = [], isLoading, isError } = useApplications()
  const updateMutation = useUpdateApplication()
  const deleteMutation = useDeleteApplication()

  // Table state
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 })

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [modalityFilter, setModalityFilter] = useState<string[]>([])

  const columnFilters = useMemo(() => {
    const filters: ColumnFiltersState = []
    if (statusFilter.length > 0) filters.push({ id: 'status', value: statusFilter })
    if (modalityFilter.length > 0) filters.push({ id: 'modality', value: modalityFilter })
    return filters
  }, [statusFilter, modalityFilter])

  // Modal state
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [notesApp, setNotesApp] = useState<Application | null>(null)
  const [deleteApp, setDeleteApp] = useState<Application | null>(null)

  const handleUpdate = useCallback((id: string, payload: UpdateApplicationPayload) => {
    updateMutation.mutate({ id, payload }, {
      onError: () => toast.error('Failed to save changes. Please try again.'),
    })
  }, [updateMutation])

  const handleOpenNotes = useCallback((app: Application) => setNotesApp(app), [])
  const handleDelete = useCallback((app: Application) => setDeleteApp(app), [])

  const handleConfirmDelete = useCallback(() => {
    if (!deleteApp) return
    deleteMutation.mutate(deleteApp.id, {
      onSuccess: () => {
        toast.success('Application deleted')
        setDeleteApp(null)
      },
      onError: () => {
        toast.error('Failed to delete application.')
        setDeleteApp(null)
      },
    })
  }, [deleteApp, deleteMutation])

  const columns = useMemo(
    () => createColumns(handleUpdate, handleOpenNotes, handleDelete),
    [handleUpdate, handleOpenNotes, handleDelete],
  )

  const table = useReactTable({
    data: applications,
    columns,
    filterFns: { applicationSearch: applicationSearchFilter, multiSelect: multiSelectFilter },
    globalFilterFn: applicationSearchFilter,
    state: { globalFilter, sorting, pagination, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <p className="text-[#5f5f61]">Loading applications...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8">
        <p className="text-[#ba1a1a]">Failed to load applications. Please refresh.</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-[2rem] font-semibold text-[#323235]">Applications</h1>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="bg-gradient-to-br from-[#005ac2] to-[#004fab] text-white font-body font-semibold text-sm rounded-md px-4 py-2 hover:from-[#004fab] hover:to-[#003d96] transition-all"
        >
          + Add Application
        </button>
      </div>

      {applications.length === 0 ? (
        <EmptyState type="no-data" onAddApplication={() => setAddModalOpen(true)} />
      ) : (
        <>
          {/* Filter bar */}
          <div className="flex items-center gap-3 mb-6">
            <SearchBar value={globalFilter} onChange={setGlobalFilter} />
            <FilterDropdown
              label="Status"
              options={ORDERED_STATUSES.map(s => ({ value: s.value, label: s.label }))}
              selected={statusFilter}
              onChange={setStatusFilter}
            />
            <FilterDropdown
              label="Modality"
              options={MODALITY_OPTIONS}
              selected={modalityFilter}
              onChange={setModalityFilter}
            />
          </div>

          {table.getFilteredRowModel().rows.length === 0 ? (
            <EmptyState type="no-results" />
          ) : (
            <>
              <ApplicationsTable
                table={table}
                onUpdate={handleUpdate}
                onOpenNotes={handleOpenNotes}
                onDelete={handleDelete}
              />
              <TablePagination table={table} />
            </>
          )}
        </>
      )}

      {/* Modals */}
      <AddApplicationModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <NotesModal application={notesApp} onClose={() => setNotesApp(null)} />
      <ConfirmDialog
        open={deleteApp !== null}
        title="Delete this application?"
        description="This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteApp(null)}
      />
    </div>
  )
}
