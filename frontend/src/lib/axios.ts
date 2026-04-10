import axios from 'axios'
import { supabase } from '@/lib/supabase'

const apiUrl = import.meta.env.VITE_API_URL
if (!apiUrl) throw new Error('VITE_API_URL environment variable is not set')

export const api = axios.create({
  baseURL: apiUrl as string,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})
