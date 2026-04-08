import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  throw new Error('VITE_API_URL environment variable is not set')
}

export const api = axios.create({
  baseURL: apiUrl as string,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth interceptor — will be added in Sprint 1B when Supabase auth is wired up
// api.interceptors.request.use((config) => {
//   const session = supabase.auth.getSession()
//   if (session?.data?.session?.access_token) {
//     config.headers.Authorization = `Bearer ${session.data.session.access_token}`
//   }
//   return config
// })
