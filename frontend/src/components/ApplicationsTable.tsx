import {
  flexRender,
  createColumnHelper, type FilterFn,
  type Table,
} from '@tanstack/react-table'
import { ChevronsUpDown, ChevronUp, ChevronDown } from 'lucide-react'
import { StatusPillar } from './StatusPillar'
import { StatusBadge } from './StatusBadge'
import { ActionsCell } from './ActionsCell'
import { InlineEditCell } from './InlineEditCell'
import { InlineSelectCell } from './InlineSelectCell'
import { MODALITY_OPTIONS } from '@/config/applicationModalities'
import { ORDERED_STATUSES } from '@/config/applicationStatuses'
import type { Application, ApplicationStatus, ApplicationModality, UpdateApplicationPayload } from '@/types'

// Custom filter functions
const applicationSearchFilter: FilterFn<Application> = (row, _columnId, filterValue: string) => {
  const search = filterValue.toLowerCase()
  return (
    (row.original.company?.toLowerCase().includes(search) ?? false) ||
    (row.original.role?.toLowerCase().includes(search) ?? false) ||
    (row.original.location?.toLowerCase().includes(search) ?? false)
  )
}
applicationSearchFilter.autoRemove = (val: string) => !val

const multiSelectFilter: FilterFn<Application> = (row, columnId, filterValue: string[]) => {
  if (!filterValue.length) return true
  const cellValue = row.getValue(columnId) as string
  return filterValue.includes(cellValue)
}
multiSelectFilter.autoRemove = (val: string[]) => !val?.length

export function createColumns(
  onUpdate: (id: string, payload: UpdateApplicationPayload) => void,
  onOpenNotes: (app: Application) => void,
  onDelete: (app: Application) => void,
) {
  const helper = createColumnHelper<Application>()
  return [
    helper.display({
      id: 'pillar',
      header: '',
      size: 4,
      cell: ({ row }) => <StatusPillar status={row.original.status} />,
      enableSorting: false,
    }),
    helper.accessor('company', {
      header: 'Company',
      size: 180,
      cell: ({ row }) => (
        <InlineEditCell
          value={row.original.company}
          onSave={v => onUpdate(row.original.id, { company: v })}
          placeholder="Add company"
        />
      ),
    }),
    helper.accessor('role', {
      header: 'Role',
      size: 220,
      cell: ({ row }) => (
        <InlineEditCell
          value={row.original.role}
          onSave={v => onUpdate(row.original.id, { role: v })}
          placeholder="Add role"
        />
      ),
    }),
    helper.accessor('status', {
      header: 'Status',
      size: 150,
      filterFn: multiSelectFilter,
      cell: ({ row }) => (
        <InlineSelectCell
          value={row.original.status}
          options={ORDERED_STATUSES.map(s => ({ value: s.value, label: s.label }))}
          onSave={v => onUpdate(row.original.id, { status: v as ApplicationStatus })}
          renderDisplay={v => <StatusBadge status={v as ApplicationStatus} />}
        />
      ),
    }),
    helper.accessor('modality', {
      header: 'Modality',
      size: 120,
      filterFn: multiSelectFilter,
      cell: ({ row }) => (
        <InlineSelectCell
          value={row.original.modality ?? ''}
          options={[{ value: '', label: '—' }, ...MODALITY_OPTIONS]}
          onSave={v => onUpdate(row.original.id, { modality: v as ApplicationModality })}
        />
      ),
    }),
    helper.accessor('location', {
      header: 'Location',
      size: 160,
      cell: ({ row }) => (
        <InlineEditCell
          value={row.original.location}
          onSave={v => onUpdate(row.original.id, { location: v })}
          disabled={row.original.modality === 'remote'}
          placeholder="Add location"
        />
      ),
    }),
    helper.accessor('salary', {
      header: 'Salary',
      size: 120,
      cell: ({ row }) => (
        <InlineEditCell
          value={row.original.salary}
          onSave={v => onUpdate(row.original.id, { salary: v })}
          placeholder="Add salary"
        />
      ),
    }),
    helper.accessor('created_at', {
      header: 'Date Saved',
      size: 120,
      cell: ({ getValue }) => {
        const date = new Date(getValue())
        return (
          <span className="text-sm text-[#5f5f61]">
            {date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
          </span>
        )
      },
    }),
    helper.display({
      id: 'actions',
      header: '',
      size: 100,
      enableSorting: false,
      cell: ({ row }) => (
        <ActionsCell
          application={row.original}
          onOpenNotes={onOpenNotes}
          onDelete={onDelete}
        />
      ),
    }),
  ]
}

interface ApplicationsTableProps {
  table: Table<Application>
  onUpdate: (id: string, payload: UpdateApplicationPayload) => void
  onOpenNotes: (app: Application) => void
  onDelete: (app: Application) => void
}

export function ApplicationsTable({ table, onUpdate, onOpenNotes, onDelete }: ApplicationsTableProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left font-body text-xs font-medium uppercase tracking-wider text-[#5f5f61]"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={header.column.getCanSort() ? 'flex items-center gap-1 cursor-pointer select-none' : ''}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="text-[#b3b1b4]">
                          {header.column.getIsSorted() === 'asc' ? <ChevronUp size={12} /> :
                           header.column.getIsSorted() === 'desc' ? <ChevronDown size={12} /> :
                           <ChevronsUpDown size={12} />}
                        </span>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className="hover:bg-[#eae7ea] transition-colors duration-150"
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-5">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Export filter functions for use in ApplicationsPage
export { applicationSearchFilter, multiSelectFilter }
