import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useNotes, useCreateNote, useDeleteNote } from '@/hooks/useApplications'
import { noteSchema, type NoteFormValues } from '@/validation/schemas/application.schema'
import { FieldError } from './FieldError'
import type { Application } from '@/types'

interface NotesModalProps {
  application: Application | null
  onClose: () => void
}

export function NotesModal({ application, onClose }: NotesModalProps) {
  const { data: notes = [] } = useNotes(application?.id ?? null)
  const createNote = useCreateNote(application?.id ?? '')
  const deleteNote = useDeleteNote(application?.id ?? '')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
  })

  useEffect(() => {
    if (!application) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [application, onClose])

  if (!application) return null

  const onSubmit = (values: NoteFormValues) => {
    createNote.mutate({ content: values.content }, {
      onSuccess: () => reset(),
      onError: () => toast.error('Failed to add note.'),
    })
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-[0_20px_50px_rgba(50,50,53,0.06)] p-6 max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-[#323235]">
            {application.company ?? 'Untitled'} — Notes
          </h2>
          <button type="button" onClick={onClose} className="p-1 rounded text-[#5f5f61] hover:bg-[#eae7ea]">
            <X size={16} />
          </button>
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {notes.length === 0 && (
            <p className="text-sm text-[#5f5f61] text-center py-4">No notes yet.</p>
          )}
          {notes.map((note, i) => (
            <div
              key={note.id}
              className={`rounded-lg p-4 ${i % 2 === 0 ? 'bg-[#f6f3f4]' : 'bg-[#fdf9fa]'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-[#5f5f61] mb-1">
                    {new Date(note.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: '2-digit', year: 'numeric',
                    })} · {new Date(note.created_at).toLocaleTimeString('en-US', {
                      hour: 'numeric', minute: '2-digit',
                    })}
                  </p>
                  <p className="text-sm text-[#323235]">{note.content}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteNote.mutate(note.id, {
                    onError: () => toast.error('Failed to delete note.'),
                  })}
                  className="p-1 rounded text-[#5f5f61] hover:text-[#ba1a1a] hover:bg-[#eae7ea] transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add note form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="pt-4">
          <textarea
            {...register('content')}
            placeholder="Add a note..."
            rows={3}
            className="w-full bg-white border border-[#b3b1b4]/20 rounded-md px-3 py-2 text-sm focus:border-[#005ac2] focus:ring-2 focus:ring-[#005ac2]/10 outline-none resize-none mb-2"
          />
          {errors.content && <FieldError message={errors.content.message ?? ''} />}
          <button
            type="submit"
            disabled={createNote.isPending}
            className="bg-gradient-to-br from-[#005ac2] to-[#004fab] text-white font-body font-semibold text-sm rounded-md py-2 px-4 hover:from-[#004fab] hover:to-[#003d96] transition-all disabled:opacity-60"
          >
            {createNote.isPending ? 'Adding...' : 'Add →'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  )
}
