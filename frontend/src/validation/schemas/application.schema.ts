import { z } from 'zod'

export const addApplicationSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
})

export const noteSchema = z.object({
  content: z.string().min(1, 'Note cannot be empty').transform(v => v.trim()).refine(v => v.length > 0, 'Note cannot be empty'),
})

export type AddApplicationFormValues = z.infer<typeof addApplicationSchema>
export type NoteFormValues = z.infer<typeof noteSchema>
