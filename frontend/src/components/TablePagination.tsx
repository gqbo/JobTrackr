import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import type { Application } from '@/types'

interface TablePaginationProps { table: Table<Application> }

export function TablePagination({ table }: TablePaginationProps) {
  const { pageIndex, pageSize } = table.getState().pagination
  const totalRows = table.getFilteredRowModel().rows.length
  const pageCount = table.getPageCount()
  const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, totalRows)

  const pageSizeOptions = [5, 10, 25, 50]

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      {/* Page size */}
      <div className="flex items-center gap-1">
        {pageSizeOptions.map(size => (
          <button
            key={size}
            type="button"
            onClick={() => { table.setPageSize(size); table.setPageIndex(0) }}
            className={`px-2.5 py-1 text-sm rounded transition-colors ${
              pageSize === size
                ? 'bg-[#eae7ea] text-[#323235] font-medium'
                : 'text-[#5f5f61] hover:bg-[#f6f3f4]'
            }`}
          >
            {size}
          </button>
        ))}
        <span className="text-xs text-[#5f5f61] ml-1">per page</span>
      </div>

      {/* Info */}
      <span className="font-body text-sm text-[#5f5f61]">
        {totalRows === 0 ? 'No results' : `Showing ${start}–${end} of ${totalRows} applications`}
      </span>

      {/* Navigation */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-1.5 rounded text-[#5f5f61] hover:bg-[#eae7ea] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => i).map(i => (
          <button
            key={i}
            type="button"
            onClick={() => table.setPageIndex(i)}
            className={`w-8 h-8 text-sm rounded transition-colors ${
              pageIndex === i
                ? 'bg-[#005ac2] text-white font-medium'
                : 'text-[#5f5f61] hover:bg-[#eae7ea]'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-1.5 rounded text-[#5f5f61] hover:bg-[#eae7ea] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
