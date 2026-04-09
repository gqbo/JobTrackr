import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type PasswordInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <input
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={`
          w-full px-4 py-3 pr-10 rounded-md font-body text-sm text-[#323235]
          bg-white border border-[#b3b1b4]/20
          placeholder:text-[#b3b1b4]
          focus:outline-none focus:border-[#005ac2] focus:ring-2 focus:ring-[#005ac2]/10
          transition-all
          ${className ?? ''}
        `}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b1b4] hover:text-[#5f5f61] transition-colors"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}
