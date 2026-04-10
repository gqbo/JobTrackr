import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface FilterDropdownProps {
  label: string
  options: ReadonlyArray<{ value: string; label: string }>
  selected: string[]
  onChange: (selected: string[]) => void
}

export function FilterDropdown({ label, options, selected, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value])
  }

  const buttonLabel = selected.length > 0 ? `${label} (${selected.length})` : label

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(p => !p)}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          selected.length > 0
            ? 'bg-[#005ac2]/10 text-[#005ac2]'
            : 'bg-[#f0eef0] text-[#5f5f61] hover:bg-[#eae7ea]'
        }`}
      >
        {buttonLabel}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-lg shadow-[0_8px_24px_rgba(50,50,53,0.08)] border border-[#eae7ea] min-w-[160px] py-1">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => { onChange([]); setIsOpen(false) }}
              className="w-full text-left px-4 py-2 text-xs text-[#005ac2] hover:bg-[#eae7ea] font-medium"
            >
              Clear filters
            </button>
          )}
          {options.map(opt => (
            <label key={opt.value} className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-[#f6f3f4]">
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="accent-[#005ac2]"
              />
              <span className="text-sm text-[#323235]">{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
