import { FileText, ExternalLink, Trash2 } from 'lucide-react'
import type { Application } from '@/types'

interface ActionsCellProps {
  application: Application
  onOpenNotes: (app: Application) => void
  onDelete: (app: Application) => void
}

export function ActionsCell({ application, onOpenNotes, onDelete }: ActionsCellProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        title="View Notes"
        onClick={() => onOpenNotes(application)}
        className="p-1.5 rounded text-[#5f5f61] hover:text-[#005ac2] hover:bg-[#eae7ea] transition-colors"
      >
        <FileText size={16} />
      </button>
      <a
        href={application.url}
        target="_blank"
        rel="noopener noreferrer"
        title="Open Posting"
        className="p-1.5 rounded text-[#5f5f61] hover:text-[#005ac2] hover:bg-[#eae7ea] transition-colors"
      >
        <ExternalLink size={16} />
      </a>
      <button
        type="button"
        title="Delete"
        onClick={() => onDelete(application)}
        className="p-1.5 rounded text-[#5f5f61] hover:text-[#ba1a1a] hover:bg-[#eae7ea] transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
