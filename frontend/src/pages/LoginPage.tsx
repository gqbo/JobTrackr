import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAuth } from '@/hooks/useAuth'
import {
  loginSchema,
  signupSchema,
  type LoginFormValues,
  type SignupFormValues,
} from '@/validation/schemas/auth.schema'

type Mode = 'signin' | 'signup'
type FormValues = LoginFormValues | SignupFormValues

// Decorative card thumbnails for the left panel
const PREVIEW_CARDS = [
  { bg: 'from-blue-100 to-blue-50', accent: 'bg-blue-300' },
  { bg: 'from-slate-200 to-slate-100', accent: 'bg-slate-400' },
  { bg: 'from-emerald-100 to-emerald-50', accent: 'bg-emerald-300' },
  { bg: 'from-violet-100 to-violet-50', accent: 'bg-violet-300' },
  { bg: 'from-amber-100 to-amber-50', accent: 'bg-amber-300' },
  { bg: 'from-rose-100 to-rose-50', accent: 'bg-rose-300' },
  { bg: 'from-cyan-100 to-cyan-50', accent: 'bg-cyan-300' },
  { bg: 'from-indigo-100 to-indigo-50', accent: 'bg-indigo-300' },
]

function PreviewCard({ bg, accent }: { bg: string; accent: string }) {
  return (
    <div className={`rounded-xl bg-gradient-to-br ${bg} p-3 flex flex-col gap-2`}>
      <div className={`w-6 h-6 rounded-md ${accent} opacity-70`} />
      <div className="h-1.5 w-3/4 rounded-full bg-black/10" />
      <div className="h-1.5 w-1/2 rounded-full bg-black/10" />
    </div>
  )
}

export function LoginPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('signin')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(mode === 'signin' ? loginSchema : signupSchema),
    mode: 'onTouched',
  })

  const switchMode = (next: Mode) => {
    setMode(next)
    setSuccessMsg(null)
    form.reset()
  }

  const onSubmit = form.handleSubmit(async (data) => {
    setSuccessMsg(null)
    try {
      if (mode === 'signin') {
        await signIn(data.email, data.password)
        navigate('/')
      } else {
        await signUp(data.email, data.password)
        setSuccessMsg('Account created! Check your email to confirm before signing in.')
      }
    } catch (err) {
      form.setError('root', {
        message: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      })
    }
  })

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ── Left panel: branding ────────────────────────────── */}
      <div className="md:w-1/2 bg-[#f6f3f4] flex flex-col p-10 md:p-14">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#005ac2] to-[#004fab] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="white" strokeWidth="1.5" />
              <path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <span className="font-display font-semibold text-[#323235] text-lg tracking-tight">
            JobTrackr
          </span>
        </div>

        {/* Centered content */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Hero copy */}
          <div>
            <h1 className="font-display font-bold text-[#323235] text-4xl md:text-5xl leading-tight tracking-tight">
              Track every application.
              <br />
              <span className="text-[#005ac2]">Land your next role.</span>
            </h1>
            <p className="mt-4 font-body text-[#5f5f61] text-base leading-relaxed max-w-sm">
              Paste a job URL and our AI extracts everything — company, role, salary, tech stack.
              Your personal dashboard, always up to date.
            </p>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['#005ac2', '#7c3aed', '#059669', '#d97706'].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#f6f3f4] flex items-center justify-center text-white text-xs font-body font-semibold"
                    style={{ backgroundColor: color }}
                  >
                    {['A', 'M', 'S', 'R'][i]}
                  </div>
                ))}
              </div>
              <p className="font-body text-sm text-[#5f5f61]">
                Join thousands tracking their job search
              </p>
            </div>
          </div>

          {/* Decorative preview grid */}
          <div className="mt-12 grid grid-cols-4 gap-3">
            {PREVIEW_CARDS.map((card, i) => (
              <PreviewCard key={i} bg={card.bg} accent={card.accent} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel: form ──────────────────────────────── */}
      <div className="md:w-1/2 bg-[#fcf8f9] flex items-center justify-center p-8 md:p-14 min-h-[60vh] md:min-h-screen">
        <div className="w-full max-w-sm">
          {/* Heading */}
          <h2 className="font-display font-semibold text-[#323235] text-2xl text-center mb-8">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </h2>

          {/* Mode toggle */}
          <div className="flex bg-[#eae7ea] rounded-lg p-1 mb-8">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`flex-1 py-2 rounded-md text-sm font-body font-medium transition-all ${
                mode === 'signin'
                  ? 'bg-white text-[#323235] shadow-sm'
                  : 'text-[#5f5f61] hover:text-[#323235]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2 rounded-md text-sm font-body font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-white text-[#323235] shadow-sm'
                  : 'text-[#5f5f61] hover:text-[#323235]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-medium text-[#5f5f61] uppercase tracking-wider">
                Email Address
              </label>
              <input
                {...form.register('email')}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="
                  w-full px-4 py-3 rounded-md font-body text-sm text-[#323235]
                  bg-white border border-[#b3b1b4]/20
                  placeholder:text-[#b3b1b4]
                  focus:outline-none focus:border-[#005ac2] focus:ring-2 focus:ring-[#005ac2]/10
                  transition-all
                "
              />
              {form.formState.errors.email && (
                <p className="font-body text-xs text-[#ba1a1a]">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-body text-xs font-medium text-[#5f5f61] uppercase tracking-wider">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    className="font-body text-xs text-[#005ac2] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                {...form.register('password')}
                type="password"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                className="
                  w-full px-4 py-3 rounded-md font-body text-sm text-[#323235]
                  bg-white border border-[#b3b1b4]/20
                  placeholder:text-[#b3b1b4]
                  focus:outline-none focus:border-[#005ac2] focus:ring-2 focus:ring-[#005ac2]/10
                  transition-all
                "
              />
              {form.formState.errors.password && (
                <p className="font-body text-xs text-[#ba1a1a]">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Root error (Supabase errors) / Success message */}
            {form.formState.errors.root && (
              <p className="font-body text-xs text-[#ba1a1a] bg-[#ba1a1a]/5 px-3 py-2 rounded-md">
                {form.formState.errors.root.message}
              </p>
            )}
            {successMsg && (
              <p className="font-body text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-md">
                {successMsg}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="
                w-full py-3 mt-2 rounded-md font-body font-semibold text-sm text-white
                bg-gradient-to-br from-[#005ac2] to-[#004fab]
                hover:from-[#004fab] hover:to-[#003d96]
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all shadow-sm
              "
            >
              {form.formState.isSubmitting
                ? mode === 'signin'
                  ? 'Signing in…'
                  : 'Creating account…'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-center font-body text-sm text-[#5f5f61]">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-[#005ac2] hover:underline font-medium"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-[#005ac2] hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
