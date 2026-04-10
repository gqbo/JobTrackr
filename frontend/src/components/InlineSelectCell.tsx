import { useState, useEffect, useRef, type ReactNode } from 'react'

interface InlineSelectCellProps {
  value: string
  options: ReadonlyArray<{ value: string; label: string }>
  onSave: (value: string) => void
  renderDisplay?: (value: string) => ReactNode
}

export function InlineSelectCell({ value, options, onSave, renderDisplay }: InlineSelectCellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen])

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 4, left: rect.left })
    }
    setIsOpen(v => !v)
  }

  return (
    <div className="inline-block">
      <span ref={triggerRef} className="cursor-pointer" onClick={handleOpen}>
        {renderDisplay ? renderDisplay(value) : (
          <span className="text-sm text-[#323235]">
            {options.find(o => o.value === value)?.label ?? value}
          </span>
        )}
      </span>

      {isOpen && (
        <div
          ref={dropdownRef}
          style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left }}
          className="z-[9999] bg-white rounded-lg shadow-lg border border-[#b3b1b4]/20 py-1 min-w-[140px]"
        >
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              className="w-full text-left px-3 py-1.5 hover:bg-[#eae7ea] flex items-center transition-colors"
              onMouseDown={e => e.preventDefault()}
              onClick={() => { onSave(opt.value); setIsOpen(false) }}
            >
              {renderDisplay ? renderDisplay(opt.value) : (
                <span className="text-sm text-[#323235]">{opt.label}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
