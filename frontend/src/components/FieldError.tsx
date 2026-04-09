import { AlertCircle } from 'lucide-react'

export function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 font-body text-xs text-[#ba1a1a]">
      <AlertCircle size={13} className="shrink-0" />
      {message}
    </p>
  )
}
