import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useCreateApplication } from '@/hooks/useApplications'
import { addApplicationSchema, type AddApplicationFormValues } from '@/validation/schemas/application.schema'
import { FieldError } from './FieldError'

interface AddApplicationModalProps {
  open: boolean
  onClose: () => void
}

export function AddApplicationModal({ open, onClose }: AddApplicationModalProps) {
  const createMutation = useCreateApplication()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddApplicationFormValues>({
    resolver: zodResolver(addApplicationSchema),
  })

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const onSubmit = (values: AddApplicationFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Application saved!')
        reset()
        onClose()
      },
      onError: () => toast.error('Failed to save application.'),
    })
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-[0_20px_50px_rgba(50,50,53,0.06)] p-6 max-w-md w-full mx-4">
        <h2 className="font-display font-semibold text-[#323235] text-lg mb-6">Add Application</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label className="font-body text-xs uppercase tracking-wider text-[#5f5f61] block mb-2">
              JOB POSTING URL
            </label>
            <input
              {...register('url')}
              type="url"
              placeholder="https://linkedin.com/jobs/..."
              className="w-full bg-white border border-[#b3b1b4]/20 rounded-md px-3 py-2 text-sm focus:border-[#005ac2] focus:ring-2 focus:ring-[#005ac2]/10 outline-none"
            />
            {errors.url && <FieldError message={errors.url.message ?? ''} />}
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-gradient-to-br from-[#005ac2] to-[#004fab] text-white font-body font-semibold text-sm rounded-md py-2 px-4 hover:from-[#004fab] hover:to-[#003d96] transition-all disabled:opacity-60"
          >
            {createMutation.isPending ? 'Saving...' : 'Save Application'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  )
}
