import { useState, useEffect, useRef } from 'react'

interface InlineEditCellProps {
  value: string | null
  onSave: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function InlineEditCell({ value, onSave, placeholder, disabled }: InlineEditCellProps) {
  const [draft, setDraft] = useState(value ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync prop → draft when value changes externally (not while user is typing)
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setDraft(value ?? '')
    }
  }, [value])

  if (disabled) {
    return <span className="text-sm text-[#5f5f61] line-through cursor-not-allowed">—</span>
  }

  const handleConfirm = () => {
    if (draft !== (value ?? '')) onSave(draft)
  }

  return (
    <input
      ref={inputRef}
      value={draft}
      onChange={e => setDraft(e.target.value)}
      onBlur={handleConfirm}
      onKeyDown={e => {
        if (e.key === 'Enter') { handleConfirm(); inputRef.current?.blur() }
        if (e.key === 'Escape') { setDraft(value ?? ''); inputRef.current?.blur() }
      }}
      placeholder={placeholder}
      className="w-full bg-transparent border-0 text-sm text-[#323235] outline-none placeholder:text-[#b3b1b4] cursor-pointer focus:border-b focus:border-[#005ac2] focus:cursor-text focus:pb-px"
    />
  )
}
