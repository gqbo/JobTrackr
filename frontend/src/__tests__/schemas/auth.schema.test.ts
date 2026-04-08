import { describe, expect, it } from 'vitest'

import { loginSchema, signupSchema } from '@/validation/schemas/auth.schema'

describe('loginSchema', () => {
  it('fails when email is empty', () => {
    const result = loginSchema.safeParse({ email: '', password: 'pass' })
    expect(result.success).toBe(false)
  })

  it('fails when email has no @', () => {
    const result = loginSchema.safeParse({ email: 'notanemail', password: 'pass' })
    expect(result.success).toBe(false)
  })

  it('fails when email has no domain', () => {
    const result = loginSchema.safeParse({ email: 'user@', password: 'pass' })
    expect(result.success).toBe(false)
  })

  it('fails when password is empty', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: '' })
    expect(result.success).toBe(false)
  })

  it('passes with valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'pass' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ email: 'user@example.com', password: 'pass' })
    }
  })
})

describe('signupSchema', () => {
  it('fails when password has 7 chars', () => {
    const result = signupSchema.safeParse({ email: 'user@example.com', password: '1234567' })
    expect(result.success).toBe(false)
  })

  it('fails when email has no domain part', () => {
    const result = signupSchema.safeParse({ email: 'user@nodomain', password: '12345678' })
    expect(result.success).toBe(false)
  })

  it('passes when password has exactly 8 chars', () => {
    const result = signupSchema.safeParse({ email: 'user@example.com', password: '12345678' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.password).toBe('12345678')
    }
  })

  it('passes with valid signup data', () => {
    const result = signupSchema.safeParse({ email: 'user@example.com', password: 'strongpass' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ email: 'user@example.com', password: 'strongpass' })
    }
  })
})
