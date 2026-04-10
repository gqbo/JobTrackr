import { Briefcase } from 'lucide-react'

interface EmptyStateProps {
  type: 'no-data' | 'no-results'
  onAddApplication?: () => void
}

export function EmptyState({ type, onAddApplication }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Briefcase size={48} className="text-[#b3b1b4]" />
      <div className="text-center">
        <h3 className="font-display text-xl text-[#323235]">
          {type === 'no-data' ? 'No applications yet' : 'No applications'}
        </h3>
        <p className="font-body text-[#5f5f61] mt-1">
          {type === 'no-data' ? 'Paste a job URL to get started' : 'No applications match your search'}
        </p>
      </div>
      {type === 'no-data' && onAddApplication && (
        <button
          type="button"
          onClick={onAddApplication}
          className="bg-gradient-to-br from-[#005ac2] to-[#004fab] text-white font-body font-semibold text-sm rounded-md px-4 py-2 hover:from-[#004fab] hover:to-[#003d96] transition-all"
        >
          + Add Application
        </button>
      )}
    </div>
  )
}
