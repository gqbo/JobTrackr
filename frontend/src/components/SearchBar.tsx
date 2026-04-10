import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Search applications...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5f5f61]" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2 w-64 bg-white border border-[#b3b1b4]/20 rounded-md text-sm focus:border-[#005ac2] focus:ring-2 focus:ring-[#005ac2]/10 outline-none"
      />
    </div>
  )
}
