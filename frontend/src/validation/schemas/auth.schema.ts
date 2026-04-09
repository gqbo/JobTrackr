import { z } from 'zod'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const emailField = z
  .string()
  .min(1, 'Email is required')
  .superRefine((val, ctx) => {
    if (!val.includes('@')) {
      ctx.addIssue({
        code: 'custom',
        message: `Please include an '@' in the email address. '${val}' is missing an '@'`,
      })
      return z.NEVER
    }
    if (!EMAIL_RE.test(val)) {
      ctx.addIssue({ code: 'custom', message: 'Please enter a valid email address' })
    }
  })

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  email: emailField,
  password: z
    .string()
    .min(1, 'Password is required')
    .superRefine((val, ctx) => {
      if (val.length > 0 && val.length < 8) {
        ctx.addIssue({
          code: 'custom',
          message: `Must be at least 8 characters (you are currently using ${val.length})`,
        })
      }
    }),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
