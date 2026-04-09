import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import { useAuth } from '@/hooks/useAuth'
import { AuthBrandingPanel } from '@/components/AuthBrandingPanel'
import { FieldError } from '@/components/FieldError'
import { PasswordInput } from '@/components/PasswordInput'
import { loginSchema, type LoginFormValues } from '@/validation/schemas/auth.schema'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await signIn(data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      form.setError('root', {
        message: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      })
    }
  })

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AuthBrandingPanel />

      {/* ── Right panel: form ──────────────────────────────── */}
      <div className="md:w-1/2 bg-[#fcf8f9] flex items-center justify-center p-8 md:p-14 min-h-[60vh] md:min-h-screen">
        <div className="w-full max-w-sm">
          {/* Heading */}
          <h2 className="font-display font-semibold text-[#323235] text-2xl text-center mb-8">
            Sign in to your account
          </h2>

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
                <FieldError message={form.formState.errors.email.message!} />
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-body text-xs font-medium text-[#5f5f61] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  className="font-body text-xs text-[#005ac2] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <PasswordInput
                {...form.register('password')}
                autoComplete="current-password"
                placeholder="••••••••"
              />
              {form.formState.errors.password && (
                <FieldError message={form.formState.errors.password.message!} />
              )}
            </div>

            {/* Root error (Supabase errors) */}
            {form.formState.errors.root && (
              <p className="font-body text-xs text-[#ba1a1a] bg-[#ba1a1a]/5 px-3 py-2 rounded-md">
                {form.formState.errors.root.message}
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
              {form.formState.isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-center font-body text-sm text-[#5f5f61]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-[#005ac2] hover:underline font-medium"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
